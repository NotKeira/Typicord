import WebSocket from "ws";
import { GatewayOpcodes } from "./constants";

/**
 * Manages Discord gateway heartbeats and latency tracking.
 */
export class HeartbeatManager {
  private ws: WebSocket;
  private interval: number;
  private intervalId: NodeJS.Timeout | null = null;
  private lastAck = true;
  private lastHeartbeat: number = 0;
  private latency: number = 0;

  private onMissedHeartbeat: () => void;

  /**
   * @param ws The WebSocket connection
   * @param interval Heartbeat interval in ms
   * @param onMissedHeartbeat Callback for missed heartbeat
   */
  constructor(ws: WebSocket, interval: number, onMissedHeartbeat: () => void) {
    this.ws = ws;
    this.interval = interval;
    this.onMissedHeartbeat = onMissedHeartbeat;
  }

  /**
   * Send a heartbeat to Discord.
   */
  private sendHeartbeat() {
    this.lastHeartbeat = Date.now();
    this.ws.send(JSON.stringify({ op: GatewayOpcodes.HEARTBEAT, d: null }));
  }

  /**
   * Get the current WebSocket ping/latency.
   */
  public getPing(): number {
    return this.latency;
  }

  /**
   * Start the heartbeat interval.
   */
  public start() {
    this.intervalId = setInterval(() => {
      if (!this.lastAck) {
        this.stop();
        this.onMissedHeartbeat();
        return;
      }

      this.ws.send(JSON.stringify({ op: GatewayOpcodes.HEARTBEAT, d: null }));
      this.lastAck = false;
    }, this.interval);
  }

  /**
   * Handle a heartbeat ACK from Discord.
   */
  public onHeartbeatAck() {
    const now = Date.now();
    this.latency = now - this.lastHeartbeat;
    this.lastAck = true;
  }

  /**
   * Stop the heartbeat interval.
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
