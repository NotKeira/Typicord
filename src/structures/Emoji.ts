/**
 * Represents a Discord emoji and provides helper methods.
 */
import type { Emoji as RawEmoji } from "../types/structures/Emoji";
import { User } from "./User";
import type { RESTClient } from "@/client/RESTClient";

export class Emoji {
  private readonly _client?: RESTClient;
  private readonly _user?: User;

  /**
   * Create a new Emoji instance.
   * @param data The raw emoji data
   * @param client Optional REST client for API operations
   */
  constructor(
    public data: RawEmoji,
    client?: RESTClient
  ) {
    this._client = client;
    // Create User instance if user data exists
    if (this.data.user) {
      this._user = new User(this.data.user, client);
    }
  }

  /**
   * The emoji's ID
   */
  get id(): string | null {
    return this.data.id;
  }

  /**
   * The emoji's name
   */
  get name(): string | null {
    return this.data.name;
  }

  /**
   * The user who created this emoji (with full User functionality)
   */
  get user(): User | undefined {
    return this._user;
  }

  /**
   * Whether this emoji requires colons
   */
  get requireColons(): boolean | undefined {
    return this.data.require_colons;
  }

  /**
   * Whether this emoji is managed
   */
  get managed(): boolean | undefined {
    return this.data.managed;
  }

  /**
   * Whether this emoji is animated
   */
  get animated(): boolean | undefined {
    return this.data.animated;
  }

  /**
   * Whether this emoji is available
   */
  get available(): boolean | undefined {
    return this.data.available;
  }

  /**
   * Array of role IDs allowed to use this emoji
   */
  get roles(): string[] | undefined {
    return this.data.roles;
  }

  /**
   * Convert the emoji to a Discord mention string.
   */
  toString(): string {
    if (!this.data.id || !this.data.name) {
      return this.data.name || "";
    }
    return this.data.animated
      ? `<a:${this.data.name}:${this.data.id}>`
      : `<:${this.data.name}:${this.data.id}>`;
  }

  /**
   * Check if the emoji is a custom emoji.
   */
  isCustom(): boolean {
    return this.data.id !== null;
  }

  /**
   * Check if the emoji is animated.
   */
  isAnimated(): boolean {
    return this.data.animated === true;
  }

  /**
   * Check if the emoji is managed by an integration.
   */
  isManaged(): boolean {
    return this.data.managed === true;
  }

  /**
   * Check if the emoji is available for use.
   */
  isAvailable(): boolean {
    return this.data.available !== false;
  }

  /**
   * Get the emoji's image URL
   */
  get imageURL(): string | null {
    if (!this.data.id) return null;
    const extension = this.data.animated ? "gif" : "png";
    return `https://cdn.discordapp.com/emojis/${this.data.id}.${extension}`;
  }

  /**
   * Get the emoji's image URL with custom options
   */
  imageURLWithOptions(
    options: { size?: number; format?: "png" | "gif" } = {}
  ): string | null {
    if (!this.data.id) return null;
    const { size = 128, format } = options;
    const extension = format || (this.data.animated ? "gif" : "png");
    return `https://cdn.discordapp.com/emojis/${this.data.id}.${extension}?size=${size}`;
  }

  /**
   * Delete this emoji (requires appropriate permissions)
   */
  async delete(guildId: string, reason?: string): Promise<void> {
    if (!this._client || !this.data.id) {
      throw new Error("REST client or emoji ID not available");
    }

    await this._client.delete(
      `/guilds/${guildId}/emojis/${this.data.id}`,
      reason ? { reason } : {}
    );
  }

  /**
   * Edit this emoji
   */
  async edit(
    guildId: string,
    options: {
      name?: string;
      roles?: string[];
      reason?: string;
    }
  ): Promise<Emoji> {
    if (!this._client || !this.data.id) {
      throw new Error("REST client or emoji ID not available");
    }

    const { reason, ...body } = options;
    const updatedEmoji = await this._client.patch(
      `/guilds/${guildId}/emojis/${this.data.id}`,
      body,
      reason ? { reason } : {}
    );

    return new Emoji(updatedEmoji as RawEmoji, this._client);
  }

  /**
   * Get the emoji as a reaction string for API usage
   */
  get reactionString(): string {
    if (!this.data.id) {
      return this.data.name || "";
    }
    return `${this.data.name}:${this.data.id}`;
  }

  /**
   * Convert to JSON representation
   */
  toJSON(): RawEmoji {
    return { ...this.data };
  }

  /**
   * Value representation
   */
  valueOf(): string {
    return this.toString();
  }
}
