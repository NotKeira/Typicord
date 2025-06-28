import type { TypicordEvents } from "@/types/gateway/events";

export class EventEmitter {
  private listeners: {
    [K in keyof TypicordEvents]?: Array<(data: TypicordEvents[K]) => void>;
  } = {};

  on<K extends keyof TypicordEvents>(
    event: K,
    listener: (data: TypicordEvents[K]) => void
  ): void {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event]!.push(listener);
  }

  emit<K extends keyof TypicordEvents>(
    event: K,
    data: TypicordEvents[K]
  ): void {
    this.listeners[event]?.forEach((listener) => listener(data));
  }
}
