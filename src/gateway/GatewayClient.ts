import WebSocket from "ws";
import { handleHello } from "./handlers";
import type {
  GatewayPayload,
  HelloPayloadData,
} from "@/types/gateway/payloads";
import { GatewayOpcodes } from "./constants";
import { HeartbeatManager } from "./HeartbeatManager";
import { ReconnectionManager } from "./ReconnectionManager";
import { User } from "@/structures/User";
import type { TypicordEvents, ReadyEvent } from "@/types/gateway/events";
import { Client } from "@/client/Client";
import { debug, DebugNamespace } from "@/debug";
// Import our modular dispatch handler system
import { dispatchHandlerRegistry } from "./DispatchHandlerRegistry";
// Import dispatch handlers to register them
import "./handlers/index";

/**
 * The main gateway client - handles connecting to Discord's gateway,
 * managing events, and keeping our cache up to date. This is where all
 * the magic happens for real-time Discord stuff.
 */
export class GatewayClient {
  private readonly client: Client;
  private ws: WebSocket | null = null;
  private heartbeatManager: HeartbeatManager | null = null;
  public readonly reconnectionManager: ReconnectionManager;
  private readonly cachedGuilds: Set<string> = new Set();
  public readyReceived = false;
  // Session stuff for resuming connections - proper important this
  public sessionId: string | null = null;
  private sequenceNumber: number | null = null;
  public resumeGatewayUrl: string | null = null;
  private isReconnecting = false;

  /**
   * Sets up a new gateway client - this is what connects us to Discord's servers
   * @param client The main Typicord client instance
   */
  constructor(client: Client) {
    debug.log(DebugNamespace.GATEWAY, "Initializing GatewayClient");
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
    debug.log(
      DebugNamespace.GATEWAY,
      "GatewayClient initialized with reconnection settings",
      {
        maxAttempts: 10,
        baseDelay: 1000,
        maxDelay: 300000,
      }
    );
  }

  /**
   * Extracts and sets the session ID from the READY event data.
   */
  private handleSessionInfo(data: ReadyEvent): void {
    if (typeof data === "object" && data && "session_id" in data) {
      this.sessionId = data.session_id;
      debug.info(
        DebugNamespace.GATEWAY,
        `Session established: ${this.sessionId}`
      );
    }
  }

  /**
   * Extracts and sets the resume gateway URL from the READY event data.
   */
  private handleResumeGatewayUrl(data: ReadyEvent): void {
    if (typeof data === "object" && data && "resume_gateway_url" in data) {
      this.resumeGatewayUrl = data.resume_gateway_url;
    }
  }

  /**
   * Sets up the client user and guilds from the READY event data.
   */
  private setupClientUserAndGuilds(data: ReadyEvent): void {
    if (typeof data === "object") {
      // Set user info
      if ("user" in data) {
        this.client.user = new User(data.user);
      }
      // Cache all the guilds we're in
      if ("guilds" in data) {
        this.client.guilds = data.guilds;
        for (const guild of data.guilds) {
          if (guild.id) this.client.cache.guilds.set(guild.id, guild);
        }
      }
    }
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
    debug.info(DebugNamespace.GATEWAY, "Starting gateway connection");
    this.isReconnecting = false;
    this.createWebSocketConnection();
  }

  /**
   * Tries to reconnect, preferring to resume our existing session if we can
   * This is way more efficient than starting from scratch every time
   */
  private attemptReconnect(): void {
    debug.info(DebugNamespace.GATEWAY, "Attempting to reconnect to gateway");
    this.isReconnecting = true;

    if (this.canResume()) {
      debug.log(DebugNamespace.GATEWAY, "Attempting to resume session", {
        sessionId: this.sessionId,
        sequenceNumber: this.sequenceNumber,
        resumeUrl: this.resumeGatewayUrl,
      });
      this.createWebSocketConnection(true);
    } else {
      debug.log(
        DebugNamespace.GATEWAY,
        "Creating new connection (cannot resume)",
        {
          hasSessionId: !!this.sessionId,
          hasSequenceNumber: this.sequenceNumber !== null,
          hasResumeUrl: !!this.resumeGatewayUrl,
        }
      );
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
    debug.log(
      DebugNamespace.GATEWAY,
      `Creating WebSocket connection (resume: ${resume})`
    );

    // Clean up any existing connection first
    if (this.ws) {
      debug.log(
        DebugNamespace.GATEWAY,
        "Cleaning up existing WebSocket connection"
      );
      this.ws.removeAllListeners();
      this.ws.terminate();
    }

    this.heartbeatManager?.stop();

    // Use the resume URL if we have it, otherwise use the standard gateway
    const gatewayUrl =
      resume && this.resumeGatewayUrl
        ? this.resumeGatewayUrl
        : "wss://gateway.discord.gg/?v=10&encoding=json";

    debug.log(DebugNamespace.GATEWAY, `Connecting to: ${gatewayUrl}`);
    this.ws = new WebSocket(gatewayUrl);

    this.ws.on("open", () => {
      debug.info(
        DebugNamespace.GATEWAY,
        `WebSocket connection ${resume ? "resumed" : "established"}`
      );
      if (!resume) {
        this.reconnectionManager.onConnectionSuccess();
      }
    });

    this.ws.on("message", data => {
      try {
        let jsonString: string;
        if (typeof data === "string") {
          jsonString = data;
        } else if (Buffer.isBuffer(data)) {
          jsonString = data.toString("utf8");
        } else {
          throw new Error(
            "[Gateway] Received unsupported data type from WebSocket"
          );
        }
        const packet: GatewayPayload = JSON.parse(jsonString);

        debug.trace(
          DebugNamespace.GATEWAY,
          `Received gateway packet - OP: ${packet.op}, Type: ${packet.t || "N/A"}`
        );

        // Keep track of sequence numbers for resuming sessions later
        if (packet.s !== null && packet.s !== undefined) {
          this.sequenceNumber = packet.s;
          debug.trace(
            DebugNamespace.GATEWAY,
            `Updated sequence number: ${this.sequenceNumber}`
          );
        }

        // Handle different opcodes from Discord
        switch (packet.op) {
          case GatewayOpcodes.HELLO: {
            // First message from Discord - sets up heartbeat
            debug.info(DebugNamespace.GATEWAY, "Received HELLO opcode", {
              heartbeat_interval: (packet.d as HelloPayloadData)
                .heartbeat_interval,
            });
            const helloData = packet.d as HelloPayloadData;
            handleHello(this.ws!, helloData, this.client);

            this.heartbeatManager = new HeartbeatManager(
              this.ws!,
              helloData.heartbeat_interval,
              () => this.handleConnectionLoss("missed heartbeat")
            );
            this.heartbeatManager.start();

            // Send IDENTIFY or RESUME depending on if we're reconnecting
            if (resume && this.canResume()) {
              debug.info(DebugNamespace.GATEWAY, "Sending RESUME payload");
              this.sendResume();
            } else {
              debug.info(DebugNamespace.GATEWAY, "Sending IDENTIFY payload");
              // Send IDENTIFY to start a new session
              const identifyPayload = {
                op: 2, // IDENTIFY opcode
                d: {
                  token: this.client.token,
                  intents: this.client.intents,
                  properties: {
                    os: process.platform,
                    browser: "Typicord",
                    device: "Typicord",
                  },
                },
              };
              this.ws!.send(JSON.stringify(identifyPayload));
            }
            break;
          }

          case GatewayOpcodes.HEARTBEAT_ACK: {
            // Discord confirmed our heartbeat
            debug.trace(DebugNamespace.HEARTBEAT, "Received HEARTBEAT_ACK");
            this.heartbeatManager?.onHeartbeatAck();
            break;
          }

          case GatewayOpcodes.DISPATCH: {
            // This is where actual events come through
            const event = packet.t as keyof TypicordEvents;
            debug.log(
              DebugNamespace.EVENTS,
              `Received DISPATCH event: ${event}`
            );

            // Use our modular dispatch handler system
            dispatchHandlerRegistry.handleDispatch(
              this.client,
              event,
              packet.d
            );
            break;
          }

          default:
            debug.warn(DebugNamespace.GATEWAY, `Unknown opcode: ${packet.op}`);
        }
      } catch (error) {
        debug.error(
          DebugNamespace.GATEWAY,
          "Failed to parse message",
          error as Error
        );
      }
    });

    this.ws.on("error", err => {
      debug.error(DebugNamespace.GATEWAY, "WebSocket error", err);
      this.handleConnectionLoss("websocket error");
    });

    this.ws.on("close", (code, reason) => {
      debug.warn(
        DebugNamespace.GATEWAY,
        `Connection closed: ${code} - ${reason.toString()}`
      );
      this.heartbeatManager?.stop();

      // Some close codes mean we shouldn't even try to reconnect
      if (this.shouldNotReconnect(code)) {
        debug.error(
          DebugNamespace.GATEWAY,
          `Non-recoverable close code ${code}. Not reconnecting.`
        );
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

    debug.warn(DebugNamespace.GATEWAY, `Connection lost: ${reason}`);
    this.reconnectionManager.scheduleReconnect(reason);
  }

  /**
   * Sends a RESUME payload to try and pick up where we left off
   */
  private sendResume(): void {
    if (!this.ws || !this.sessionId || this.sequenceNumber === null) {
      debug.error(
        DebugNamespace.GATEWAY,
        "Cannot resume: missing session data"
      );
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

    debug.info(
      DebugNamespace.GATEWAY,
      `Sending RESUME payload (seq: ${this.sequenceNumber})`
    );
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
    debug.info(DebugNamespace.GATEWAY, "Disconnecting...");
    this.reconnectionManager.cancel();
    this.heartbeatManager?.stop();

    if (this.ws) {
      this.ws.removeAllListeners();
      this.ws.close(1000, "Client disconnect");
      this.ws = null;
    }

    this.resetSessionData();
  }

  /**
   * Sends a raw payload to Discord - for advanced usage
   * @param payload The payload to send
   */
  public sendRawPayload(payload: object): void {
    if (this.ws && this.ws.readyState === 1) {
      // WebSocket.OPEN
      this.ws.send(JSON.stringify(payload));
    } else {
      debug.warn(
        DebugNamespace.GATEWAY,
        "Attempted to send payload while not connected"
      );
    }
  }
}
