import type { TypicordEvents } from "@/types/gateway/events";

/**
 * Enhanced event emitter with static methods and better TypeScript support
 */
export class TypedEventEmitter {
  /**
   * All our registered event listeners, organized by event type
   */
  private listeners: {
    [K in keyof TypicordEvents]?: Array<{
      listener: (data: TypicordEvents[K]) => void;
      once?: boolean;
    }>;
  } = {};

  /**
   * Registers a function to be called when an event happens
   * @param event What event to listen for
   * @param listener Function to call when the event fires
   */
  on<K extends keyof TypicordEvents>(
    event: K,
    listener: (data: TypicordEvents[K]) => void
  ): this {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event]!.push({ listener });
    return this;
  }

  /**
   * Registers a function to be called once when an event happens
   * The listener is automatically removed after the first emission
   * @param event What event to listen for
   * @param listener Function to call when the event fires
   */
  once<K extends keyof TypicordEvents>(
    event: K,
    listener: (data: TypicordEvents[K]) => void
  ): this {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event]!.push({ listener, once: true });
    return this;
  }

  /**
   * Removes a specific listener from an event
   * @param event The event to remove the listener from
   * @param listener The listener function to remove
   */
  off<K extends keyof TypicordEvents>(
    event: K,
    listener: (data: TypicordEvents[K]) => void
  ): this {
    if (!this.listeners[event]) return this;

    const listeners = this.listeners[event];
    if (!listeners) return this;

    const index = listeners.findIndex(l => l.listener === listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }

    return this;
  }

  /**
   * Removes all listeners from an event, or all listeners from all events
   * @param event Optional event to remove listeners from. If not provided, removes all listeners
   */
  removeAllListeners<K extends keyof TypicordEvents>(event?: K): this {
    if (event) {
      this.listeners[event] = [];
    } else {
      this.listeners = {};
    }
    return this;
  }

  /**
   * Gets the number of listeners for an event
   * @param event The event to count listeners for
   */
  listenerCount<K extends keyof TypicordEvents>(event: K): number {
    return this.listeners[event]?.length ?? 0;
  }

  /**
   * Gets all the event names that have listeners
   */
  eventNames(): (keyof TypicordEvents)[] {
    return Object.keys(this.listeners).filter(
      event => this.listeners[event as keyof TypicordEvents]!.length > 0
    ) as (keyof TypicordEvents)[];
  }

  /**
   * Fires an event, calling all registered listeners
   * @param event What event happened
   * @param data The data to pass to listeners
   */
  emit<K extends keyof TypicordEvents>(
    event: K,
    data: TypicordEvents[K]
  ): boolean {
    if (!this.listeners[event]?.length) return false;

    const listeners = this.listeners[event];
    if (!listeners?.length) return false;

    const toRemove: number[] = [];

    listeners.forEach((listenerObj, index) => {
      try {
        listenerObj.listener(data);
        if (listenerObj.once) {
          toRemove.push(index);
        }
      } catch (error) {
        console.error(`Error in event listener for ${String(event)}:`, error);
      }
    });

    // Remove once listeners (in reverse order to maintain indices)
    toRemove.reverse();
    toRemove.forEach(index => {
      listeners.splice(index, 1);
    });

    return true;
  }

  /**
   * Adds a listener to the beginning of the listeners array for the specified event
   * @param event The event to listen for
   * @param listener The listener function
   */
  prependListener<K extends keyof TypicordEvents>(
    event: K,
    listener: (data: TypicordEvents[K]) => void
  ): this {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event]!.unshift({ listener });
    return this;
  }

  /**
   * Adds a one-time listener to the beginning of the listeners array for the specified event
   * @param event The event to listen for
   * @param listener The listener function
   */
  prependOnceListener<K extends keyof TypicordEvents>(
    event: K,
    listener: (data: TypicordEvents[K]) => void
  ): this {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event]!.unshift({ listener, once: true });
    return this;
  }

  /**
   * Returns a copy of the array of listeners for the event
   * @param event The event to get listeners for
   */
  rawListeners<K extends keyof TypicordEvents>(
    event: K
  ): Array<(data: TypicordEvents[K]) => void> {
    return this.listeners[event]?.map(l => l.listener) ?? [];
  }
}
