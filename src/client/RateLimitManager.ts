import { debug, DebugNamespace } from "@/debug";

/**
 * Represents a rate limit bucket for a specific route or endpoint
 */
export interface RateLimitBucket {
  /** How many requests we can make */
  limit: number;
  /** How many requests we have left */
  remaining: number;
  /** When the bucket resets (unix timestamp in ms) */
  resetTime: number;
  /** How long until reset (in seconds) */
  resetAfter: number;
  /** The bucket hash from Discord */
  bucket?: string;
  /** Whether this is a global rate limit */
  global?: boolean;
  /** Current retry after time if rate limited */
  retryAfter?: number;
}

/**
 * Request queue item for managing API requests
 */
export interface QueuedRequest {
  /** The method (GET, POST, etc.) */
  method: string;
  /** The endpoint path */
  endpoint: string;
  /** Request body if any */
  body?: unknown;
  /** Extra headers */
  headers?: Record<string, string>;
  /** Whether this is form data */
  isForm?: boolean;
  /** Resolve function for the promise */
  resolve: (value: any) => void;
  /** Reject function for the promise */
  reject: (error: Error) => void;
  /** When this request was queued */
  queuedAt: number;
  /** Priority level (lower = higher priority) */
  priority: number;
}

/**
 * Configuration for the rate limit manager
 */
export interface RateLimitManagerOptions {
  /** Maximum queue size before rejecting requests */
  maxQueueSize?: number;
  /** Maximum time to wait in queue (ms) */
  maxQueueWait?: number;
  /** Enable request prioritization */
  enablePrioritization?: boolean;
  /** Global rate limit buffer (seconds) */
  globalBuffer?: number;
  /** Per-route rate limit buffer (seconds) */
  routeBuffer?: number;
  /** Enable adaptive rate limiting */
  enableAdaptive?: boolean;
}

/**
 * Rate limit manager for Discord API
 * Handles per-route rate limits, global rate limits, request queueing,
 * and intelligent request scheduling based on Discord's guidelines
 */
export class RateLimitManager {
  private readonly buckets = new Map<string, RateLimitBucket>();
  private globalRateLimit: RateLimitBucket | null = null;
  private readonly requestQueue = new Map<string, QueuedRequest[]>();
  private readonly activeRequests = new Set<string>();
  private readonly options: Required<RateLimitManagerOptions>;

  // Statistics for monitoring
  public stats = {
    totalRequests: 0,
    queuedRequests: 0,
    rateLimitedRequests: 0,
    globalRateLimits: 0,
    averageLatency: 0,
    peakQueueSize: 0,
  };

  constructor(options: RateLimitManagerOptions = {}) {
    this.options = {
      maxQueueSize: options.maxQueueSize ?? 1000,
      maxQueueWait: options.maxQueueWait ?? 30000, // 30 seconds
      enablePrioritization: options.enablePrioritization ?? true,
      globalBuffer: options.globalBuffer ?? 0.1, // 100ms buffer
      routeBuffer: options.routeBuffer ?? 0.05, // 50ms buffer
      enableAdaptive: options.enableAdaptive ?? true,
    };

    debug.info(
      DebugNamespace.REST,
      "RateLimitManager initialized",
      this.options
    );
  }

  /**
   * Get the rate limit bucket key for a route
   * This handles major parameters like channel_id, guild_id, etc.
   */
  private getBucketKey(method: string, endpoint: string): string {
    // Remove query parameters
    const cleanEndpoint = endpoint.split("?")[0];

    // Replace major parameters with placeholders
    const bucketEndpoint = cleanEndpoint
      .replace(/\/channels\/\d+/, "/channels/{channel.id}")
      .replace(/\/guilds\/\d+/, "/guilds/{guild.id}")
      .replace(/\/users\/\d+/, "/users/{user.id}")
      .replace(/\/webhooks\/\d+/, "/webhooks/{webhook.id}")
      .replace(/\/applications\/\d+/, "/applications/{application.id}")
      .replace(/\/interactions\/\d+/, "/interactions/{interaction.id}");

    return `${method}:${bucketEndpoint}`;
  }

  /**
   * Check if we're currently rate limited for a specific bucket
   */
  private isRateLimited(bucketKey: string): boolean {
    // Check global rate limit first
    if (this.globalRateLimit && Date.now() < this.globalRateLimit.resetTime) {
      return true;
    }

    // Check route-specific rate limit
    const bucket = this.buckets.get(bucketKey);
    if (!bucket) return false;

    // If we have no remaining requests and haven't reset yet
    if (bucket.remaining <= 0 && Date.now() < bucket.resetTime) {
      return true;
    }

    return false;
  }

  /**
   * Calculate how long we need to wait before making a request
   */
  private getWaitTime(bucketKey: string): number {
    let waitTime = 0;

    // Global rate limit takes precedence
    if (this.globalRateLimit && Date.now() < this.globalRateLimit.resetTime) {
      waitTime = Math.max(
        waitTime,
        this.globalRateLimit.resetTime - Date.now()
      );
    }

    // Check route-specific rate limit
    const bucket = this.buckets.get(bucketKey);
    if (bucket && bucket.remaining <= 0 && Date.now() < bucket.resetTime) {
      waitTime = Math.max(waitTime, bucket.resetTime - Date.now());
    }

    // Add buffer time to prevent hitting limits
    const buffer = this.globalRateLimit
      ? this.options.globalBuffer * 1000
      : this.options.routeBuffer * 1000;
    return waitTime + buffer;
  }

  /**
   * Update rate limit information from response headers
   */
  public updateRateLimit(
    method: string,
    endpoint: string,
    headers: Headers | Record<string, string>
  ): void {
    const bucketKey = this.getBucketKey(method, endpoint);

    // Helper to get header value
    const getHeader = (name: string): string | null => {
      if (headers instanceof Headers) {
        return headers.get(name);
      }
      return headers[name] || headers[name.toLowerCase()] || null;
    };

    // Check for global rate limit
    const globalLimit = getHeader("x-ratelimit-global");
    if (globalLimit === "true") {
      const retryAfter = Number(getHeader("retry-after")) || 1;
      this.globalRateLimit = {
        limit: 0,
        remaining: 0,
        resetTime: Date.now() + retryAfter * 1000,
        resetAfter: retryAfter,
        global: true,
        retryAfter,
      };

      this.stats.globalRateLimits++;
      debug.warn(
        DebugNamespace.REST,
        `Global rate limit hit, retry after ${retryAfter}s`
      );
      return;
    }

    // Update bucket information
    const limit = Number(getHeader("x-ratelimit-limit"));
    const remaining = Number(getHeader("x-ratelimit-remaining"));
    const resetAfter = Number(getHeader("x-ratelimit-reset-after"));
    const bucketHash = getHeader("x-ratelimit-bucket");

    if (!isNaN(limit) && !isNaN(remaining) && !isNaN(resetAfter)) {
      const bucket: RateLimitBucket = {
        limit,
        remaining,
        resetTime: Date.now() + resetAfter * 1000,
        resetAfter,
        bucket: bucketHash || undefined,
      };

      this.buckets.set(bucketKey, bucket);

      debug.trace(DebugNamespace.REST, `Rate limit updated for ${bucketKey}`, {
        limit,
        remaining,
        resetAfter,
        bucket: bucketHash,
      });

      // If we hit a rate limit, track it
      if (remaining === 0) {
        this.stats.rateLimitedRequests++;
      }
    }
  }

  /**
   * Queue a request for execution when rate limits allow
   */
  public async queueRequest<T>(
    method: string,
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>,
    isForm?: boolean,
    priority: number = 5
  ): Promise<T> {
    const bucketKey = this.getBucketKey(method, endpoint);

    // Check queue size limits
    const currentQueueSize = Array.from(this.requestQueue.values()).reduce(
      (total, queue) => total + queue.length,
      0
    );

    if (currentQueueSize >= this.options.maxQueueSize) {
      throw new Error(
        `Request queue full (${this.options.maxQueueSize} items)`
      );
    }

    // Update stats
    this.stats.totalRequests++;
    this.stats.queuedRequests++;
    this.stats.peakQueueSize = Math.max(
      this.stats.peakQueueSize,
      currentQueueSize + 1
    );

    return new Promise<T>((resolve, reject) => {
      const queuedRequest: QueuedRequest = {
        method,
        endpoint,
        body,
        headers,
        isForm,
        resolve,
        reject,
        queuedAt: Date.now(),
        priority,
      };

      // Add to queue
      if (!this.requestQueue.has(bucketKey)) {
        this.requestQueue.set(bucketKey, []);
      }

      const queue = this.requestQueue.get(bucketKey)!;
      queue.push(queuedRequest);

      // Sort by priority if enabled
      if (this.options.enablePrioritization) {
        queue.sort((a, b) => a.priority - b.priority);
      }

      // Process queue immediately if possible
      this.processQueue(bucketKey);
    });
  }

  /**
   * Process the request queue for a specific bucket
   */
  private async processQueue(bucketKey: string): Promise<void> {
    const queue = this.requestQueue.get(bucketKey);
    if (!queue || queue.length === 0) return;

    // Don't process if we're already processing this bucket
    if (this.activeRequests.has(bucketKey)) return;

    // Check if we're rate limited
    if (this.isRateLimited(bucketKey)) {
      const waitTime = this.getWaitTime(bucketKey);
      debug.log(
        DebugNamespace.REST,
        `Queue paused for ${bucketKey}, waiting ${waitTime}ms`
      );

      setTimeout(() => this.processQueue(bucketKey), waitTime);
      return;
    }

    // Mark as active
    this.activeRequests.add(bucketKey);

    const request = queue.shift();
    if (!request) {
      this.activeRequests.delete(bucketKey);
      return;
    }

    // Check if request has been waiting too long
    const waitTime = Date.now() - request.queuedAt;
    if (waitTime > this.options.maxQueueWait) {
      request.reject(
        new Error(`Request timeout: waited ${waitTime}ms in queue`)
      );
      this.activeRequests.delete(bucketKey);
      this.processQueue(bucketKey); // Process next request
      return;
    }

    try {
      this.stats.queuedRequests--;

      // Execute the request (this should be injected by the REST client)
      const result = await this.executeRequest(request);
      request.resolve(result);
    } catch (error) {
      request.reject(error instanceof Error ? error : new Error(String(error)));
    } finally {
      this.activeRequests.delete(bucketKey);

      // Process next request in queue after a small delay
      setTimeout(() => this.processQueue(bucketKey), 10);
    }
  }

  /**
   * This method should be overridden by the REST client to actually execute requests
   */
  private async executeRequest(_request: QueuedRequest): Promise<any> {
    throw new Error("executeRequest must be implemented by REST client");
  }

  /**
   * Set the request executor function (called by REST client)
   */
  public setRequestExecutor(
    executor: (request: QueuedRequest) => Promise<any>
  ): void {
    this.executeRequest = executor;
  }

  /**
   * Get current rate limit status for debugging
   */
  public getRateLimitStatus(): {
    buckets: Map<string, RateLimitBucket>;
    globalRateLimit: RateLimitBucket | null;
    queueSizes: Record<string, number>;
    stats: {
      totalRequests: number;
      queuedRequests: number;
      rateLimitedRequests: number;
      globalRateLimits: number;
      averageLatency: number;
      peakQueueSize: number;
    };
  } {
    const queueSizes: Record<string, number> = {};
    for (const [key, queue] of this.requestQueue.entries()) {
      queueSizes[key] = queue.length;
    }

    return {
      buckets: new Map(this.buckets),
      globalRateLimit: this.globalRateLimit,
      queueSizes,
      stats: { ...this.stats },
    };
  }

  /**
   * Clean up expired rate limits
   */
  public cleanup(): void {
    const now = Date.now();

    // Clean up expired buckets
    for (const [key, bucket] of this.buckets.entries()) {
      if (now > bucket.resetTime) {
        this.buckets.delete(key);
      }
    }

    // Clean up global rate limit
    if (this.globalRateLimit && now > this.globalRateLimit.resetTime) {
      this.globalRateLimit = null;
    }

    // Clean up empty queues
    for (const [key, queue] of this.requestQueue.entries()) {
      if (queue.length === 0) {
        this.requestQueue.delete(key);
      }
    }
  }
}
