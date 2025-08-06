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
export declare class RateLimitManager {
    private readonly buckets;
    private globalRateLimit;
    private readonly requestQueue;
    private readonly activeRequests;
    private readonly options;
    stats: {
        totalRequests: number;
        queuedRequests: number;
        rateLimitedRequests: number;
        globalRateLimits: number;
        averageLatency: number;
        peakQueueSize: number;
    };
    constructor(options?: RateLimitManagerOptions);
    /**
     * Get the rate limit bucket key for a route
     * This handles major parameters like channel_id, guild_id, etc.
     */
    private getBucketKey;
    /**
     * Check if we're currently rate limited for a specific bucket
     */
    private isRateLimited;
    /**
     * Calculate how long we need to wait before making a request
     */
    private getWaitTime;
    /**
     * Update rate limit information from response headers
     */
    updateRateLimit(method: string, endpoint: string, headers: Headers | Record<string, string>): void;
    /**
     * Queue a request for execution when rate limits allow
     */
    queueRequest<T>(method: string, endpoint: string, body?: unknown, headers?: Record<string, string>, isForm?: boolean, priority?: number): Promise<T>;
    /**
     * Process the request queue for a specific bucket
     */
    private processQueue;
    /**
     * This method should be overridden by the REST client to actually execute requests
     */
    private executeRequest;
    /**
     * Set the request executor function (called by REST client)
     */
    setRequestExecutor(executor: (request: QueuedRequest) => Promise<any>): void;
    /**
     * Get current rate limit status for debugging
     */
    getRateLimitStatus(): {
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
    };
    /**
     * Clean up expired rate limits
     */
    cleanup(): void;
}
//# sourceMappingURL=RateLimitManager.d.ts.map