// This is replaced at build time by tsup
declare const __CLIENT_VERSION__: string;
import { GatewayClient } from "@/gateway/GatewayClient";

import { EventEmitter } from "@/events/EventEmitter";
import { Message } from "@/structures/Message";
import { Guild } from "@/structures/Guild";
import { Channel } from "@/structures/Channel";
import { User } from "@/structures/User";
import { ApplicationCommandManager } from "@/structures/ApplicationCommand";
import type { TypicordEvents } from "@/types/gateway/events";
import type { Message as GatewayMessage } from "@/types/gateway/structures/Message";
import type { Channel as ChannelData } from "@/types/structures/channel";
import { GuildCacheManager } from "@/cache/GuildCacheManager";
import { UserCacheManager } from "@/cache/UserCacheManager";
import { RESTClient } from "@/client/RESTClient";

// Import all event data classes
import { ReadyEventData } from "@/events/READY";
import { ResumedEventData } from "@/events/RESUMED";
import { MessageCreateEventData } from "@/events/MESSAGE_CREATE";
import { MessageUpdateEventData } from "@/events/MESSAGE_UPDATE";
import { MessageDeleteEventData } from "@/events/MESSAGE_DELETE";
import { GuildCreateEventData } from "@/events/GUILD_CREATE";
import { GuildUpdateEventData } from "@/events/GUILD_UPDATE";
import { GuildDeleteEventData } from "@/events/GUILD_DELETE";
import { ChannelCreateEventData } from "@/events/CHANNEL_CREATE";
import { ChannelUpdateEventData } from "@/events/CHANNEL_UPDATE";
import { ChannelDeleteEventData } from "@/events/CHANNEL_DELETE";
import { InteractionCreateEventData } from "@/events/INTERACTION_CREATE";
import { TypingStartEventData } from "@/events/TYPING_START";
import { MessageReactionAddEventData } from "@/events/MESSAGE_REACTION_ADD";
import { MessageReactionRemoveEventData } from "@/events/MESSAGE_REACTION_REMOVE";
import { MessageReactionRemoveAllEventData } from "@/events/MESSAGE_REACTION_REMOVE_ALL";
import { MessageReactionRemoveEmojiEventData } from "@/events/MESSAGE_REACTION_REMOVE_EMOJI";
import { PresenceUpdateEventData } from "@/events/PRESENCE_UPDATE";
import { VoiceStateUpdateEventData } from "@/events/VOICE_STATE_UPDATE";
import { UserUpdateEventData } from "@/events/USER_UPDATE";

/**
 * The main Typicord client - this is what you'll be using to interact with Discord!
 * Handles connecting to the gateway, sending messages, and all that good stuff.
 */
export class Client extends EventEmitter {
  /**
   * What version of Typicord this is
   */
  public static readonly version: string =
    typeof __CLIENT_VERSION__ !== "undefined" ? __CLIENT_VERSION__ : "1.0.0";
  public token: string;
  public intents: number;
  public rest: RESTClient;
  public cache: {
    guilds: GuildCacheManager;
    users: UserCacheManager;
  };
  public user: import("@/structures/User").User | null = null;
  public guilds: any[] = [];
  public commands: ApplicationCommandManager | null = null;
  private readonly _gateway: GatewayClient;

  /**
   * Creates a new Typicord client instance
   * @param token Your bot's token from Discord
   * @param intents What events you want to receive (use GatewayIntentBits)
   */
  constructor(token: string, intents: number) {
    super();
    this.token = token;
    this.intents = intents;
    this.rest = new RESTClient({ token });
    this._gateway = new GatewayClient(this);
    this.cache = {
      guilds: new GuildCacheManager(),
      users: new UserCacheManager(),
    };
  }

  /**
   * Actually connects to Discord - this starts everything up!
   */
  public connect(): void {
    this._gateway.connect();
  }

  /**
   * Initializes application commands manager
   * Call this after connecting to set up slash commands
   */
  public async initializeCommands(): Promise<void> {
    if (!this.user) {
      throw new Error("Client must be connected before initializing commands");
    }

    const application = await this.fetchApplication();
    this.commands = new ApplicationCommandManager(this, application.id);
  }

  /**
   * Cleanly disconnects from Discord
   */
  public disconnect(): void {
    this._gateway.disconnect();
  }

  /**
   * Disconnects from Discord and cleans up all resources
   * Call this when you're shutting down your bot to free up connections
   */
  destroy() {
    this._gateway.disconnect();
    this.rest.destroy();
  }

  /**
   * Gets our gateway client for advanced usage
   */
  public get gateway(): GatewayClient {
    return this._gateway;
  }

  public override on<K extends keyof TypicordEvents>(
    event: K,
    listener: (data: TypicordEvents[K]) => void
  ): this {
    super.on(event, listener);
    return this;
  }

  /**
   * Listens for an event once - the listener is removed after the first emission
   * @param event The event to listen for
   * @param listener The function to call when the event is emitted
   */
  public once<K extends keyof TypicordEvents>(
    event: K,
    listener: (data: TypicordEvents[K]) => void
  ): this {
    super.once(event, listener);
    return this;
  }

  /**
   * Internal emit method for raw gateway data that needs to be wrapped
   * @internal This method is used internally by the gateway client
   */
  public emitRaw(event: string, data: any): void {
    // For most events, we wrap the raw data in a user-friendly event data class
    // This provides a clean API for users: client.on('READY', (event: Events.Ready) => {})
    let wrappedData: any;

    switch (event) {
      case "READY":
        wrappedData = new ReadyEventData(data as any);
        break;
      case "RESUMED":
        wrappedData = new ResumedEventData();
        break;
      case "MESSAGE_CREATE": {
        // First create Message instance, then wrap in MessageCreateEventData
        const message = new Message(this, data as any);
        wrappedData = new MessageCreateEventData(message);
        break;
      }
      case "MESSAGE_UPDATE":
        wrappedData = new MessageUpdateEventData(data as any);
        break;
      case "MESSAGE_DELETE":
        wrappedData = new MessageDeleteEventData(data as any);
        break;
      case "GUILD_CREATE":
        wrappedData = new GuildCreateEventData(data as any);
        break;
      case "GUILD_UPDATE":
        wrappedData = new GuildUpdateEventData(data as any);
        break;
      case "GUILD_DELETE":
        wrappedData = new GuildDeleteEventData(data as any);
        break;
      case "CHANNEL_CREATE":
        wrappedData = new ChannelCreateEventData(data as any);
        break;
      case "CHANNEL_UPDATE":
        wrappedData = new ChannelUpdateEventData(data as any);
        break;
      case "CHANNEL_DELETE":
        wrappedData = new ChannelDeleteEventData(data as any);
        break;
      case "INTERACTION_CREATE":
        wrappedData = new InteractionCreateEventData(data as any);
        break;
      case "TYPING_START":
        wrappedData = new TypingStartEventData(data as any);
        break;
      case "MESSAGE_REACTION_ADD":
        wrappedData = new MessageReactionAddEventData(data as any);
        break;
      case "MESSAGE_REACTION_REMOVE":
        wrappedData = new MessageReactionRemoveEventData(data as any);
        break;
      case "MESSAGE_REACTION_REMOVE_ALL":
        wrappedData = new MessageReactionRemoveAllEventData(data as any);
        break;
      case "MESSAGE_REACTION_REMOVE_EMOJI":
        wrappedData = new MessageReactionRemoveEmojiEventData(data as any);
        break;
      case "PRESENCE_UPDATE":
        wrappedData = new PresenceUpdateEventData(data as any);
        break;
      case "VOICE_STATE_UPDATE":
        wrappedData = new VoiceStateUpdateEventData(data as any);
        break;
      case "USER_UPDATE":
        wrappedData = new UserUpdateEventData(data as any);
        break;
      default:
        // For any events we don't explicitly handle, pass through as-is
        wrappedData = data;
    }

    (super.emit as any)(event, wrappedData);
  }

  /**
   * Override emit to ensure proper typing for user-facing API
   */
  public override emit<K extends keyof TypicordEvents>(
    event: K,
    data: TypicordEvents[K]
  ): void {
    super.emit(event, data);
  } /**
   * Sends a message to a channel - the bread and butter of Discord bots!
   * @param channelId Where to send the message
   * @param content What to say
   * @param options Extra stuff like replying to a message, embeds, etc.
   */
  async sendMessage(
    channelId: string,
    content: string,
    options?: {
      message_reference?: { message_id: string };
      tts?: boolean;
      embeds?: any[];
      allowed_mentions?: any;
      components?: any[];
      sticker_ids?: string[];
      files?: any[];
    }
  ) {
    const body: any = { content, ...options };
    const data = await this.rest.post(`/channels/${channelId}/messages`, body);
    return new Message(this, data as GatewayMessage);
  }

  /**
   * Fetches a specific channel by ID
   * @param channelId The channel ID to fetch
   */
  async fetchChannel(channelId: string): Promise<Channel> {
    const data = await this.rest.get(`/channels/${channelId}`);
    return new Channel(this, data as ChannelData);
  }

  /**
   * Fetches a specific guild by ID
   * @param guildId The guild ID to fetch
   */
  async fetchGuild(guildId: string): Promise<Guild> {
    const data = await this.rest.get(`/guilds/${guildId}`);
    const guild = new Guild(this, data as any);
    this.cache.guilds.set(guildId, data);
    return guild;
  }

  /**
   * Fetches a specific user by ID
   * @param userId The user ID to fetch
   */
  async fetchUser(userId: string): Promise<User> {
    const data = await this.rest.get(`/users/${userId}`);
    const user = new User(data as any);
    this.cache.users.set(userId, data);
    return user;
  }

  /**
   * Creates a DM channel with a user
   * @param userId The user to create a DM with
   */
  async createDM(userId: string): Promise<Channel> {
    const data = await this.rest.post("/users/@me/channels", {
      recipient_id: userId,
    });
    return new Channel(this, data as ChannelData);
  }

  /**
   * Fetches all guilds the bot is in
   */
  async fetchGuilds(
    options: {
      before?: string;
      after?: string;
      limit?: number;
      with_counts?: boolean;
    } = {}
  ): Promise<Guild[]> {
    const query = new URLSearchParams();
    if (options.before) query.set("before", options.before);
    if (options.after) query.set("after", options.after);
    if (options.limit)
      query.set("limit", Math.min(options.limit, 200).toString());
    if (options.with_counts) query.set("with_counts", "true");

    const guilds = await this.rest.get(`/users/@me/guilds?${query}`);
    return (guilds as any[]).map((data: any) => {
      this.cache.guilds.set(data.id, data);
      return new Guild(this, data);
    });
  }

  /**
   * Leaves a guild
   * @param guildId The guild to leave
   */
  async leaveGuild(guildId: string): Promise<void> {
    await this.rest.delete(`/users/@me/guilds/${guildId}`);
    this.cache.guilds.delete(guildId);
  }

  /**
   * Sets the bot's activity/status
   * @param options Activity options
   */
  setActivity(options: {
    name: string;
    type?: 0 | 1 | 2 | 3 | 4 | 5; // Playing, Streaming, Listening, Watching, Custom, Competing
    url?: string;
    status?: "online" | "dnd" | "idle" | "invisible";
  }): void {
    const payload = {
      op: 3, // PRESENCE_UPDATE
      d: {
        since: null,
        activities: [
          {
            name: options.name,
            type: options.type ?? 0,
            url: options.url,
          },
        ],
        status: options.status ?? "online",
        afk: false,
      },
    };

    this._gateway.sendRawPayload(payload);
  }

  /**
   * Gets the bot's application info
   */
  async fetchApplication(): Promise<any> {
    return this.rest.get("/oauth2/applications/@me");
  }

  /**
   * Fetches an invite by code
   * @param code The invite code
   * @param withCounts Whether to include member counts
   */
  async fetchInvite(code: string, withCounts: boolean = false): Promise<any> {
    const query = withCounts ? "?with_counts=true" : "";
    return this.rest.get(`/invites/${code}${query}`);
  }
}

export enum GatewayIntentBits {
  Guilds = 1,
  GuildMembers = 2,
  GuildModeration = 4,
  GuildEmojisAndStickers = 8,
  GuildIntegrations = 16,
  GuildWebhooks = 32,
  GuildInvites = 64,
  GuildVoiceStates = 128,
  GuildPresences = 256,
  GuildMessages = 512,
  GuildMessageReactions = 1024,
  GuildMessageTyping = 2048,
  DirectMessages = 4096,
  DirectMessageReactions = 8192,
  DirectMessageTyping = 16384,
  MessageContent = 32768,
  GuildScheduledEvents = 65536,
  AutoModerationConfiguration = 1048576,
  AutoModerationExecution = 2097152,
}
