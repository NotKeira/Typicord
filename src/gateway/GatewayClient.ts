import WebSocket from "ws";
import { handleHello } from "./handlers";
import type {
  GatewayPayload,
  HelloPayloadData,
} from "@/types/gateway/payloads";
import { GatewayEvents, GatewayOpcodes } from "./constants";
import { HeartbeatManager } from "./HeartbeatManager";
import { ReconnectionManager } from "./ReconnectionManager";
import type {
  TypicordEvents,
  MessageCreateEvent,
  ReadyEvent,
} from "@/types/gateway/events";
import { Message } from "@/structures/Message";
import { Client } from "@/client/Client";

/**
 * The main gateway client - handles connecting to Discord's gateway, 
 * managing events, and keeping our cache up to date. This is where all 
 * the magic happens for real-time Discord stuff.
 */
export class GatewayClient {
  private client: Client;
  private ws: WebSocket | null = null;
  private heartbeatManager: HeartbeatManager | null = null;
  private reconnectionManager: ReconnectionManager;
  private cachedGuilds: Set<string> = new Set();
  private readyReceived = false;
  // Session stuff for resuming connections - proper important this
  private sessionId: string | null = null;
  private sequenceNumber: number | null = null;
  private resumeGatewayUrl: string | null = null;
  private isReconnecting = false;

  /**
   * Sets up a new gateway client - this is what connects us to Discord's servers
   * @param client The main Typicord client instance
   */
  constructor(client: Client) {
    this.client = client;
    // Set up our reconnection manager with sensible defaults
    // 10 attempts max, starting at 1s delay, capping at 5 mins
    this.reconnectionManager = new ReconnectionManager(
      () => this.attemptReconnect(),
      {
        maxAttempts: 10,
        baseDelay: 1000,
        maxDelay: 300000, // 5 minutes max delay
        jitter: true,
      }
    );
  }

  /**
   * Gets the current WebSocket ping - how long it takes to get a response
   * from Discord's servers. Lower is better obviously!
   */
  public getWebSocketLatency(): number {
    return this.heartbeatManager?.getWebSocketLatency() ?? -1;
  }

  /**
   * Same as getWebSocketLatency but with the old name - keeping it for backwards compatibility
   * @deprecated Use getWebSocketLatency() instead, it's clearer what it does
   */
  public getPing(): number {
    return this.getWebSocketLatency();
  }

  /**
   * Actually connects to Discord's gateway - this is where we establish the WebSocket connection
   */
  public connect(): void {
    this.isReconnecting = false;
    this.createWebSocketConnection();
  }

  /**
   * Tries to reconnect, preferring to resume our existing session if we can
   * This is way more efficient than starting from scratch every time
   */
  private attemptReconnect(): void {
    this.isReconnecting = true;
    
    if (this.canResume()) {
      console.log("[Gateway] Attempting to resume session");
      this.createWebSocketConnection(true);
    } else {
      console.log("[Gateway] Creating new connection (cannot resume)");
      this.resetSessionData();
      this.createWebSocketConnection(false);
    }
  }

  /**
   * Checks if we've got everything we need to resume our session
   * Need session ID, sequence number, and the resume URL
   */
  private canResume(): boolean {
    return (
      this.sessionId !== null &&
      this.sequenceNumber !== null &&
      this.resumeGatewayUrl !== null
    );
  }

  /**
   * Wipes all our session data - used when we need to start fresh
   */
  private resetSessionData(): void {
    this.sessionId = null;
    this.sequenceNumber = null;
    this.resumeGatewayUrl = null;
    this.readyReceived = false;
  }

  /**
   * Creates the actual WebSocket connection to Discord
   * @param resume Whether we're trying to resume an existing session or starting fresh
   */
  private createWebSocketConnection(resume: boolean = false): void {
    // Clean up any existing connection first
    if (this.ws) {
      this.ws.removeAllListeners();
      this.ws.terminate();
    }
    
    this.heartbeatManager?.stop();

    // Use the resume URL if we have it, otherwise use the standard gateway
    const gatewayUrl = resume && this.resumeGatewayUrl 
      ? this.resumeGatewayUrl
      : "wss://gateway.discord.gg/?v=10&encoding=json";

    this.ws = new WebSocket(gatewayUrl);

    this.ws.on("open", () => {
      console.log(`[Gateway] ${resume ? 'Reconnected' : 'Connected'} to Discord Gateway`);
      if (!resume) {
        this.reconnectionManager.onConnectionSuccess();
      }
    });

    this.ws.on("message", (data) => {
      try {
        const packet: GatewayPayload = JSON.parse(data.toString());

        // Keep track of sequence numbers for resuming sessions later
        if (packet.s !== null && packet.s !== undefined) {
          this.sequenceNumber = packet.s;
        }

        switch (packet.op) {
          case GatewayOpcodes.HELLO:
            // Discord says hello! Set up heartbeating and send our identify/resume
            this.heartbeatManager = new HeartbeatManager(
              this.ws!,
              (packet.d as HelloPayloadData).heartbeat_interval,
              () => {
                console.warn("[Gateway] Missed heartbeat ACK");
                this.handleConnectionLoss("missed heartbeat");
              }
            );
            this.heartbeatManager.start();

            // Either resume our session or send a fresh identify
            if (resume && this.canResume()) {
              this.sendResume();
            } else {
              handleHello(this.ws!, packet.d as HelloPayloadData, {
                token: this.client.token,
                intents: this.client.intents,
              });
            }
            break;

          case GatewayOpcodes.HEARTBEAT_ACK:
            // Discord acknowledged our heartbeat - all good!
            this.heartbeatManager?.onHeartbeatAck();
            break;

          case GatewayOpcodes.DISPATCH: {
            const event = packet.t as keyof TypicordEvents;

            // Handle different event types - this is where the real work happens
            const handlers: Partial<{
              [K in keyof TypicordEvents]: (data: TypicordEvents[K]) => void;
            }> = {
              READY: (data) => {
                // Got the ready event! Save session info for later resuming
                if (typeof data === "object" && data && "session_id" in data) {
                  this.sessionId = (data as any).session_id;
                  console.log("[Gateway] Session established:", this.sessionId);
                }
                
                if (typeof data === "object" && data && "resume_gateway_url" in data) {
                  this.resumeGatewayUrl = (data as any).resume_gateway_url;
                }

                // Set up the client with user info and guilds
                if (typeof data === "object") {
                  // Set user info
                  if ("user" in data) {
                    const { User } = require("@/structures/User");
                    this.client.user = new User((data as any).user);
                  }
                  // Cache all the guilds we're in
                  if ("guilds" in data) {
                    this.client.guilds = (data as any).guilds;
                    for (const guild of (data as any).guilds) {
                      if (guild.id)
                        this.client.cache.guilds.set(guild.id, guild);
                    }
                  }
                }
                
                this.readyReceived = true;
                this.reconnectionManager.onConnectionSuccess();
                this.client.emit(GatewayEvents.READY, data as ReadyEvent);
              },
              RESUMED: () => {
                console.log("[Gateway] Session resumed successfully");
                this.reconnectionManager.onConnectionSuccess();
                // Don't emit READY again for resumed sessions - we're already ready!
              },
              MESSAGE_CREATE: (data) => {
                // New message came in - wrap it in our Message class and emit it
                const msg = new Message(
                  this.client,
                  data as MessageCreateEvent
                );
                this.client.emit(GatewayEvents.MESSAGE_CREATE, msg);
              },
              GUILD_CREATE: (data: any) => {
                const guildId = data.id;
                if (!this.readyReceived) {
                  // During startup, just cache everything
                  this.client.cache.guilds.set(guildId, data);
                  this.client.emit("GUILD_CREATE", data);
                } else if (!this.client.cache.guilds.has(guildId)) {
                  // Actually joined a new guild!
                  this.client.cache.guilds.set(guildId, data);
                  this.client.emit("GUILD_CREATE", data);
                } else {
                  // Already know about this guild, ignore it
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
      this.handleConnectionLoss("websocket error");
    });

    this.ws.on("close", (code, reason) => {
      console.warn(
        `[Gateway] Connection closed: ${code} - ${reason.toString()}`
      );
      this.heartbeatManager?.stop();
      
      // Some close codes mean we shouldn't even try to reconnect
      if (this.shouldNotReconnect(code)) {
        console.error(`[Gateway] Non-recoverable close code ${code}. Not reconnecting.`);
        return;
      }
      
      this.handleConnectionLoss(`close code ${code}: ${reason.toString()}`);
    });
  }

  /**
   * Something went wrong with our connection - let the reconnection manager handle it
   * @param reason What went wrong (for logging)
   */
  private handleConnectionLoss(reason: string): void {
    if (this.isReconnecting) {
      return; // Already dealing with a reconnection
    }
    
    console.warn(`[Gateway] Connection lost: ${reason}`);
    this.reconnectionManager.scheduleReconnect(reason);
  }

  /**
   * Sends a RESUME payload to try and pick up where we left off
   */
  private sendResume(): void {
    if (!this.ws || !this.sessionId || this.sequenceNumber === null) {
      console.error("[Gateway] Cannot resume: missing session data");
      return;
    }

    const resumePayload = {
      op: 6, // RESUME opcode
      d: {
        token: this.client.token,
        session_id: this.sessionId,
        seq: this.sequenceNumber,
      },
    };

    console.log(`[Gateway] Sending RESUME payload (seq: ${this.sequenceNumber})`);
    this.ws.send(JSON.stringify(resumePayload));
  }

  /**
   * Checks if a close code means we shouldn't bother trying to reconnect
   * Some errors like bad auth just aren't worth retrying
   * @param code The WebSocket close code from Discord
   */
  private shouldNotReconnect(code: number): boolean {
    // These close codes from Discord mean we're screwed and shouldn't retry
    const nonRecoverableCodes = [
      4004, // Authentication failed - bad token
      4010, // Invalid shard
      4011, // Sharding required
      4012, // Invalid API version
      4013, // Invalid intent(s)
      4014, // Disallowed intent(s)
    ];
    
    return nonRecoverableCodes.includes(code);
  }

  /**
   * Properly shuts down the gateway connection - cleanup everything nicely
   */
  public disconnect(): void {
    console.log("[Gateway] Disconnecting...");
    this.reconnectionManager.cancel();
    this.heartbeatManager?.stop();
    
    if (this.ws) {
      this.ws.removeAllListeners();
      this.ws.close(1000, "Client disconnect");
      this.ws = null;
    }
    
    this.resetSessionData();
  }
}
