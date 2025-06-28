import WebSocket from "ws";
import { handleHello } from "./handlers";
import type {
  GatewayPayload,
  HelloPayloadData,
} from "@/types/gateway/payloads";
import { GatewayEvents, GatewayOpcodes } from "./constants";
import { HeartbeatManager } from "./HeartbeatManager";
import type {
  TypicordEvents,
  MessageCreateEvent,
  ReadyEvent,
} from "@/types/gateway/events";
import { Message } from "@/structures/Message";
import { Client } from "@/client/Client";
import fs from "fs";
import path from "path";

/**
 * Handles the Discord gateway connection, events, and caching.
 */
export class GatewayClient {
  private client: Client;
  private ws: WebSocket | null = null;
  private heartbeatManager: HeartbeatManager | null = null;
  private cachedGuilds: Set<string> = new Set();
  private readyReceived = false;

  /**
   * Create a new GatewayClient instance.
   * @param client The Typicord client
   */
  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Get the current WebSocket latency.
   */
  public get latency(): number {
    return this.heartbeatManager?.getPing() ?? -1;
  }

  /**
   * Connect to the Discord gateway.
   */
  public connect(): void {
    this.ws = new WebSocket("wss://gateway.discord.gg/?v=10&encoding=json");

    this.ws.on("open", () => {
      console.log("[Gateway] Connected to Discord Gateway");
    });

    this.ws.on("message", (data) => {
      try {
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
              token: this.client.token,
              intents: this.client.intents,
            });
            break;

          case GatewayOpcodes.HEARTBEAT_ACK:
            this.heartbeatManager?.onHeartbeatAck();
            break;

          case GatewayOpcodes.DISPATCH: {
            const event = packet.t as keyof TypicordEvents;

            const handlers: Partial<{
              [K in keyof TypicordEvents]: (data: TypicordEvents[K]) => void;
            }> = {
              READY: (data) => {
                // Cache all guilds from READY event
                if (Array.isArray((data as any).guilds)) {
                  for (const guild of (data as any).guilds) {
                    if (guild.id) this.client.cache.guilds.set(guild.id, guild);
                  }
                }
                this.readyReceived = true;
                this.client.emit(GatewayEvents.READY, data as ReadyEvent);
              },
              MESSAGE_CREATE: (data) => {
                const msg = new Message(
                  this.client,
                  data as MessageCreateEvent
                );
                this.client.emit(GatewayEvents.MESSAGE_CREATE, msg);
              },
              GUILD_CREATE: (data: any) => {
                const guildId = data.id;
                if (!this.readyReceived) {
                  // During startup, just cache
                  this.client.cache.guilds.set(guildId, data);
                  this.client.emit("GUILD_CREATE", data); // Optionally emit all at startup
                } else if (!this.client.cache.guilds.has(guildId)) {
                  // Truly new guild
                  this.client.cache.guilds.set(guildId, data);
                  this.client.emit("GUILD_CREATE", data);
                } else {
                  // Not a new join, ignore
                }
              },
            };

            const handler = handlers[event];
            if (handler) {
              handler(packet.d as any);
            } else {
              console.log(`[Gateway] Unhandled dispatch event: ${packet.t}`);
            }
            break;
          }

          default:
            console.log(`[Gateway] Unknown opcode: ${packet.op}`);
        }
      } catch (error) {
        console.error("[Gateway] Failed to parse message:", error);
      }
    });

    this.ws.on("error", (err) => {
      console.error("[Gateway] WebSocket error:", err);
    });

    this.ws.on("close", (code, reason) => {
      console.warn(
        `[Gateway] Connection closed: ${code} - ${reason.toString()}`
      );
      this.heartbeatManager?.stop();
      setTimeout(() => this.connect(), 5000);
    });
  }
}
