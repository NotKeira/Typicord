import WebSocket, { WebSocketServer } from "ws";
import { handleHello } from "./handlers";
import type {
  GatewayPayload,
  HelloPayloadData,
} from "@/types/gateway/payloads";
import { GatewayEvents, GatewayOpcodes } from "./constants";
import { HeartbeatManager } from "./HeartbeatManager";
import { EventEmitter } from "@/events/EventEmitter";
import { MessageCreateEvent, ReadyEvent } from "@/types/gateway/events";

export class GatewayClient {
  private ws: WebSocket | null = null;
  private token: string;
  private intents: number;
  private heartbeatManager: HeartbeatManager | null = null;
  public events = new EventEmitter();

  constructor(token: string, intents: number) {
    this.token = token;
    this.intents = intents;
  }

  connect() {
    this.ws = new WebSocket("wss://gateway.discord.gg/?v=10&encoding=json");

    this.ws.on("open", () => {
      console.log("[Gateway] Connected to Discord Gateway");
    });

    this.ws.on("message", (data) => {
      const packet: GatewayPayload = JSON.parse(data.toString());

      switch (packet.op) {
        case GatewayOpcodes.HELLO:
          this.heartbeatManager = new HeartbeatManager(
            this.ws!,
            (packet.d as HelloPayloadData).heartbeat_interval,
            () => {
              console.warn("[Gateway] Missed heartbeat ACK, Reconnecting...");
              this.ws?.terminate();
              this.connect();
            }
          );
          this.heartbeatManager.start();

          handleHello(this.ws!, packet.d as HelloPayloadData, {
            token: this.token,
            intents: this.intents,
          });
          break;

        case GatewayOpcodes.HEARTBEAT_ACK:
          this.heartbeatManager?.onHeartbeatAck();
          break;

        case GatewayOpcodes.DISPATCH:
          switch (packet.t) {
            case GatewayEvents.MESSAGE_CREATE:
              this.events.emit<MessageCreateEvent>(
                GatewayEvents.MESSAGE_CREATE,
                packet.d as MessageCreateEvent
              );
              break;
            case GatewayEvents.READY:
              this.events.emit<ReadyEvent>(
                GatewayEvents.READY,
                packet.d as ReadyEvent
              );
              break;
            default:
              console.error(
                `[Gateway] Unknown event ${packet.t}` /*, packet.d*/
              );
          }
          break;
        default:
          console.log(`[Gateway] Unknown opcode ${packet.op}`);
      }
    });
  }
}
