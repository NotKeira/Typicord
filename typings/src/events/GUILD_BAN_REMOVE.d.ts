/**
 * GUILD_BAN_REMOVE Event
 *
 * Sent when a user is unbanned from a guild.
 */
import type { User } from "@/types/structures/user";
export interface GuildBanRemoveEventData {
    /** ID of the guild */
    guild_id: string;
    /** User who was unbanned */
    user: User;
}
export declare class GuildBanRemoveData {
    data: GuildBanRemoveEventData;
    constructor(data: GuildBanRemoveEventData);
    /**
     * The guild ID where the unban occurred
     */
    get guildId(): string;
    /**
     * The user who was unbanned
     */
    get user(): User;
    /**
     * The unbanned user's ID
     */
    get userId(): string;
    /**
     * The unbanned user's username
     */
    get username(): string;
    /**
     * The unbanned user's discriminator
     */
    get discriminator(): string;
    /**
     * The unbanned user's display name
     */
    get displayName(): string;
    /**
     * Whether the unbanned user is a bot
     */
    get isBot(): boolean;
    /**
     * The unbanned user's tag (username#discriminator)
     */
    get tag(): string;
}
//# sourceMappingURL=GUILD_BAN_REMOVE.d.ts.map