/**
 * TYPING_START Event
 *
 * Emitted when a user starts typing in a channel.
 */
import type { GuildMember } from "@/types/structures/guild";
export interface TypingStartEventData {
    channel_id: string;
    user_id: string;
    timestamp: number;
    guild_id?: string;
    member?: GuildMember;
}
export declare class TypingStartData {
    data: TypingStartEventData;
    constructor(data: TypingStartEventData);
    /**
     * Channel ID where typing started
     */
    get channelId(): string;
    /**
     * User ID who started typing
     */
    get userId(): string;
    /**
     * Unix timestamp when typing started
     */
    get timestamp(): number;
    /**
     * Guild ID (if in a guild)
     */
    get guildId(): string | undefined;
    /**
     * Guild member (if in a guild)
     */
    get member(): GuildMember | undefined;
    /**
     * Convert timestamp to Date object
     */
    get date(): Date;
}
//# sourceMappingURL=TYPING_START.d.ts.map