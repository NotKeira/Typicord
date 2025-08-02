/**
 * Basic cache for storing stuff by ID - like a Map but with some extra methods
 * Used for storing guilds, users, and other Discord objects we want to keep around
 */
export declare class CacheManager<K, V> {
    /**
     * The actual Map that stores everything
     */
    protected cache: Map<K, V>;
    /**
     * Gets something from the cache
     * @param id What to look for
     */
    get(id: K): V | undefined;
    /**
     * Stores something in the cache
     * @param id The key to store it under
     * @param value The actual thing to store
     */
    set(id: K, value: V): void;
    /**
     * Checks if we have something in the cache
     * @param id What to check for
     */
    has(id: K): boolean;
    /**
     * Removes something from the cache
     * @param id What to remove
     */
    delete(id: K): boolean;
    /**
     * Gets all the values in the cache (not the keys, just the values)
     */
    values(): IterableIterator<V>;
    /**
     * Empties the entire cache
     */
    clear(): void;
}
//# sourceMappingURL=CacheManager.d.ts.map