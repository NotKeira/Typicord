/**
 * Webhook Management Utilities for Discord API
 * Handles creating, editing, and executing webhooks
 */

import type { RESTClient } from "@/client/RESTClient";

export interface WebhookCreateOptions {
  /** Name of the webhook (1-80 characters) */
  name: string;
  /** Image data for the default webhook avatar */
  avatar?: string | null;
}

export interface WebhookEditOptions {
  /** The default name of the webhook */
  name?: string;
  /** Image data for the default webhook avatar */
  avatar?: string | null;
  /** The new channel id this webhook should be moved to */
  channel_id?: string;
}

export interface WebhookExecuteOptions {
  /** The message contents (up to 2000 characters) */
  content?: string;
  /** Override the default username of the webhook */
  username?: string;
  /** Override the default avatar of the webhook */
  avatar_url?: string;
  /** True if this is a TTS message */
  tts?: boolean;
  /** Embedded rich content */
  embeds?: any[];
  /** Allowed mentions for the message */
  allowed_mentions?: {
    parse?: ("roles" | "users" | "everyone")[];
    roles?: string[];
    users?: string[];
    replied_user?: boolean;
  };
  /** The components to include with the message */
  components?: any[];
  /** Contents of the file being sent */
  files?: Buffer[];
  /** JSON encoded body of non-file params */
  payload_json?: string;
  /** Attachment objects with filename and description */
  attachments?: any[];
  /** Message flags combined as a bitfield */
  flags?: number;
  /** Name of thread to create (requires the webhook channel to be a forum channel) */
  thread_name?: string;
}

export interface Webhook {
  /** The id of the webhook */
  id: string;
  /** The type of the webhook */
  type: number;
  /** The guild id this webhook is for, if any */
  guild_id?: string | null;
  /** The channel id this webhook is for, if any */
  channel_id?: string | null;
  /** The user this webhook was created by (not returned when getting a webhook with its token) */
  user?: any;
  /** The default name of the webhook */
  name?: string | null;
  /** The default user avatar hash of the webhook */
  avatar?: string | null;
  /** The secure token of the webhook (returned for Incoming Webhooks) */
  token?: string;
  /** The bot/OAuth2 application that created this webhook */
  application_id?: string | null;
  /** The guild of the channel that this webhook is following (returned for Channel Follower Webhooks) */
  source_guild?: any;
  /** The channel that this webhook is following (returned for Channel Follower Webhooks) */
  source_channel?: any;
  /** The url used for executing the webhook (returned by the webhooks OAuth2 flow) */
  url?: string;
}

export class WebhookManager {
  private readonly rest: RESTClient;

  constructor(rest: RESTClient) {
    this.rest = rest;
  }

  /**
   * Create a new webhook for a channel
   */
  async create(
    channelId: string,
    options: WebhookCreateOptions
  ): Promise<Webhook> {
    const data = await this.rest.post(
      `/channels/${channelId}/webhooks`,
      options
    );
    return data as Webhook;
  }

  /**
   * Get all webhooks for a channel
   */
  async getChannelWebhooks(channelId: string): Promise<Webhook[]> {
    const data = await this.rest.get(`/channels/${channelId}/webhooks`);
    return data as Webhook[];
  }

  /**
   * Get all webhooks for a guild
   */
  async getGuildWebhooks(guildId: string): Promise<Webhook[]> {
    const data = await this.rest.get(`/guilds/${guildId}/webhooks`);
    return data as Webhook[];
  }

  /**
   * Get a webhook by ID
   */
  async get(webhookId: string): Promise<Webhook> {
    const data = await this.rest.get(`/webhooks/${webhookId}`);
    return data as Webhook;
  }

  /**
   * Get a webhook by ID and token
   */
  async getWithToken(webhookId: string, token: string): Promise<Webhook> {
    const data = await this.rest.get(`/webhooks/${webhookId}/${token}`);
    return data as Webhook;
  }

  /**
   * Edit a webhook
   */
  async edit(webhookId: string, options: WebhookEditOptions): Promise<Webhook> {
    const data = await this.rest.patch(`/webhooks/${webhookId}`, options);
    return data as Webhook;
  }

  /**
   * Edit a webhook with token
   */
  async editWithToken(
    webhookId: string,
    token: string,
    options: WebhookEditOptions
  ): Promise<Webhook> {
    const data = await this.rest.patch(
      `/webhooks/${webhookId}/${token}`,
      options
    );
    return data as Webhook;
  }

  /**
   * Delete a webhook
   */
  async delete(webhookId: string): Promise<void> {
    await this.rest.delete(`/webhooks/${webhookId}`);
  }

  /**
   * Delete a webhook with token
   */
  async deleteWithToken(webhookId: string, token: string): Promise<void> {
    await this.rest.delete(`/webhooks/${webhookId}/${token}`);
  }

  /**
   * Execute a webhook
   */
  async execute(
    webhookId: string,
    token: string,
    options: WebhookExecuteOptions
  ): Promise<any> {
    const queryParams = new URLSearchParams();
    if (options.thread_name) {
      queryParams.append("thread_name", options.thread_name);
    }

    const queryString = queryParams.toString();
    const baseUrl = `/webhooks/${webhookId}/${token}`;
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    if (options.files && options.files.length > 0) {
      // Handle file uploads with FormData
      const formData = new FormData();

      if (options.payload_json) {
        formData.append("payload_json", options.payload_json);
      } else {
        formData.append(
          "payload_json",
          JSON.stringify({
            content: options.content,
            username: options.username,
            avatar_url: options.avatar_url,
            tts: options.tts,
            embeds: options.embeds,
            allowed_mentions: options.allowed_mentions,
            components: options.components,
            flags: options.flags,
          })
        );
      }

      options.files.forEach((file, index) => {
        const uint8Array = new Uint8Array(file);
        const blob = new Blob([uint8Array]);
        formData.append(`files[${index}]`, blob, `file${index}`);
      });

      return await this.rest.post(url, formData);
    } else {
      return await this.rest.post(url, options);
    }
  }

  /**
   * Execute a webhook and wait for the message response
   */
  async executeAndWait(
    webhookId: string,
    token: string,
    options: WebhookExecuteOptions
  ): Promise<any> {
    const queryParams = new URLSearchParams();
    queryParams.append("wait", "true");
    if (options.thread_name) {
      queryParams.append("thread_name", options.thread_name);
    }

    const url = `/webhooks/${webhookId}/${token}?${queryParams}`;

    if (options.files && options.files.length > 0) {
      // Handle file uploads with FormData
      const formData = new FormData();

      if (options.payload_json) {
        formData.append("payload_json", options.payload_json);
      } else {
        formData.append(
          "payload_json",
          JSON.stringify({
            content: options.content,
            username: options.username,
            avatar_url: options.avatar_url,
            tts: options.tts,
            embeds: options.embeds,
            allowed_mentions: options.allowed_mentions,
            components: options.components,
            flags: options.flags,
          })
        );
      }

      options.files.forEach((file, index) => {
        const uint8Array = new Uint8Array(file);
        const blob = new Blob([uint8Array]);
        formData.append(`files[${index}]`, blob, `file${index}`);
      });

      return await this.rest.post(url, formData);
    } else {
      return await this.rest.post(url, options);
    }
  }

  /**
   * Get a webhook message
   */
  async getMessage(
    webhookId: string,
    token: string,
    messageId: string,
    threadId?: string
  ): Promise<any> {
    let url = `/webhooks/${webhookId}/${token}/messages/${messageId}`;
    if (threadId) {
      url += `?thread_id=${threadId}`;
    }

    return await this.rest.get(url);
  }

  /**
   * Edit a webhook message
   */
  async editMessage(
    webhookId: string,
    token: string,
    messageId: string,
    options: {
      content?: string;
      embeds?: any[];
      allowed_mentions?: any;
      components?: any[];
      files?: Buffer[];
      attachments?: any[];
    },
    threadId?: string
  ): Promise<any> {
    let url = `/webhooks/${webhookId}/${token}/messages/${messageId}`;
    if (threadId) {
      url += `?thread_id=${threadId}`;
    }

    if (options.files && options.files.length > 0) {
      const formData = new FormData();
      formData.append(
        "payload_json",
        JSON.stringify({
          content: options.content,
          embeds: options.embeds,
          allowed_mentions: options.allowed_mentions,
          components: options.components,
          attachments: options.attachments,
        })
      );

      options.files.forEach((file, index) => {
        const uint8Array = new Uint8Array(file);
        const blob = new Blob([uint8Array]);
        formData.append(`files[${index}]`, blob, `file${index}`);
      });

      return await this.rest.patch(url, formData);
    } else {
      return await this.rest.patch(url, options);
    }
  }

  /**
   * Delete a webhook message
   */
  async deleteMessage(
    webhookId: string,
    token: string,
    messageId: string,
    threadId?: string
  ): Promise<void> {
    let url = `/webhooks/${webhookId}/${token}/messages/${messageId}`;
    if (threadId) {
      url += `?thread_id=${threadId}`;
    }

    await this.rest.delete(url);
  }

  /**
   * Get webhook URL for easy access
   */
  static getWebhookUrl(webhookId: string, token: string): string {
    return `https://discord.com/api/webhooks/${webhookId}/${token}`;
  }

  /**
   * Parse webhook URL to get ID and token
   */
  static parseWebhookUrl(url: string): { id: string; token: string } | null {
    const regex = /discord\.com\/api\/webhooks\/(\d+)\/([a-zA-Z0-9_-]+)/;
    const match = regex.exec(url);
    if (!match) return null;

    return {
      id: match[1],
      token: match[2],
    };
  }
}
