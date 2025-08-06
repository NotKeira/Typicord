import { RESTClient } from "@/client/RESTClient";
import { User } from "@/structures/User";
import type { Message as GatewayMessage } from "@/types/gateway/structures/Message";

/**
 * Message Create Event Data
 * Fired when a message is sent in a channel the bot can see
 *
 * Enhanced with Discord bot utility methods for easy message handling
 */
export class MessageCreateData {
  private readonly _client?: RESTClient;
  private readonly _author: User;

  constructor(
    public readonly message: GatewayMessage,
    client?: RESTClient
  ) {
    this._client = client;
    // Create User instance with full functionality
    this._author = new User(message.author as any, client);
  }

  // Convenience getters for common message properties
  get content(): string {
    return this.message.content;
  }

  get author(): User {
    return this._author;
  }

  get channelId(): string {
    return this.message.channel_id;
  }

  get guildId(): string | undefined {
    return this.message.guild_id;
  }

  get id(): string {
    return this.message.id;
  }

  get timestamp(): string {
    return this.message.timestamp;
  }

  get editedTimestamp(): string | null {
    return this.message.edited_timestamp;
  }

  // Discord bot utility methods

  /**
   * Reply to the message with a reference
   */
  async reply(
    content: string,
    options: {
      tts?: boolean;
      embeds?: any[];
      allowed_mentions?: any;
      components?: any[];
      sticker_ids?: string[];
      files?: Buffer[];
    } = {}
  ): Promise<GatewayMessage> {
    if (!this._client) {
      throw new Error("REST client not available for message operations");
    }

    return this._client.post(`/channels/${this.message.channel_id}/messages`, {
      content,
      message_reference: {
        message_id: this.message.id,
        channel_id: this.message.channel_id,
        guild_id: this.message.guild_id,
      },
      ...options,
    });
  }

  /**
   * Send a message to the same channel
   */
  async send(content: string, options: any = {}): Promise<GatewayMessage> {
    if (!this._client) {
      throw new Error("REST client not available for message operations");
    }

    return this._client.post(`/channels/${this.message.channel_id}/messages`, {
      content,
      ...options,
    });
  }

  /**
   * Delete the message (requires appropriate permissions)
   */
  async delete(): Promise<void> {
    if (!this._client) {
      throw new Error("REST client not available for message operations");
    }

    await this._client.delete(
      `/channels/${this.message.channel_id}/messages/${this.message.id}`
    );
  }

  /**
   * Edit the message (only if sent by the bot)
   */
  async edit(content: string): Promise<GatewayMessage> {
    if (!this._client) {
      throw new Error("REST client not available for message operations");
    }

    return this._client.patch(
      `/channels/${this.message.channel_id}/messages/${this.message.id}`,
      {
        content,
      }
    );
  }

  /**
   * React to the message with an emoji
   */
  async react(emoji: string): Promise<void> {
    if (!this._client) {
      throw new Error("REST client not available for message operations");
    }

    await this._client.put(
      `/channels/${this.message.channel_id}/messages/${this.message.id}/reactions/${encodeURIComponent(emoji)}/@me`
    );
  }

  /**
   * Pin the message to the channel
   */
  async pin(): Promise<void> {
    if (!this._client) {
      throw new Error("REST client not available for message operations");
    }

    await this._client.put(
      `/channels/${this.message.channel_id}/pins/${this.message.id}`
    );
  }

  /**
   * Unpin the message from the channel
   */
  async unpin(): Promise<void> {
    if (!this._client) {
      throw new Error("REST client not available for message operations");
    }

    await this._client.delete(
      `/channels/${this.message.channel_id}/pins/${this.message.id}`
    );
  }

  /**
   * Start a thread from this message
   */
  async startThread(
    name: string,
    options: {
      auto_archive_duration?: 60 | 1440 | 4320 | 10080;
      rate_limit_per_user?: number;
    } = {}
  ): Promise<any> {
    if (!this._client) {
      throw new Error("REST client not available for message operations");
    }

    return this._client.post(
      `/channels/${this.message.channel_id}/messages/${this.message.id}/threads`,
      { name, ...options }
    );
  }

  /**
   * Crosspost the message (for announcement channels)
   */
  async crosspost(): Promise<GatewayMessage> {
    if (!this._client) {
      throw new Error("REST client not available for message operations");
    }

    return this._client.post(
      `/channels/${this.message.channel_id}/messages/${this.message.id}/crosspost`
    );
  }

  /**
   * DM the message author
   */
  async dmAuthor(content: string): Promise<GatewayMessage> {
    if (!this._client) {
      throw new Error("REST client not available for message operations");
    }

    // First create a DM channel with the user
    const dmChannel: any = await this._client.post("/users/@me/channels", {
      recipient_id: this.message.author.id,
    });

    // Then send the message
    return this._client.post(`/channels/${dmChannel.id}/messages`, {
      content,
    });
  }

  /**
   * Timeout the message author (guild only, requires permissions)
   */
  async timeoutAuthor(duration: number, reason?: string): Promise<void> {
    if (!this._client || !this.message.guild_id) {
      throw new Error("REST client not available or not in a guild");
    }

    const timeoutUntil = new Date(Date.now() + duration * 1000).toISOString();

    await this._client.patch(
      `/guilds/${this.message.guild_id}/members/${this.message.author.id}`,
      {
        communication_disabled_until: timeoutUntil,
      },
      reason ? { "X-Audit-Log-Reason": reason } : undefined
    );
  }

  /**
   * Kick the message author (guild only, requires permissions)
   */
  async kickAuthor(reason?: string): Promise<void> {
    if (!this._client || !this.message.guild_id) {
      throw new Error("REST client not available or not in a guild");
    }

    await this._client.delete(
      `/guilds/${this.message.guild_id}/members/${this.message.author.id}`,
      reason ? { "X-Audit-Log-Reason": reason } : undefined
    );
  }

  /**
   * Ban the message author (guild only, requires permissions)
   */
  async banAuthor(reason?: string, deleteMessageDays?: number): Promise<void> {
    if (!this._client || !this.message.guild_id) {
      throw new Error("REST client not available or not in a guild");
    }

    const body: any = {};
    if (deleteMessageDays !== undefined) {
      body.delete_message_days = deleteMessageDays;
    }

    await this._client.put(
      `/guilds/${this.message.guild_id}/bans/${this.message.author.id}`,
      body,
      reason ? { "X-Audit-Log-Reason": reason } : undefined
    );
  }

  /**
   * Add a role to the message author (guild only, requires permissions)
   */
  async addRoleToAuthor(roleId: string, reason?: string): Promise<void> {
    if (!this._client || !this.message.guild_id) {
      throw new Error("REST client not available or not in a guild");
    }

    await this._client.put(
      `/guilds/${this.message.guild_id}/members/${this.message.author.id}/roles/${roleId}`,
      {},
      reason ? { "X-Audit-Log-Reason": reason } : undefined
    );
  }

  /**
   * Remove a role from the message author (guild only, requires permissions)
   */
  async removeRoleFromAuthor(roleId: string, reason?: string): Promise<void> {
    if (!this._client || !this.message.guild_id) {
      throw new Error("REST client not available or not in a guild");
    }

    await this._client.delete(
      `/guilds/${this.message.guild_id}/members/${this.message.author.id}/roles/${roleId}`,
      reason ? { "X-Audit-Log-Reason": reason } : undefined
    );
  }

  /**
   * Get the channel this message was sent in
   */
  async getChannel(): Promise<any> {
    if (!this._client) {
      throw new Error("REST client not available for message operations");
    }

    return this._client.get(`/channels/${this.message.channel_id}`);
  }

  /**
   * Get the guild this message was sent in (if applicable)
   */
  async getGuild(): Promise<any> {
    if (!this._client || !this.message.guild_id) {
      throw new Error("REST client not available or not in a guild");
    }

    return this._client.get(`/guilds/${this.message.guild_id}`);
  }

  // Utility helper methods

  /**
   * Check if the message was sent in a DM
   */
  isDM(): boolean {
    return !this.message.guild_id;
  }

  /**
   * Check if the message was sent by a bot
   */
  isFromBot(): boolean {
    return this.message.author.bot === true;
  }

  /**
   * Check if the message mentions everyone
   */
  mentionsEveryone(): boolean {
    return this.message.mention_everyone === true;
  }

  /**
   * Check if the message has attachments
   */
  hasAttachments(): boolean {
    return Boolean(
      this.message.attachments && this.message.attachments.length > 0
    );
  }

  /**
   * Check if the message has embeds
   */
  hasEmbeds(): boolean {
    return Boolean(this.message.embeds && this.message.embeds.length > 0);
  }

  /**
   * Get all user mentions in the message
   */
  getUserMentions(): any[] {
    return this.message.mentions || [];
  }

  /**
   * Check if a specific user is mentioned
   */
  userMentioned(userId: string): boolean {
    const mentions = this.getUserMentions();
    return mentions.some(user => user.id === userId);
  }

  /**
   * Get message URL for Discord client
   */
  getUrl(): string {
    const guildPart = this.message.guild_id || "@me";
    return `https://discord.com/channels/${guildPart}/${this.message.channel_id}/${this.message.id}`;
  }

  /**
   * Get creation timestamp as Date object
   */
  getCreatedAt(): Date {
    return new Date(this.message.timestamp);
  }

  /**
   * Get edit timestamp as Date object (null if never edited)
   */
  getEditedAt(): Date | null {
    return this.message.edited_timestamp
      ? new Date(this.message.edited_timestamp)
      : null;
  }
}
