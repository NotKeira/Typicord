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

export class MessagePollVoteRemoveData {
  constructor(public data: MessagePollVoteRemoveEventData) {}

  /**
   * The user who removed their vote
   */
  get userId() {
    return this.data.user_id;
  }

  /**
   * The channel where the poll is
   */
  get channelId() {
    return this.data.channel_id;
  }

  /**
   * The message containing the poll
   */
  get messageId() {
    return this.data.message_id;
  }

  /**
   * The guild ID (if in a guild)
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * The answer ID that the vote was removed from
   */
  get answerId() {
    return this.data.answer_id;
  }

  /**
   * Whether this vote removal was in a guild
   */
  get isInGuild() {
    return !!this.data.guild_id;
  }

  /**
   * Whether this vote removal was in a DM
   */
  get isInDM() {
    return !this.data.guild_id;
  }
}
