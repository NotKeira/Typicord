import WebSocket from "ws";
/**
 * Manages Discord gateway heartbeats and latency tracking.
 */
export declare class HeartbeatManager {
    private ws;
    private interval;
    private intervalId;
    private lastAck;
    private lastHeartbeat;
    private latency;
    private onMissedHeartbeat;
    /**
     * @param ws The WebSocket connection
     * @param interval Heartbeat interval in ms
     * @param onMissedHeartbeat Callback for missed heartbeat
     */
    constructor(ws: WebSocket, interval: number, onMissedHeartbeat: () => void);
    /**
     * Send a heartbeat to Discord.
     */
    private sendHeartbeat;
    /**
     * Get the current WebSocket ping/latency.
     */
    getPing(): number;
    /**
     * Start the heartbeat interval.
     */
    start(): void;
    /**
     * Handle a heartbeat ACK from Discord.
     */
    onHeartbeatAck(): void;
    /**
     * Stop the heartbeat interval.
     */
    stop(): void;
}
//# sourceMappingURL=HeartbeatManager.d.ts.map