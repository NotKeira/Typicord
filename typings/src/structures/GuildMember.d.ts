import type { GuildMember as RawGuildMember } from "../types/structures/guild";
import { User } from "./User";
import type { RESTClient } from "@/client/RESTClient";
export declare class GuildMember {
    data: RawGuildMember;
    private readonly _client?;
    private readonly _user?;
    constructor(data: RawGuildMember, client?: RESTClient);
    /**
     * The user this guild member represents with full functionality
     */
    get user(): User | undefined;
    /**
     * Raw member data without User class methods (for compatibility)
     */
    get rawMember(): RawGuildMember;
    get id(): string | undefined;
    get nickname(): string | null | undefined;
    get displayName(): string;
    get joinedAt(): Date;
    get premiumSince(): Date | null;
    get roles(): string[];
    get isDeafened(): boolean;
    get isMuted(): boolean;
    get flags(): number;
    get isPending(): boolean;
    get permissions(): string | undefined;
    get communicationDisabledUntil(): Date | null;
    get isTimedOut(): boolean;
    /**
     * Get the member's avatar URL for this guild
     */
    get avatarURL(): string | null;
    /**
     * Get the member's display avatar URL (guild avatar, user avatar, or default)
     */
    get displayAvatarURL(): string;
    /**
     * Get mention string for this member
     */
    get mention(): string;
    /**
     * Get nickname mention (if they have a nickname)
     */
    get nicknameMention(): string;
    /**
     * Check if member has a specific role
     */
    hasRole(roleId: string): boolean;
    /**
     * Ban this member from the guild
     */
    ban(guildId: string, options?: {
        reason?: string;
        deleteMessageDays?: number;
    }): Promise<void>;
    /**
     * Kick this member from the guild
     */
    kick(guildId: string, reason?: string): Promise<void>;
    /**
     * Timeout this member
     */
    timeout(guildId: string, duration: number, reason?: string): Promise<GuildMember>;
    /**
     * Remove timeout from this member
     */
    removeTimeout(guildId: string, reason?: string): Promise<GuildMember>;
    /**
     * Add a role to this member
     */
    addRole(guildId: string, roleId: string, reason?: string): Promise<void>;
    /**
     * Remove a role from this member
     */
    removeRole(guildId: string, roleId: string, reason?: string): Promise<void>;
    /**
     * Edit this member's properties
     */
    edit(guildId: string, options: {
        nick?: string | null;
        roles?: string[];
        mute?: boolean;
        deaf?: boolean;
        channel_id?: string | null;
        communication_disabled_until?: string | null;
        reason?: string;
    }): Promise<GuildMember>;
    /**
     * Send a direct message to this member
     */
    send(content: string, options?: any): Promise<any>;
    /**
     * Convert to JSON representation
     */
    toJSON(): RawGuildMember;
    /**
     * String representation
     */
    toString(): string;
    /**
     * Value representation
     */
    valueOf(): string;
}
//# sourceMappingURL=GuildMember.d.ts.map