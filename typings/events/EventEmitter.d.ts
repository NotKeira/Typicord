import type { TypicordEvents } from "@/types/gateway/events";
/**
 * A simple event emitter for Typicord events.
 */
export declare class EventEmitter {
    /**
     * Registered event listeners.
     */
    private listeners;
    /**
     * Register an event listener.
     * @param event The event name
     * @param listener The callback function
     */
    on<K extends keyof TypicordEvents>(event: K, listener: (data: TypicordEvents[K]) => void): void;
    /**
     * Emit an event to all registered listeners.
     * @param event The event name
     * @param data The event data
     */
    emit<K extends keyof TypicordEvents>(event: K, data: TypicordEvents[K]): void;
}
//# sourceMappingURL=EventEmitter.d.ts.map