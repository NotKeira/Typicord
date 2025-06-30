/**
 * Basic cache for storing stuff by ID - like a Map but with some extra methods
 * Used for storing guilds, users, and other Discord objects we want to keep around
 */
export class CacheManager<K, V> {
  /**
   * The actual Map that stores everything
   */
  protected cache: Map<K, V> = new Map();

  /**
   * Gets something from the cache
   * @param id What to look for
   */
  get(id: K): V | undefined {
    return this.cache.get(id);
  }

  /**
   * Stores something in the cache
   * @param id The key to store it under
   * @param value The actual thing to store
   */
  set(id: K, value: V): void {
    this.cache.set(id, value);
  }

  /**
   * Checks if we have something in the cache
   * @param id What to check for
   */
  has(id: K): boolean {
    return this.cache.has(id);
  }

  /**
   * Removes something from the cache
   * @param id What to remove
   */
  delete(id: K): boolean {
    return this.cache.delete(id);
  }

  /**
   * Gets all the values in the cache (not the keys, just the values)
   */
  values(): IterableIterator<V> {
    return this.cache.values();
  }

  /**
   * Empties the entire cache
   */
  clear(): void {
    this.cache.clear();
  }
}
