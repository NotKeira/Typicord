/**
 * MESSAGE_UPDATE Event
 *
 * Emitted when a message is updated (edited).
 */

import type { Message } from "@/types/gateway/structures/Message";
import { User } from "@/structures/User";
import type { RESTClient } from "@/client/RESTClient";

export class MessageUpdateData {
  private readonly _author?: User;
  private readonly _client?: RESTClient;

  constructor(
    public data: Partial<Message>,
    client?: RESTClient
  ) {
    this._client = client;
    // Create User instance if author data exists
    if (this.data.author) {
      this._author = new User(this.data.author as any, client);
    }
  }

  /**
   * The updated message data (partial)
   */
  get message() {
    return this.data;
  }

  /**
   * The author of the message with full User class functionality
   */
  get author(): User | undefined {
    return this._author;
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
