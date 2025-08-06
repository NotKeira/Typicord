import type { User as RawUser } from "../types/structures/user";
import type { RESTClient } from "@/client/RESTClient";

/**
 * Represents a partial user object
 */
export interface PartialUser {
  /** The user's ID */
  id: string;
  /** The user's username */
  username?: string;
  /** The user's 4-digit discord-tag */
  discriminator?: string;
  /** The user's display name */
  global_name?: string | null;
  /** The user's avatar hash */
  avatar?: string | null;
}

export class User {
  private readonly _client?: RESTClient;

  constructor(
    public data: RawUser,
    client?: RESTClient
  ) {
    this._client = client;
  }

  get name(): string {
    return this.data.username;
  }

  get discriminator(): string {
    return this.data.discriminator;
  }

  get id(): string {
    return this.data.id;
  }

  get tag(): string {
    return `${this.name}#${this.discriminator}`;
  }

  get mention(): string {
    return `<@${this.id}>`;
  }

  get isSystem(): boolean {
    return this.data.system === true;
  }

  get isVerified(): boolean {
    return this.data.verified === true;
  }

  get isMFAEnabled(): boolean {
    return this.data.mfa_enabled === true;
  }

  get isBot(): boolean {
    return this.data.bot === true;
  }

  get avatarURL(): string | null {
    return this.data.avatar
      ? `https://cdn.discordapp.com/avatars/${this.data.id}/${this.data.avatar}.png`
      : null;
  }

  /**
   * Get the user's avatar decoration URL
   */
  get avatarDecorationURL(): string | null {
    return this.data.avatar_decoration
      ? `https://cdn.discordapp.com/avatar-decoration-presets/${this.data.avatar_decoration}.png`
      : null;
  }

  /**
   * Get the user's banner URL
   */
  get bannerURL(): string | null {
    return this.data.banner
      ? `https://cdn.discordapp.com/banners/${this.data.id}/${this.data.banner}.png`
      : null;
  }

  /**
   * Get the user's display avatar URL (avatar or default)
   */
  get displayAvatarURL(): string {
    return (
      this.avatarURL ||
      `https://cdn.discordapp.com/embed/avatars/${Number(this.discriminator) % 5}.png`
    );
  }

  /**
   * Create a DM channel with this user
   */
  async createDM(): Promise<any> {
    if (!this._client) {
      throw new Error("REST client not available");
    }

    return this._client.post("/users/@me/channels", {
      recipient_id: this.id,
    });
  }

  /**
   * Delete DM channel with this user
   */
  async deleteDM(): Promise<void> {
    const dmChannel = await this.createDM();
    if (!this._client) {
      throw new Error("REST client not available");
    }

    await this._client.delete(`/channels/${dmChannel.id}`);
  }

  /**
   * Send a message to this user
   */
  async send(content: string, options: any = {}): Promise<any> {
    const dmChannel = await this.createDM();
    if (!this._client) {
      throw new Error("REST client not available");
    }

    return this._client.post(`/channels/${dmChannel.id}/messages`, {
      content,
      ...options,
    });
  }

  /**
   * Fetch fresh user data from Discord
   */
  async fetch(): Promise<User> {
    if (!this._client) {
      throw new Error("REST client not available");
    }

    const userData = await this._client.get<RawUser>(`/users/${this.id}`);
    return new User(userData, this._client);
  }

  /**
   * Fetch user flags
   */
  async fetchFlags(): Promise<number> {
    const freshUser = await this.fetch();
    return freshUser.data.flags || 0;
  }

  /**
   * Check if this user equals another user
   */
  equals(other: User): boolean {
    return this.id === other.id;
  }

  /**
   * Convert to JSON representation
   */
  toJSON(): RawUser {
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
    return this.id;
  }
}
