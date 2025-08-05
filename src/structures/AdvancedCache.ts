/**
 * Advanced Caching System with TTL, LRU eviction, and memory management
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  lastAccessed: number;
  accessCount: number;
}

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

export class AdvancedCache<K, V> {
  private readonly cache = new Map<K, CacheEntry<V>>();
  private readonly maxSize: number;
  private readonly defaultTTL: number;
  private readonly cleanupInterval: number;
  private readonly enableStats: boolean;
  private cleanupTimer?: NodeJS.Timeout;

  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    evictions: 0,
    cleanups: 0,
    size: 0,
    memoryUsage: 0,
  };

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize || 1000;
    this.defaultTTL = options.defaultTTL || 300000; // 5 minutes
    this.cleanupInterval = options.cleanupInterval || 60000; // 1 minute
    this.enableStats = options.enableStats !== false;

    // Start cleanup timer
    this.startCleanup();
  }

  /**
   * Get a value from the cache
   */
  get(key: K): V | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      if (this.enableStats) this.stats.misses++;
      return undefined;
    }

    // Check if expired
    if (entry.expiresAt <= Date.now()) {
      this.cache.delete(key);
      if (this.enableStats) this.stats.misses++;
      return undefined;
    }

    // Update access info
    entry.lastAccessed = Date.now();
    entry.accessCount++;

    if (this.enableStats) this.stats.hits++;
    return entry.value;
  }

  /**
   * Set a value in the cache
   */
  set(key: K, value: V, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || this.defaultTTL);
    const now = Date.now();

    const entry: CacheEntry<V> = {
      value,
      expiresAt,
      lastAccessed: now,
      accessCount: 1,
    };

    // If at max capacity, evict LRU item
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    this.cache.set(key, entry);

    if (this.enableStats) {
      this.stats.sets++;
      this.updateMemoryStats();
    }
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: K): boolean {
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    // Check if expired
    if (entry.expiresAt <= Date.now()) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete a key from the cache
   */
  delete(key: K): boolean {
    const deleted = this.cache.delete(key);

    if (deleted && this.enableStats) {
      this.stats.deletes++;
      this.updateMemoryStats();
    }

    return deleted;
  }

  /**
   * Clear all entries from the cache
   */
  clear(): void {
    this.cache.clear();

    if (this.enableStats) {
      this.stats.size = 0;
      this.stats.memoryUsage = 0;
    }
  }

  /**
   * Get all keys (non-expired)
   */
  keys(): K[] {
    const now = Date.now();
    const validKeys: K[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt > now) {
        validKeys.push(key);
      }
    }

    return validKeys;
  }

  /**
   * Get all values (non-expired)
   */
  values(): V[] {
    const now = Date.now();
    const validValues: V[] = [];

    for (const entry of this.cache.values()) {
      if (entry.expiresAt > now) {
        validValues.push(entry.value);
      }
    }

    return validValues;
  }

  /**
   * Get all entries (non-expired)
   */
  entries(): Array<[K, V]> {
    const now = Date.now();
    const validEntries: Array<[K, V]> = [];

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt > now) {
        validEntries.push([key, entry.value]);
      }
    }

    return validEntries;
  }

  /**
   * Get cache size (including expired entries)
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * Get cache size (excluding expired entries)
   */
  get validSize(): number {
    const now = Date.now();
    let count = 0;

    for (const entry of this.cache.values()) {
      if (entry.expiresAt > now) {
        count++;
      }
    }

    return count;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    if (!this.enableStats) {
      throw new Error("Stats are disabled for this cache instance");
    }

    return {
      ...this.stats,
      size: this.validSize,
    };
  }

  /**
   * Reset cache statistics
   */
  resetStats(): void {
    if (!this.enableStats) {
      throw new Error("Stats are disabled for this cache instance");
    }

    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      evictions: 0,
      cleanups: 0,
      size: this.validSize,
      memoryUsage: 0,
    };

    this.updateMemoryStats();
  }

  /**
   * Get cache hit ratio
   */
  getHitRatio(): number {
    if (!this.enableStats) {
      throw new Error("Stats are disabled for this cache instance");
    }

    const total = this.stats.hits + this.stats.misses;
    return total === 0 ? 0 : this.stats.hits / total;
  }

  /**
   * Set TTL for an existing key
   */
  setTTL(key: K, ttl: number): boolean {
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    entry.expiresAt = Date.now() + ttl;
    return true;
  }

  /**
   * Get TTL for a key (in milliseconds)
   */
  getTTL(key: K): number | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      return undefined;
    }

    const ttl = entry.expiresAt - Date.now();
    return ttl > 0 ? ttl : 0;
  }

  /**
   * Touch a key to update its last accessed time
   */
  touch(key: K): boolean {
    const entry = this.cache.get(key);

    if (!entry || entry.expiresAt <= Date.now()) {
      return false;
    }

    entry.lastAccessed = Date.now();
    entry.accessCount++;
    return true;
  }

  /**
   * Get or set a value (cache-aside pattern)
   */
  async getOrSet<T extends V>(
    key: K,
    factory: () => Promise<T> | T,
    ttl?: number
  ): Promise<T> {
    const existing = this.get(key);

    if (existing !== undefined) {
      return existing as T;
    }

    const value = await factory();
    this.set(key, value, ttl);
    return value;
  }

  /**
   * Bulk set multiple values
   */
  setMany(entries: Array<[K, V, number?]>): void {
    for (const [key, value, ttl] of entries) {
      this.set(key, value, ttl);
    }
  }

  /**
   * Bulk get multiple values
   */
  getMany(keys: K[]): Map<K, V> {
    const result = new Map<K, V>();

    for (const key of keys) {
      const value = this.get(key);
      if (value !== undefined) {
        result.set(key, value);
      }
    }

    return result;
  }

  /**
   * Evict least recently used item
   */
  private evictLRU(): void {
    let lruKey: K | undefined;
    let lruTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < lruTime) {
        lruTime = entry.lastAccessed;
        lruKey = key;
      }
    }

    if (lruKey !== undefined) {
      this.cache.delete(lruKey);
      if (this.enableStats) this.stats.evictions++;
    }
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: K[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt <= now) {
        expiredKeys.push(key);
      }
    }

    for (const key of expiredKeys) {
      this.cache.delete(key);
    }

    if (this.enableStats) {
      this.stats.cleanups++;
      this.updateMemoryStats();
    }
  }

  /**
   * Start automatic cleanup
   */
  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }

  /**
   * Stop automatic cleanup
   */
  private stopCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
  }

  /**
   * Update memory usage statistics (approximate)
   */
  private updateMemoryStats(): void {
    if (!this.enableStats) return;

    // Rough estimate of memory usage
    let memoryUsage = 0;

    for (const [key, entry] of this.cache.entries()) {
      // Estimate size of key and entry
      memoryUsage += this.estimateSize(key) + this.estimateSize(entry);
    }

    this.stats.memoryUsage = memoryUsage;
    this.stats.size = this.validSize;
  }

  /**
   * Estimate size of an object in bytes (rough approximation)
   */
  private estimateSize(obj: any): number {
    if (obj === null || obj === undefined) return 0;

    if (typeof obj === "string") {
      return obj.length * 2; // Assuming UTF-16
    }

    if (typeof obj === "number") {
      return 8;
    }

    if (typeof obj === "boolean") {
      return 4;
    }

    if (obj instanceof Date) {
      return 8;
    }

    if (Array.isArray(obj)) {
      return obj.reduce((sum, item) => sum + this.estimateSize(item), 0);
    }

    if (typeof obj === "object") {
      return Object.entries(obj).reduce(
        (sum, [key, value]) =>
          sum + this.estimateSize(key) + this.estimateSize(value),
        0
      );
    }

    return 0;
  }

  /**
   * Destroy the cache and cleanup resources
   */
  destroy(): void {
    this.stopCleanup();
    this.clear();
  }
}
