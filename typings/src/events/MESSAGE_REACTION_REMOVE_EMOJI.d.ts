/**
 * MESSAGE_REACTION_REMOVE_EMOJI Event
 *
 * Emitted when all reactions of a specific emoji are removed from a message.
 */
export interface MessageReactionRemoveEmojiEventData {
    channel_id: string;
    message_id: string;
    emoji: {
        id: string | null;
        name: string;
    };
    guild_id?: string;
}
export declare class MessageReactionRemoveEmojiData {
    data: MessageReactionRemoveEmojiEventData;
    constructor(data: MessageReactionRemoveEmojiEventData);
    /**
     * Channel ID where the emoji reactions were removed
     */
    get channelId(): string;
    /**
     * Message ID that had the emoji reactions removed
     */
    get messageId(): string;
    /**
     * Guild ID (if in a guild)
     */
    get guildId(): string | undefined;
    /**
     * The emoji that was removed
     */
    get emoji(): {
        id: string | null;
        name: string;
    };
    /**
     * Whether the emoji is custom
     */
    get isCustomEmoji(): boolean;
}
//# sourceMappingURL=MESSAGE_REACTION_REMOVE_EMOJI.d.ts.map