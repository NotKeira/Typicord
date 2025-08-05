import { TypedEventEmitter } from "@/events/TypedEventEmitter";
import type { ClientEvents } from "@/types/ClientEvents";
import type { TypicordEvents } from "@/types/gateway/events";

/**
 * Enhanced Client class with static methods and improved event handling
 */
export class EnhancedClient extends TypedEventEmitter {
  /**
   * Static method to wait for a single event emission
   * @param eventEmitter The event emitter to listen on
   * @param eventName The event to wait for
   * @param options Optional configuration
   * @returns Promise that resolves with the event data
   */
  static once<Emitter extends EnhancedClient, Event extends keyof ClientEvents>(
    eventEmitter: Emitter,
    eventName: Emitter extends EnhancedClient ? Event : string | symbol,
    options?: { signal?: AbortSignal }
  ): Promise<Emitter extends EnhancedClient ? [ClientEvents[Event]] : any[]> {
    return new Promise((resolve, reject) => {
      // Handle abort signal
      if (options?.signal?.aborted) {
        reject(new Error("Operation was aborted"));
        return;
      }

      const cleanup = () => {
        if (options?.signal) {
          options.signal.removeEventListener("abort", onAbort);
        }
      };

      const onAbort = () => {
        cleanup();
        reject(new Error("Operation was aborted"));
      };

      if (options?.signal) {
        options.signal.addEventListener("abort", onAbort);
      }

      // For enhanced clients, use typed event handling
      if (eventEmitter instanceof EnhancedClient) {
        eventEmitter.once(eventName, data => {
          cleanup();
          resolve([data] as any);
        });
      } else {
        // Fallback for other event emitters (shouldn't happen in our case)
        const listener = (...args: any[]) => {
          cleanup();
          resolve(args as any);
        };

        // @ts-ignore - For compatibility with other event emitters
        eventEmitter.once(eventName, listener);
      }
    });
  }

  /**
   * Listens for events with additional options like timeouts and conditions
   * @param event The event to listen for
   * @param options Listening options
   */
  waitFor<K extends keyof ClientEvents>(
    event: K,
    options: {
      /** Maximum time to wait in milliseconds */
      timeout?: number;
      /** Condition function that must return true for the promise to resolve */
      filter?: (data: ClientEvents[K]) => boolean;
      /** Maximum number of events to collect before resolving */
      max?: number;
      /** Whether to collect all matching events or just the first */
      collect?: boolean;
    } = {}
  ): Promise<ClientEvents[K] | ClientEvents[K][]> {
    return new Promise((resolve, reject) => {
      const collected: ClientEvents[K][] = [];
      let timeoutId: NodeJS.Timeout | undefined;

      const cleanup = () => {
        if (timeoutId) clearTimeout(timeoutId);
        this.off(event, handler);
      };

      const handler = (data: ClientEvents[K]) => {
        // Apply filter if provided
        if (options.filter && !options.filter(data)) {
          return;
        }

        if (options.collect) {
          collected.push(data);

          // Check if we've collected enough events
          if (options.max && collected.length >= options.max) {
            cleanup();
            resolve(collected);
          }
        } else {
          // Just resolve with the first matching event
          cleanup();
          resolve(data);
        }
      };

      // Set up timeout if specified
      if (options.timeout) {
        timeoutId = setTimeout(() => {
          cleanup();
          if (options.collect && collected.length > 0) {
            resolve(collected);
          } else {
            reject(new Error(`Timeout waiting for event '${String(event)}'`));
          }
        }, options.timeout);
      }

      this.on(event, handler);
    });
  }

  /**
   * Override the on method to support ClientEvents
   */
  override on<K extends keyof ClientEvents>(
    event: K,
    listener: (data: ClientEvents[K]) => void
  ): this {
    // Cast to TypicordEvents for compatibility with parent class
    return super.on(event as keyof TypicordEvents, listener as any);
  }

  /**
   * Override the once method to support ClientEvents
   */
  override once<K extends keyof ClientEvents>(
    event: K,
    listener: (data: ClientEvents[K]) => void
  ): this {
    // Cast to TypicordEvents for compatibility with parent class
    return super.once(event as keyof TypicordEvents, listener as any);
  }

  /**
   * Override the off method to support ClientEvents
   */
  override off<K extends keyof ClientEvents>(
    event: K,
    listener: (data: ClientEvents[K]) => void
  ): this {
    // Cast to TypicordEvents for compatibility with parent class
    return super.off(event as keyof TypicordEvents, listener as any);
  }

  /**
   * Override emit to support ClientEvents
   */
  override emit<K extends keyof ClientEvents>(
    event: K,
    data: ClientEvents[K]
  ): boolean {
    // Cast to TypicordEvents for compatibility with parent class
    return super.emit(event as keyof TypicordEvents, data as any);
  }

  /**
   * Emit error events with proper error handling
   */
  emitError(error: Error): void {
    if (this.listenerCount("error" as keyof TypicordEvents) > 0) {
      this.emit("error" as keyof ClientEvents, error);
    } else {
      // If no error listeners, log the error to prevent silent failures
      console.error("Unhandled client error:", error);
    }
  }

  /**
   * Emit warning events
   */
  emitWarn(message: string): void {
    this.emit("warn" as keyof ClientEvents, message);
  }

  /**
   * Emit debug events
   */
  emitDebug(message: string): void {
    this.emit("debug" as keyof ClientEvents, message);
  }
}
