import type { Client } from "@/client/Client";
import type { Message as GatewayMessage } from "@/types/gateway/structures/Message";
import type { Embed, MessageComponent } from "@/types/structures/message";
import type { AllowedMentions } from "@/types/structures/rest";
import type { User } from "@/types/structures/user";
import type { Channel } from "@/types/structures/channel";

/**
 * Message reference information
 */
export interface MessageReference {
  /** ID of the originating message */
  message_id?: string;
  /** ID of the originating message's channel */
  channel_id?: string;
  /** ID of the originating message's guild */
  guild_id?: string;
  /** When sending, whether to error if the referenced message doesn't exist instead of sending as a normal (non-reply) message */
  fail_if_not_exists?: boolean;
}

/**
 * Message activity information
 */
export interface MessageActivity {
  /** Type of message activity */
  type: number;
  /** Party_id from a Rich Presence event */
  party_id?: string;
}

/**
 * Message attachment information
 */
export interface Attachment {
  /** Attachment id */
  id: string;
  /** Name of file attached */
  filename: string;
  /** Description for the file */
  description?: string;
  /** The attachment's media type */
  content_type?: string;
  /** Size of file in bytes */
  size: number;
  /** Source url of file */
  url: string;
  /** A proxied url of file */
  proxy_url: string;
  /** Height of file (if image) */
  height?: number | null;
  /** Width of file (if image) */
  width?: number | null;
  /** Whether this attachment is ephemeral */
  ephemeral?: boolean;
}

/**
 * Message type enumeration
 */
export enum MessageType {
  DEFAULT = 0,
  RECIPIENT_ADD = 1,
  RECIPIENT_REMOVE = 2,
  CALL = 3,
  CHANNEL_NAME_CHANGE = 4,
  CHANNEL_ICON_CHANGE = 5,
  CHANNEL_PINNED_MESSAGE = 6,
  USER_JOIN = 7,
  GUILD_BOOST = 8,
  GUILD_BOOST_TIER_1 = 9,
  GUILD_BOOST_TIER_2 = 10,
  GUILD_BOOST_TIER_3 = 11,
  CHANNEL_FOLLOW_ADD = 12,
  GUILD_DISCOVERY_DISQUALIFIED = 14,
  GUILD_DISCOVERY_REQUALIFIED = 15,
  GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING = 16,
  GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING = 17,
  THREAD_CREATED = 18,
  REPLY = 19,
  CHAT_INPUT_COMMAND = 20,
  THREAD_STARTER_MESSAGE = 21,
  GUILD_INVITE_REMINDER = 22,
  CONTEXT_MENU_COMMAND = 23,
  AUTO_MODERATION_ACTION = 24,
}

/**
 * Represents a Discord message with helper methods for doing stuff with it
 * Like replying, editing, deleting, reacting - all the good message things!
 */
export class Message {
  public id: string;
  public channelId: string;
  public channel_id: string; // Discord uses snake_case, keeping both for compatibility
  public guildId?: string;
  public content: string;
  public author: GatewayMessage["author"];
  public raw: GatewayMessage;
  public timestamp: string;
  public editedTimestamp: string | null;
  public edited_timestamp: string | null; // Again, Discord's naming
  private readonly client: Client;

  constructor(client: Client, data: GatewayMessage) {
    this.client = client;
    this.id = data.id;
    this.channelId = data.channel_id;
    this.channel_id = data.channel_id;
    this.guildId = data.guild_id;
    this.content = data.content;
    this.author = data.author;
    this.raw = data;
    this.timestamp = data.timestamp;
    this.editedTimestamp = data.edited_timestamp || null;
    this.edited_timestamp = data.edited_timestamp || null;
  }

  /**
   * Replies to this message - creates a proper reply that shows up linked
   * @param content What you want to say back
   * @param options Additional message options
   */
  public async reply(
    content: string,
    options: {
      tts?: boolean;
      embeds?: Embed[];
      allowed_mentions?: AllowedMentions;
      components?: MessageComponent[];
      sticker_ids?: string[];
      files?: Buffer[];
    } = {}
  ): Promise<Message> {
    return this.client.sendMessage(this.channelId, content, {
      message_reference: { message_id: this.id },
      ...options,
    });
  }

  /**
   * Edits this message to say something different
   * @param content The new content for the message
   */
  public async edit(content: string): Promise<Message> {
    const data = await this.client.rest.patch(
      `/channels/${this.channelId}/messages/${this.id}`,
      { content }
    );
    return new Message(this.client, data as GatewayMessage);
  }

  /**
   * Deletes this message - poof, it's gone!
   */
  public async delete(): Promise<void> {
    await this.client.rest.delete(
      `/channels/${this.channelId}/messages/${this.id}`
    );
  }

  /**
   * Reacts to this message with an emoji
   * @param emoji The emoji to react with (can be unicode or custom emoji format)
   */
  public async react(emoji: string): Promise<void> {
    await this.client.rest.put(
      `/channels/${this.channelId}/messages/${
        this.id
      }/reactions/${encodeURIComponent(emoji)}/@me`
    );
  }

  /**
   * Removes a reaction from this message
   * @param emoji The emoji reaction to remove
   * @param userId The user ID whose reaction to remove (defaults to bot)
   */
  public async removeReaction(
    emoji: string,
    userId: string = "@me"
  ): Promise<void> {
    await this.client.rest.delete(
      `/channels/${this.channelId}/messages/${
        this.id
      }/reactions/${encodeURIComponent(emoji)}/${userId}`
    );
  }

  /**
   * Removes all reactions from this message
   */
  public async removeAllReactions(): Promise<void> {
    await this.client.rest.delete(
      `/channels/${this.channelId}/messages/${this.id}/reactions`
    );
  }

  /**
   * Removes all reactions of a specific emoji from this message
   * @param emoji The emoji to remove all reactions for
   */
  public async removeAllReactionsForEmoji(emoji: string): Promise<void> {
    await this.client.rest.delete(
      `/channels/${this.channelId}/messages/${
        this.id
      }/reactions/${encodeURIComponent(emoji)}`
    );
  }

  /**
   * Fetches users who reacted with a specific emoji
   * @param emoji The emoji to get reactions for
   * @param options Pagination options
   */
  public async fetchReactions(
    emoji: string,
    options: {
      after?: string;
      limit?: number;
    } = {}
  ): Promise<User[]> {
    const query = new URLSearchParams();
    if (options.after) query.set("after", options.after);
    if (options.limit)
      query.set("limit", Math.min(options.limit, 100).toString());

    return this.client.rest.get(
      `/channels/${this.channelId}/messages/${
        this.id
      }/reactions/${encodeURIComponent(emoji)}?${query}`
    );
  }

  /**
   * Pins this message to the channel
   */
  public async pin(): Promise<void> {
    await this.client.rest.put(`/channels/${this.channelId}/pins/${this.id}`);
  }

  /**
   * Unpins this message from the channel
   */
  public async unpin(): Promise<void> {
    await this.client.rest.delete(
      `/channels/${this.channelId}/pins/${this.id}`
    );
  }

  /**
   * Crosspost this message (for announcement channels)
   */
  public async crosspost(): Promise<Message> {
    const data = await this.client.rest.post(
      `/channels/${this.channelId}/messages/${this.id}/crosspost`
    );
    return new Message(this.client, data as GatewayMessage);
  }

  /**
   * Creates a thread from this message
   * @param name The name of the thread
   * @param options Thread options
   */
  public async startThread(
    name: string,
    options: {
      auto_archive_duration?: 60 | 1440 | 4320 | 10080;
      rate_limit_per_user?: number;
    } = {}
  ): Promise<Channel> {
    return this.client.rest.post(
      `/channels/${this.channelId}/messages/${this.id}/threads`,
      { name, ...options }
    );
  }

  /**
   * Checks if this message was sent by the bot
   */
  public get isFromBot(): boolean {
    return this.client.user?.id === this.author.id;
  }

  /**
   * Gets the URL to this message
   */
  public get url(): string {
    return `https://discord.com/channels/${this.guildId || "@me"}/${this.channelId}/${this.id}`;
  }

  /**
   * Gets the creation timestamp as a Date object
   */
  public get createdAt(): Date {
    return new Date(this.timestamp);
  }

  /**
   * Gets the edit timestamp as a Date object (null if never edited)
   */
  public get editedAt(): Date | null {
    return this.editedTimestamp ? new Date(this.editedTimestamp) : null;
  }
}
