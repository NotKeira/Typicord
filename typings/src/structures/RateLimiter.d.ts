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
export declare class RateLimiter {
    private readonly buckets;
    private globalLimit;
    private globalQueue;
    private processingGlobal;
    /**
     * Wait for rate limit clearance before making a request
     */
    waitForRateLimit(route: string): Promise<void>;
    /**
     * Update rate limit information from response headers
     */
    updateRateLimit(route: string, headers: Headers): void;
    /**
     * Handle 429 Too Many Requests response
     */
    handleRateLimitExceeded(route: string, headers: Headers): void;
    /**
     * Wait for global rate limit to clear
     */
    private waitForGlobal;
    /**
     * Wait for bucket rate limit to clear
     */
    private waitForBucket;
    /**
     * Process global rate limit queue
     */
    private processGlobalQueue;
    /**
     * Process bucket rate limit queue
     */
    private processBucketQueue;
    /**
     * Get current rate limit status for a route
     */
    getRateLimitStatus(route: string): {
        bucket?: RateLimitBucket;
        global?: RateLimit;
        canMakeRequest: boolean;
    };
    /**
     * Clear expired rate limits
     */
    cleanup(): void;
    /**
     * Create a route key for rate limiting
     */
    static createRouteKey(method: string, url: string): string;
    /**
     * Reset all rate limits (for testing)
     */
    reset(): void;
}
export {};
//# sourceMappingURL=RateLimiter.d.ts.map