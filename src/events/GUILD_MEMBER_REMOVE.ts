/**
 * GUILD_MEMBER_REMOVE Event
 *
 * Emitted when a member leaves a guild (kicked, banned, or left voluntarily).
 * Enhanced with Discord bot utility methods for logging and response.
 */

import type { User } from "@/types/structures/user";
import type { RESTClient } from "@/client/RESTClient";

export interface GuildMemberRemoveEventData {
  /** The guild ID where the member was removed */
  guild_id: string;
  /** The user that was removed */
  user: User;
}

export class GuildMemberRemoveData {
  private readonly _client?: RESTClient;

  constructor(
    public data: GuildMemberRemoveEventData,
    client?: RESTClient
  ) {
    this._client = client;
  }

  /**
   * The user that was removed from the guild
   */
  get user() {
    return this.data.user;
  }

  /**
   * The guild ID where the member was removed
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * The user's ID
   */
  get userId() {
    return this.data.user.id;
  }

  /**
   * The user's username
   */
  get username() {
    return this.data.user.username;
  }

  /**
   * The user's discriminator
   */
  get discriminator() {
    return this.data.user.discriminator;
  }

  /**
   * The user's display name
   */
  get displayName() {
    return this.data.user.global_name || this.data.user.username;
  }

  /**
   * The user's avatar hash
   */
  get avatar() {
    return this.data.user.avatar;
  }

  /**
   * Whether the user is a bot
   */
  get isBot() {
    return this.data.user.bot || false;
  }

  /**
   * The user's tag (username#discriminator)
   */
  get tag() {
    return `${this.data.user.username}#${this.data.user.discriminator}`;
  }

  // Discord bot utility methods

  /**
   * Send a log message to a specific channel about the member leaving
   */
  async logToChannel(
    channelId: string,
    message: string,
    options: any = {}
  ): Promise<any> {
    if (!this._client) {
      throw new Error("REST client not available for message operations");
    }

    return this._client.post(`/channels/${channelId}/messages`, {
      content: message,
      ...options,
    });
  }

  /**
   * Try to send a DM to the user (will fail if they left voluntarily and have DMs disabled)
   */
  async tryDmUser(content: string, options: any = {}): Promise<any> {
    if (!this._client) {
      throw new Error("REST client not available for message operations");
    }

    try {
      // Create DM channel
      const dmChannel: any = await this._client.post("/users/@me/channels", {
        recipient_id: this.data.user.id,
      });

      // Send message
      return await this._client.post(`/channels/${dmChannel.id}/messages`, {
        content,
        ...options,
      });
    } catch {
      // User probably has DMs disabled or blocked the bot
      return null;
    }
  }

  /**
   * Check if the user is banned from the guild
   */
  async checkIfBanned(): Promise<boolean> {
    if (!this._client) {
      throw new Error("REST client not available");
    }

    try {
      await this._client.get(`/guilds/${this.guildId}/bans/${this.userId}`);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get the guild this member was removed from
   */
  async getGuild(): Promise<any> {
    if (!this._client) {
      throw new Error("REST client not available");
    }

    return this._client.get(`/guilds/${this.guildId}`);
  }

  /**
   * Get audit log entries to understand why the member was removed
   */
  async getAuditLogs(limit: number = 10): Promise<any> {
    if (!this._client) {
      throw new Error("REST client not available");
    }

    return this._client.get(
      `/guilds/${this.guildId}/audit-logs?action_type=20&limit=${limit}`
    );
  }

  /**
   * Get member's account creation date
   */
  getAccountCreatedAt(): Date {
    // Discord snowflake timestamp extraction
    const timestamp = (BigInt(this.data.user.id) >> 22n) + 1420070400000n;
    return new Date(Number(timestamp));
  }

  /**
   * Get how long ago the account was created
   */
  getAccountAge(): number {
    return Date.now() - this.getAccountCreatedAt().getTime();
  }

  /**
   * Get user's avatar URL
   */
  getAvatarUrl(size: number = 256): string {
    if (!this.data.user.avatar) {
      // Default avatar
      const defaultAvatarNumber = parseInt(this.data.user.discriminator) % 5;
      return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
    }

    const format = this.data.user.avatar.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/avatars/${this.data.user.id}/${this.data.user.avatar}.${format}?size=${size}`;
  }

  /**
   * Create a formatted mention string for the user
   */
  getMention(): string {
    return `<@${this.data.user.id}>`;
  }
}
