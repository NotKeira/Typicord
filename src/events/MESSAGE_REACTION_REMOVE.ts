/**
 * MESSAGE_REACTION_REMOVE Event
 *
 * Emitted when a reaction is removed from a message.
 */

import type { MessageReactionEvent } from "@/types/gateway/events";

export class MessageReactionRemoveData {
  constructor(public data: MessageReactionEvent) {}

  /**
   * User ID who removed the reaction
   */
  get userId() {
    return this.data.user_id;
  }

  /**
   * Channel ID where the reaction was removed
   */
  get channelId() {
    return this.data.channel_id;
  }

  /**
   * Message ID that the reaction was removed from
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

  /**
   * Whether the emoji is animated
   */
  get isAnimated() {
    return this.data.emoji.animated || false;
  }
}
