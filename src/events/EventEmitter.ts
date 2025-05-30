type Listener<T = any> = (data: T) => void;

export class EventEmitter {
  private listeners: Map<string, Listener[]> = new Map();

  on<T>(event: string, listener: Listener<T>): void {
    const existing = this.listeners.get(event) ?? [];
    existing.push(listener);
    this.listeners.set(event, existing);
  }

  emit<T>(event: string, data: T): void {
    const listeners = this.listeners.get(event);
    if (!listeners) return;
    for (const listener of listeners) {
      listener(data);
    }
  }
}
