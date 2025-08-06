import { RESTClient } from "@/client/RESTClient";
import { User } from "@/structures/User";
import type { Message as GatewayMessage } from "@/types/gateway/structures/Message";
/**
 * Message Create Event Data
 * Fired when a message is sent in a channel the bot can see
 *
 * Enhanced with Discord bot utility methods for easy message handling
 */
export declare class MessageCreateData {
    readonly message: GatewayMessage;
    private readonly _client?;
    private readonly _author;
    constructor(message: GatewayMessage, client?: RESTClient);
    get content(): string;
    get author(): User;
    get channelId(): string;
    get guildId(): string | undefined;
    get id(): string;
    get timestamp(): string;
    get editedTimestamp(): string | null;
    /**
     * Reply to the message with a reference
     */
    reply(content: string, options?: {
        tts?: boolean;
        embeds?: any[];
        allowed_mentions?: any;
        components?: any[];
        sticker_ids?: string[];
        files?: Buffer[];
    }): Promise<GatewayMessage>;
    /**
     * Send a message to the same channel
     */
    send(content: string, options?: any): Promise<GatewayMessage>;
    /**
     * Delete the message (requires appropriate permissions)
     */
    delete(): Promise<void>;
    /**
     * Edit the message (only if sent by the bot)
     */
    edit(content: string): Promise<GatewayMessage>;
    /**
     * React to the message with an emoji
     */
    react(emoji: string): Promise<void>;
    /**
     * Pin the message to the channel
     */
    pin(): Promise<void>;
    /**
     * Unpin the message from the channel
     */
    unpin(): Promise<void>;
    /**
     * Start a thread from this message
     */
    startThread(name: string, options?: {
        auto_archive_duration?: 60 | 1440 | 4320 | 10080;
        rate_limit_per_user?: number;
    }): Promise<any>;
    /**
     * Crosspost the message (for announcement channels)
     */
    crosspost(): Promise<GatewayMessage>;
    /**
     * DM the message author
     */
    dmAuthor(content: string): Promise<GatewayMessage>;
    /**
     * Timeout the message author (guild only, requires permissions)
     */
    timeoutAuthor(duration: number, reason?: string): Promise<void>;
    /**
     * Kick the message author (guild only, requires permissions)
     */
    kickAuthor(reason?: string): Promise<void>;
    /**
     * Ban the message author (guild only, requires permissions)
     */
    banAuthor(reason?: string, deleteMessageDays?: number): Promise<void>;
    /**
     * Add a role to the message author (guild only, requires permissions)
     */
    addRoleToAuthor(roleId: string, reason?: string): Promise<void>;
    /**
     * Remove a role from the message author (guild only, requires permissions)
     */
    removeRoleFromAuthor(roleId: string, reason?: string): Promise<void>;
    /**
     * Get the channel this message was sent in
     */
    getChannel(): Promise<any>;
    /**
     * Get the guild this message was sent in (if applicable)
     */
    getGuild(): Promise<any>;
    /**
     * Check if the message was sent in a DM
     */
    isDM(): boolean;
    /**
     * Check if the message was sent by a bot
     */
    isFromBot(): boolean;
    /**
     * Check if the message mentions everyone
     */
    mentionsEveryone(): boolean;
    /**
     * Check if the message has attachments
     */
    hasAttachments(): boolean;
    /**
     * Check if the message has embeds
     */
    hasEmbeds(): boolean;
    /**
     * Get all user mentions in the message
     */
    getUserMentions(): any[];
    /**
     * Check if a specific user is mentioned
     */
    userMentioned(userId: string): boolean;
    /**
     * Get message URL for Discord client
     */
    getUrl(): string;
    /**
     * Get creation timestamp as Date object
     */
    getCreatedAt(): Date;
    /**
     * Get edit timestamp as Date object (null if never edited)
     */
    getEditedAt(): Date | null;
}
//# sourceMappingURL=MESSAGE_CREATE.d.ts.map