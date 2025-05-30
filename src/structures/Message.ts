import type { Client } from "@/client/Client";
import type { Message as GatewayMessage } from "@/types/gateway/structures/Message";
import type { Emoji } from "./Emoji";
import type { Emoji as GatewayEmoji } from "@/types/gateway/structures/Emoji";

export class Message {
  public id: string;
  public channelId: string;
  public guildId?: string;
  public content: string;
  public author: GatewayMessage["author"];
  public raw: GatewayMessage;
  public timestamp: string;
  public editedTimestamp: string | null;
  private client: Client;

  constructor(client: Client, data: GatewayMessage) {
    this.client = client;
    this.id = data.id;
    this.channelId = data.channel_id;
    this.guildId = data.guild_id;
    this.content = data.content;
    this.author = data.author;
    this.raw = data;
    this.timestamp = data.timestamp;
    this.editedTimestamp = data.edited_timestamp || null;
  }

  async reply(content: string): Promise<Message> {
    return this.client.sendMessage(this.channelId, content, {
      message_reference: { message_id: this.id },
    });
  }

  async delete(): Promise<void> {
    const url = `https://discord.com/api/v10/channels/${this.channelId}/messages/${this.id}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${this.client.token}`,
      },
    });
    if (!res.ok) throw new Error(`Failed to delete message: ${res.statusText}`);
    return;
  }

  async react(emoji: string) {
    const url = `https://discord.com/api/v10/channels/${
      this.channelId
    }/messages/${this.id}/reactions/${encodeURIComponent(emoji)}/@me`;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${this.client.token}`,
      },
    });
    if (!res.ok)
      throw new Error(`Failed to react to message: ${res.statusText}`);
    return;
  }
}
