import { ReconnectionManager } from "./ReconnectionManager";
import { Client } from "@/client/Client";
import "./handlers/index";
/**
 * The main gateway client - handles connecting to Discord's gateway,
 * managing events, and keeping our cache up to date. This is where all
 * the magic happens for real-time Discord stuff.
 */
export declare class GatewayClient {
    private readonly client;
    private ws;
    private heartbeatManager;
    readonly reconnectionManager: ReconnectionManager;
    private readonly cachedGuilds;
    readyReceived: boolean;
    sessionId: string | null;
    private sequenceNumber;
    resumeGatewayUrl: string | null;
    private isReconnecting;
    /**
     * Sets up a new gateway client - this is what connects us to Discord's servers
     * @param client The main Typicord client instance
     */
    constructor(client: Client);
    /**
     * Extracts and sets the session ID from the READY event data.
     */
    private handleSessionInfo;
    /**
     * Extracts and sets the resume gateway URL from the READY event data.
     */
    private handleResumeGatewayUrl;
    /**
     * Sets up the client user and guilds from the READY event data.
     */
    private setupClientUserAndGuilds;
    /**
     * Gets the current WebSocket ping - how long it takes to get a response
     * from Discord's servers. Lower is better obviously!
     */
    getWebSocketLatency(): number;
    /**
     * Same as getWebSocketLatency but with the old name - keeping it for backwards compatibility
     * @deprecated Use getWebSocketLatency() instead, it's clearer what it does
     */
    getPing(): number;
    /**
     * Actually connects to Discord's gateway - this is where we establish the WebSocket connection
     */
    connect(): void;
    /**
     * Tries to reconnect, preferring to resume our existing session if we can
     * This is way more efficient than starting from scratch every time
     */
    private attemptReconnect;
    /**
     * Checks if we've got everything we need to resume our session
     * Need session ID, sequence number, and the resume URL
     */
    private canResume;
    /**
     * Wipes all our session data - used when we need to start fresh
     */
    private resetSessionData;
    /**
     * Creates the actual WebSocket connection to Discord
     * @param resume Whether we're trying to resume an existing session or starting fresh
     */
    private createWebSocketConnection;
    /**
     * Something went wrong with our connection - let the reconnection manager handle it
     * @param reason What went wrong (for logging)
     */
    private handleConnectionLoss;
    /**
     * Sends a RESUME payload to try and pick up where we left off
     */
    private sendResume;
    /**
     * Checks if a close code means we shouldn't bother trying to reconnect
     * Some errors like bad auth just aren't worth retrying
     * @param code The WebSocket close code from Discord
     */
    private shouldNotReconnect;
    /**
     * Properly shuts down the gateway connection - cleanup everything nicely
     */
    disconnect(): void;
    /**
     * Sends a raw payload to Discord - for advanced usage
     * @param payload The payload to send
     */
    sendRawPayload(payload: object): void;
}
//# sourceMappingURL=GatewayClient.d.ts.map