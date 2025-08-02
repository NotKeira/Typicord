/**
 * MESSAGE_DELETE Event
 *
 * Emitted when a message is deleted.
 */

export interface MessageDeleteData {
  id: string;
  channel_id: string;
  guild_id?: string;
}

export class MessageDeleteEventData {
  constructor(public data: MessageDeleteData) {}

  /**
   * The ID of the deleted message
   */
  get messageId() {
    return this.data.id;
  }

  /**
   * The channel ID where the message was deleted
   */
  get channelId() {
    return this.data.channel_id;
  }

  /**
   * The guild ID (if in a guild)
   */
  get guildId() {
    return this.data.guild_id;
  }
}
