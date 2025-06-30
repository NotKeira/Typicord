import WebSocket from "ws";
import { GatewayOpcodes } from "./constants";

/**
 * Keeps our connection to Discord alive by sending regular heartbeats
 * Also tracks latency so we know how fast our connection is
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
   * Gets the current WebSocket latency - how long it takes for Discord
   * to respond to our heartbeats. Lower is better!
   */
  public getWebSocketLatency(): number {
    return this.latency;
  }

  /**
   * Old name for getWebSocketLatency - keeping for backwards compatibility
   */
  public getPing(): number {
    return this.getWebSocketLatency();
  }

  /**
   * Starts the heartbeat loop - we'll send heartbeats and wait for ACKs
   */
  public start() {
    this.lastAck = true;
    this.sendHeartbeat();
  }

  /**
   * Sends a heartbeat to Discord and sets up the next one
   * If we don't get an ACK back, something's wrong with the connection
   */
  private sendHeartbeat() {
    if (!this.lastAck) {
      // Didn't get an ACK for the last heartbeat - connection's probably dead
      this.stop();
      this.onMissedHeartbeat();
      return;
    }
    this.lastHeartbeat = Date.now();
    this.ws.send(JSON.stringify({ op: GatewayOpcodes.HEARTBEAT, d: null }));
    this.lastAck = false;
    // If we don't get an ACK within 2x the interval, assume the connection is dead
    this.timeoutId = setTimeout(() => {
      if (!this.lastAck) {
        this.stop();
        this.onMissedHeartbeat();
      }
    }, this.interval * 2);
  }

  /**
   * Discord acknowledged our heartbeat! Calculate latency and schedule the next one
   */
  public onHeartbeatAck() {
    const now = Date.now();
    this.latency = now - this.lastHeartbeat;
    this.lastAck = true;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    // Wait for the full interval before sending the next heartbeat
    this.timeoutId = setTimeout(() => this.sendHeartbeat(), this.interval);
  }

  /**
   * Stops the heartbeat loop - cleanup when disconnecting
   */
  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
