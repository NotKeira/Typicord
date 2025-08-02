import type { Client } from "@/client/Client";
interface Channel {
    id: string;
    type: number;
    name?: string;
}
/**
 * Discord guild structure data from the API
 */
export interface GuildData {
    id: string;
    name: string;
    icon?: string | null;
    icon_hash?: string | null;
    splash?: string | null;
    discovery_splash?: string | null;
    owner?: boolean;
    owner_id: string;
    permissions?: string;
    region?: string | null;
    afk_channel_id?: string | null;
    afk_timeout: number;
    widget_enabled?: boolean;
    widget_channel_id?: string | null;
    verification_level: number;
    default_message_notifications: number;
    explicit_content_filter: number;
    roles: any[];
    emojis: any[];
    features: string[];
    mfa_level: number;
    application_id?: string | null;
    system_channel_id?: string | null;
    system_channel_flags: number;
    rules_channel_id?: string | null;
    max_presences?: number | null;
    max_members?: number;
    vanity_url_code?: string | null;
    description?: string | null;
    banner?: string | null;
    premium_tier: number;
    premium_subscription_count?: number;
    preferred_locale: string;
    public_updates_channel_id?: string | null;
    max_video_channel_users?: number;
    approximate_member_count?: number;
    approximate_presence_count?: number;
    welcome_screen?: any;
    nsfw_level: number;
    stickers?: any[];
    premium_progress_bar_enabled: boolean;
}
/**
 * Represents a Discord guild (server) with helpful methods for management
 */
export declare class Guild {
    readonly id: string;
    name: string;
    icon?: string | null;
    ownerId: string;
    permissions?: string;
    features: string[];
    memberCount?: number;
    channels: Map<string, Channel>;
    raw: GuildData;
    private readonly client;
    constructor(client: Client, data: GuildData);
    /**
     * Gets all channels in this guild
     */
    fetchChannels(): Promise<Channel[]>;
    /**
     * Creates a new channel in this guild
     */
    createChannel(name: string, options?: {
        type?: number;
        topic?: string;
        bitrate?: number;
        user_limit?: number;
        rate_limit_per_user?: number;
        position?: number;
        permission_overwrites?: any[];
        parent_id?: string;
        nsfw?: boolean;
    }): Promise<Channel>; /**
     * Gets a specific channel by ID
     */
    getChannel(channelId: string): Channel | undefined;
    /**
     * Gets the guild's icon URL
     */
    iconURL(options?: {
        size?: number;
        format?: "png" | "jpg" | "webp" | "gif";
    }): string | null;
    /**
     * Leaves this guild
     */
    leave(): Promise<void>;
    /**
     * Gets guild members
     */
    fetchMembers(options?: {
        limit?: number;
        after?: string;
    }): Promise<any[]>;
    /**
     * Kicks a member from the guild
     */
    kickMember(userId: string, reason?: string): Promise<void>;
    /**
     * Bans a member from the guild
     */
    banMember(userId: string, options?: {
        reason?: string;
        delete_message_days?: number;
    }): Promise<void>;
    /**
     * Unbans a member from the guild
     */
    unbanMember(userId: string, reason?: string): Promise<void>;
}
export {};
//# sourceMappingURL=Guild.d.ts.map