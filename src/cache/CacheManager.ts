/**
 * Generic cache manager for storing and retrieving entities by ID.
 */
export class CacheManager<K, V> {
  /**
   * Internal cache map.
   */
  protected cache: Map<K, V> = new Map();

  /**
   * Get an item from the cache.
   * @param id The key
   */
  get(id: K): V | undefined {
    return this.cache.get(id);
  }

  /**
   * Set an item in the cache.
   * @param id The key
   * @param value The value
   */
  set(id: K, value: V): void {
    this.cache.set(id, value);
  }

  /**
   * Check if the cache contains a key.
   * @param id The key
   */
  has(id: K): boolean {
    return this.cache.has(id);
  }

  /**
   * Delete an item from the cache.
   * @param id The key
   */
  delete(id: K): boolean {
    return this.cache.delete(id);
  }

  /**
   * Get all values in the cache.
   */
  values(): IterableIterator<V> {
    return this.cache.values();
  }

  /**
   * Clear the cache.
   */
  clear(): void {
    this.cache.clear();
  }
}
