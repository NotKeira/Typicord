import type { TypicordEvents } from "@/types/gateway/events";
/**
 * Simple event system for Typicord - lets you listen for things like messages,
 * user joins, etc. Much simpler than Node's built-in EventEmitter but does what we need
 */
export declare class EventEmitter {
    /**
     * All our registered event listeners, organized by event type
     */
    private listeners;
    /**
     * Registers a function to be called when an event happens
     * @param event What event to listen for
     * @param listener Function to call when the event fires
     */
    on<K extends keyof TypicordEvents>(event: K, listener: (data: TypicordEvents[K]) => void): void;
    /**
     * Fires an event, calling all registered listeners
     * @param event What event happened
     * @param data The data to pass to listeners
     */
    emit<K extends keyof TypicordEvents>(event: K, data: TypicordEvents[K]): void;
}
//# sourceMappingURL=EventEmitter.d.ts.map