import type { Client } from "@/client/Client";
import type { Message as GatewayMessage } from "@/types/gateway/structures/Message";
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
    private client;
    constructor(client: Client, data: GatewayMessage);
    /**
     * Replies to this message - creates a proper reply that shows up linked
     * @param content What you want to say back
     * @param options Additional message options
     */
    reply(content: string, options?: {
        tts?: boolean;
        embeds?: any[];
        allowed_mentions?: any;
        components?: any[];
        sticker_ids?: string[];
        files?: any[];
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
    }): Promise<any[]>;
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
    }): Promise<any>;
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