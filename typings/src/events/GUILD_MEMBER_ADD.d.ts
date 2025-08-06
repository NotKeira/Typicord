/**
 * GUILD_MEMBER_ADD Event
 *
 * Emitted when a new member joins a guild.
 * Enhanced with Discord bot utility methods for member management.
 */
import type { GuildMember as RawGuildMember } from "@/types/structures/guild";
import { GuildMember } from "@/structures/GuildMember";
import type { RESTClient } from "@/client/RESTClient";
export interface GuildMemberAddEventData extends RawGuildMember {
    /** The guild ID where the member joined */
    guild_id: string;
}
export declare class GuildMemberAddData {
    data: GuildMemberAddEventData;
    private readonly _client?;
    private readonly _member;
    constructor(data: GuildMemberAddEventData, client?: RESTClient);
    /**
     * The guild member with full class methods
     */
    get member(): GuildMember;
    /**
     * Get the raw GuildMember object (for compatibility with existing code)
     */
    get rawMember(): RawGuildMember;
    /**
     * The user object for the member with full User class functionality
     */
    get user(): import("..").User | undefined;
    /**
     * The guild ID where the member joined
     */
    get guildId(): string;
    /**
     * The member's nickname in the guild
     */
    get nick(): string | null | undefined;
    /**
     * The member's guild avatar hash
     */
    get avatar(): string | null | undefined;
    /**
     * Array of role IDs the member has
     */
    get roles(): string[];
    /**
     * When the user joined the guild
     */
    get joinedAt(): Date;
    /**
     * When the user started boosting the guild (if applicable)
     */
    get premiumSince(): Date | null;
    /**
     * Whether the user is deafened in voice channels
     */
    get deaf(): boolean;
    /**
     * Whether the user is muted in voice channels
     */
    get mute(): boolean;
    /**
     * Guild member flags represented as a bit set
     */
    get flags(): number;
    /**
     * Whether the user has passed the guild's Membership Screening requirements
     */
    get pending(): boolean;
    /**
     * The member's display name (nickname or username)
     */
    get displayName(): string;
    /**
     * Send a direct message to the new member
     */
    dmMember(content: string, options?: any): Promise<any>;
    /**
     * Add a role to the new member
     */
    addRole(roleId: string, reason?: string): Promise<void>;
    /**
     * Remove a role from the member
     */
    removeRole(roleId: string, reason?: string): Promise<void>;
    /**
     * Set the member's nickname
     */
    setNickname(nickname: string | null, reason?: string): Promise<void>;
    /**
     * Timeout the member
     */
    timeout(duration: number, reason?: string): Promise<void>;
    /**
     * Kick the member
     */
    kick(reason?: string): Promise<void>;
    /**
     * Ban the member
     */
    ban(reason?: string, deleteMessageDays?: number): Promise<void>;
    /**
     * Move member to a voice channel
     */
    moveToVoiceChannel(channelId: string | null, reason?: string): Promise<void>;
    /**
     * Mute/unmute member in voice
     */
    setVoiceMute(mute: boolean, reason?: string): Promise<void>;
    /**
     * Deafen/undeafen member in voice
     */
    setVoiceDeafen(deaf: boolean, reason?: string): Promise<void>;
    /**
     * Get the guild this member joined
     */
    getGuild(): Promise<any>;
    /**
     * Check if member has a specific role
     */
    hasRole(roleId: string): boolean;
    /**
     * Check if member is a bot
     */
    isBot(): boolean;
    /**
     * Check if member is boosting the server
     */
    isBoosting(): boolean;
    /**
     * Get member's account creation date
     */
    getAccountCreatedAt(): Date;
    /**
     * Get how long ago the account was created
     */
    getAccountAge(): number;
}
//# sourceMappingURL=GUILD_MEMBER_ADD.d.ts.map