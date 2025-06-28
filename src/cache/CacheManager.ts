export class CacheManager<K, V> {
  protected cache: Map<K, V> = new Map();

  get(id: K): V | undefined {
    return this.cache.get(id);
  }

  set(id: K, value: V): void {
    this.cache.set(id, value);
  }

  has(id: K): boolean {
    return this.cache.has(id);
  }

  delete(id: K): boolean {
    return this.cache.delete(id);
  }

  values(): IterableIterator<V> {
    return this.cache.values();
  }

  clear(): void {
    this.cache.clear();
  }
}
