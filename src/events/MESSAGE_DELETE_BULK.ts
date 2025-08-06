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

export class MessageDeleteBulkData {
  constructor(public data: MessageDeleteBulkEventData) {}

  /**
   * Array of deleted message IDs
   */
  get messageIds() {
    return this.data.ids;
  }

  /**
   * The channel ID where messages were deleted
   */
  get channelId() {
    return this.data.channel_id;
  }

  /**
   * The guild ID where messages were deleted
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * Number of messages that were deleted
   */
  get count() {
    return this.data.ids.length;
  }
}
