/**
 * Rate Limiter for Discord API Requests
 * Handles both global and per-route rate limiting
 */

interface RateLimit {
  limit: number;
  remaining: number;
  resetAt: number;
  resetAfter: number;
}

interface RateLimitBucket {
  limit: number;
  remaining: number;
  resetAt: number;
  queue: Array<{
    resolve: (value: void) => void;
    reject: (error: Error) => void;
  }>;
  processing: boolean;
}

export class RateLimiter {
  private readonly buckets = new Map<string, RateLimitBucket>();
  private globalLimit: RateLimit | null = null;
  private globalQueue: Array<{
    resolve: (value: void) => void;
    reject: (error: Error) => void;
  }> = [];
  private processingGlobal = false;

  /**
   * Wait for rate limit clearance before making a request
   */
  async waitForRateLimit(route: string): Promise<void> {
    // Check global rate limit first
    if (this.globalLimit && this.globalLimit.remaining <= 0) {
      await this.waitForGlobal();
    }

    // Check route-specific rate limit
    const bucket = this.buckets.get(route);
    if (bucket && bucket.remaining <= 0) {
      await this.waitForBucket(route);
    }
  }

  /**
   * Update rate limit information from response headers
   */
  updateRateLimit(route: string, headers: Headers): void {
    const limit = parseInt(headers.get("x-ratelimit-limit") || "0");
    const remaining = parseInt(headers.get("x-ratelimit-remaining") || "0");
    const resetAfter =
      parseFloat(headers.get("x-ratelimit-reset-after") || "0") * 1000;
    const resetAt = Date.now() + resetAfter;

    // Update global rate limit
    const globalRemaining = headers.get("x-ratelimit-global");
    if (globalRemaining) {
      const globalResetAfter =
        parseFloat(headers.get("retry-after") || "0") * 1000;
      this.globalLimit = {
        limit: 50, // Discord's global rate limit
        remaining: 0,
        resetAt: Date.now() + globalResetAfter,
        resetAfter: globalResetAfter,
      };
      this.processGlobalQueue();
      return;
    }

    // Update route-specific rate limit
    let bucket = this.buckets.get(route);
    if (!bucket) {
      bucket = {
        limit,
        remaining,
        resetAt,
        queue: [],
        processing: false,
      };
      this.buckets.set(route, bucket);
    } else {
      bucket.limit = limit;
      bucket.remaining = remaining;
      bucket.resetAt = resetAt;
    }

    // Process queue if rate limit reset
    if (bucket.remaining > 0) {
      this.processBucketQueue(route);
    }
  }

  /**
   * Handle 429 Too Many Requests response
   */
  handleRateLimitExceeded(route: string, headers: Headers): void {
    const retryAfter = parseFloat(headers.get("retry-after") || "1") * 1000;
    const isGlobal = headers.get("x-ratelimit-global") === "true";

    if (isGlobal) {
      this.globalLimit = {
        limit: 50,
        remaining: 0,
        resetAt: Date.now() + retryAfter,
        resetAfter: retryAfter,
      };

      setTimeout(() => {
        this.globalLimit = null;
        this.processGlobalQueue();
      }, retryAfter);
    } else {
      let bucket = this.buckets.get(route);
      if (!bucket) {
        bucket = {
          limit: 1,
          remaining: 0,
          resetAt: Date.now() + retryAfter,
          queue: [],
          processing: false,
        };
        this.buckets.set(route, bucket);
      } else {
        bucket.remaining = 0;
        bucket.resetAt = Date.now() + retryAfter;
      }

      setTimeout(() => {
        if (bucket) {
          bucket.remaining = bucket.limit;
        }
        this.processBucketQueue(route);
      }, retryAfter);
    }
  }

  /**
   * Wait for global rate limit to clear
   */
  private async waitForGlobal(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.globalQueue.push({ resolve, reject });
      this.processGlobalQueue();
    });
  }

  /**
   * Wait for bucket rate limit to clear
   */
  private async waitForBucket(route: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const bucket = this.buckets.get(route);
      if (!bucket) {
        resolve();
        return;
      }

      bucket.queue.push({ resolve, reject });
      this.processBucketQueue(route);
    });
  }

  /**
   * Process global rate limit queue
   */
  private processGlobalQueue(): void {
    if (this.processingGlobal || this.globalQueue.length === 0) {
      return;
    }

    if (this.globalLimit && this.globalLimit.remaining <= 0) {
      const timeUntilReset = this.globalLimit.resetAt - Date.now();
      if (timeUntilReset > 0) {
        this.processingGlobal = true;
        setTimeout(() => {
          this.globalLimit = null;
          this.processingGlobal = false;
          this.processGlobalQueue();
        }, timeUntilReset);
        return;
      }
    }

    // Process all queued requests
    const queue = [...this.globalQueue];
    this.globalQueue = [];

    for (const { resolve } of queue) {
      resolve();
    }
  }

  /**
   * Process bucket rate limit queue
   */
  private processBucketQueue(route: string): void {
    const bucket = this.buckets.get(route);
    if (!bucket || bucket.processing || bucket.queue.length === 0) {
      return;
    }

    if (bucket.remaining <= 0) {
      const timeUntilReset = bucket.resetAt - Date.now();
      if (timeUntilReset > 0) {
        bucket.processing = true;
        setTimeout(() => {
          bucket.remaining = bucket.limit;
          bucket.processing = false;
          this.processBucketQueue(route);
        }, timeUntilReset);
        return;
      }
    }

    // Process requests while we have remaining quota
    while (bucket.queue.length > 0 && bucket.remaining > 0) {
      const { resolve } = bucket.queue.shift()!;
      bucket.remaining--;
      resolve();
    }
  }

  /**
   * Get current rate limit status for a route
   */
  getRateLimitStatus(route: string): {
    bucket?: RateLimitBucket;
    global?: RateLimit;
    canMakeRequest: boolean;
  } {
    const bucket = this.buckets.get(route);
    const canMakeRequest =
      (!this.globalLimit || this.globalLimit.remaining > 0) &&
      (!bucket || bucket.remaining > 0);

    return {
      bucket,
      global: this.globalLimit || undefined,
      canMakeRequest,
    };
  }

  /**
   * Clear expired rate limits
   */
  cleanup(): void {
    const now = Date.now();

    // Clear global rate limit if expired
    if (this.globalLimit && this.globalLimit.resetAt <= now) {
      this.globalLimit = null;
    }

    // Clear expired bucket rate limits
    for (const [route, bucket] of this.buckets.entries()) {
      if (bucket.resetAt <= now) {
        bucket.remaining = bucket.limit;
      }

      // Remove empty buckets that haven't been used recently
      if (bucket.queue.length === 0 && bucket.resetAt + 300000 < now) {
        // 5 minutes
        this.buckets.delete(route);
      }
    }
  }

  /**
   * Create a route key for rate limiting
   */
  static createRouteKey(method: string, url: string): string {
    let route = url;

    // Replace major parameters with placeholders
    route = route.replace(/\/channels\/\d+/, "/channels/{channel.id}");
    route = route.replace(/\/guilds\/\d+/, "/guilds/{guild.id}");
    route = route.replace(/\/users\/\d+/, "/users/{user.id}");
    route = route.replace(/\/members\/\d+/, "/members/{user.id}");
    route = route.replace(/\/messages\/\d+/, "/messages/{message.id}");
    route = route.replace(/\/roles\/\d+/, "/roles/{role.id}");
    route = route.replace(/\/webhooks\/\d+/, "/webhooks/{webhook.id}");
    route = route.replace(/\/emojis\/\d+/, "/emojis/{emoji.id}");
    route = route.replace(/\/invites\/\w+/, "/invites/{invite.code}");

    return `${method.toUpperCase()} ${route}`;
  }

  /**
   * Reset all rate limits (for testing)
   */
  reset(): void {
    this.buckets.clear();
    this.globalLimit = null;
    this.globalQueue = [];
    this.processingGlobal = false;
  }
}
