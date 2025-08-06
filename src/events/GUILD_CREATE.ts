/**
 * GUILD_CREATE Event
 *
 * Emitted when the bot joins a new guild or when a guild becomes available.
 * Enhanced with Discord bot utility methods for guild management.
 */

import type { Guild } from "@/types/structures/guild";
import type { RESTClient } from "@/client/RESTClient";

export class GuildCreateData {
  private readonly _client?: RESTClient;

  constructor(
    public data: Guild,
    client?: RESTClient
  ) {
    this._client = client;
  }

  /**
   * The guild data
   */
  get guild() {
    return this.data;
  }

  /**
   * Guild ID
   */
  get id() {
    return this.data.id;
  }

  /**
   * Guild name
   */
  get name() {
    return this.data.name;
  }

  /**
   * Guild owner ID
   */
  get ownerId() {
    return this.data.owner_id;
  }

  /**
   * Guild members array
   */
  get members() {
    return this.data.members;
  }

  /**
   * Guild features
   */
  get features() {
    return this.data.features;
  }

  /**
   * Guild roles
   */
  get roles() {
    return this.data.roles;
  }

  /**
   * Whether the user is the owner of this guild
   */
  get isOwner() {
    return this.data.owner;
  }

  /**
   * Guild member count (approximate)
   */
  get memberCount() {
    return this.data.approximate_member_count || this.members?.length || 0;
  }

  /**
   * Guild verification level
   */
  get verificationLevel() {
    return this.data.verification_level;
  }

  // Discord bot utility methods

  /**
   * Send a message to the system channel (if exists)
   */
  async sendToSystemChannel(content: string, options: any = {}): Promise<any> {
    if (!this._client || !this.data.system_channel_id) {
      throw new Error("REST client not available or no system channel");
    }

    return this._client.post(
      `/channels/${this.data.system_channel_id}/messages`,
      {
        content,
        ...options,
      }
    );
  }

  /**
   * Send a message to the general/first text channel
   */
  async sendToDefaultChannel(content: string, options: any = {}): Promise<any> {
    if (!this._client) {
      throw new Error("REST client not available");
    }

    // Get guild channels from API
    const channels: any[] = await this._client.get(
      `/guilds/${this.id}/channels`
    );

    // Find first text channel the bot can send messages to
    const textChannel = channels.find(
      (channel: any) => channel.type === 0 // GUILD_TEXT
    );

    if (!textChannel) {
      throw new Error("No accessible text channel found");
    }

    return this._client.post(`/channels/${textChannel.id}/messages`, {
      content,
      ...options,
    });
  }

  /**
   * Create a new text channel
   */
  async createTextChannel(
    name: string,
    options: {
      topic?: string;
      rate_limit_per_user?: number;
      position?: number;
      parent_id?: string;
      nsfw?: boolean;
      permission_overwrites?: any[];
      reason?: string;
    } = {}
  ): Promise<any> {
    if (!this._client) {
      throw new Error("REST client not available");
    }

    const { reason, ...channelData } = options;
    return this._client.post(
      `/guilds/${this.id}/channels`,
      {
        name,
        type: 0, // GUILD_TEXT
        ...channelData,
      },
      reason ? { "X-Audit-Log-Reason": reason } : undefined
    );
  }

  /**
   * Create a new voice channel
   */
  async createVoiceChannel(
    name: string,
    options: {
      bitrate?: number;
      user_limit?: number;
      position?: number;
      parent_id?: string;
      permission_overwrites?: any[];
      reason?: string;
    } = {}
  ): Promise<any> {
    if (!this._client) {
      throw new Error("REST client not available");
    }

    const { reason, ...channelData } = options;
    return this._client.post(
      `/guilds/${this.id}/channels`,
      {
        name,
        type: 2, // GUILD_VOICE
        ...channelData,
      },
      reason ? { "X-Audit-Log-Reason": reason } : undefined
    );
  }

  /**
   * Create a new role
   */
  async createRole(
    options: {
      name?: string;
      permissions?: string;
      color?: number;
      hoist?: boolean;
      mentionable?: boolean;
      reason?: string;
    } = {}
  ): Promise<any> {
    if (!this._client) {
      throw new Error("REST client not available");
    }

    const { reason, ...roleData } = options;
    return this._client.post(
      `/guilds/${this.id}/roles`,
      roleData,
      reason ? { "X-Audit-Log-Reason": reason } : undefined
    );
  }

  /**
   * Get guild member by ID
   */
  async getMember(userId: string): Promise<any> {
    if (!this._client) {
      throw new Error("REST client not available");
    }

    return this._client.get(`/guilds/${this.id}/members/${userId}`);
  }

  /**
   * Get all guild members (paginated)
   */
  async getMembers(limit: number = 1000, after?: string): Promise<any> {
    if (!this._client) {
      throw new Error("REST client not available");
    }

    const query = new URLSearchParams();
    query.set("limit", Math.min(limit, 1000).toString());
    if (after) query.set("after", after);

    return this._client.get(`/guilds/${this.id}/members?${query}`);
  }

  /**
   * Get guild bans
   */
  async getBans(): Promise<any> {
    if (!this._client) {
      throw new Error("REST client not available");
    }

    return this._client.get(`/guilds/${this.id}/bans`);
  }

  /**
   * Get guild invites
   */
  async getInvites(): Promise<any> {
    if (!this._client) {
      throw new Error("REST client not available");
    }

    return this._client.get(`/guilds/${this.id}/invites`);
  }

  /**
   * Leave the guild
   */
  async leave(): Promise<void> {
    if (!this._client) {
      throw new Error("REST client not available");
    }

    await this._client.delete(`/users/@me/guilds/${this.id}`);
  }

  // Utility helper methods

  /**
   * Check if guild has a specific feature
   */
  hasFeature(feature: string): boolean {
    return this.features?.includes(feature) || false;
  }

  /**
   * Check if guild is partnered
   */
  isPartnered(): boolean {
    return this.hasFeature("PARTNERED");
  }

  /**
   * Check if guild is verified
   */
  isVerified(): boolean {
    return this.hasFeature("VERIFIED");
  }

  /**
   * Check if guild has community features
   */
  isCommunity(): boolean {
    return this.hasFeature("COMMUNITY");
  }

  /**
   * Check if guild supports threads
   */
  supportsThreads(): boolean {
    return this.hasFeature("THREADS_ENABLED");
  }

  /**
   * Get guild creation timestamp
   */
  getCreatedAt(): Date {
    // Discord snowflake timestamp extraction
    const timestamp = (BigInt(this.id) >> 22n) + 1420070400000n;
    return new Date(Number(timestamp));
  }

  /**
   * Get how old the guild is
   */
  getGuildAge(): number {
    return Date.now() - this.getCreatedAt().getTime();
  }

  /**
   * Get guild icon URL
   */
  getIconUrl(size: number = 256): string | null {
    if (!this.data.icon) return null;

    const format = this.data.icon.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/icons/${this.id}/${this.data.icon}.${format}?size=${size}`;
  }

  /**
   * Get guild banner URL
   */
  getBannerUrl(size: number = 1024): string | null {
    if (!this.data.banner) return null;

    const format = this.data.banner.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/banners/${this.id}/${this.data.banner}.${format}?size=${size}`;
  }
}
