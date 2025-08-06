/**
 * GUILD_MEMBER_ADD Event
 *
 * Emitted when a new member joins a guild.
 * Enhanced with Discord bot utility methods for member management.
 */

import type { GuildMember } from "@/structures/Guild";
import type { RESTClient } from "@/client/RESTClient";

export interface GuildMemberAddEventData extends GuildMember {
  /** The guild ID where the member joined */
  guild_id: string;
}

export class GuildMemberAddData {
  private readonly _client?: RESTClient;

  constructor(
    public data: GuildMemberAddEventData,
    client?: RESTClient
  ) {
    this._client = client;
  }

  /**
   * The guild member data
   */
  get member() {
    return this.data;
  }

  /**
   * The user object for the member
   */
  get user() {
    return this.data.user;
  }

  /**
   * The guild ID where the member joined
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * The member's nickname in the guild
   */
  get nick() {
    return this.data.nick;
  }

  /**
   * The member's guild avatar hash
   */
  get avatar() {
    return this.data.avatar;
  }

  /**
   * Array of role IDs the member has
   */
  get roles() {
    return this.data.roles;
  }

  /**
   * When the user joined the guild
   */
  get joinedAt() {
    return new Date(this.data.joined_at);
  }

  /**
   * When the user started boosting the guild (if applicable)
   */
  get premiumSince() {
    return this.data.premium_since ? new Date(this.data.premium_since) : null;
  }

  /**
   * Whether the user is deafened in voice channels
   */
  get deaf() {
    return this.data.deaf;
  }

  /**
   * Whether the user is muted in voice channels
   */
  get mute() {
    return this.data.mute;
  }

  /**
   * Guild member flags represented as a bit set
   */
  get flags() {
    return this.data.flags;
  }

  /**
   * Whether the user has passed the guild's Membership Screening requirements
   */
  get pending() {
    return this.data.pending;
  }

  /**
   * The member's display name (nickname or username)
   */
  get displayName() {
    return this.data.nick || this.data.user?.username || "Unknown User";
  }

  // Discord bot utility methods for member management

  /**
   * Send a direct message to the new member
   */
  async dmMember(content: string, options: any = {}): Promise<any> {
    if (!this._client || !this.user) {
      throw new Error("REST client not available or user data missing");
    }

    // Create DM channel
    const dmChannel: any = await this._client.post("/users/@me/channels", {
      recipient_id: this.user.id,
    });

    // Send message
    return this._client.post(`/channels/${dmChannel.id}/messages`, {
      content,
      ...options,
    });
  }

  /**
   * Add a role to the new member
   */
  async addRole(roleId: string, reason?: string): Promise<void> {
    if (!this._client || !this.user) {
      throw new Error("REST client not available or user data missing");
    }

    await this._client.put(
      `/guilds/${this.guildId}/members/${this.user.id}/roles/${roleId}`,
      {},
      reason ? { "X-Audit-Log-Reason": reason } : undefined
    );
  }

  /**
   * Remove a role from the member
   */
  async removeRole(roleId: string, reason?: string): Promise<void> {
    if (!this._client || !this.user) {
      throw new Error("REST client not available or user data missing");
    }

    await this._client.delete(
      `/guilds/${this.guildId}/members/${this.user.id}/roles/${roleId}`,
      reason ? { "X-Audit-Log-Reason": reason } : undefined
    );
  }

  /**
   * Set the member's nickname
   */
  async setNickname(nickname: string | null, reason?: string): Promise<void> {
    if (!this._client || !this.user) {
      throw new Error("REST client not available or user data missing");
    }

    await this._client.patch(
      `/guilds/${this.guildId}/members/${this.user.id}`,
      { nick: nickname },
      reason ? { "X-Audit-Log-Reason": reason } : undefined
    );
  }

  /**
   * Timeout the member
   */
  async timeout(duration: number, reason?: string): Promise<void> {
    if (!this._client || !this.user) {
      throw new Error("REST client not available or user data missing");
    }

    const timeoutUntil = new Date(Date.now() + duration * 1000).toISOString();

    await this._client.patch(
      `/guilds/${this.guildId}/members/${this.user.id}`,
      {
        communication_disabled_until: timeoutUntil,
      },
      reason ? { "X-Audit-Log-Reason": reason } : undefined
    );
  }

  /**
   * Kick the member
   */
  async kick(reason?: string): Promise<void> {
    if (!this._client || !this.user) {
      throw new Error("REST client not available or user data missing");
    }

    await this._client.delete(
      `/guilds/${this.guildId}/members/${this.user.id}`,
      reason ? { "X-Audit-Log-Reason": reason } : undefined
    );
  }

  /**
   * Ban the member
   */
  async ban(reason?: string, deleteMessageDays?: number): Promise<void> {
    if (!this._client || !this.user) {
      throw new Error("REST client not available or user data missing");
    }

    const body: any = {};
    if (deleteMessageDays !== undefined) {
      body.delete_message_days = deleteMessageDays;
    }

    await this._client.put(
      `/guilds/${this.guildId}/bans/${this.user.id}`,
      body,
      reason ? { "X-Audit-Log-Reason": reason } : undefined
    );
  }

  /**
   * Move member to a voice channel
   */
  async moveToVoiceChannel(
    channelId: string | null,
    reason?: string
  ): Promise<void> {
    if (!this._client || !this.user) {
      throw new Error("REST client not available or user data missing");
    }

    await this._client.patch(
      `/guilds/${this.guildId}/members/${this.user.id}`,
      { channel_id: channelId },
      reason ? { "X-Audit-Log-Reason": reason } : undefined
    );
  }

  /**
   * Mute/unmute member in voice
   */
  async setVoiceMute(mute: boolean, reason?: string): Promise<void> {
    if (!this._client || !this.user) {
      throw new Error("REST client not available or user data missing");
    }

    await this._client.patch(
      `/guilds/${this.guildId}/members/${this.user.id}`,
      { mute },
      reason ? { "X-Audit-Log-Reason": reason } : undefined
    );
  }

  /**
   * Deafen/undeafen member in voice
   */
  async setVoiceDeafen(deaf: boolean, reason?: string): Promise<void> {
    if (!this._client || !this.user) {
      throw new Error("REST client not available or user data missing");
    }

    await this._client.patch(
      `/guilds/${this.guildId}/members/${this.user.id}`,
      { deaf },
      reason ? { "X-Audit-Log-Reason": reason } : undefined
    );
  }

  /**
   * Get the guild this member joined
   */
  async getGuild(): Promise<any> {
    if (!this._client) {
      throw new Error("REST client not available");
    }

    return this._client.get(`/guilds/${this.guildId}`);
  }

  /**
   * Check if member has a specific role
   */
  hasRole(roleId: string): boolean {
    return this.roles.includes(roleId);
  }

  /**
   * Check if member is a bot
   */
  isBot(): boolean {
    return this.user?.bot === true;
  }

  /**
   * Check if member is boosting the server
   */
  isBoosting(): boolean {
    return !!this.data.premium_since;
  }

  /**
   * Get member's account creation date
   */
  getAccountCreatedAt(): Date {
    if (!this.user) throw new Error("User data not available");

    // Discord snowflake timestamp extraction
    const timestamp = (BigInt(this.user.id) >> 22n) + 1420070400000n;
    return new Date(Number(timestamp));
  }

  /**
   * Get how long ago the account was created
   */
  getAccountAge(): number {
    return Date.now() - this.getAccountCreatedAt().getTime();
  }
}
