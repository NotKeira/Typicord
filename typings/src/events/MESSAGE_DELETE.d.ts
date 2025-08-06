/**
 * MESSAGE_DELETE Event
 *
 * Emitted when a message is deleted.
 */
export interface MessageDeleteEventData {
    id: string;
    channel_id: string;
    guild_id?: string;
}
export declare class MessageDeleteData {
    data: MessageDeleteEventData;
    constructor(data: MessageDeleteEventData);
    /**
     * The ID of the deleted message
     */
    get messageId(): string;
    /**
     * The channel ID where the message was deleted
     */
    get channelId(): string;
    /**
     * The guild ID (if in a guild)
     */
    get guildId(): string | undefined;
}
//# sourceMappingURL=MESSAGE_DELETE.d.ts.map