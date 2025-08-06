// This is replaced at build time by tsup
declare const __CLIENT_VERSION__: string;
import { ShardManager } from "@/gateway/ShardManager";
import { RateLimitManager } from "@/client/RateLimitManager";

import { EnhancedClient } from "@/events/EnhancedClient";
import { Message } from "@/structures/Message";
import { Guild } from "@/structures/Guild";
import { Channel } from "@/structures/Channel";
import { User } from "@/structures/User";
import { ApplicationCommandManager } from "@/structures/ApplicationCommand";
import type { ClientEvents } from "@/types/ClientEvents";
import type { Message as GatewayMessage } from "@/types/gateway/structures/Message";
import type { Channel as ChannelData } from "@/types/structures/channel";
import { GuildCacheManager } from "@/cache/GuildCacheManager";
import { UserCacheManager } from "@/cache/UserCacheManager";
import { RESTClient } from "@/client/RESTClient";

// Import all event data classes
import { ReadyData } from "@/events/READY";
import { ResumedData } from "@/events/RESUMED";
import { MessageCreateData } from "@/events/MESSAGE_CREATE";
import { MessageUpdateData } from "@/events/MESSAGE_UPDATE";
import { MessageDeleteData } from "@/events/MESSAGE_DELETE";
import { MessageDeleteBulkData } from "@/events/MESSAGE_DELETE_BULK";
import { GuildCreateData } from "@/events/GUILD_CREATE";
import { GuildUpdateData } from "@/events/GUILD_UPDATE";
import { GuildDeleteData } from "@/events/GUILD_DELETE";
import { GuildMemberAddData } from "@/events/GUILD_MEMBER_ADD";
import { GuildMemberUpdateData } from "@/events/GUILD_MEMBER_UPDATE";
import { GuildMemberRemoveData } from "@/events/GUILD_MEMBER_REMOVE";
import { GuildMembersChunkData } from "@/events/GUILD_MEMBERS_CHUNK";
import { GuildRoleCreateData } from "@/events/GUILD_ROLE_CREATE";
import { GuildRoleUpdateData } from "@/events/GUILD_ROLE_UPDATE";
import { GuildRoleDeleteData } from "@/events/GUILD_ROLE_DELETE";
import { GuildBanAddData } from "@/events/GUILD_BAN_ADD";
import { GuildBanRemoveData } from "@/events/GUILD_BAN_REMOVE";
import { GuildEmojisUpdateData } from "@/events/GUILD_EMOJIS_UPDATE";
import { GuildStickersUpdateData } from "@/events/GUILD_STICKERS_UPDATE";
import { GuildIntegrationsUpdateData } from "@/events/GUILD_INTEGRATIONS_UPDATE";
import { ChannelCreateData } from "@/events/CHANNEL_CREATE";
import { ChannelUpdateData } from "@/events/CHANNEL_UPDATE";
import { ChannelDeleteData } from "@/events/CHANNEL_DELETE";
import { ChannelPinsUpdateData } from "@/events/CHANNEL_PINS_UPDATE";
import { ThreadCreateData } from "@/events/THREAD_CREATE";
import { ThreadUpdateData } from "@/events/THREAD_UPDATE";
import { ThreadDeleteData } from "@/events/THREAD_DELETE";
import { ThreadListSyncData } from "@/events/THREAD_LIST_SYNC";
import { ThreadMemberUpdateData } from "@/events/THREAD_MEMBER_UPDATE";
import { ThreadMembersUpdateData } from "@/events/THREAD_MEMBERS_UPDATE";
import { InteractionCreateData } from "@/events/INTERACTION_CREATE";
import { InviteCreateData } from "@/events/INVITE_CREATE";
import { InviteDeleteData } from "@/events/INVITE_DELETE";
import { TypingStartData } from "@/events/TYPING_START";
import { MessageReactionAddData } from "@/events/MESSAGE_REACTION_ADD";
import { MessageReactionRemoveData } from "@/events/MESSAGE_REACTION_REMOVE";
import { MessageReactionRemoveAllData } from "@/events/MESSAGE_REACTION_REMOVE_ALL";
import { MessageReactionRemoveEmojiData } from "@/events/MESSAGE_REACTION_REMOVE_EMOJI";
import { PresenceUpdateData } from "@/events/PRESENCE_UPDATE";
import { VoiceStateUpdateData } from "@/events/VOICE_STATE_UPDATE";
import { VoiceServerUpdateData } from "@/events/VOICE_SERVER_UPDATE";
import { WebhooksUpdateData } from "@/events/WEBHOOKS_UPDATE";
import { UserUpdateData } from "@/events/USER_UPDATE";
import { ApplicationCommandPermissionsUpdateData } from "@/events/APPLICATION_COMMAND_PERMISSIONS_UPDATE";
// Auto Moderation Events
import { AutoModerationRuleCreateData } from "@/events/AUTO_MODERATION_RULE_CREATE";
import { AutoModerationRuleUpdateData } from "@/events/AUTO_MODERATION_RULE_UPDATE";
import { AutoModerationRuleDeleteData } from "@/events/AUTO_MODERATION_RULE_DELETE";
import { AutoModerationActionExecutionData } from "@/events/AUTO_MODERATION_ACTION_EXECUTION";
// Stage Instance Events
import { StageInstanceCreateData } from "@/events/STAGE_INSTANCE_CREATE";
import { StageInstanceUpdateData } from "@/events/STAGE_INSTANCE_UPDATE";
import { StageInstanceDeleteData } from "@/events/STAGE_INSTANCE_DELETE";
// Guild Scheduled Events
import { GuildScheduledEventCreateData } from "@/events/GUILD_SCHEDULED_EVENT_CREATE";
import { GuildScheduledEventUpdateData } from "@/events/GUILD_SCHEDULED_EVENT_UPDATE";
import { GuildScheduledEventDeleteData } from "@/events/GUILD_SCHEDULED_EVENT_DELETE";
import { GuildScheduledEventUserAddData } from "@/events/GUILD_SCHEDULED_EVENT_USER_ADD";
import { GuildScheduledEventUserRemoveData } from "@/events/GUILD_SCHEDULED_EVENT_USER_REMOVE";
// Poll Events
import { MessagePollVoteAddData } from "@/events/MESSAGE_POLL_VOTE_ADD";
import { MessagePollVoteRemoveData } from "@/events/MESSAGE_POLL_VOTE_REMOVE";
// Entitlement Events
import { EntitlementCreateData } from "@/events/ENTITLEMENT_CREATE";
import { EntitlementUpdateData } from "@/events/ENTITLEMENT_UPDATE";
import { EntitlementDeleteData } from "@/events/ENTITLEMENT_DELETE";
// Integration Events
import { IntegrationCreateData } from "@/events/INTEGRATION_CREATE";
import { IntegrationUpdateData } from "@/events/INTEGRATION_UPDATE";
import { IntegrationDeleteData } from "@/events/INTEGRATION_DELETE";

/**
 * The main Typicord client - this is what you'll be using to interact with Discord!
 * Handles connecting to the gateway, sending messages, and all that good stuff.
 */
export class Client extends EnhancedClient {
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
  private readonly _shardManager: ShardManager;
  private readonly _rateLimitManager: RateLimitManager;

  /**
   * Creates a new Typicord client instance
   * @param token Your bot's token from Discord
   * @param intents What events you want to receive (use GatewayIntentBits)
   * @param options Optional client configuration
   */
  constructor(
    token: string,
    intents: number,
    options?: {
      shardCount?: number;
      shardIds?: number[];
      totalShards?: number;
    }
  ) {
    super();
    this.token = token;
    this.intents = intents;
    this._rateLimitManager = new RateLimitManager();
    this.rest = new RESTClient({
      token,
      rateLimitManager: this._rateLimitManager,
    });
    this._shardManager = new ShardManager({
      token,
      intents,
      shardCount: options?.shardCount || 1,
      shardIds: options?.shardIds,
      totalShards: options?.totalShards,
    });
    this.cache = {
      guilds: new GuildCacheManager(),
      users: new UserCacheManager(),
    };
  }

  /**
   * Actually connects to Discord - this starts everything up!
   */
  public connect(): void {
    this._shardManager.spawn();
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
    this._shardManager.destroy();
  }

  /**
   * Disconnects from Discord and cleans up all resources
   * Call this when you're shutting down your bot to free up connections
   */
  destroy() {
    this._shardManager.destroy();
    this.rest.destroy();
  }

  /**
   * Gets our shard manager for advanced usage
   */
  public get shards(): ShardManager {
    return this._shardManager;
  }

  /**
   * Gets the rate limit manager for advanced usage
   */
  public get rateLimits(): RateLimitManager {
    return this._rateLimitManager;
  }

  public override on<K extends keyof ClientEvents>(
    event: K,
    listener: (data: ClientEvents[K]) => void
  ): this {
    super.on(event, listener);
    return this;
  }

  /**
   * Listens for an event once - the listener is removed after the first emission
   * @param event The event to listen for
   * @param listener The function to call when the event is emitted
   */
  public override once<K extends keyof ClientEvents>(
    event: K,
    listener: (data: ClientEvents[K]) => void
  ): this {
    super.once(event, listener);
    return this;
  }

  /**
   * Event handler mapping for efficient event processing
   * @private
   */
  private readonly eventHandlers = new Map<string, (data: any) => any>([
    ["READY", data => new ReadyData(data)],
    ["RESUMED", () => new ResumedData()],
    [
      "MESSAGE_CREATE",
      data => {
        return new MessageCreateData(data, this.rest);
      },
    ],
    ["MESSAGE_UPDATE", data => new MessageUpdateData(data)],
    ["MESSAGE_DELETE", data => new MessageDeleteData(data)],
    ["MESSAGE_DELETE_BULK", data => new MessageDeleteBulkData(data)],
    ["GUILD_CREATE", data => new GuildCreateData(data, this.rest)],
    ["GUILD_UPDATE", data => new GuildUpdateData(data)],
    ["GUILD_DELETE", data => new GuildDeleteData(data)],
    ["CHANNEL_CREATE", data => new ChannelCreateData(data)],
    ["CHANNEL_UPDATE", data => new ChannelUpdateData(data)],
    ["CHANNEL_DELETE", data => new ChannelDeleteData(data)],
    ["CHANNEL_PINS_UPDATE", data => new ChannelPinsUpdateData(data)],
    ["INTERACTION_CREATE", data => new InteractionCreateData(data, this.rest)],
    ["TYPING_START", data => new TypingStartData(data)],
    ["MESSAGE_REACTION_ADD", data => new MessageReactionAddData(data)],
    ["MESSAGE_REACTION_REMOVE", data => new MessageReactionRemoveData(data)],
    [
      "MESSAGE_REACTION_REMOVE_ALL",
      data => new MessageReactionRemoveAllData(data),
    ],
    [
      "MESSAGE_REACTION_REMOVE_EMOJI",
      data => new MessageReactionRemoveEmojiData(data),
    ],
    ["PRESENCE_UPDATE", data => new PresenceUpdateData(data)],
    ["VOICE_STATE_UPDATE", data => new VoiceStateUpdateData(data)],
    ["VOICE_SERVER_UPDATE", data => new VoiceServerUpdateData(data)],
    ["USER_UPDATE", data => new UserUpdateData(data)],
    [
      "APPLICATION_COMMAND_PERMISSIONS_UPDATE",
      data => new ApplicationCommandPermissionsUpdateData(data),
    ],
    ["GUILD_MEMBER_ADD", data => new GuildMemberAddData(data, this.rest)],
    ["GUILD_MEMBER_UPDATE", data => new GuildMemberUpdateData(data)],
    ["GUILD_MEMBER_REMOVE", data => new GuildMemberRemoveData(data, this.rest)],
    ["GUILD_MEMBERS_CHUNK", data => new GuildMembersChunkData(data)],
    ["GUILD_ROLE_CREATE", data => new GuildRoleCreateData(data)],
    ["GUILD_ROLE_UPDATE", data => new GuildRoleUpdateData(data)],
    ["GUILD_ROLE_DELETE", data => new GuildRoleDeleteData(data)],
    ["GUILD_BAN_ADD", data => new GuildBanAddData(data)],
    ["GUILD_BAN_REMOVE", data => new GuildBanRemoveData(data)],
    ["GUILD_EMOJIS_UPDATE", data => new GuildEmojisUpdateData(data)],
    ["GUILD_STICKERS_UPDATE", data => new GuildStickersUpdateData(data)],
    [
      "GUILD_INTEGRATIONS_UPDATE",
      data => new GuildIntegrationsUpdateData(data),
    ],
    ["THREAD_CREATE", data => new ThreadCreateData(data)],
    ["THREAD_UPDATE", data => new ThreadUpdateData(data)],
    ["THREAD_DELETE", data => new ThreadDeleteData(data)],
    ["THREAD_LIST_SYNC", data => new ThreadListSyncData(data)],
    ["THREAD_MEMBER_UPDATE", data => new ThreadMemberUpdateData(data)],
    ["THREAD_MEMBERS_UPDATE", data => new ThreadMembersUpdateData(data)],
    ["INVITE_CREATE", data => new InviteCreateData(data)],
    ["INVITE_DELETE", data => new InviteDeleteData(data)],
    ["WEBHOOKS_UPDATE", data => new WebhooksUpdateData(data)],
    [
      "AUTO_MODERATION_RULE_CREATE",
      data => new AutoModerationRuleCreateData(data),
    ],
    [
      "AUTO_MODERATION_RULE_UPDATE",
      data => new AutoModerationRuleUpdateData(data),
    ],
    [
      "AUTO_MODERATION_RULE_DELETE",
      data => new AutoModerationRuleDeleteData(data),
    ],
    [
      "AUTO_MODERATION_ACTION_EXECUTION",
      data => new AutoModerationActionExecutionData(data),
    ],
    ["STAGE_INSTANCE_CREATE", data => new StageInstanceCreateData(data)],
    ["STAGE_INSTANCE_UPDATE", data => new StageInstanceUpdateData(data)],
    ["STAGE_INSTANCE_DELETE", data => new StageInstanceDeleteData(data)],
    [
      "GUILD_SCHEDULED_EVENT_CREATE",
      data => new GuildScheduledEventCreateData(data),
    ],
    [
      "GUILD_SCHEDULED_EVENT_UPDATE",
      data => new GuildScheduledEventUpdateData(data),
    ],
    [
      "GUILD_SCHEDULED_EVENT_DELETE",
      data => new GuildScheduledEventDeleteData(data),
    ],
    [
      "GUILD_SCHEDULED_EVENT_USER_ADD",
      data => new GuildScheduledEventUserAddData(data),
    ],
    [
      "GUILD_SCHEDULED_EVENT_USER_REMOVE",
      data => new GuildScheduledEventUserRemoveData(data),
    ],
    ["MESSAGE_POLL_VOTE_ADD", data => new MessagePollVoteAddData(data)],
    ["MESSAGE_POLL_VOTE_REMOVE", data => new MessagePollVoteRemoveData(data)],
    ["ENTITLEMENT_CREATE", data => new EntitlementCreateData(data)],
    ["ENTITLEMENT_UPDATE", data => new EntitlementUpdateData(data)],
    ["ENTITLEMENT_DELETE", data => new EntitlementDeleteData(data)],
    ["INTEGRATION_CREATE", data => new IntegrationCreateData(data)],
    ["INTEGRATION_UPDATE", data => new IntegrationUpdateData(data)],
    ["INTEGRATION_DELETE", data => new IntegrationDeleteData(data)],
  ]);

  /**
   * Internal emit method for raw gateway data that needs to be wrapped
   * @internal This method is used internally by the gateway client
   */
  public emitRaw(event: string, data: any): void {
    // Use event handler mapping for efficient processing
    const handler = this.eventHandlers.get(event);
    const wrappedData = handler ? handler(data) : data;

    (super.emit as any)(event, wrappedData);
  }

  /**
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

    // Send to all shards
    this._shardManager.broadcast(payload);
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
