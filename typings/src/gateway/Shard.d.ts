import { EventEmitter } from "events";
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
export declare enum ShardStatus {
    IDLE = "idle",
    CONNECTING = "connecting",
    CONNECTED = "connected",
    READY = "ready",
    RECONNECTING = "reconnecting",
    DISCONNECTED = "disconnected",
    DESTROYED = "destroyed"
}
/**
 * Represents a single shard connection to Discord
 */
export declare class Shard extends EventEmitter {
    readonly id: number;
    readonly totalShards: number;
    status: ShardStatus;
    ping: number;
    lastHeartbeat: number;
    guilds: Set<string>;
    private ws;
    private heartbeatInterval;
    private reconnectAttempts;
    private sessionId;
    private sequence;
    private resumeUrl;
    private readonly options;
    private readonly token;
    private readonly intents;
    constructor(options: ShardOptions);
    /**
     * Connect this shard to Discord
     */
    connect(): Promise<void>;
    /**
     * Create WebSocket connection
     */
    private createConnection;
    /**
     * Handle incoming WebSocket messages
     */
    private handleMessage;
    /**
     * Handle Hello opcode
     */
    private handleHello;
    /**
     * Handle dispatch events
     */
    private handleDispatch;
    /**
     * Handle READY event
     */
    private handleReady;
    /**
     * Handle RESUMED event
     */
    private handleResumed;
    /**
     * Send heartbeat
     */
    private sendHeartbeat;
    /**
     * Handle heartbeat acknowledgment
     */
    private handleHeartbeatAck;
    /**
     * Send identify payload
     */
    private sendIdentify;
    /**
     * Send resume payload
     */
    private sendResume;
    /**
     * Send payload to Discord
     */
    private send;
    /**
     * Handle reconnection logic
     */
    private handleReconnect;
    /**
     * Check if we should reconnect based on close code
     */
    private shouldReconnect;
    /**
     * Clean up resources
     */
    private cleanup;
    /**
     * Disconnect this shard
     */
    disconnect(): void;
    /**
     * Destroy this shard permanently
     */
    destroy(): void;
    /**
     * Send raw payload to Discord
     */
    sendRawPayload(data: any): void;
    /**
     * Get shard statistics
     */
    getStats(): {
        id: number;
        status: ShardStatus;
        ping: number;
        guilds: number;
        reconnectAttempts: number;
        uptime: number;
    };
}
//# sourceMappingURL=Shard.d.ts.map