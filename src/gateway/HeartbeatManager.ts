import WebSocket from "ws";
import { GatewayOpcodes } from "./constants";

export class HeartbeatManager {
  private ws: WebSocket;
  private interval: number;
  private intervalId: NodeJS.Timeout | null = null;
  private lastAck = true;
  private lastHeartbeat: number = 0;
  private latency: number = 0;

  private onMissedHeartbeat: () => void;

  constructor(ws: WebSocket, interval: number, onMissedHeartbeat: () => void) {
    this.ws = ws;
    this.interval = interval;
    this.onMissedHeartbeat = onMissedHeartbeat;
  }

  private sendHeartbeat() {
    this.lastHeartbeat = Date.now();
    this.ws.send(JSON.stringify({ op: GatewayOpcodes.HEARTBEAT, d: null }));
  }

  public getPing(): number {
    return this.latency;
  }

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

  public onHeartbeatAck() {
    const now = Date.now();
    this.latency = now - this.lastHeartbeat;
    this.lastAck = true;
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
