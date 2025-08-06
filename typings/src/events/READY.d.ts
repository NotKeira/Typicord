/**
 * READY Event
 *
 * Emitted when the client has successfully connected to Discord and is ready to operate.
 * This event contains initial session data including user information, guilds, and session details.
 */
import type { ReadyEvent } from "@/types/gateway/events";
export declare class ReadyData {
    data: ReadyEvent;
    constructor(data: ReadyEvent);
    /**
     * The bot user information
     */
    get user(): {
        id: string;
        username: string;
        discriminator: string;
        avatar: string | null;
        bot?: boolean;
    };
    /**
     * The guilds the bot is in (may be unavailable during startup)
     */
    get guilds(): {
        id: string;
        unavailable?: boolean;
    }[];
    /**
     * The session ID for this connection
     */
    get sessionId(): string;
    /**
     * The gateway URL to use for resuming connections
     */
    get resumeGatewayUrl(): string;
    /**
     * Application information
     */
    get application(): {
        id: string;
        flags: number;
    };
    /**
     * Gateway API version
     */
    get version(): number;
}
export type { ReadyEvent };
//# sourceMappingURL=READY.d.ts.map