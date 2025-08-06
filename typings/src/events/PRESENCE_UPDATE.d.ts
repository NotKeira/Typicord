/**
 * PRESENCE_UPDATE Event
 *
 * Emitted when a user's presence is updated (status, activity, etc.).
 */
import type { PresenceUpdateEvent } from "@/types/gateway/events";
export declare class PresenceUpdateData {
    data: PresenceUpdateEvent;
    constructor(data: PresenceUpdateEvent);
    /**
     * The user whose presence was updated
     */
    get user(): import("../types/structures/user").User;
    /**
     * Guild ID where the presence was updated
     */
    get guildId(): string;
    /**
     * The user's new status
     */
    get status(): "idle" | "dnd" | "online" | "offline";
    /**
     * The user's activities
     */
    get activities(): import("@/types/gateway/events").Activity[];
    /**
     * Client status breakdown
     */
    get clientStatus(): {
        desktop?: string;
        mobile?: string;
        web?: string;
    };
    /**
     * Whether the user is online
     */
    get isOnline(): boolean;
    /**
     * Whether the user is idle
     */
    get isIdle(): boolean;
    /**
     * Whether the user is in do not disturb mode
     */
    get isDnd(): boolean;
    /**
     * Whether the user is offline
     */
    get isOffline(): boolean;
}
//# sourceMappingURL=PRESENCE_UPDATE.d.ts.map