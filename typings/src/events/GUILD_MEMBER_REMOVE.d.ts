/**
 * GUILD_MEMBER_REMOVE Event
 *
 * Emitted when a member leaves a guild (kicked, banned, or left voluntarily).
 * Enhanced with Discord bot utility methods for logging and response.
 */
import type { User } from "@/types/structures/user";
import type { RESTClient } from "@/client/RESTClient";
export interface GuildMemberRemoveEventData {
    /** The guild ID where the member was removed */
    guild_id: string;
    /** The user that was removed */
    user: User;
}
export declare class GuildMemberRemoveData {
    data: GuildMemberRemoveEventData;
    private readonly _client?;
    constructor(data: GuildMemberRemoveEventData, client?: RESTClient);
    /**
     * The user that was removed from the guild
     */
    get user(): User;
    /**
     * The guild ID where the member was removed
     */
    get guildId(): string;
    /**
     * The user's ID
     */
    get userId(): string;
    /**
     * The user's username
     */
    get username(): string;
    /**
     * The user's discriminator
     */
    get discriminator(): string;
    /**
     * The user's display name
     */
    get displayName(): string;
    /**
     * The user's avatar hash
     */
    get avatar(): string | null | undefined;
    /**
     * Whether the user is a bot
     */
    get isBot(): boolean;
    /**
     * The user's tag (username#discriminator)
     */
    get tag(): string;
    /**
     * Send a log message to a specific channel about the member leaving
     */
    logToChannel(channelId: string, message: string, options?: any): Promise<any>;
    /**
     * Try to send a DM to the user (will fail if they left voluntarily and have DMs disabled)
     */
    tryDmUser(content: string, options?: any): Promise<any>;
    /**
     * Check if the user is banned from the guild
     */
    checkIfBanned(): Promise<boolean>;
    /**
     * Get the guild this member was removed from
     */
    getGuild(): Promise<any>;
    /**
     * Get audit log entries to understand why the member was removed
     */
    getAuditLogs(limit?: number): Promise<any>;
    /**
     * Get member's account creation date
     */
    getAccountCreatedAt(): Date;
    /**
     * Get how long ago the account was created
     */
    getAccountAge(): number;
    /**
     * Get user's avatar URL
     */
    getAvatarUrl(size?: number): string;
    /**
     * Create a formatted mention string for the user
     */
    getMention(): string;
}
//# sourceMappingURL=GUILD_MEMBER_REMOVE.d.ts.map