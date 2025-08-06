/**
 * GUILD_BAN_ADD Event
 *
 * Sent when a user is banned from a guild.
 */
import type { User } from "@/types/structures/user";
export interface GuildBanAddEventData {
    /** ID of the guild */
    guild_id: string;
    /** User who was banned */
    user: User;
}
export declare class GuildBanAddData {
    data: GuildBanAddEventData;
    constructor(data: GuildBanAddEventData);
    /**
     * The guild ID where the ban occurred
     */
    get guildId(): string;
    /**
     * The user who was banned
     */
    get user(): User;
    /**
     * The banned user's ID
     */
    get userId(): string;
    /**
     * The banned user's username
     */
    get username(): string;
    /**
     * The banned user's discriminator
     */
    get discriminator(): string;
    /**
     * The banned user's display name
     */
    get displayName(): string;
    /**
     * Whether the banned user is a bot
     */
    get isBot(): boolean;
    /**
     * The banned user's tag (username#discriminator)
     */
    get tag(): string;
}
//# sourceMappingURL=GUILD_BAN_ADD.d.ts.map