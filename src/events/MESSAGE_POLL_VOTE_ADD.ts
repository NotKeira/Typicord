/**
 * MESSAGE_POLL_VOTE_ADD Event
 *
 * Sent when a user votes on a poll.
 */

export interface MessagePollVoteAddData {
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

export class MessagePollVoteAddEventData {
  constructor(public data: MessagePollVoteAddData) {}

  /**
   * The user who voted
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
   * The answer ID that was voted for
   */
  get answerId() {
    return this.data.answer_id;
  }

  /**
   * Whether this vote was in a guild
   */
  get isInGuild() {
    return !!this.data.guild_id;
  }

  /**
   * Whether this vote was in a DM
   */
  get isInDM() {
    return !this.data.guild_id;
  }
}
