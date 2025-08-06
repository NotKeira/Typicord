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
  private spawnQueue: number[] = [];
  private isSpawning = false;
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
   * Get recommended shard count from Discord
   */
  public async getRecommendedShardCount(): Promise<number> {
    try {
      const response = await fetch("https://discord.com/api/v10/gateway/bot", {
        headers: {
          Authorization: `Bot ${this.options.token}`,
          "User-Agent":
            "DiscordBot (https://github.com/typicord/typicord, 1.0.0)",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get gateway info: ${response.status}`);
      }

      const data = await response.json();
      return data.shards || 1;
    } catch (error) {
      debug.warn(
        DebugNamespace.GATEWAY,
        "Failed to get recommended shard count, using 1",
        error instanceof Error ? error : new Error(String(error))
      );
      return 1;
    }
  }

  /**
   * Spawn all shards
   */
  public async spawn(): Promise<void> {
    debug.info(DebugNamespace.GATEWAY, "Starting shard spawn process");

    // Auto-detect shard count if not provided
    if (!this.options.shardCount || this.options.shardCount === 1) {
      const recommended = await this.getRecommendedShardCount();
      if (recommended > 1) {
        this.options.shardCount = recommended;
        debug.info(
          DebugNamespace.GATEWAY,
          `Using recommended shard count: ${recommended}`
        );
      }
    }

    // Determine which shards to spawn
    const shardIds =
      this.options.shardIds.length > 0
        ? this.options.shardIds
        : Array.from({ length: this.options.shardCount }, (_, i) => i);

    // Add shards to spawn queue
    this.spawnQueue = [...shardIds];

    debug.info(
      DebugNamespace.GATEWAY,
      `Spawning ${shardIds.length} shards: [${shardIds.join(", ")}]`
    );

    // Start spawning process
    this.processSpawnQueue();

    // Wait for all shards to be ready
    return new Promise(resolve => {
      const checkReady = () => {
        const readyShards = Array.from(this.shards.values()).filter(
          shard => shard.status === ShardStatus.READY
        );

        if (readyShards.length === shardIds.length) {
          debug.info(DebugNamespace.GATEWAY, "All shards ready");
          this.emit("ready");
          resolve();
        } else {
          setTimeout(checkReady, 100);
        }
      };

      checkReady();
    });
  }

  /**
   * Process the shard spawn queue
   */
  private async processSpawnQueue(): Promise<void> {
    if (this.isSpawning || this.spawnQueue.length === 0) return;

    this.isSpawning = true;

    while (this.spawnQueue.length > 0) {
      const shardId = this.spawnQueue.shift()!;
      await this.spawnShard(shardId);

      // Wait between spawns to avoid rate limits
      if (this.spawnQueue.length > 0) {
        debug.log(
          DebugNamespace.GATEWAY,
          `Waiting ${this.options.shardSpawnDelay}ms before spawning next shard`
        );
        await this.delay(this.options.shardSpawnDelay);
      }
    }

    this.isSpawning = false;
  }

  /**
   * Spawn a single shard
   */
  private async spawnShard(shardId: number): Promise<void> {
    debug.info(DebugNamespace.GATEWAY, `Spawning shard ${shardId}`);

    const shard = new Shard({
      id: shardId,
      totalShards: this.options.shardCount,
      token: this.options.token,
      intents: this.options.intents,
      maxReconnectAttempts: this.options.maxReconnectAttempts,
      reconnectDelay: this.options.reconnectDelay,
      maxReconnectDelay: this.options.maxReconnectDelay,
      compress: this.options.compress,
      largeThreshold: this.options.largeThreshold,
    });

    // Set up shard event handlers
    this.setupShardHandlers(shard);

    // Store shard
    this.shards.set(shardId, shard);

    try {
      await shard.connect();
      debug.info(
        DebugNamespace.GATEWAY,
        `Shard ${shardId} spawned successfully`
      );
    } catch (error) {
      debug.error(
        DebugNamespace.GATEWAY,
        `Failed to spawn shard ${shardId}`,
        error instanceof Error ? error : new Error(String(error))
      );

      this.shards.delete(shardId);

      if (this.options.autoRespawn) {
        debug.info(
          DebugNamespace.GATEWAY,
          `Scheduling respawn for shard ${shardId}`
        );
        setTimeout(() => this.respawnShard(shardId), 5000);
      }
    }
  }

  /**
   * Set up event handlers for a shard
   */
  private setupShardHandlers(shard: Shard): void {
    shard.on("ready", () => {
      debug.info(DebugNamespace.GATEWAY, `Shard ${shard.id} ready`);
      this.emit("shardReady", shard.id);
    });

    shard.on("resumed", () => {
      debug.info(DebugNamespace.GATEWAY, `Shard ${shard.id} resumed`);
      this.emit("shardResumed", shard.id);
    });

    shard.on("disconnect", (code: number, reason: string) => {
      debug.warn(
        DebugNamespace.GATEWAY,
        `Shard ${shard.id} disconnected: ${code} - ${reason}`
      );
      this.emit("shardDisconnect", shard.id, code, reason);

      if (this.options.autoRespawn && shard.status !== ShardStatus.DESTROYED) {
        debug.info(
          DebugNamespace.GATEWAY,
          `Scheduling respawn for shard ${shard.id}`
        );
        setTimeout(() => this.respawnShard(shard.id), 5000);
      }
    });

    shard.on("error", (error: Error) => {
      debug.error(DebugNamespace.GATEWAY, `Shard ${shard.id} error`, error);
      this.emit("shardError", shard.id, error);
    });

    shard.on("statusUpdate", (status: ShardStatus) => {
      this.emit("shardStatusUpdate", shard.id, status);
    });

    shard.on("dispatch", (type: string, data: any) => {
      this.emit("dispatch", type, data, shard.id);
    });

    shard.on("heartbeat", (ping: number) => {
      this.emit("shardHeartbeat", shard.id, ping);
    });
  }

  /**
   * Respawn a specific shard
   */
  public async respawnShard(shardId: number): Promise<void> {
    debug.info(DebugNamespace.GATEWAY, `Respawning shard ${shardId}`);

    const existingShard = this.shards.get(shardId);
    if (existingShard) {
      existingShard.destroy();
      this.shards.delete(shardId);
    }

    await this.spawnShard(shardId);
  }

  /**
   * Respawn all shards
   */
  public async respawnAll(): Promise<void> {
    debug.info(DebugNamespace.GATEWAY, "Respawning all shards");

    const shardIds = Array.from(this.shards.keys());

    // Destroy all existing shards
    for (const shard of this.shards.values()) {
      shard.destroy();
    }
    this.shards.clear();

    // Respawn all shards
    this.spawnQueue = [...shardIds];
    await this.processSpawnQueue();
  }

  /**
   * Get a specific shard
   */
  public getShard(shardId: number): Shard | undefined {
    return this.shards.get(shardId);
  }

  /**
   * Get shard ID for a guild
   */
  public getShardIdForGuild(guildId: string): number {
    return Number((BigInt(guildId) >> 22n) % BigInt(this.options.shardCount));
  }

  /**
   * Get shard for a guild
   */
  public getShardForGuild(guildId: string): Shard | undefined {
    const shardId = this.getShardIdForGuild(guildId);
    return this.getShard(shardId);
  }

  /**
   * Broadcast data to all shards
   */
  public broadcast(data: any): void {
    for (const shard of this.shards.values()) {
      if (shard.status === ShardStatus.READY) {
        shard.sendRawPayload?.(data);
      }
    }
  }

  /**
   * Get shard manager statistics
   */
  public getStats(): ShardManagerStats {
    const shards = Array.from(this.shards.values());
    const totalGuilds = shards.reduce(
      (total, shard) => total + shard.guilds.size,
      0
    );
    const pings = shards.map(shard => shard.ping).filter(ping => ping >= 0);
    const averagePing =
      pings.length > 0 ? pings.reduce((a, b) => a + b, 0) / pings.length : 0;

    return {
      totalShards: shards.length,
      connectedShards: shards.filter(s => s.status === ShardStatus.CONNECTED)
        .length,
      readyShards: shards.filter(s => s.status === ShardStatus.READY).length,
      reconnectingShards: shards.filter(
        s => s.status === ShardStatus.RECONNECTING
      ).length,
      disconnectedShards: shards.filter(
        s => s.status === ShardStatus.DISCONNECTED
      ).length,
      totalGuilds,
      averagePing,
      uptime: Date.now() - this.startTime,
    };
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
   * Destroy all shards and clean up
   */
  public destroy(): void {
    debug.info(DebugNamespace.GATEWAY, "Destroying shard manager");

    for (const shard of this.shards.values()) {
      shard.destroy();
    }

    this.shards.clear();
    this.spawnQueue = [];
    this.removeAllListeners();
  }

  /**
   * Utility method for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
