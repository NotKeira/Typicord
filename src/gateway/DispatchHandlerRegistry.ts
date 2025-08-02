/**
 * Modular, scalable Gateway dispatch event handler system.
 *
 * This system provides:
 * - Central registry for gateway event handlers
 * - Strong TypeScript typing for known events
 * - Dynamic handler registration for plugin architectures
 * - Automatic handler lookup and invocation
 * - Warning logging for unhandled events
 */

import { debug, DebugNamespace } from "@/debug";
import type { TypicordEvents } from "@/types/gateway/events";

/**
 * Handler function signature for gateway events
 */
export type DispatchHandler<T = any> = (client: any, data: T) => void;

/**
 * Map of event names to their handler functions
 */
type HandlerRegistry = Map<string, DispatchHandler>;

/**
 * Central registry for all gateway dispatch event handlers.
 * Supports dynamic registration and plugin-based architectures.
 */
export class DispatchHandlerRegistry {
  private readonly handlers: HandlerRegistry = new Map();

  /**
   * Register a handler for a specific gateway event
   * @param event The gateway event name (e.g., "MESSAGE_CREATE", "READY")
   * @param handler The handler function to invoke when the event is received
   */
  public registerDispatchHandler<K extends keyof TypicordEvents>(
    event: K,
    handler: DispatchHandler<TypicordEvents[K]>
  ): void;
  public registerDispatchHandler(event: string, handler: DispatchHandler): void;
  public registerDispatchHandler(
    event: string,
    handler: DispatchHandler
  ): void {
    debug.log(
      DebugNamespace.GATEWAY,
      `Registering dispatch handler for event: ${event}`
    );

    if (this.handlers.has(event)) {
      debug.warn(
        DebugNamespace.GATEWAY,
        `Overwriting existing handler for event: ${event}`
      );
    }

    this.handlers.set(event, handler);
  }

  /**
   * Unregister a handler for a specific gateway event
   * @param event The gateway event name to unregister
   */
  public unregisterDispatchHandler(event: string): boolean {
    debug.log(
      DebugNamespace.GATEWAY,
      `Unregistering dispatch handler for event: ${event}`
    );
    return this.handlers.delete(event);
  }

  /**
   * Check if a handler is registered for a specific event
   * @param event The gateway event name to check
   */
  public hasHandler(event: string): boolean {
    return this.handlers.has(event);
  }

  /**
   * Get the handler for a specific event
   * @param event The gateway event name
   */
  public getHandler(event: string): DispatchHandler | undefined {
    return this.handlers.get(event);
  }

  /**
   * Process a gateway dispatch event by looking up and invoking the appropriate handler
   * @param client The Typicord client instance
   * @param event The gateway event name
   * @param data The event payload data
   */
  public handleDispatch(client: any, event: string, data: any): void {
    debug.log(DebugNamespace.EVENTS, `Processing dispatch event: ${event}`);

    const handler = this.handlers.get(event);

    if (handler) {
      try {
        handler(client, data);
      } catch (error) {
        debug.error(
          DebugNamespace.EVENTS,
          `Error in dispatch handler for ${event}`,
          error as Error
        );
      }
    } else {
      debug.warn(
        DebugNamespace.EVENTS,
        `No handler registered for dispatch event: ${event}`
      );
    }
  }

  /**
   * Get all registered event names
   */
  public getRegisteredEvents(): string[] {
    return Array.from(this.handlers.keys());
  }

  /**
   * Clear all registered handlers
   */
  public clear(): void {
    debug.log(DebugNamespace.GATEWAY, "Clearing all dispatch handlers");
    this.handlers.clear();
  }

  /**
   * Get the number of registered handlers
   */
  public size(): number {
    return this.handlers.size;
  }
}

/**
 * Global instance of the dispatch handler registry
 */
export const dispatchHandlerRegistry = new DispatchHandlerRegistry();
