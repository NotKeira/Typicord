/**
 * MESSAGE_POLL_VOTE_ADD Event
 *
 * Sent when a user votes on a poll.
 */
export interface MessagePollVoteAddEventData {
    /** The id of the user */
    user_id: string;
    /** The id of the channel */
    channel_id: string;
    /** The id of the message */
    message_id: string;
    /** The id of the guild */
    guild_id?: string;
    /** The id of the answer */
    answer_id: number;
}
export declare class MessagePollVoteAddData {
    data: MessagePollVoteAddEventData;
    constructor(data: MessagePollVoteAddEventData);
    /**
     * The user who voted
     */
    get userId(): string;
    /**
     * The channel where the poll is
     */
    get channelId(): string;
    /**
     * The message containing the poll
     */
    get messageId(): string;
    /**
     * The guild ID (if in a guild)
     */
    get guildId(): string | undefined;
    /**
     * The answer ID that was voted for
     */
    get answerId(): number;
    /**
     * Whether this vote was in a guild
     */
    get isInGuild(): boolean;
    /**
     * Whether this vote was in a DM
     */
    get isInDM(): boolean;
}
//# sourceMappingURL=MESSAGE_POLL_VOTE_ADD.d.ts.map