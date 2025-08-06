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
import type { TypicordEvents } from "@/types/gateway/events";
/**
 * Handler function signature for gateway events
 */
export type DispatchHandler<T = any> = (client: any, data: T) => void;
/**
 * Central registry for all gateway dispatch event handlers.
 * Supports dynamic registration and plugin-based architectures.
 */
export declare class DispatchHandlerRegistry {
    private readonly handlers;
    /**
     * Register a handler for a specific gateway event
     * @param event The gateway event name (e.g., "MESSAGE_CREATE", "READY")
     * @param handler The handler function to invoke when the event is received
     */
    registerDispatchHandler<K extends keyof TypicordEvents>(event: K, handler: DispatchHandler<TypicordEvents[K]>): void;
    registerDispatchHandler(event: string, handler: DispatchHandler): void;
    /**
     * Unregister a handler for a specific gateway event
     * @param event The gateway event name to unregister
     */
    unregisterDispatchHandler(event: string): boolean;
    /**
     * Check if a handler is registered for a specific event
     * @param event The gateway event name to check
     */
    hasHandler(event: string): boolean;
    /**
     * Get the handler for a specific event
     * @param event The gateway event name
     */
    getHandler(event: string): DispatchHandler | undefined;
    /**
     * Process a gateway dispatch event by looking up and invoking the appropriate handler
     * @param client The Typicord client instance
     * @param event The gateway event name
     * @param data The event payload data
     */
    handleDispatch(client: any, event: string, data: any): void;
    /**
     * Get all registered event names
     */
    getRegisteredEvents(): string[];
    /**
     * Clear all registered handlers
     */
    clear(): void;
    /**
     * Get the number of registered handlers
     */
    size(): number;
}
/**
 * Global instance of the dispatch handler registry
 */
export declare const dispatchHandlerRegistry: DispatchHandlerRegistry;
//# sourceMappingURL=DispatchHandlerRegistry.d.ts.map