/**
 * GUILD_CREATE Event
 *
 * Emitted when the bot joins a new guild or when a guild becomes available.
 * Enhanced with Discord bot utility methods for guild management.
 */
import type { Guild } from "@/types/structures/guild";
import type { RESTClient } from "@/client/RESTClient";
export declare class GuildCreateData {
    data: Guild;
    private readonly _client?;
    constructor(data: Guild, client?: RESTClient);
    /**
     * The guild data
     */
    get guild(): Guild;
    /**
     * Guild ID
     */
    get id(): string;
    /**
     * Guild name
     */
    get name(): string;
    /**
     * Guild owner ID
     */
    get ownerId(): string;
    /**
     * Guild members array
     */
    get members(): import("@/types/structures/guild").GuildMember[];
    /**
     * Guild features
     */
    get features(): string[];
    /**
     * Guild roles
     */
    get roles(): import("../types/structures/role").Role[];
    /**
     * Whether the user is the owner of this guild
     */
    get isOwner(): boolean | undefined;
    /**
     * Guild member count (approximate)
     */
    get memberCount(): number;
    /**
     * Guild verification level
     */
    get verificationLevel(): number;
    /**
     * Send a message to the system channel (if exists)
     */
    sendToSystemChannel(content: string, options?: any): Promise<any>;
    /**
     * Send a message to the general/first text channel
     */
    sendToDefaultChannel(content: string, options?: any): Promise<any>;
    /**
     * Create a new text channel
     */
    createTextChannel(name: string, options?: {
        topic?: string;
        rate_limit_per_user?: number;
        position?: number;
        parent_id?: string;
        nsfw?: boolean;
        permission_overwrites?: any[];
        reason?: string;
    }): Promise<any>;
    /**
     * Create a new voice channel
     */
    createVoiceChannel(name: string, options?: {
        bitrate?: number;
        user_limit?: number;
        position?: number;
        parent_id?: string;
        permission_overwrites?: any[];
        reason?: string;
    }): Promise<any>;
    /**
     * Create a new role
     */
    createRole(options?: {
        name?: string;
        permissions?: string;
        color?: number;
        hoist?: boolean;
        mentionable?: boolean;
        reason?: string;
    }): Promise<any>;
    /**
     * Get guild member by ID
     */
    getMember(userId: string): Promise<any>;
    /**
     * Get all guild members (paginated)
     */
    getMembers(limit?: number, after?: string): Promise<any>;
    /**
     * Get guild bans
     */
    getBans(): Promise<any>;
    /**
     * Get guild invites
     */
    getInvites(): Promise<any>;
    /**
     * Leave the guild
     */
    leave(): Promise<void>;
    /**
     * Check if guild has a specific feature
     */
    hasFeature(feature: string): boolean;
    /**
     * Check if guild is partnered
     */
    isPartnered(): boolean;
    /**
     * Check if guild is verified
     */
    isVerified(): boolean;
    /**
     * Check if guild has community features
     */
    isCommunity(): boolean;
    /**
     * Check if guild supports threads
     */
    supportsThreads(): boolean;
    /**
     * Get guild creation timestamp
     */
    getCreatedAt(): Date;
    /**
     * Get how old the guild is
     */
    getGuildAge(): number;
    /**
     * Get guild icon URL
     */
    getIconUrl(size?: number): string | null;
    /**
     * Get guild banner URL
     */
    getBannerUrl(size?: number): string | null;
}
//# sourceMappingURL=GUILD_CREATE.d.ts.map