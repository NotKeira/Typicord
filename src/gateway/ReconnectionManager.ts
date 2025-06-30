/**
 * Handles reconnection logic with exponential backoff - basically makes sure
 * we don't spam Discord's servers when our connection drops but still try
 * to get back online reasonably quickly
 */
export class ReconnectionManager {
  private attempts: number = 0;
  private maxAttempts: number;
  private baseDelay: number;
  private maxDelay: number;
  private jitter: boolean;
  private reconnectCallback: () => void;
  private timeoutId: NodeJS.Timeout | null = null;

  /**
   * @param reconnectCallback Function to call when we want to try reconnecting
   * @param options How we want the reconnection to behave
   */
  constructor(
    reconnectCallback: () => void,
    options: {
      maxAttempts?: number;
      baseDelay?: number;
      maxDelay?: number;
      jitter?: boolean;
    } = {}
  ) {
    this.reconnectCallback = reconnectCallback;
    this.maxAttempts = options.maxAttempts ?? 10;
    this.baseDelay = options.baseDelay ?? 1000; // Start with 1 second
    this.maxDelay = options.maxDelay ?? 300000; // Cap at 5 minutes
    this.jitter = options.jitter ?? true; // Add randomness by default
  }

  /**
   * Works out how long to wait before the next reconnection attempt
   * Uses exponential backoff so we don't hammer Discord's servers
   */
  private calculateDelay(): number {
    // Double the delay each time: 1s, 2s, 4s, 8s, 16s...
    let delay = this.baseDelay * Math.pow(2, this.attempts);

    // Don't let it get ridiculous though
    delay = Math.min(delay, this.maxDelay);

    // Add some randomness to avoid the thundering herd problem
    if (this.jitter) {
      delay = delay * (0.5 + Math.random() * 0.5);
    }

    return Math.floor(delay);
  }

  /**
   * Schedules the next reconnection attempt with appropriate delay
   * @param reason Why are we reconnecting? (for logging)
   */
  public scheduleReconnect(reason?: string): void {
    if (this.attempts >= this.maxAttempts) {
      console.error(
        `[ReconnectionManager] Hit max attempts (${this.maxAttempts}), giving up for now`
      );
      return;
    }

    const delay = this.calculateDelay();
    this.attempts++;

    console.warn(
      `[ReconnectionManager] Scheduling reconnection attempt ${this.attempts}/${this.maxAttempts} in ${delay}ms${
        reason ? ` (reason: ${reason})` : ""
      }`
    );

    this.timeoutId = setTimeout(() => {
      this.timeoutId = null;
      try {
        this.reconnectCallback();
      } catch (error) {
        console.error(
          "[ReconnectionManager] Reconnection callback failed:",
          error
        );
        // Try again if the callback itself fails
        this.scheduleReconnect("callback failed");
      }
    }, delay);
  }

  /**
   * We successfully reconnected! Reset everything back to normal
   */
  public onConnectionSuccess(): void {
    console.log(
      "[ReconnectionManager] Connection successful, resetting backoff"
    );
    this.attempts = 0;
    this.cancel();
  }

  /**
   * Cancel any pending reconnection attempts - used when shutting down
   */
  public cancel(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  /**
   * How many times have we tried to reconnect?
   */
  public getAttempts(): number {
    return this.attempts;
  }

  /**
   * Have we hit our retry limit?
   */
  public hasReachedMaxAttempts(): boolean {
    return this.attempts >= this.maxAttempts;
  }

  /**
   * Manually set the attempt count (mostly for testing)
   * @param attempts Number of attempts to set
   */
  public setAttempts(attempts: number): void {
    this.attempts = Math.max(0, attempts);
  }
}
