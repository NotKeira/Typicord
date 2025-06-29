/**
 * Generic cache manager for storing and retrieving entities by ID.
 */
export declare class CacheManager<K, V> {
    /**
     * Internal cache map.
     */
    protected cache: Map<K, V>;
    /**
     * Get an item from the cache.
     * @param id The key
     */
    get(id: K): V | undefined;
    /**
     * Set an item in the cache.
     * @param id The key
     * @param value The value
     */
    set(id: K, value: V): void;
    /**
     * Check if the cache contains a key.
     * @param id The key
     */
    has(id: K): boolean;
    /**
     * Delete an item from the cache.
     * @param id The key
     */
    delete(id: K): boolean;
    /**
     * Get all values in the cache.
     */
    values(): IterableIterator<V>;
    /**
     * Clear the cache.
     */
    clear(): void;
}
//# sourceMappingURL=CacheManager.d.ts.map