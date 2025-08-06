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

  /**
   * Get shard manager statistics
   */
  public getStats(): ShardManagerStats {
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

  /**
   * Spawn shards
   */
  public async spawn(): Promise<void> {
    const shardIds =
      this.options.shardIds.length > 0
        ? this.options.shardIds
        : Array.from({ length: this.options.shardCount }, (_, i) => i);

    debug.info(DebugNamespace.GATEWAY, `Spawning ${shardIds.length} shards`, {
      shardIds,
    });

    this.spawnQueue.push(...shardIds);
    await this.processSpawnQueue();
  }

  /**
   * Process the spawn queue
   */
  private async processSpawnQueue(): Promise<void> {
    if (this.isSpawning || this.spawnQueue.length === 0) {
      return;
    }

    (this as any).isSpawning = true;

    try {
      while (this.spawnQueue.length > 0) {
        const shardId = this.spawnQueue.shift()!;
        await this.spawnShard(shardId);

        if (this.spawnQueue.length > 0) {
          await new Promise(resolve =>
            setTimeout(resolve, this.options.shardSpawnDelay)
          );
        }
      }
    } finally {
      (this as any).isSpawning = false;
    }
  }

  /**
   * Spawn a single shard
   */
  private async spawnShard(shardId: number): Promise<void> {
    if (this.shards.has(shardId)) {
      throw new Error(`Shard ${shardId} already exists`);
    }

    debug.info(DebugNamespace.GATEWAY, `Spawning shard ${shardId}`);

    const shard = new Shard({
      id: shardId,
      token: this.options.token,
      intents: this.options.intents,
      totalShards: this.options.totalShards,
      largeThreshold: this.options.largeThreshold,
      compress: this.options.compress,
      maxReconnectAttempts: this.options.maxReconnectAttempts,
      reconnectDelay: this.options.reconnectDelay,
      maxReconnectDelay: this.options.maxReconnectDelay,
    });

    this.shards.set(shardId, shard);

    // Forward shard events
    shard.on("ready", () => this.emit("shardReady", shardId));
    shard.on("disconnect", () => this.emit("shardDisconnect", shardId));
    shard.on("reconnect", () => this.emit("shardReconnect", shardId));
    shard.on("error", error => this.emit("shardError", shardId, error));
    shard.on("packet", packet => this.emit("packet", shardId, packet));

    if (this.options.autoRespawn) {
      shard.on("disconnect", () => {
        if (shard.status === ShardStatus.DESTROYED) return;
        debug.warn(DebugNamespace.GATEWAY, `Auto-respawning shard ${shardId}`);
        setTimeout(() => shard.connect(), this.options.reconnectDelay);
      });
    }

    await shard.connect();
  }

  /**
   * Destroy a shard
   */
  public destroyShard(shardId: number): void {
    const shard = this.shards.get(shardId);
    if (!shard) {
      throw new Error(`Shard ${shardId} does not exist`);
    }

    debug.info(DebugNamespace.GATEWAY, `Destroying shard ${shardId}`);

    shard.destroy();
    this.shards.delete(shardId);

    this.emit("shardDestroy", shardId);
  }

  /**
   * Destroy all shards
   */
  public destroy(): void {
    debug.info(DebugNamespace.GATEWAY, "Destroying all shards");

    for (const [shardId] of this.shards) {
      this.destroyShard(shardId);
    }
  }

  /**
   * Broadcast data to all shards
   */
  public broadcast(data: any): number {
    let sentCount = 0;

    for (const shard of this.shards.values()) {
      if (shard.status === ShardStatus.READY) {
        shard.sendRawPayload(data);
        sentCount++;
      }
    }

    debug.info(
      DebugNamespace.GATEWAY,
      `Broadcasted data to ${sentCount} shards`
    );
    return sentCount;
  }
}
