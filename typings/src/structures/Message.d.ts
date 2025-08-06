import type { Client } from "@/client/Client";
import type { Message as GatewayMessage } from "@/types/gateway/structures/Message";
import type { Embed, MessageComponent } from "@/types/structures/message";
import type { AllowedMentions } from "@/types/structures/rest";
import type { User } from "@/types/structures/user";
import type { Channel } from "@/types/structures/channel";
/**
 * Message reference information
 */
export interface MessageReference {
    /** ID of the originating message */
    message_id?: string;
    /** ID of the originating message's channel */
    channel_id?: string;
    /** ID of the originating message's guild */
    guild_id?: string;
    /** When sending, whether to error if the referenced message doesn't exist instead of sending as a normal (non-reply) message */
    fail_if_not_exists?: boolean;
}
/**
 * Message activity information
 */
export interface MessageActivity {
    /** Type of message activity */
    type: number;
    /** Party_id from a Rich Presence event */
    party_id?: string;
}
/**
 * Message attachment information
 */
export interface Attachment {
    /** Attachment id */
    id: string;
    /** Name of file attached */
    filename: string;
    /** Description for the file */
    description?: string;
    /** The attachment's media type */
    content_type?: string;
    /** Size of file in bytes */
    size: number;
    /** Source url of file */
    url: string;
    /** A proxied url of file */
    proxy_url: string;
    /** Height of file (if image) */
    height?: number | null;
    /** Width of file (if image) */
    width?: number | null;
    /** Whether this attachment is ephemeral */
    ephemeral?: boolean;
}
/**
 * Message type enumeration
 */
export declare enum MessageType {
    DEFAULT = 0,
    RECIPIENT_ADD = 1,
    RECIPIENT_REMOVE = 2,
    CALL = 3,
    CHANNEL_NAME_CHANGE = 4,
    CHANNEL_ICON_CHANGE = 5,
    CHANNEL_PINNED_MESSAGE = 6,
    USER_JOIN = 7,
    GUILD_BOOST = 8,
    GUILD_BOOST_TIER_1 = 9,
    GUILD_BOOST_TIER_2 = 10,
    GUILD_BOOST_TIER_3 = 11,
    CHANNEL_FOLLOW_ADD = 12,
    GUILD_DISCOVERY_DISQUALIFIED = 14,
    GUILD_DISCOVERY_REQUALIFIED = 15,
    GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING = 16,
    GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING = 17,
    THREAD_CREATED = 18,
    REPLY = 19,
    CHAT_INPUT_COMMAND = 20,
    THREAD_STARTER_MESSAGE = 21,
    GUILD_INVITE_REMINDER = 22,
    CONTEXT_MENU_COMMAND = 23,
    AUTO_MODERATION_ACTION = 24
}
/**
 * Represents a Discord message with helper methods for doing stuff with it
 * Like replying, editing, deleting, reacting - all the good message things!
 */
export declare class Message {
    id: string;
    channelId: string;
    channel_id: string;
    guildId?: string;
    content: string;
    author: GatewayMessage["author"];
    raw: GatewayMessage;
    timestamp: string;
    editedTimestamp: string | null;
    edited_timestamp: string | null;
    private readonly client;
    constructor(client: Client, data: GatewayMessage);
    /**
     * Replies to this message - creates a proper reply that shows up linked
     * @param content What you want to say back
     * @param options Additional message options
     */
    reply(content: string, options?: {
        tts?: boolean;
        embeds?: Embed[];
        allowed_mentions?: AllowedMentions;
        components?: MessageComponent[];
        sticker_ids?: string[];
        files?: Buffer[];
    }): Promise<Message>;
    /**
     * Edits this message to say something different
     * @param content The new content for the message
     */
    edit(content: string): Promise<Message>;
    /**
     * Deletes this message - poof, it's gone!
     */
    delete(): Promise<void>;
    /**
     * Reacts to this message with an emoji
     * @param emoji The emoji to react with (can be unicode or custom emoji format)
     */
    react(emoji: string): Promise<void>;
    /**
     * Removes a reaction from this message
     * @param emoji The emoji reaction to remove
     * @param userId The user ID whose reaction to remove (defaults to bot)
     */
    removeReaction(emoji: string, userId?: string): Promise<void>;
    /**
     * Removes all reactions from this message
     */
    removeAllReactions(): Promise<void>;
    /**
     * Removes all reactions of a specific emoji from this message
     * @param emoji The emoji to remove all reactions for
     */
    removeAllReactionsForEmoji(emoji: string): Promise<void>;
    /**
     * Fetches users who reacted with a specific emoji
     * @param emoji The emoji to get reactions for
     * @param options Pagination options
     */
    fetchReactions(emoji: string, options?: {
        after?: string;
        limit?: number;
    }): Promise<User[]>;
    /**
     * Pins this message to the channel
     */
    pin(): Promise<void>;
    /**
     * Unpins this message from the channel
     */
    unpin(): Promise<void>;
    /**
     * Crosspost this message (for announcement channels)
     */
    crosspost(): Promise<Message>;
    /**
     * Creates a thread from this message
     * @param name The name of the thread
     * @param options Thread options
     */
    startThread(name: string, options?: {
        auto_archive_duration?: 60 | 1440 | 4320 | 10080;
        rate_limit_per_user?: number;
    }): Promise<Channel>;
    /**
     * Checks if this message was sent by the bot
     */
    get isFromBot(): boolean;
    /**
     * Gets the URL to this message
     */
    get url(): string;
    /**
     * Gets the creation timestamp as a Date object
     */
    get createdAt(): Date;
    /**
     * Gets the edit timestamp as a Date object (null if never edited)
     */
    get editedAt(): Date | null;
}
//# sourceMappingURL=Message.d.ts.map