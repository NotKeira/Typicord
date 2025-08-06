import type { Client } from "@/client/Client";
import type { Role } from "@/types/structures/role";
import type { Emoji } from "@/types/structures/emoji";
import type { User } from "@/types/structures/user";
interface Channel {
    id: string;
    type: number;
    name?: string;
}
/**
 * Represents a guild member
 */
export interface GuildMember {
    /** The user this guild member represents */
    user?: User;
    /** This user's guild nickname */
    nick?: string | null;
    /** The member's guild avatar hash */
    avatar?: string | null;
    /** Array of role object IDs */
    roles: string[];
    /** When the user joined the guild */
    joined_at: string;
    /** When the user started boosting the guild */
    premium_since?: string | null;
    /** Whether the user is deafened in voice channels */
    deaf: boolean;
    /** Whether the user is muted in voice channels */
    mute: boolean;
    /** Guild member flags represented as a bit set */
    flags: number;
    /** Whether the user has not yet passed the guild's Membership Screening requirements */
    pending?: boolean;
    /** Total permissions of the member in the channel, including overwrites, returned when in the interaction object */
    permissions?: string;
    /** When the user's timeout will expire and the user will be able to communicate in the guild again */
    communication_disabled_until?: string | null;
}
/**
 * Represents a guild welcome screen
 */
export interface WelcomeScreen {
    /** The server description shown in the welcome screen */
    description: string | null;
    /** The channels shown in the welcome screen, up to 5 */
    welcome_channels: WelcomeScreenChannel[];
}
/**
 * Represents a welcome screen channel
 */
export interface WelcomeScreenChannel {
    /** The channel's ID */
    channel_id: string;
    /** The description shown for the channel */
    description: string;
    /** The emoji ID, if the emoji is custom */
    emoji_id?: string | null;
    /** The emoji name if custom, the unicode character if standard, or null if no emoji is set */
    emoji_name?: string | null;
}
/**
 * Represents a guild sticker
 */
export interface Sticker {
    /** ID of the sticker */
    id: string;
    /** For guild stickers, the Discord name of a unicode emoji representing the sticker's expression */
    name: string;
    /** Description of the sticker */
    description: string | null;
    /** Autocomplete/suggestion tags for the sticker (max 200 characters) */
    tags: string;
    /** The type of sticker format */
    format_type: number;
    /** Whether this guild sticker can be used, may be false due to loss of Server Boosts */
    available?: boolean;
    /** ID of the guild that owns this sticker */
    guild_id?: string;
    /** The user that uploaded the guild sticker */
    user?: User;
    /** The standard sticker's sort order within its pack */
    sort_value?: number;
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
    roles: Role[];
    emojis: Emoji[];
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
    welcome_screen?: {
        description: string | null;
        welcome_channels: Array<{
            channel_id: string;
            description: string;
            emoji_id?: string | null;
            emoji_name?: string | null;
        }>;
    };
    nsfw_level: number;
    stickers?: Array<{
        id: string;
        pack_id?: string;
        name: string;
        description: string | null;
        tags: string;
        type: number;
        format_type: number;
        available?: boolean;
        guild_id?: string;
        user?: User;
        sort_value?: number;
    }>;
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
        permission_overwrites?: Array<{
            id: string;
            type: number;
            allow: string;
            deny: string;
        }>;
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
    }): Promise<Array<{
        user?: User;
        nick?: string | null;
        avatar?: string | null;
        roles: string[];
        joined_at: string;
        premium_since?: string | null;
        deaf: boolean;
        mute: boolean;
        flags: number;
        pending?: boolean;
        permissions?: string;
        communication_disabled_until?: string | null;
    }>>;
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