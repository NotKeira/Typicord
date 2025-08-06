import type { GuildMember as RawGuildMember } from "../types/structures/guild";
import { User } from "./User";
import type { RESTClient } from "@/client/RESTClient";

export class GuildMember {
  private readonly _client?: RESTClient;
  private readonly _user?: User;

  constructor(
    public data: RawGuildMember,
    client?: RESTClient
  ) {
    this._client = client;
    // Create User instance from raw user data if it exists
    if (this.data.user) {
      this._user = new User(this.data.user, client);
    }
  }

  /**
   * The user this guild member represents with full functionality
   */
  get user(): User | undefined {
    return this._user;
  }

  /**
   * Raw member data without User class methods (for compatibility)
   */
  get rawMember(): RawGuildMember {
    return this.data;
  }

  get id(): string | undefined {
    return this.data.user?.id;
  }

  get nickname(): string | null | undefined {
    return this.data.nick;
  }

  get displayName(): string {
    return this.data.nick || this.data.user?.username || "Unknown User";
  }

  get joinedAt(): Date {
    return new Date(this.data.joined_at);
  }

  get premiumSince(): Date | null {
    return this.data.premium_since ? new Date(this.data.premium_since) : null;
  }

  get roles(): string[] {
    return this.data.roles;
  }

  get isDeafened(): boolean {
    return this.data.deaf;
  }

  get isMuted(): boolean {
    return this.data.mute;
  }

  get flags(): number {
    return this.data.flags;
  }

  get isPending(): boolean {
    return this.data.pending === true;
  }

  get permissions(): string | undefined {
    return this.data.permissions;
  }

  get communicationDisabledUntil(): Date | null {
    return this.data.communication_disabled_until
      ? new Date(this.data.communication_disabled_until)
      : null;
  }

  get isTimedOut(): boolean {
    if (!this.data.communication_disabled_until) return false;
    return new Date(this.data.communication_disabled_until) > new Date();
  }

  /**
   * Get the member's avatar URL for this guild
   */
  get avatarURL(): string | null {
    if (this.data.avatar && this.data.user?.id) {
      return `https://cdn.discordapp.com/guilds/${this.data.user.id}/users/${this.data.user.id}/avatars/${this.data.avatar}.png`;
    }
    // Fall back to user's global avatar
    return this._user?.avatarURL || null;
  }

  /**
   * Get the member's display avatar URL (guild avatar, user avatar, or default)
   */
  get displayAvatarURL(): string {
    return (
      this.avatarURL ||
      this._user?.displayAvatarURL ||
      `https://cdn.discordapp.com/embed/avatars/0.png`
    );
  }

  /**
   * Get mention string for this member
   */
  get mention(): string {
    return this.data.user?.id ? `<@${this.data.user.id}>` : "@unknown";
  }

  /**
   * Get nickname mention (if they have a nickname)
   */
  get nicknameMention(): string {
    return this.data.user?.id ? `<@!${this.data.user.id}>` : "@unknown";
  }

  /**
   * Check if member has a specific role
   */
  hasRole(roleId: string): boolean {
    return this.data.roles.includes(roleId);
  }

  /**
   * Ban this member from the guild
   */
  async ban(
    guildId: string,
    options: { reason?: string; deleteMessageDays?: number } = {}
  ): Promise<void> {
    if (!this._client || !this.data.user?.id) {
      throw new Error("REST client or user ID not available");
    }

    const params = new URLSearchParams();
    if (options.deleteMessageDays) {
      params.append(
        "delete_message_days",
        options.deleteMessageDays.toString()
      );
    }

    await this._client.put(
      `/guilds/${guildId}/bans/${this.data.user.id}?${params}`,
      {
        reason: options.reason,
      }
    );
  }

  /**
   * Kick this member from the guild
   */
  async kick(guildId: string, reason?: string): Promise<void> {
    if (!this._client || !this.data.user?.id) {
      throw new Error("REST client or user ID not available");
    }

    await this._client.delete(
      `/guilds/${guildId}/members/${this.data.user.id}`,
      reason ? { reason } : {}
    );
  }

  /**
   * Timeout this member
   */
  async timeout(
    guildId: string,
    duration: number,
    reason?: string
  ): Promise<GuildMember> {
    if (!this._client || !this.data.user?.id) {
      throw new Error("REST client or user ID not available");
    }

    const timeoutUntil = new Date(Date.now() + duration).toISOString();

    const updatedMember = await this._client.patch<RawGuildMember>(
      `/guilds/${guildId}/members/${this.data.user.id}`,
      {
        communication_disabled_until: timeoutUntil,
        reason,
      }
    );

    return new GuildMember(updatedMember, this._client);
  }

  /**
   * Remove timeout from this member
   */
  async removeTimeout(guildId: string, reason?: string): Promise<GuildMember> {
    if (!this._client || !this.data.user?.id) {
      throw new Error("REST client or user ID not available");
    }

    const updatedMember = await this._client.patch<RawGuildMember>(
      `/guilds/${guildId}/members/${this.data.user.id}`,
      {
        communication_disabled_until: null,
        reason,
      }
    );

    return new GuildMember(updatedMember, this._client);
  }

  /**
   * Add a role to this member
   */
  async addRole(
    guildId: string,
    roleId: string,
    reason?: string
  ): Promise<void> {
    if (!this._client || !this.data.user?.id) {
      throw new Error("REST client or user ID not available");
    }

    await this._client.put(
      `/guilds/${guildId}/members/${this.data.user.id}/roles/${roleId}`,
      reason ? { reason } : {}
    );
  }

  /**
   * Remove a role from this member
   */
  async removeRole(
    guildId: string,
    roleId: string,
    reason?: string
  ): Promise<void> {
    if (!this._client || !this.data.user?.id) {
      throw new Error("REST client or user ID not available");
    }

    await this._client.delete(
      `/guilds/${guildId}/members/${this.data.user.id}/roles/${roleId}`,
      reason ? { reason } : {}
    );
  }

  /**
   * Edit this member's properties
   */
  async edit(
    guildId: string,
    options: {
      nick?: string | null;
      roles?: string[];
      mute?: boolean;
      deaf?: boolean;
      channel_id?: string | null;
      communication_disabled_until?: string | null;
      reason?: string;
    }
  ): Promise<GuildMember> {
    if (!this._client || !this.data.user?.id) {
      throw new Error("REST client or user ID not available");
    }

    const updatedMember = await this._client.patch<RawGuildMember>(
      `/guilds/${guildId}/members/${this.data.user.id}`,
      {
        ...options,
        reason: undefined, // Remove reason from body, it should be in headers
      }
    );

    return new GuildMember(updatedMember, this._client);
  }

  /**
   * Send a direct message to this member
   */
  async send(content: string, options: any = {}): Promise<any> {
    if (!this._user) {
      throw new Error("User not available");
    }
    return this._user.send(content, options);
  }

  /**
   * Convert to JSON representation
   */
  toJSON(): RawGuildMember {
    return { ...this.data };
  }

  /**
   * String representation
   */
  toString(): string {
    return this.mention;
  }

  /**
   * Value representation
   */
  valueOf(): string {
    return this.data.user?.id || "unknown";
  }
}
