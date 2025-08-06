import type { TypicordEvents } from "@/types/gateway/events";
/**
 * Enhanced event emitter with static methods and better TypeScript support
 */
export declare class TypedEventEmitter {
    /**
     * All our registered event listeners, organized by event type
     */
    private listeners;
    /**
     * Registers a function to be called when an event happens
     * @param event What event to listen for
     * @param listener Function to call when the event fires
     */
    on<K extends keyof TypicordEvents>(event: K, listener: (data: TypicordEvents[K]) => void): this;
    /**
     * Registers a function to be called once when an event happens
     * The listener is automatically removed after the first emission
     * @param event What event to listen for
     * @param listener Function to call when the event fires
     */
    once<K extends keyof TypicordEvents>(event: K, listener: (data: TypicordEvents[K]) => void): this;
    /**
     * Removes a specific listener from an event
     * @param event The event to remove the listener from
     * @param listener The listener function to remove
     */
    off<K extends keyof TypicordEvents>(event: K, listener: (data: TypicordEvents[K]) => void): this;
    /**
     * Removes all listeners from an event, or all listeners from all events
     * @param event Optional event to remove listeners from. If not provided, removes all listeners
     */
    removeAllListeners<K extends keyof TypicordEvents>(event?: K): this;
    /**
     * Gets the number of listeners for an event
     * @param event The event to count listeners for
     */
    listenerCount<K extends keyof TypicordEvents>(event: K): number;
    /**
     * Gets all the event names that have listeners
     */
    eventNames(): (keyof TypicordEvents)[];
    /**
     * Fires an event, calling all registered listeners
     * @param event What event happened
     * @param data The data to pass to listeners
     */
    emit<K extends keyof TypicordEvents>(event: K, data: TypicordEvents[K]): boolean;
    /**
     * Adds a listener to the beginning of the listeners array for the specified event
     * @param event The event to listen for
     * @param listener The listener function
     */
    prependListener<K extends keyof TypicordEvents>(event: K, listener: (data: TypicordEvents[K]) => void): this;
    /**
     * Adds a one-time listener to the beginning of the listeners array for the specified event
     * @param event The event to listen for
     * @param listener The listener function
     */
    prependOnceListener<K extends keyof TypicordEvents>(event: K, listener: (data: TypicordEvents[K]) => void): this;
    /**
     * Returns a copy of the array of listeners for the event
     * @param event The event to get listeners for
     */
    rawListeners<K extends keyof TypicordEvents>(event: K): Array<(data: TypicordEvents[K]) => void>;
}
//# sourceMappingURL=TypedEventEmitter.d.ts.map