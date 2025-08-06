import { EventEmitter } from "events";
import { Shard, ShardStatus } from "./Shard";
import { debug, DebugNamespace } from "@/debug";

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
export class ShardManager extends EventEmitter {
  public readonly shards = new Map<number, Shard>();
  public readonly options: Required<ShardManagerOptions>;
  private readonly spawnQueue: number[] = [];
  private readonly isSpawning = false;
  private readonly startTime = Date.now();

  constructor(options: ShardManagerOptions) {
    super();

    this.options = {
      token: options.token,
      intents: options.intents,
      shardCount: options.shardCount ?? 1,
      totalShards: options.totalShards ?? options.shardCount ?? 1,
      shardIds: options.shardIds ?? [],
      shardSpawnDelay: options.shardSpawnDelay ?? 5500, // Discord recommends 5-5.5s
      maxReconnectAttempts: options.maxReconnectAttempts ?? 10,
      reconnectDelay: options.reconnectDelay ?? 1000,
      maxReconnectDelay: options.maxReconnectDelay ?? 60000,
      largeThreshold: options.largeThreshold ?? 50,
      compress: options.compress ?? false,
      autoRespawn: options.autoRespawn ?? true,
    };

    debug.info(DebugNamespace.GATEWAY, "ShardManager initialized", {
      shardCount: this.options.shardCount,
      shardIds: this.options.shardIds,
      autoRespawn: this.options.autoRespawn,
    });
  }

  private getStats() {
    const stats: ShardManagerStats = {
      totalShards: this.shards.size,
      connectedShards: 0,
      readyShards: 0,
      reconnectingShards: 0,
      disconnectedShards: 0,
      totalGuilds: 0,
      averagePing: 0,
      uptime: Date.now() - this.startTime,
    };

    let totalPing = 0;
    let pingSamples = 0;

    for (const shard of this.shards.values()) {
      switch (shard.status) {
        case ShardStatus.READY:
          stats.readyShards++;
          stats.connectedShards++;
          break;
        case ShardStatus.CONNECTING:
        case ShardStatus.CONNECTED:
        case ShardStatus.IDLE:
          stats.connectedShards++;
          break;
        case ShardStatus.RECONNECTING:
          stats.reconnectingShards++;
          break;
        case ShardStatus.DISCONNECTED:
          stats.disconnectedShards++;
          break;
        case ShardStatus.DESTROYED:
          stats.disconnectedShards++;
          stats.connectedShards--;
          stats.readyShards--;
          stats.totalShards--;
      }

      if (shard.ping > 0) {
        totalPing += shard.ping;
        pingSamples++;
      }
    }

    if (pingSamples > 0) {
      stats.averagePing = Math.round(totalPing / pingSamples);
    }

    return stats;
  }
  /**
   * Get the average WebSocket latency across all shards (for backwards compatibility)
   */
  public getWebSocketLatency(): number {
    return this.getStats().averagePing;
  }

  /**
   * Disconnect all shards
   */
  public disconnect(): void {
    debug.info(DebugNamespace.GATEWAY, "Disconnecting all shards");

    for (const shard of this.shards.values()) {
      shard.disconnect();
    }
  }
}
