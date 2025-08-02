/**
 * MESSAGE_REACTION_REMOVE_ALL Event
 *
 * Emitted when all reactions are removed from a message.
 */

export interface MessageReactionRemoveAllData {
  channel_id: string;
  message_id: string;
  guild_id?: string;
}

export class MessageReactionRemoveAllEventData {
  constructor(public data: MessageReactionRemoveAllData) {}

  /**
   * Channel ID where all reactions were removed
   */
  get channelId() {
    return this.data.channel_id;
  }

  /**
   * Message ID that had all reactions removed
   */
  get messageId() {
    return this.data.message_id;
  }

  /**
   * Guild ID (if in a guild)
   */
  get guildId() {
    return this.data.guild_id;
  }
}
