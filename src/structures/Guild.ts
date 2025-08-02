import type { Client } from "@/client/Client";
import type { Role } from "@/types/structures/role";
import type { Emoji } from "@/types/structures/emoji";
import type { User } from "@/types/structures/user";

// Forward declaration to avoid circular dependency
interface Channel {
  id: string;
  type: number;
  name?: string;
  // Add other essential Channel properties as needed
}

/**
 * Discord guild structure data from the API
 */
export interface GuildData {
  id: string;
  name: string;
  icon?: string | null;
  icon_hash?: string | null;
  splash?: string | null;
  discovery_splash?: string | null;
  owner?: boolean;
  owner_id: string;
  permissions?: string;
  region?: string | null;
  afk_channel_id?: string | null;
  afk_timeout: number;
  widget_enabled?: boolean;
  widget_channel_id?: string | null;
  verification_level: number;
  default_message_notifications: number;
  explicit_content_filter: number;
  roles: Role[];
  emojis: Emoji[];
  features: string[];
  mfa_level: number;
  application_id?: string | null;
  system_channel_id?: string | null;
  system_channel_flags: number;
  rules_channel_id?: string | null;
  max_presences?: number | null;
  max_members?: number;
  vanity_url_code?: string | null;
  description?: string | null;
  banner?: string | null;
  premium_tier: number;
  premium_subscription_count?: number;
  preferred_locale: string;
  public_updates_channel_id?: string | null;
  max_video_channel_users?: number;
  approximate_member_count?: number;
  approximate_presence_count?: number;
  welcome_screen?: {
    description: string | null;
    welcome_channels: Array<{
      channel_id: string;
      description: string;
      emoji_id?: string | null;
      emoji_name?: string | null;
    }>;
  };
  nsfw_level: number;
  stickers?: Array<{
    id: string;
    pack_id?: string;
    name: string;
    description: string | null;
    tags: string;
    type: number;
    format_type: number;
    available?: boolean;
    guild_id?: string;
    user?: User;
    sort_value?: number;
  }>;
  premium_progress_bar_enabled: boolean;
}

/**
 * Represents a Discord guild (server) with helpful methods for management
 */
export class Guild {
  public readonly id: string;
  public name: string;
  public icon?: string | null;
  public ownerId: string;
  public permissions?: string;
  public features: string[];
  public memberCount?: number;
  public channels: Map<string, Channel> = new Map();
  public raw: GuildData;
  private readonly client: Client;

  constructor(client: Client, data: GuildData) {
    this.client = client;
    this.id = data.id;
    this.name = data.name;
    this.icon = data.icon;
    this.ownerId = data.owner_id;
    this.permissions = data.permissions;
    this.features = data.features;
    this.memberCount = data.approximate_member_count;
    this.raw = data;
  }

  /**
   * Gets all channels in this guild
   */
  public async fetchChannels(): Promise<Channel[]> {
    const { Channel } = await import("./Channel");
    const channels = await this.client.rest.get(`/guilds/${this.id}/channels`);
    const channelObjects = (channels as unknown[]).map(
      (data: unknown) => new Channel(this.client, data as any)
    );

    // Cache channels
    for (const channel of channelObjects) {
      this.channels.set(channel.id, channel);
    }

    return channelObjects;
  }

  /**
   * Creates a new channel in this guild
   */
  public async createChannel(
    name: string,
    options: {
      type?: number;
      topic?: string;
      bitrate?: number;
      user_limit?: number;
      rate_limit_per_user?: number;
      position?: number;
      permission_overwrites?: Array<{
        id: string;
        type: number;
        allow: string;
        deny: string;
      }>;
      parent_id?: string;
      nsfw?: boolean;
    } = {}
  ): Promise<Channel> {
    const { Channel } = await import("./Channel");
    const data = await this.client.rest.post(`/guilds/${this.id}/channels`, {
      name,
      ...options,
    });
    const channel = new Channel(this.client, data as any);
    this.channels.set(channel.id, channel);
    return channel;
  } /**
   * Gets a specific channel by ID
   */
  public getChannel(channelId: string): Channel | undefined {
    return this.channels.get(channelId);
  }

  /**
   * Gets the guild's icon URL
   */
  public iconURL(
    options: { size?: number; format?: "png" | "jpg" | "webp" | "gif" } = {}
  ): string | null {
    if (!this.icon) return null;
    const { size = 256, format = "png" } = options;
    return `https://cdn.discordapp.com/icons/${this.id}/${this.icon}.${format}?size=${size}`;
  }

  /**
   * Leaves this guild
   */
  public async leave(): Promise<void> {
    await this.client.rest.delete(`/users/@me/guilds/${this.id}`);
  }

  /**
   * Gets guild members
   */
  public async fetchMembers(
    options: { limit?: number; after?: string } = {}
  ): Promise<
    Array<{
      user?: User;
      nick?: string | null;
      avatar?: string | null;
      roles: string[];
      joined_at: string;
      premium_since?: string | null;
      deaf: boolean;
      mute: boolean;
      flags: number;
      pending?: boolean;
      permissions?: string;
      communication_disabled_until?: string | null;
    }>
  > {
    const query = new URLSearchParams();
    if (options.limit) query.set("limit", options.limit.toString());
    if (options.after) query.set("after", options.after);

    return this.client.rest.get(`/guilds/${this.id}/members?${query}`);
  }

  /**
   * Kicks a member from the guild
   */
  public async kickMember(userId: string, reason?: string): Promise<void> {
    const headers: Record<string, string> = {};
    if (reason) headers["X-Audit-Log-Reason"] = reason;

    await this.client.rest.delete(
      `/guilds/${this.id}/members/${userId}`,
      headers
    );
  }

  /**
   * Bans a member from the guild
   */
  public async banMember(
    userId: string,
    options: {
      reason?: string;
      delete_message_days?: number;
    } = {}
  ): Promise<void> {
    const headers: Record<string, string> = {};
    if (options.reason) headers["X-Audit-Log-Reason"] = options.reason;

    const body: { delete_message_days?: number } = {};
    if (options.delete_message_days)
      body.delete_message_days = options.delete_message_days;

    await this.client.rest.put(
      `/guilds/${this.id}/bans/${userId}`,
      body,
      headers
    );
  }

  /**
   * Unbans a member from the guild
   */
  public async unbanMember(userId: string, reason?: string): Promise<void> {
    const headers: Record<string, string> = {};
    if (reason) headers["X-Audit-Log-Reason"] = reason;

    await this.client.rest.delete(`/guilds/${this.id}/bans/${userId}`, headers);
  }
}
