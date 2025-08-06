/**
 * GUILD_MEMBER_ADD Event
 *
 * Emitted when a new member joins a guild.
 * Enhanced with Discord bot utility methods for member management.
 */

import type { GuildMember as RawGuildMember } from "@/types/structures/guild";
import { GuildMember } from "@/structures/GuildMember";
import type { RESTClient } from "@/client/RESTClient";

export interface GuildMemberAddEventData extends RawGuildMember {
  /** The guild ID where the member joined */
  guild_id: string;
}

export class GuildMemberAddData {
  private readonly _client?: RESTClient;
  private readonly _member: GuildMember;

  constructor(
    public data: GuildMemberAddEventData,
    client?: RESTClient
  ) {
    this._client = client;
    // Create GuildMember instance with full functionality
    this._member = new GuildMember(data, client);
  }

  /**
   * The guild member with full class methods
   */
  get member(): GuildMember {
    return this._member;
  }

  /**
   * Get the raw GuildMember object (for compatibility with existing code)
   */
  get rawMember(): RawGuildMember {
    return this.data;
  }

  /**
   * The user object for the member with full User class functionality
   */
  get user() {
    return this._member.user;
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
    return this._member.nickname;
  }

  /**
   * The member's guild avatar hash
   */
  get avatar() {
    return this._member.data.avatar;
  }

  /**
   * Array of role IDs the member has
   */
  get roles() {
    return this._member.roles;
  }

  /**
   * When the user joined the guild
   */
  get joinedAt() {
    return this._member.joinedAt;
  }

  /**
   * When the user started boosting the guild (if applicable)
   */
  get premiumSince() {
    return this._member.premiumSince;
  }

  /**
   * Whether the user is deafened in voice channels
   */
  get deaf() {
    return this._member.isDeafened;
  }

  /**
   * Whether the user is muted in voice channels
   */
  get mute() {
    return this._member.isMuted;
  }

  /**
   * Guild member flags represented as a bit set
   */
  get flags() {
    return this._member.flags;
  }

  /**
   * Whether the user has passed the guild's Membership Screening requirements
   */
  get pending() {
    return this._member.isPending;
  }

  /**
   * The member's display name (nickname or username)
   */
  get displayName() {
    return this._member.displayName;
  }

  // Discord bot utility methods for member management

  /**
   * Send a direct message to the new member
   */
  async dmMember(content: string, options: any = {}): Promise<any> {
    return this._member.send(content, options);
  }

  /**
   * Add a role to the new member
   */
  async addRole(roleId: string, reason?: string): Promise<void> {
    return this._member.addRole(this.guildId, roleId, reason);
  }

  /**
   * Remove a role from the member
   */
  async removeRole(roleId: string, reason?: string): Promise<void> {
    return this._member.removeRole(this.guildId, roleId, reason);
  }

  /**
   * Set the member's nickname
   */
  async setNickname(nickname: string | null, reason?: string): Promise<void> {
    await this._member.edit(this.guildId, { nick: nickname, reason });
  }

  /**
   * Timeout the member
   */
  async timeout(duration: number, reason?: string): Promise<void> {
    await this._member.timeout(this.guildId, duration, reason);
  }

  /**
   * Kick the member
   */
  async kick(reason?: string): Promise<void> {
    await this._member.kick(this.guildId, reason);
  }

  /**
   * Ban the member
   */
  async ban(reason?: string, deleteMessageDays?: number): Promise<void> {
    await this._member.ban(this.guildId, { reason, deleteMessageDays });
  }

  /**
   * Move member to a voice channel
   */
  async moveToVoiceChannel(
    channelId: string | null,
    reason?: string
  ): Promise<void> {
    await this._member.edit(this.guildId, { channel_id: channelId, reason });
  }

  /**
   * Mute/unmute member in voice
   */
  async setVoiceMute(mute: boolean, reason?: string): Promise<void> {
    await this._member.edit(this.guildId, { mute, reason });
  }

  /**
   * Deafen/undeafen member in voice
   */
  async setVoiceDeafen(deaf: boolean, reason?: string): Promise<void> {
    await this._member.edit(this.guildId, { deaf, reason });
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
    return this._member.hasRole(roleId);
  }

  /**
   * Check if member is a bot
   */
  isBot(): boolean {
    return this.user?.isBot === true;
  }

  /**
   * Check if member is boosting the server
   */
  isBoosting(): boolean {
    return this._member.premiumSince !== null;
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
