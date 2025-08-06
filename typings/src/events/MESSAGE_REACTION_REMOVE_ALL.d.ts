/**
 * MESSAGE_REACTION_REMOVE_ALL Event
 *
 * Emitted when all reactions are removed from a message.
 */
export interface MessageReactionRemoveAllEventData {
    channel_id: string;
    message_id: string;
    guild_id?: string;
}
export declare class MessageReactionRemoveAllData {
    data: MessageReactionRemoveAllEventData;
    constructor(data: MessageReactionRemoveAllEventData);
    /**
     * Channel ID where all reactions were removed
     */
    get channelId(): string;
    /**
     * Message ID that had all reactions removed
     */
    get messageId(): string;
    /**
     * Guild ID (if in a guild)
     */
    get guildId(): string | undefined;
}
//# sourceMappingURL=MESSAGE_REACTION_REMOVE_ALL.d.ts.map