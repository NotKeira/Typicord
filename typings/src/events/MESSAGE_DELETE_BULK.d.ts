/**
 * MESSAGE_DELETE_BULK Event
 *
 * Sent when multiple messages are deleted at once.
 */
export interface MessageDeleteBulkEventData {
    /** IDs of the deleted messages */
    ids: string[];
    /** ID of the channel */
    channel_id: string;
    /** ID of the guild */
    guild_id?: string;
}
export declare class MessageDeleteBulkData {
    data: MessageDeleteBulkEventData;
    constructor(data: MessageDeleteBulkEventData);
    /**
     * Array of deleted message IDs
     */
    get messageIds(): string[];
    /**
     * The channel ID where messages were deleted
     */
    get channelId(): string;
    /**
     * The guild ID where messages were deleted
     */
    get guildId(): string | undefined;
    /**
     * Number of messages that were deleted
     */
    get count(): number;
}
//# sourceMappingURL=MESSAGE_DELETE_BULK.d.ts.map