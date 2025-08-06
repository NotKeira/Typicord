import { EventEmitter } from "events";
import { Shard } from "./Shard";
/**
 * Configuration for the shard manager
 */
export interface ShardManagerOptions {
    /** Bot token */
    token: string;
    /** Gateway intents */
    intents: number;
    /** Number of shards to use (auto-detected if not provided) */
    shardCount?: number;
    /** Total number of shards across all processes */
    totalShards?: number;
    /** Specific shard IDs to spawn */
    shardIds?: number[];
    /** Delay between shard connections (ms) */
    shardSpawnDelay?: number;
    /** Maximum reconnection attempts per shard */
    maxReconnectAttempts?: number;
    /** Base reconnection delay */
    reconnectDelay?: number;
    /** Maximum reconnection delay */
    maxReconnectDelay?: number;
    /** Large guild threshold */
    largeThreshold?: number;
    /** Enable compression */
    compress?: boolean;
    /** Auto-respawn shards on failure */
    autoRespawn?: boolean;
}
/**
 * Statistics for the shard manager
 */
export interface ShardManagerStats {
    totalShards: number;
    connectedShards: number;
    readyShards: number;
    reconnectingShards: number;
    disconnectedShards: number;
    totalGuilds: number;
    averagePing: number;
    uptime: number;
}
/**
 * Manages multiple shards for Discord gateway connections
 * Handles shard spawning, load balancing, and failover
 */
export declare class ShardManager extends EventEmitter {
    readonly shards: Map<number, Shard>;
    readonly options: Required<ShardManagerOptions>;
    private readonly spawnQueue;
    private readonly isSpawning;
    private readonly startTime;
    constructor(options: ShardManagerOptions);
    /**
     * Get shard manager statistics
     */
    getStats(): ShardManagerStats;
    /**
     * Get the average WebSocket latency across all shards (for backwards compatibility)
     */
    getWebSocketLatency(): number;
    /**
     * Disconnect all shards
     */
    disconnect(): void;
    /**
     * Spawn shards
     */
    spawn(): Promise<void>;
    /**
     * Process the spawn queue
     */
    private processSpawnQueue;
    /**
     * Spawn a single shard
     */
    private spawnShard;
    /**
     * Destroy a shard
     */
    destroyShard(shardId: number): void;
    /**
     * Destroy all shards
     */
    destroy(): void;
    /**
     * Broadcast data to all shards
     */
    broadcast(data: any): number;
}
//# sourceMappingURL=ShardManager.d.ts.map