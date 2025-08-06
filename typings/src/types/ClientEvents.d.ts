import type { TypicordEvents } from "@/types/gateway/events";
/**
 * Client-specific events that include both gateway events and client utility events
 */
export interface ClientEvents extends TypicordEvents {
    /** Emitted when the client encounters an error */
    error: Error;
    /** Emitted when the client encounters a warning */
    warn: string;
    /** Emitted when the client logs debug information */
    debug: string;
    /** Emitted when the client's rate limit is hit */
    rateLimit: {
        /** The number of requests that can be made */
        limit: number;
        /** The number of remaining requests that can be made */
        remaining: number;
        /** The time when the rate limit resets */
        resetTime: Date;
        /** The route that was rate limited */
        route: string;
    };
    /** Emitted when the client is invalidated and needs to re-authenticate */
    invalidated: void;
    /** Emitted when the WebSocket connection is established */
    shardConnect: {
        shardId: number;
    };
    /** Emitted when the WebSocket connection is closed */
    shardDisconnect: {
        shardId: number;
        code: number;
        reason: string;
    };
    /** Emitted when the WebSocket encounters an error */
    shardError: {
        shardId: number;
        error: Error;
    };
    /** Emitted when the WebSocket is reconnecting */
    shardReconnecting: {
        shardId: number;
    };
    /** Emitted when the WebSocket has reconnected */
    shardReconnected: {
        shardId: number;
    };
    /** Emitted when the WebSocket is resuming */
    shardResume: {
        shardId: number;
        replayedEvents: number;
    };
}
//# sourceMappingURL=ClientEvents.d.ts.map