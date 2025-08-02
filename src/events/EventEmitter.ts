import type { TypicordEvents } from "@/types/gateway/events";

/**
 * Simple event system for Typicord - lets you listen for things like messages,
 * user joins, etc. Much simpler than Node's built-in EventEmitter but does what we need
 */
export class EventEmitter {
  /**
   * All our registered event listeners, organized by event type
   */
  private listeners: {
    [K in keyof TypicordEvents]?: Array<(data: TypicordEvents[K]) => void>;
  } = {};

  /**
   * One-time event listeners that get removed after first emission
   */
  private onceListeners: {
    [K in keyof TypicordEvents]?: Array<(data: TypicordEvents[K]) => void>;
  } = {};

  /**
   * Registers a function to be called when an event happens
   * @param event What event to listen for
   * @param listener Function to call when the event fires
   */
  on<K extends keyof TypicordEvents>(
    event: K,
    listener: (data: TypicordEvents[K]) => void
  ): void {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event]!.push(listener);
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
  ): void {
    if (!this.onceListeners[event]) this.onceListeners[event] = [];
    this.onceListeners[event]!.push(listener);
  }

  /**
   * Fires an event, calling all registered listeners
   * @param event What event happened
   * @param data The data to pass to listeners
   */
  emit<K extends keyof TypicordEvents>(
    event: K,
    data: TypicordEvents[K]
  ): void {
    // Call regular listeners
    this.listeners[event]?.forEach(listener => listener(data));

    // Call once listeners and then remove them
    if (this.onceListeners[event]) {
      const onceListeners = this.onceListeners[event]!;
      onceListeners.forEach(listener => listener(data));
      // Clear the once listeners after calling them
      this.onceListeners[event] = [];
    }
  }
}
