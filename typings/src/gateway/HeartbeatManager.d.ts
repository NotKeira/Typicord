import WebSocket from "ws";
/**
 * Keeps our connection to Discord alive by sending regular heartbeats
 * Also tracks latency so we know how fast our connection is
 */
export declare class HeartbeatManager {
    private readonly ws;
    private readonly interval;
    private timeoutId;
    private lastAck;
    private lastHeartbeat;
    private latency;
    private readonly onMissedHeartbeat;
    constructor(ws: WebSocket, interval: number, onMissedHeartbeat: () => void);
    /**
     * Gets the current WebSocket latency - how long it takes for Discord
     * to respond to our heartbeats. Lower is better!
     */
    getWebSocketLatency(): number;
    /**
     * Old name for getWebSocketLatency - keeping for backwards compatibility
     */
    getPing(): number;
    /**
     * Starts the heartbeat loop - we'll send heartbeats and wait for ACKs
     */
    start(): void;
    /**
     * Sends a heartbeat to Discord and sets up the next one
     * If we don't get an ACK back, something's wrong with the connection
     */
    private sendHeartbeat;
    /**
     * Discord acknowledged our heartbeat! Calculate latency and schedule the next one
     */
    onHeartbeatAck(): void;
    /**
     * Stops the heartbeat loop - cleanup when disconnecting
     */
    stop(): void;
}
//# sourceMappingURL=HeartbeatManager.d.ts.map