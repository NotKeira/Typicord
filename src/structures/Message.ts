import type { Client } from "@/client/Client";
import type { Message as GatewayMessage } from "@/types/gateway/structures/Message";
import type { Emoji } from "./Emoji";
// import type { Emoji as GatewayEmoji } from "@/types/gateway/structures/Emoji";

/**
 * Represents a Discord message and provides helper methods for common actions.
 */
export class Message {
  public id: string;
  public channelId: string;
  public channel_id: string; // Required to match MessageCreateEvent interface
  public guildId?: string;
  public content: string;
  public author: GatewayMessage["author"];
  public raw: GatewayMessage;
  public timestamp: string;
  public editedTimestamp: string | null;
  public edited_timestamp: string | null; // Required to match MessageCreateEvent interface
  private client: Client;

  constructor(client: Client, data: GatewayMessage) {
    this.client = client;
    this.id = data.id;
    this.channelId = data.channel_id;
    this.channel_id = data.channel_id;
    this.guildId = data.guild_id;
    this.content = data.content;
    this.author = data.author;
    this.raw = data;
    this.timestamp = data.timestamp;
    this.editedTimestamp = data.edited_timestamp || null;
    this.edited_timestamp = data.edited_timestamp || null;
  }

  /**
   * Reply to this message.
   * @param content The reply content
   */
  public async reply(content: string): Promise<Message> {
    return this.client.sendMessage(this.channelId, content, {
      message_reference: { message_id: this.id },
    });
  }

  /**
   * Edit this message.
   * @param content The new content
   */
  public async edit(content: string): Promise<Message> {
    const data = await this.client.rest.patch(
      `/channels/${this.channelId}/messages/${this.id}`,
      { content }
    );
    return new Message(this.client, data);
  }

  /**
   * Delete this message.
   */
  public async delete(): Promise<void> {
    await this.client.rest.delete(
      `/channels/${this.channelId}/messages/${this.id}`
    );
    return;
  }

  /**
   * React to this message with an emoji.
   * @param emoji The emoji to react with
   */
  public async react(emoji: string) {
    await this.client.rest.put(
      `/channels/${this.channelId}/messages/${
        this.id
      }/reactions/${encodeURIComponent(emoji)}/@me`
    );
    return;
  }
}
