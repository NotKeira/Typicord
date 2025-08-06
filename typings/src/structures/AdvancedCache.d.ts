/**
 * Advanced Caching System with TTL, LRU eviction, and memory management
 */
interface CacheOptions {
    maxSize?: number;
    defaultTTL?: number;
    cleanupInterval?: number;
    enableStats?: boolean;
}
interface CacheStats {
    hits: number;
    misses: number;
    sets: number;
    deletes: number;
    evictions: number;
    cleanups: number;
    size: number;
    memoryUsage: number;
}
export declare class AdvancedCache<K, V> {
    private readonly cache;
    private readonly maxSize;
    private readonly defaultTTL;
    private readonly cleanupInterval;
    private readonly enableStats;
    private cleanupTimer?;
    private stats;
    constructor(options?: CacheOptions);
    /**
     * Get a value from the cache
     */
    get(key: K): V | undefined;
    /**
     * Set a value in the cache
     */
    set(key: K, value: V, ttl?: number): void;
    /**
     * Check if key exists and is not expired
     */
    has(key: K): boolean;
    /**
     * Delete a key from the cache
     */
    delete(key: K): boolean;
    /**
     * Clear all entries from the cache
     */
    clear(): void;
    /**
     * Get all keys (non-expired)
     */
    keys(): K[];
    /**
     * Get all values (non-expired)
     */
    values(): V[];
    /**
     * Get all entries (non-expired)
     */
    entries(): Array<[K, V]>;
    /**
     * Get cache size (including expired entries)
     */
    get size(): number;
    /**
     * Get cache size (excluding expired entries)
     */
    get validSize(): number;
    /**
     * Get cache statistics
     */
    getStats(): CacheStats;
    /**
     * Reset cache statistics
     */
    resetStats(): void;
    /**
     * Get cache hit ratio
     */
    getHitRatio(): number;
    /**
     * Set TTL for an existing key
     */
    setTTL(key: K, ttl: number): boolean;
    /**
     * Get TTL for a key (in milliseconds)
     */
    getTTL(key: K): number | undefined;
    /**
     * Touch a key to update its last accessed time
     */
    touch(key: K): boolean;
    /**
     * Get or set a value (cache-aside pattern)
     */
    getOrSet<T extends V>(key: K, factory: () => Promise<T> | T, ttl?: number): Promise<T>;
    /**
     * Bulk set multiple values
     */
    setMany(entries: Array<[K, V, number?]>): void;
    /**
     * Bulk get multiple values
     */
    getMany(keys: K[]): Map<K, V>;
    /**
     * Evict least recently used item
     */
    private evictLRU;
    /**
     * Clean up expired entries
     */
    private cleanup;
    /**
     * Start automatic cleanup
     */
    private startCleanup;
    /**
     * Stop automatic cleanup
     */
    private stopCleanup;
    /**
     * Update memory usage statistics (approximate)
     */
    private updateMemoryStats;
    /**
     * Estimate size of an object in bytes (rough approximation)
     */
    private estimateSize;
    /**
     * Destroy the cache and cleanup resources
     */
    destroy(): void;
}
export {};
//# sourceMappingURL=AdvancedCache.d.ts.map