/**
 * MESSAGE_REACTION_REMOVE_EMOJI Event
 *
 * Emitted when all reactions of a specific emoji are removed from a message.
 */

export interface MessageReactionRemoveEmojiEventData {
  channel_id: string;
  message_id: string;
  emoji: { id: string | null; name: string };
  guild_id?: string;
}

export class MessageReactionRemoveEmojiData {
  constructor(public data: MessageReactionRemoveEmojiEventData) {}

  /**
   * Channel ID where the emoji reactions were removed
   */
  get channelId() {
    return this.data.channel_id;
  }

  /**
   * Message ID that had the emoji reactions removed
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

  /**
   * The emoji that was removed
   */
  get emoji() {
    return this.data.emoji;
  }

  /**
   * Whether the emoji is custom
   */
  get isCustomEmoji() {
    return this.data.emoji.id !== null;
  }
}
