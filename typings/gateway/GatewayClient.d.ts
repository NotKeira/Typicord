import { Client } from "@/client/Client";
/**
 * Handles the Discord gateway connection, events, and caching.
 */
export declare class GatewayClient {
    private client;
    private ws;
    private heartbeatManager;
    private cachedGuilds;
    private readyReceived;
    /**
     * Create a new GatewayClient instance.
     * @param client The Typicord client
     */
    constructor(client: Client);
    /**
     * Get the current WebSocket latency.
     */
    get latency(): number;
    /**
     * Connect to the Discord gateway.
     */
    connect(): void;
}
//# sourceMappingURL=GatewayClient.d.ts.map