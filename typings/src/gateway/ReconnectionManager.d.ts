/**
 * Handles reconnection logic with exponential backoff - basically makes sure
 * we don't spam Discord's servers when our connection drops but still try
 * to get back online reasonably quickly
 */
export declare class ReconnectionManager {
    private attempts;
    private readonly maxAttempts;
    private readonly baseDelay;
    private readonly maxDelay;
    private readonly jitter;
    private readonly reconnectCallback;
    private timeoutId;
    /**
     * @param reconnectCallback Function to call when we want to try reconnecting
     * @param options How we want the reconnection to behave
     */
    constructor(reconnectCallback: () => void, options?: {
        maxAttempts?: number;
        baseDelay?: number;
        maxDelay?: number;
        jitter?: boolean;
    });
    /**
     * Works out how long to wait before the next reconnection attempt
     * Uses exponential backoff so we don't hammer Discord's servers
     */
    private calculateDelay;
    /**
     * Schedules the next reconnection attempt with appropriate delay
     * @param reason Why are we reconnecting? (for logging)
     */
    scheduleReconnect(reason?: string): void;
    /**
     * We successfully reconnected! Reset everything back to normal
     */
    onConnectionSuccess(): void;
    /**
     * Cancel any pending reconnection attempts - used when shutting down
     */
    cancel(): void;
    /**
     * How many times have we tried to reconnect?
     */
    getAttempts(): number;
    /**
     * Have we hit our retry limit?
     */
    hasReachedMaxAttempts(): boolean;
    /**
     * Manually set the attempt count (mostly for testing)
     * @param attempts Number of attempts to set
     */
    setAttempts(attempts: number): void;
}
//# sourceMappingURL=ReconnectionManager.d.ts.map