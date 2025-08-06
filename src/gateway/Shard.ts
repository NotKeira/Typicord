import { EventEmitter } from "events";
import WebSocket from "ws";
import { debug, DebugNamespace } from "@/debug";

/**
 * Configuration options for a shard
 */
export interface ShardOptions {
  /** Shard ID (0-based) */
  id: number;
  /** Total number of shards */
  totalShards: number;
  /** Bot token */
  token: string;
  /** Gateway intents */
  intents: number;
  /** Maximum reconnection attempts */
  maxReconnectAttempts?: number;
  /** Base reconnection delay in ms */
  reconnectDelay?: number;
  /** Maximum reconnection delay in ms */
  maxReconnectDelay?: number;
  /** Whether to use compression */
  compress?: boolean;
  /** Large guild threshold */
  largeThreshold?: number;
}

/**
 * Shard status enum
 */
export enum ShardStatus {
  IDLE = "idle",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  READY = "ready",
  RECONNECTING = "reconnecting",
  DISCONNECTED = "disconnected",
  DESTROYED = "destroyed",
}

/**
 * Represents a single shard connection to Discord
 */
export class Shard extends EventEmitter {
  public readonly id: number;
  public readonly totalShards: number;
  public status: ShardStatus = ShardStatus.IDLE;
  public ping: number = -1;
  public lastHeartbeat: number = 0;
  public guilds = new Set<string>();

  private ws: WebSocket | null = null;
  private heartbeatInterval: number | null = null;
  private reconnectAttempts: number = 0;
  private sessionId: string | null = null;
  private sequence: number | null = null;
  private resumeUrl: string | null = null;

  private readonly options: Required<
    Omit<ShardOptions, "id" | "totalShards" | "token" | "intents">
  >;
  private readonly token: string;
  private readonly intents: number;

  constructor(options: ShardOptions) {
    super();

    this.id = options.id;
    this.totalShards = options.totalShards;
    this.token = options.token;
    this.intents = options.intents;

    this.options = {
      maxReconnectAttempts: options.maxReconnectAttempts ?? 10,
      reconnectDelay: options.reconnectDelay ?? 1000,
      maxReconnectDelay: options.maxReconnectDelay ?? 60000,
      compress: options.compress ?? false,
      largeThreshold: options.largeThreshold ?? 50,
    };

    debug.log(DebugNamespace.GATEWAY, `Shard ${this.id} initialized`, {
      totalShards: this.totalShards,
      options: this.options,
    });
  }

  /**
   * Connect this shard to Discord
   */
  public async connect(): Promise<void> {
    if (
      this.status !== ShardStatus.IDLE &&
      this.status !== ShardStatus.DISCONNECTED
    ) {
      throw new Error(
        `Shard ${this.id} is not in a connectable state: ${this.status}`
      );
    }

    this.status = ShardStatus.CONNECTING;
    this.emit("statusUpdate", this.status);

    debug.info(DebugNamespace.GATEWAY, `Shard ${this.id} connecting...`);

    try {
      await this.createConnection();
    } catch (error) {
      this.status = ShardStatus.DISCONNECTED;
      this.emit("statusUpdate", this.status);
      throw error;
    }
  }

  /**
   * Create WebSocket connection
   */
  private async createConnection(resume: boolean = false): Promise<void> {
    const gatewayUrl =
      resume && this.resumeUrl
        ? this.resumeUrl
        : "wss://gateway.discord.gg/?v=10&encoding=json&compress=false";

    debug.log(DebugNamespace.GATEWAY, `Shard ${this.id} creating connection`, {
      resume,
      url: gatewayUrl,
    });

    // Clean up existing connection
    if (this.ws) {
      this.ws.removeAllListeners();
      this.ws.close();
    }

    this.ws = new WebSocket(gatewayUrl);

    this.ws.onopen = () => {
      debug.info(DebugNamespace.GATEWAY, `Shard ${this.id} WebSocket opened`);
      this.status = ShardStatus.CONNECTED;
      this.emit("statusUpdate", this.status);
    };

    this.ws.onmessage = event => {
      let data: string;
      if (typeof event.data === "string") {
        data = event.data;
      } else if (Buffer.isBuffer(event.data)) {
        data = event.data.toString("utf8");
      } else if (event.data instanceof ArrayBuffer) {
        data = new TextDecoder().decode(event.data);
      } else if (event.data instanceof Blob) {
        // Handle Blob asynchronously
        event.data
          .text()
          .then(text => {
            this.handleMessage(text);
          })
          .catch(error => {
            debug.error(
              DebugNamespace.GATEWAY,
              `Shard ${this.id} failed to read Blob data:`,
              error
            );
          });
        return;
      } else {
        data = JSON.stringify(event.data);
      }
      this.handleMessage(data);
    };

    this.ws.onclose = event => {
      debug.warn(DebugNamespace.GATEWAY, `Shard ${this.id} WebSocket closed`, {
        code: event.code,
        reason: event.reason,
      });

      this.cleanup();

      if (this.shouldReconnect(event.code)) {
        this.handleReconnect();
      } else {
        this.status = ShardStatus.DISCONNECTED;
        this.emit("statusUpdate", this.status);
        this.emit("disconnect", event.code, event.reason);
      }
    };

    this.ws.onerror = error => {
      const errorMessage =
        error instanceof ErrorEvent ? error.message : "WebSocket error";
      debug.error(
        DebugNamespace.GATEWAY,
        `Shard ${this.id} WebSocket error: ${errorMessage}`
      );
      this.emit("error", new Error(errorMessage));
    };
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(data: string): void {
    let payload: any;

    try {
      payload = JSON.parse(data);
    } catch (error) {
      debug.error(
        DebugNamespace.GATEWAY,
        `Shard ${this.id} failed to parse message`,
        error instanceof Error ? error : new Error(String(error))
      );
      return;
    }

    // Update sequence number
    if (payload.s !== null && payload.s !== undefined) {
      this.sequence = payload.s;
    }

    debug.trace(
      DebugNamespace.GATEWAY,
      `Shard ${this.id} received opcode ${payload.op}`,
      {
        type: payload.t,
        sequence: payload.s,
      }
    );

    switch (payload.op) {
      case 0: // Dispatch
        this.handleDispatch(payload.t, payload.d);
        break;
      case 1: // Heartbeat
        this.sendHeartbeat();
        break;
      case 7: // Reconnect
        debug.info(
          DebugNamespace.GATEWAY,
          `Shard ${this.id} received reconnect`
        );
        this.handleReconnect();
        break;
      case 9: // Invalid Session
        debug.warn(DebugNamespace.GATEWAY, `Shard ${this.id} invalid session`, {
          resumable: payload.d,
        });
        if (!payload.d) {
          // Cannot resume, need fresh identify
          this.sessionId = null;
          this.sequence = null;
          this.resumeUrl = null;
        }
        this.handleReconnect();
        break;
      case 10: // Hello
        this.handleHello(payload.d);
        break;
      case 11: // Heartbeat ACK
        this.handleHeartbeatAck();
        break;
      default:
        debug.warn(
          DebugNamespace.GATEWAY,
          `Shard ${this.id} unknown opcode ${payload.op}`
        );
    }
  }

  /**
   * Handle Hello opcode
   */
  private handleHello(data: any): void {
    debug.info(DebugNamespace.GATEWAY, `Shard ${this.id} received Hello`, {
      heartbeatInterval: data.heartbeat_interval,
    });

    // Start heartbeat
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, data.heartbeat_interval) as any;

    // Send identify or resume
    if (this.sessionId && this.sequence !== null && this.resumeUrl) {
      this.sendResume();
    } else {
      this.sendIdentify();
    }
  }

  /**
   * Handle dispatch events
   */
  private handleDispatch(type: string, data: any): void {
    this.emit("dispatch", type, data);

    switch (type) {
      case "READY":
        this.handleReady(data);
        break;
      case "RESUMED":
        this.handleResumed();
        break;
      case "GUILD_CREATE":
        if (data.id) {
          this.guilds.add(data.id);
          debug.trace(
            DebugNamespace.GATEWAY,
            `Shard ${this.id} guild added: ${data.id}`
          );
        }
        break;
      case "GUILD_DELETE":
        if (data.id) {
          this.guilds.delete(data.id);
          debug.trace(
            DebugNamespace.GATEWAY,
            `Shard ${this.id} guild removed: ${data.id}`
          );
        }
        break;
    }
  }

  /**
   * Handle READY event
   */
  private handleReady(data: any): void {
    this.sessionId = data.session_id;
    this.resumeUrl = data.resume_gateway_url;
    this.reconnectAttempts = 0;

    this.status = ShardStatus.READY;
    this.emit("statusUpdate", this.status);
    this.emit("ready");

    debug.info(DebugNamespace.GATEWAY, `Shard ${this.id} ready`, {
      sessionId: this.sessionId,
      guilds: data.guilds?.length || 0,
    });
  }

  /**
   * Handle RESUMED event
   */
  private handleResumed(): void {
    this.reconnectAttempts = 0;

    this.status = ShardStatus.READY;
    this.emit("statusUpdate", this.status);
    this.emit("resumed");

    debug.info(DebugNamespace.GATEWAY, `Shard ${this.id} resumed`);
  }

  /**
   * Send heartbeat
   */
  private sendHeartbeat(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const payload = {
      op: 1,
      d: this.sequence,
    };

    this.lastHeartbeat = Date.now();
    this.send(payload);

    debug.trace(DebugNamespace.HEARTBEAT, `Shard ${this.id} sent heartbeat`, {
      sequence: this.sequence,
    });
  }

  /**
   * Handle heartbeat acknowledgment
   */
  private handleHeartbeatAck(): void {
    this.ping = Date.now() - this.lastHeartbeat;
    this.emit("heartbeat", this.ping);

    debug.trace(DebugNamespace.HEARTBEAT, `Shard ${this.id} heartbeat ack`, {
      ping: this.ping,
    });
  }

  /**
   * Send identify payload
   */
  private sendIdentify(): void {
    const payload = {
      op: 2,
      d: {
        token: this.token,
        intents: this.intents,
        properties: {
          os: process.platform,
          browser: "Typicord",
          device: "Typicord",
        },
        shard: [this.id, this.totalShards],
        compress: this.options.compress,
        large_threshold: this.options.largeThreshold,
      },
    };

    this.send(payload);
    debug.info(DebugNamespace.GATEWAY, `Shard ${this.id} sent identify`);
  }

  /**
   * Send resume payload
   */
  private sendResume(): void {
    const payload = {
      op: 6,
      d: {
        token: this.token,
        session_id: this.sessionId,
        seq: this.sequence,
      },
    };

    this.send(payload);
    debug.info(DebugNamespace.GATEWAY, `Shard ${this.id} sent resume`);
  }

  /**
   * Send payload to Discord
   */
  private send(payload: any): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      debug.warn(
        DebugNamespace.GATEWAY,
        `Shard ${this.id} attempted to send while not connected`
      );
      return;
    }

    this.ws.send(JSON.stringify(payload));
  }

  /**
   * Handle reconnection logic
   */
  private async handleReconnect(): Promise<void> {
    if (this.status === ShardStatus.DESTROYED) return;

    this.status = ShardStatus.RECONNECTING;
    this.emit("statusUpdate", this.status);

    if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
      debug.error(
        DebugNamespace.GATEWAY,
        `Shard ${this.id} max reconnect attempts reached`
      );
      this.status = ShardStatus.DISCONNECTED;
      this.emit("statusUpdate", this.status);
      this.emit("disconnect", 1000, "Max reconnect attempts reached");
      return;
    }

    this.reconnectAttempts++;

    const delay = Math.min(
      this.options.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      this.options.maxReconnectDelay
    );

    debug.info(
      DebugNamespace.GATEWAY,
      `Shard ${this.id} reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`
    );

    setTimeout(async () => {
      try {
        await this.createConnection(!!this.sessionId);
      } catch (error) {
        debug.error(
          DebugNamespace.GATEWAY,
          `Shard ${this.id} reconnect failed`,
          error instanceof Error ? error : new Error(String(error))
        );
        this.handleReconnect();
      }
    }, delay);
  }

  /**
   * Check if we should reconnect based on close code
   */
  private shouldReconnect(code: number): boolean {
    // These close codes should not trigger reconnection
    const nonRecoverableCodes = [
      1000, // Normal closure
      4004, // Authentication failed
      4010, // Invalid shard
      4011, // Sharding required
      4012, // Invalid API version
      4013, // Invalid intent(s)
      4014, // Disallowed intent(s)
    ];

    return (
      !nonRecoverableCodes.includes(code) &&
      this.status !== ShardStatus.DESTROYED
    );
  }

  /**
   * Clean up resources
   */
  private cleanup(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Disconnect this shard
   */
  public disconnect(): void {
    debug.info(DebugNamespace.GATEWAY, `Shard ${this.id} disconnecting`);

    this.cleanup();

    if (this.ws) {
      this.ws.close(1000, "Manual disconnect");
      this.ws = null;
    }

    this.status = ShardStatus.DISCONNECTED;
    this.emit("statusUpdate", this.status);
  }

  /**
   * Destroy this shard permanently
   */
  public destroy(): void {
    debug.info(DebugNamespace.GATEWAY, `Shard ${this.id} destroying`);

    this.status = ShardStatus.DESTROYED;
    this.emit("statusUpdate", this.status);

    this.cleanup();

    if (this.ws) {
      this.ws.removeAllListeners();
      this.ws.close(1000, "Shard destroyed");
      this.ws = null;
    }

    this.removeAllListeners();
  }

  /**
   * Send raw payload to Discord
   */
  public sendRawPayload(data: any): void {
    if (
      this.status !== ShardStatus.CONNECTED ||
      !this.ws ||
      this.ws.readyState !== 1
    ) {
      debug.warn(
        DebugNamespace.GATEWAY,
        `Shard ${this.id} cannot send payload - not connected`
      );
      return;
    }

    try {
      const payload = typeof data === "string" ? data : JSON.stringify(data);
      this.ws.send(payload);
      debug.log(
        DebugNamespace.GATEWAY,
        `Shard ${this.id} sent raw payload:`,
        data
      );
    } catch (error) {
      debug.error(
        DebugNamespace.GATEWAY,
        `Shard ${this.id} failed to send raw payload:`,
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }

  /**
   * Get shard statistics
   */
  public getStats(): {
    id: number;
    status: ShardStatus;
    ping: number;
    guilds: number;
    reconnectAttempts: number;
    uptime: number;
  } {
    return {
      id: this.id,
      status: this.status,
      ping: this.ping,
      guilds: this.guilds.size,
      reconnectAttempts: this.reconnectAttempts,
      uptime:
        this.status === ShardStatus.READY ? Date.now() - this.lastHeartbeat : 0,
    };
  }
}
