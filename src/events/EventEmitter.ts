import type { TypicordEvents } from "@/types/gateway/events";

/**
 * A simple event emitter for Typicord events.
 */
export class EventEmitter {
  /**
   * Registered event listeners.
   */
  private listeners: {
    [K in keyof TypicordEvents]?: Array<(data: TypicordEvents[K]) => void>;
  } = {};

  /**
   * Register an event listener.
   * @param event The event name
   * @param listener The callback function
   */
  on<K extends keyof TypicordEvents>(
    event: K,
    listener: (data: TypicordEvents[K]) => void
  ): void {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event]!.push(listener);
  }

  /**
   * Emit an event to all registered listeners.
   * @param event The event name
   * @param data The event data
   */
  emit<K extends keyof TypicordEvents>(
    event: K,
    data: TypicordEvents[K]
  ): void {
    this.listeners[event]?.forEach((listener) => listener(data));
  }
}
