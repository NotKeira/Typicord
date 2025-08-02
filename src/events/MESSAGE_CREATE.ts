/**
 * MESSAGE_CREATE Event
 *
 * Emitted when a new message is created in a channel the bot can see.
 */

import type { Message } from "@/structures/Message";

export class MessageCreateEventData {
  constructor(public message: Message) {}

  /**
   * The message that was created
   */
  get data() {
    return this.message;
  }

  /**
   * Quick access to message content
   */
  get content() {
    return this.message.content;
  }

  /**
   * Quick access to message author
   */
  get author() {
    return this.message.author;
  }

  /**
   * Quick access to channel ID
   */
  get channelId() {
    return this.message.channelId;
  }

  /**
   * Quick access to guild ID (if in a guild)
   */
  get guildId() {
    return this.message.guildId;
  }
}
