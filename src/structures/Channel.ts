import type { Client } from "@/client/Client";
import { Message } from "./Message";
import type { Message as GatewayMessage } from "@/types/gateway/structures/Message";
import type { Channel as IChannel } from "@/types/structures/channel";

/**
 * Discord channel types
 */
export enum ChannelType {
  GUILD_TEXT = 0,
  DM = 1,
  GUILD_VOICE = 2,
  GROUP_DM = 3,
  GUILD_CATEGORY = 4,
  GUILD_ANNOUNCEMENT = 5,
  ANNOUNCEMENT_THREAD = 10,
  PUBLIC_THREAD = 11,
  PRIVATE_THREAD = 12,
  GUILD_STAGE_VOICE = 13,
  GUILD_DIRECTORY = 14,
  GUILD_FORUM = 15,
}

/**
 * Discord channel structure data from the API
 */
export interface ChannelData {
  id: string;
  type: number;
  guild_id?: string;
  position?: number;
  permission_overwrites?: any[];
  name?: string;
  topic?: string | null;
  nsfw?: boolean;
  last_message_id?: string | null;
  bitrate?: number;
  user_limit?: number;
  rate_limit_per_user?: number;
  recipients?: any[];
  icon?: string | null;
  owner_id?: string;
  application_id?: string;
  parent_id?: string | null;
  last_pin_timestamp?: string | null;
  rtc_region?: string | null;
  video_quality_mode?: number;
  message_count?: number;
  member_count?: number;
  thread_metadata?: any;
  member?: any;
  default_auto_archive_duration?: number;
  permissions?: string;
}

/**
 * Represents a Discord channel with methods for sending messages and management
 */
export class Channel {
  public readonly id: string;
  public readonly type: number;
  public guildId?: string;
  public name?: string;
  public topic?: string | null;
  public nsfw?: boolean;
  public position?: number;
  public parentId?: string | null;
  public rateLimitPerUser?: number;
  public raw: ChannelData;
  private readonly client: Client;

  constructor(client: Client, data: ChannelData) {
    this.client = client;
    this.id = data.id;
    this.type = data.type;
    this.guildId = data.guild_id;
    this.name = data.name;
    this.topic = data.topic;
    this.nsfw = data.nsfw;
    this.position = data.position;
    this.parentId = data.parent_id;
    this.rateLimitPerUser = data.rate_limit_per_user;
    this.raw = data;
  }

  /**
   * Checks if this is a text channel where messages can be sent
   */
  public isTextBased(): boolean {
    return [
      ChannelType.GUILD_TEXT,
      ChannelType.DM,
      ChannelType.GROUP_DM,
      ChannelType.GUILD_ANNOUNCEMENT,
      ChannelType.ANNOUNCEMENT_THREAD,
      ChannelType.PUBLIC_THREAD,
      ChannelType.PRIVATE_THREAD,
      ChannelType.GUILD_FORUM,
    ].includes(this.type);
  }

  /**
   * Checks if this is a voice channel
   */
  public isVoiceBased(): boolean {
    return [ChannelType.GUILD_VOICE, ChannelType.GUILD_STAGE_VOICE].includes(
      this.type
    );
  }

  /**
   * Checks if this is a thread
   */
  public isThread(): boolean {
    return [
      ChannelType.ANNOUNCEMENT_THREAD,
      ChannelType.PUBLIC_THREAD,
      ChannelType.PRIVATE_THREAD,
    ].includes(this.type);
  }

  /**
   * Sends a message to this channel
   */
  public async send(
    content: string,
    options: {
      tts?: boolean;
      embeds?: any[];
      allowed_mentions?: any;
      message_reference?: any;
      components?: any[];
      sticker_ids?: string[];
      files?: any[];
    } = {}
  ): Promise<Message> {
    if (!this.isTextBased()) {
      throw new Error("Cannot send messages to this channel type");
    }

    const data = await this.client.rest.post(`/channels/${this.id}/messages`, {
      content,
      ...options,
    });
    return new Message(this.client, data as GatewayMessage);
  }

  /**
   * Fetches messages from this channel
   */
  public async fetchMessages(
    options: {
      limit?: number;
      before?: string;
      after?: string;
      around?: string;
    } = {}
  ): Promise<Message[]> {
    if (!this.isTextBased()) {
      throw new Error("Cannot fetch messages from this channel type");
    }

    const query = new URLSearchParams();
    if (options.limit)
      query.set("limit", Math.min(options.limit, 100).toString());
    if (options.before) query.set("before", options.before);
    if (options.after) query.set("after", options.after);
    if (options.around) query.set("around", options.around);

    const messages = await this.client.rest.get(
      `/channels/${this.id}/messages?${query}`
    );
    return (messages as unknown[]).map(
      (data: any) => new Message(this.client, data)
    );
  }

  /**
   * Edits this channel
   */
  public async edit(options: {
    name?: string;
    topic?: string;
    nsfw?: boolean;
    rate_limit_per_user?: number;
    bitrate?: number;
    user_limit?: number;
    permission_overwrites?: any[];
    parent_id?: string;
    rtc_region?: string;
    video_quality_mode?: number;
    default_auto_archive_duration?: number;
    archived?: boolean;
    auto_archive_duration?: number;
    locked?: boolean;
    invitable?: boolean;
  }): Promise<Channel> {
    const data = await this.client.rest.patch(`/channels/${this.id}`, options);
    return new Channel(this.client, data as IChannel);
  }

  /**
   * Deletes this channel
   */
  public async delete(reason?: string): Promise<void> {
    const headers: Record<string, string> = {};
    if (reason) headers["X-Audit-Log-Reason"] = reason;

    await this.client.rest.delete(`/channels/${this.id}`, headers);
  }

  /**
   * Creates an invite to this channel
   */
  public async createInvite(
    options: {
      max_age?: number;
      max_uses?: number;
      temporary?: boolean;
      unique?: boolean;
      target_type?: number;
      target_user_id?: string;
      target_application_id?: string;
    } = {}
  ): Promise<any> {
    return this.client.rest.post(`/channels/${this.id}/invites`, options);
  }

  /**
   * Sets the channel's permissions for a user or role
   */
  public async setPermissions(
    targetId: string,
    options: {
      allow?: string;
      deny?: string;
      type: 0 | 1; // 0 = role, 1 = member
    }
  ): Promise<void> {
    await this.client.rest.put(
      `/channels/${this.id}/permissions/${targetId}`,
      options
    );
  }

  /**
   * Removes permission overrides for a user or role
   */
  public async removePermissions(targetId: string): Promise<void> {
    await this.client.rest.delete(
      `/channels/${this.id}/permissions/${targetId}`
    );
  }

  /**
   * Starts typing in this channel
   */
  public async startTyping(): Promise<void> {
    if (!this.isTextBased()) {
      throw new Error("Cannot type in this channel type");
    }
    await this.client.rest.post(`/channels/${this.id}/typing`);
  }

  /**
   * Pins a message in this channel
   */
  public async pinMessage(messageId: string): Promise<void> {
    await this.client.rest.put(`/channels/${this.id}/pins/${messageId}`);
  }

  /**
   * Unpins a message in this channel
   */
  public async unpinMessage(messageId: string): Promise<void> {
    await this.client.rest.delete(`/channels/${this.id}/pins/${messageId}`);
  }

  /**
   * Gets all pinned messages in this channel
   */
  public async fetchPinnedMessages(): Promise<Message[]> {
    const messages = await this.client.rest.get(`/channels/${this.id}/pins`);
    return (messages as unknown[]).map(
      (data: any) => new Message(this.client, data)
    );
  }
}
