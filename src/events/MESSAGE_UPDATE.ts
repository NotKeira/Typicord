/**
 * MESSAGE_UPDATE Event
 *
 * Emitted when a message is updated (edited).
 */

import type { Message } from "@/types/gateway/structures/Message";

export class MessageUpdateEventData {
  constructor(public data: Partial<Message>) {}

  /**
   * The updated message data (partial)
   */
  get message() {
    return this.data;
  }

  /**
   * Message ID
   */
  get id() {
    return this.data.id;
  }

  /**
   * Channel ID where the message was updated
   */
  get channelId() {
    return this.data.channel_id;
  }

  /**
   * Guild ID (if in a guild)
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * Updated content (if changed)
   */
  get content() {
    return this.data.content;
  }

  /**
   * Updated embeds (if changed)
   */
  get embeds() {
    return this.data.embeds;
  }
}
