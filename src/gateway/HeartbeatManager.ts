import WebSocket from "ws";
import { GatewayOpcodes } from "./constants";

/**
 * Manages Discord gateway heartbeats and latency tracking.
 */
export class HeartbeatManager {
  private ws: WebSocket;
  private interval: number;
  private timeoutId: NodeJS.Timeout | null = null;
  private lastAck = true;
  private lastHeartbeat: number = 0;
  private latency: number = 0;
  private onMissedHeartbeat: () => void;

  constructor(ws: WebSocket, interval: number, onMissedHeartbeat: () => void) {
    this.ws = ws;
    this.interval = interval;
    this.onMissedHeartbeat = onMissedHeartbeat;
  }

  /**
   * Get the current WebSocket ping/latency.
   */
  public getWebSocketLatency(): number {
    return this.latency;
  }

  /**
   * Alias for getWebSocketLatency (backward compatibility)
   */
  public getPing(): number {
    return this.getWebSocketLatency();
  }

  /**
   * Start the heartbeat loop (send after each ACK).
   */
  public start() {
    this.lastAck = true;
    this.sendHeartbeat();
  }

  /**
   * Send a heartbeat and schedule the next one after ACK or timeout.
   */
  private sendHeartbeat() {
    if (!this.lastAck) {
      this.stop();
      this.onMissedHeartbeat();
      return;
    }
    this.lastHeartbeat = Date.now();
    this.ws.send(JSON.stringify({ op: GatewayOpcodes.HEARTBEAT, d: null }));
    this.lastAck = false;
    // Failsafe: if no ACK in 2x interval, treat as missed
    this.timeoutId = setTimeout(() => {
      if (!this.lastAck) {
        this.stop();
        this.onMissedHeartbeat();
      }
    }, this.interval * 2);
  }

  /**
   * Handle a heartbeat ACK from Discord.
   */
  public onHeartbeatAck() {
    const now = Date.now();
    this.latency = now - this.lastHeartbeat;
    this.lastAck = true;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    // Schedule next heartbeat
    this.timeoutId = setTimeout(() => this.sendHeartbeat(), this.interval);
  }

  /**
   * Stop the heartbeat loop.
   */
  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
