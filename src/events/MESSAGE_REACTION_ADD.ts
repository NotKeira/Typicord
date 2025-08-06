/**
 * MESSAGE_REACTION_ADD Event
 *
 * Emitted when a reaction is added to a message.
 */

import type { MessageReactionEvent } from "@/types/gateway/events";

export class MessageReactionAddData {
  constructor(public data: MessageReactionEvent) {}

  /**
   * User ID who added the reaction
   */
  get userId() {
    return this.data.user_id;
  }

  /**
   * Channel ID where the reaction was added
   */
  get channelId() {
    return this.data.channel_id;
  }

  /**
   * Message ID that was reacted to
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
   * Guild member (if in a guild)
   */
  get member() {
    return this.data.member;
  }

  /**
   * The emoji used for the reaction
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

  /**
   * Whether the emoji is animated
   */
  get isAnimated() {
    return this.data.emoji.animated || false;
  }
}
