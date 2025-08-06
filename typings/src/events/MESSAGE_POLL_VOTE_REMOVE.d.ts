/**
 * MESSAGE_POLL_VOTE_REMOVE Event
 *
 * Sent when a user removes their vote from a poll.
 */
export interface MessagePollVoteRemoveEventData {
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
export declare class MessagePollVoteRemoveData {
    data: MessagePollVoteRemoveEventData;
    constructor(data: MessagePollVoteRemoveEventData);
    /**
     * The user who removed their vote
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
     * The answer ID that the vote was removed from
     */
    get answerId(): number;
    /**
     * Whether this vote removal was in a guild
     */
    get isInGuild(): boolean;
    /**
     * Whether this vote removal was in a DM
     */
    get isInDM(): boolean;
}
//# sourceMappingURL=MESSAGE_POLL_VOTE_REMOVE.d.ts.map