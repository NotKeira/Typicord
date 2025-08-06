import type { Client } from "@/client/Client";
import { Message } from "./Message";
import type { GuildMember } from "./Guild";
/**
 * Thread metadata information
 */
export interface ThreadMetadata {
    /** Whether the thread is archived */
    archived: boolean;
    /** Duration in minutes to automatically archive the thread after recent activity */
    auto_archive_duration: number;
    /** Timestamp when the thread's archive status was last changed */
    archive_timestamp: string;
    /** Whether the thread is locked */
    locked: boolean;
    /** Whether non-moderators can add other non-moderators to a thread */
    invitable?: boolean;
    /** Timestamp when the thread was created */
    create_timestamp?: string | null;
}
/**
 * Thread member information
 */
export interface ThreadMember {
    /** ID of the thread */
    id?: string;
    /** ID of the user */
    user_id?: string;
    /** Time the current user last joined the thread */
    join_timestamp: string;
    /** Any user-thread settings, currently only used for notifications */
    flags: number;
    /** Additional information about the user */
    member?: GuildMember;
}
/**
 * Forum tag information
 */
export interface ForumTag {
    /** The id of the tag */
    id: string;
    /** The name of the tag (0-20 characters) */
    name: string;
    /** Whether this tag can only be added to or removed from threads by a member with the MANAGE_THREADS permission */
    moderated: boolean;
    /** The id of a guild's custom emoji */
    emoji_id?: string | null;
    /** The unicode character of the emoji */
    emoji_name?: string | null;
}
/**
 * Default reaction for forum channels
 */
export interface DefaultReaction {
    /** The id of a guild's custom emoji */
    emoji_id?: string | null;
    /** The unicode character of the emoji */
    emoji_name?: string | null;
}
/**
 * Permission overwrite information
 */
export interface PermissionOverwrite {
    /** Role or user id */
    id: string;
    /** Either 0 (role) or 1 (member) */
    type: number;
    /** Permission bit set */
    allow: string;
    /** Permission bit set */
    deny: string;
}
/**
 * Discord channel types
 */
export declare enum ChannelType {
    GUILD_TEXT = 0,
    DM = 1,
    GUILD_VOICE = 2,
    GROUP_DM = 3,
    GUILD_CATEGORY = 4,
    GUILD_ANNOUNCEMENT = 5,
    ANNOUNCEMENT_THREAD = 10,
    PUBLIC_THREAD = 11,
    PRIVATE_THREAD = 12,
    GUILD_STAGE_VOICE = 13,
    GUILD_DIRECTORY = 14,
    GUILD_FORUM = 15
}
/**
 * Discord channel structure data from the API
 */
export interface ChannelData {
    id: string;
    type: number;
    guild_id?: string;
    position?: number;
    permission_overwrites?: any[];
    name?: string;
    topic?: string | null;
    nsfw?: boolean;
    last_message_id?: string | null;
    bitrate?: number;
    user_limit?: number;
    rate_limit_per_user?: number;
    recipients?: any[];
    icon?: string | null;
    owner_id?: string;
    application_id?: string;
    parent_id?: string | null;
    last_pin_timestamp?: string | null;
    rtc_region?: string | null;
    video_quality_mode?: number;
    message_count?: number;
    member_count?: number;
    thread_metadata?: any;
    member?: any;
    default_auto_archive_duration?: number;
    permissions?: string;
}
/**
 * Represents a Discord channel with methods for sending messages and management
 */
export declare class Channel {
    readonly id: string;
    readonly type: number;
    guildId?: string;
    name?: string;
    topic?: string | null;
    nsfw?: boolean;
    position?: number;
    parentId?: string | null;
    rateLimitPerUser?: number;
    raw: ChannelData;
    private readonly client;
    constructor(client: Client, data: ChannelData);
    /**
     * Checks if this is a text channel where messages can be sent
     */
    isTextBased(): boolean;
    /**
     * Checks if this is a voice channel
     */
    isVoiceBased(): boolean;
    /**
     * Checks if this is a thread
     */
    isThread(): boolean;
    /**
     * Sends a message to this channel
     */
    send(content: string, options?: {
        tts?: boolean;
        embeds?: any[];
        allowed_mentions?: any;
        message_reference?: any;
        components?: any[];
        sticker_ids?: string[];
        files?: any[];
    }): Promise<Message>;
    /**
     * Fetches messages from this channel
     */
    fetchMessages(options?: {
        limit?: number;
        before?: string;
        after?: string;
        around?: string;
    }): Promise<Message[]>;
    /**
     * Edits this channel
     */
    edit(options: {
        name?: string;
        topic?: string;
        nsfw?: boolean;
        rate_limit_per_user?: number;
        bitrate?: number;
        user_limit?: number;
        permission_overwrites?: any[];
        parent_id?: string;
        rtc_region?: string;
        video_quality_mode?: number;
        default_auto_archive_duration?: number;
        archived?: boolean;
        auto_archive_duration?: number;
        locked?: boolean;
        invitable?: boolean;
    }): Promise<Channel>;
    /**
     * Deletes this channel
     */
    delete(reason?: string): Promise<void>;
    /**
     * Creates an invite to this channel
     */
    createInvite(options?: {
        max_age?: number;
        max_uses?: number;
        temporary?: boolean;
        unique?: boolean;
        target_type?: number;
        target_user_id?: string;
        target_application_id?: string;
    }): Promise<any>;
    /**
     * Sets the channel's permissions for a user or role
     */
    setPermissions(targetId: string, options: {
        allow?: string;
        deny?: string;
        type: 0 | 1;
    }): Promise<void>;
    /**
     * Removes permission overrides for a user or role
     */
    removePermissions(targetId: string): Promise<void>;
    /**
     * Starts typing in this channel
     */
    startTyping(): Promise<void>;
    /**
     * Pins a message in this channel
     */
    pinMessage(messageId: string): Promise<void>;
    /**
     * Unpins a message in this channel
     */
    unpinMessage(messageId: string): Promise<void>;
    /**
     * Gets all pinned messages in this channel
     */
    fetchPinnedMessages(): Promise<Message[]>;
}
//# sourceMappingURL=Channel.d.ts.map