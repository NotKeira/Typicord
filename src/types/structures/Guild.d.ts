import type { User } from "./User";

/**
 * Guild-related types for Discord API structures
 */


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
 * Represents a Discord guild (server)
 */
export interface Guild {
    /** Guild ID */
    id: string;
    /** Guild name (2-100 characters, excluding trailing and leading whitespace) */
    name: string;
    /** Icon hash */
    icon?: string | null;
    /** Icon hash, returned when in the template object */
    icon_hash?: string | null;
    /** Splash hash */
    splash?: string | null;
    /** Discovery splash hash; only present for guilds with the "DISCOVERABLE" feature */
    discovery_splash?: string | null;
    /** True if the user is the owner of the guild */
    owner?: boolean;
    /** ID of owner */
    owner_id: string;
    /** Total permissions for the user in the guild (excludes overwrites) */
    permissions?: string;
    /** Voice region ID for the guild (deprecated) */
    region?: string | null;
    /** ID of afk channel */
    afk_channel_id?: string | null;
    /** AFK timeout in seconds */
    afk_timeout: number;
    /** True if the server widget is enabled */
    widget_enabled?: boolean;
    /** The channel ID that the widget will generate an invite to, or null if set to no invite */
    widget_channel_id?: string | null;
    /** Verification level required for the guild */
    verification_level: number;
    /** Default message notifications level */
    default_message_notifications: number;
    /** Explicit content filter level */
    explicit_content_filter: number;
    /** Roles in the guild */
    roles: Role[];
    /** Custom guild emojis */
    emojis: Emoji[];
    /** Members in the guild */
    members: GuildMember[];
    /** Enabled guild features */
    features: string[];
    /** Required MFA level for the guild */
    mfa_level: number;
    /** Application ID of the guild creator if it is bot-created */
    application_id?: string | null;
    /** The ID of the channel where guild notices such as welcome messages and boost events are posted */
    system_channel_id?: string | null;
    /** System channel flags */
    system_channel_flags: number;
    /** The ID of the channel where Community guilds can display rules and/or guidelines */
    rules_channel_id?: string | null;
    /** The maximum number of presences for the guild (null is always returned, apart from the largest of guilds) */
    max_presences?: number | null;
    /** The maximum number of members for the guild */
    max_members?: number;
    /** The vanity url code for the guild */
    vanity_url_code?: string | null;
    /** The description of a guild */
    description?: string | null;
    /** Banner hash */
    banner?: string | null;
    /** Premium tier (Server Boost level) */
    premium_tier: number;
    /** The number of boosts this guild currently has */
    premium_subscription_count?: number;
    /** The preferred locale of a Community guild; used in server discovery and notices from Discord; defaults to "en-US" */
    preferred_locale: string;
    /** The ID of the channel where admins and moderators of Community guilds receive notices from Discord */
    public_updates_channel_id?: string | null;
    /** The maximum amount of users in a video channel */
    max_video_channel_users?: number;
    /** The maximum amount of users in a stage video channel */
    max_stage_video_channel_users?: number;
    /** Approximate number of members in this guild, returned from the GET /guilds/<id> endpoint when with_counts is true */
    approximate_member_count?: number;
    /** Approximate number of non-offline members in this guild, returned from the GET /guilds/<id> endpoint when with_counts is true */
    approximate_presence_count?: number;
    /** The welcome screen of a Community guild, shown to new members, returned in an Invite's guild object */
    welcome_screen?: WelcomeScreen;
    /** Guild NSFW level */
    nsfw_level: number;
    /** Custom guild stickers */
    stickers?: Sticker[];
    /** Whether the guild has the boost progress bar enabled */
    premium_progress_bar_enabled: boolean;
    /** The ID of the channel where admins and moderators of Community guilds receive safety alerts from Discord */
    safety_alerts_channel_id?: string | null;
}

/**
 * Represents a custom emoji
 */
export interface Emoji {
    /** Emoji ID */
    id: string | null;
    /** Emoji name */
    name: string | null;
    /** Roles allowed to use this emoji */
    roles?: string[];
    /** User that created this emoji */
    user?: User;
    /** Whether this emoji must be wrapped in colons */
    require_colons?: boolean;
    /** Whether this emoji is managed */
    managed?: boolean;
    /** Whether this emoji is animated */
    animated?: boolean;
    /** Whether this emoji can be used, may be false due to loss of Server Boosts */
    available?: boolean;
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

export interface Role {
    id: string;
    name: string;
    color: number;
    hoist: boolean;
    icon?: string;
    unicode_emoji?: string;
    position: number;
    permissions: string;
    managed: boolean;
    mentionable: boolean;
    tags?: RoleTags;
}

export interface RoleTags {
    bot_id?: string;
    integration_id?: string;
    premium_subscriber?: null;
    subscription_listing_id?: string;
    available_for_purchase?: null;
    guild_connections?: null;
}

export interface Emoji {
    id?: string;
    name?: string;
    roles?: string[];
    user?: User;
    require_colons?: boolean;
    managed?: boolean;
    animated?: boolean;
    available?: boolean;
}

export interface WelcomeScreen {
    description?: string;
    welcome_channels: WelcomeScreenChannel[];
}

export interface WelcomeScreenChannel {
    channel_id: string;
    description: string;
    emoji_id?: string;
    emoji_name?: string;
}

export interface Sticker {
    id: string;
    pack_id?: string;
    name: string;
    description?: string;
    tags: string;
    asset?: string;
    type: number;
    format_type: number;
    available?: boolean;
    guild_id?: string;
    user?: User;
    sort_value?: number;
}

export interface User {
    id: string;
    username: string;
    discriminator: string;
    global_name?: string;
    avatar?: string;
    bot?: boolean;
    system?: boolean;
    mfa_enabled?: boolean;
    banner?: string;
    accent_color?: number;
    locale?: string;
    verified?: boolean;
    email?: string;
    flags?: number;
    premium_type?: number;
    public_flags?: number;
    avatar_decoration?: string;
}