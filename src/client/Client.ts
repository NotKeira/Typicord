// This is replaced at build time by tsup
declare const __CLIENT_VERSION__: string;
import { GatewayClient } from "@/gateway/GatewayClient";

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
import { ReadyEventData } from "@/events/READY";
import { ResumedEventData } from "@/events/RESUMED";
import { MessageCreateEventData } from "@/events/MESSAGE_CREATE";
import { MessageUpdateEventData } from "@/events/MESSAGE_UPDATE";
import { MessageDeleteEventData } from "@/events/MESSAGE_DELETE";
import { MessageDeleteBulkEventData } from "@/events/MESSAGE_DELETE_BULK";
import { GuildCreateEventData } from "@/events/GUILD_CREATE";
import { GuildUpdateEventData } from "@/events/GUILD_UPDATE";
import { GuildDeleteEventData } from "@/events/GUILD_DELETE";
import { GuildMemberAddEventData } from "@/events/GUILD_MEMBER_ADD";
import { GuildMemberUpdateEventData } from "@/events/GUILD_MEMBER_UPDATE";
import { GuildMemberRemoveEventData } from "@/events/GUILD_MEMBER_REMOVE";
import { GuildMembersChunkEventData } from "@/events/GUILD_MEMBERS_CHUNK";
import { GuildRoleCreateEventData } from "@/events/GUILD_ROLE_CREATE";
import { GuildRoleUpdateEventData } from "@/events/GUILD_ROLE_UPDATE";
import { GuildRoleDeleteEventData } from "@/events/GUILD_ROLE_DELETE";
import { GuildBanAddEventData } from "@/events/GUILD_BAN_ADD";
import { GuildBanRemoveEventData } from "@/events/GUILD_BAN_REMOVE";
import { GuildEmojisUpdateEventData } from "@/events/GUILD_EMOJIS_UPDATE";
import { GuildStickersUpdateEventData } from "@/events/GUILD_STICKERS_UPDATE";
import { GuildIntegrationsUpdateEventData } from "@/events/GUILD_INTEGRATIONS_UPDATE";
import { ChannelCreateEventData } from "@/events/CHANNEL_CREATE";
import { ChannelUpdateEventData } from "@/events/CHANNEL_UPDATE";
import { ChannelDeleteEventData } from "@/events/CHANNEL_DELETE";
import { ChannelPinsUpdateEventData } from "@/events/CHANNEL_PINS_UPDATE";
import { ThreadCreateEventData } from "@/events/THREAD_CREATE";
import { ThreadUpdateEventData } from "@/events/THREAD_UPDATE";
import { ThreadDeleteEventData } from "@/events/THREAD_DELETE";
import { ThreadListSyncEventData } from "@/events/THREAD_LIST_SYNC";
import { ThreadMemberUpdateEventData } from "@/events/THREAD_MEMBER_UPDATE";
import { ThreadMembersUpdateEventData } from "@/events/THREAD_MEMBERS_UPDATE";
import { InteractionCreateEventData } from "@/events/INTERACTION_CREATE";
import { InviteCreateEventData } from "@/events/INVITE_CREATE";
import { InviteDeleteEventData } from "@/events/INVITE_DELETE";
import { TypingStartEventData } from "@/events/TYPING_START";
import { MessageReactionAddEventData } from "@/events/MESSAGE_REACTION_ADD";
import { MessageReactionRemoveEventData } from "@/events/MESSAGE_REACTION_REMOVE";
import { MessageReactionRemoveAllEventData } from "@/events/MESSAGE_REACTION_REMOVE_ALL";
import { MessageReactionRemoveEmojiEventData } from "@/events/MESSAGE_REACTION_REMOVE_EMOJI";
import { PresenceUpdateEventData } from "@/events/PRESENCE_UPDATE";
import { VoiceStateUpdateEventData } from "@/events/VOICE_STATE_UPDATE";
import { VoiceServerUpdateEventData } from "@/events/VOICE_SERVER_UPDATE";
import { WebhooksUpdateEventData } from "@/events/WEBHOOKS_UPDATE";
import { UserUpdateEventData } from "@/events/USER_UPDATE";
import { ApplicationCommandPermissionsUpdateEventData } from "@/events/APPLICATION_COMMAND_PERMISSIONS_UPDATE";
// Auto Moderation Events
import { AutoModerationRuleCreateEventData } from "@/events/AUTO_MODERATION_RULE_CREATE";
import { AutoModerationRuleUpdateEventData } from "@/events/AUTO_MODERATION_RULE_UPDATE";
import { AutoModerationRuleDeleteEventData } from "@/events/AUTO_MODERATION_RULE_DELETE";
import { AutoModerationActionExecutionEventData } from "@/events/AUTO_MODERATION_ACTION_EXECUTION";
// Stage Instance Events
import { StageInstanceCreateEventData } from "@/events/STAGE_INSTANCE_CREATE";
import { StageInstanceUpdateEventData } from "@/events/STAGE_INSTANCE_UPDATE";
import { StageInstanceDeleteEventData } from "@/events/STAGE_INSTANCE_DELETE";
// Guild Scheduled Events
import { GuildScheduledEventCreateEventData } from "@/events/GUILD_SCHEDULED_EVENT_CREATE";
import { GuildScheduledEventUpdateEventData } from "@/events/GUILD_SCHEDULED_EVENT_UPDATE";
import { GuildScheduledEventDeleteEventData } from "@/events/GUILD_SCHEDULED_EVENT_DELETE";
import { GuildScheduledEventUserAddEventData } from "@/events/GUILD_SCHEDULED_EVENT_USER_ADD";
import { GuildScheduledEventUserRemoveEventData } from "@/events/GUILD_SCHEDULED_EVENT_USER_REMOVE";
// Poll Events
import { MessagePollVoteAddEventData } from "@/events/MESSAGE_POLL_VOTE_ADD";
import { MessagePollVoteRemoveEventData } from "@/events/MESSAGE_POLL_VOTE_REMOVE";
// Entitlement Events
import { EntitlementCreateEventData } from "@/events/ENTITLEMENT_CREATE";
import { EntitlementUpdateEventData } from "@/events/ENTITLEMENT_UPDATE";
import { EntitlementDeleteEventData } from "@/events/ENTITLEMENT_DELETE";
// Integration Events
import { IntegrationCreateEventData } from "@/events/INTEGRATION_CREATE";
import { IntegrationUpdateEventData } from "@/events/INTEGRATION_UPDATE";
import { IntegrationDeleteEventData } from "@/events/INTEGRATION_DELETE";

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
    ["READY", data => new ReadyEventData(data)],
    ["RESUMED", () => new ResumedEventData()],
    [
      "MESSAGE_CREATE",
      data => {
        const message = new Message(this, data);
        return new MessageCreateEventData(message);
      },
    ],
    ["MESSAGE_UPDATE", data => new MessageUpdateEventData(data)],
    ["MESSAGE_DELETE", data => new MessageDeleteEventData(data)],
    ["MESSAGE_DELETE_BULK", data => new MessageDeleteBulkEventData(data)],
    ["GUILD_CREATE", data => new GuildCreateEventData(data)],
    ["GUILD_UPDATE", data => new GuildUpdateEventData(data)],
    ["GUILD_DELETE", data => new GuildDeleteEventData(data)],
    ["CHANNEL_CREATE", data => new ChannelCreateEventData(data)],
    ["CHANNEL_UPDATE", data => new ChannelUpdateEventData(data)],
    ["CHANNEL_DELETE", data => new ChannelDeleteEventData(data)],
    ["CHANNEL_PINS_UPDATE", data => new ChannelPinsUpdateEventData(data)],
    ["INTERACTION_CREATE", data => new InteractionCreateEventData(data)],
    ["TYPING_START", data => new TypingStartEventData(data)],
    ["MESSAGE_REACTION_ADD", data => new MessageReactionAddEventData(data)],
    [
      "MESSAGE_REACTION_REMOVE",
      data => new MessageReactionRemoveEventData(data),
    ],
    [
      "MESSAGE_REACTION_REMOVE_ALL",
      data => new MessageReactionRemoveAllEventData(data),
    ],
    [
      "MESSAGE_REACTION_REMOVE_EMOJI",
      data => new MessageReactionRemoveEmojiEventData(data),
    ],
    ["PRESENCE_UPDATE", data => new PresenceUpdateEventData(data)],
    ["VOICE_STATE_UPDATE", data => new VoiceStateUpdateEventData(data)],
    ["VOICE_SERVER_UPDATE", data => new VoiceServerUpdateEventData(data)],
    ["USER_UPDATE", data => new UserUpdateEventData(data)],
    [
      "APPLICATION_COMMAND_PERMISSIONS_UPDATE",
      data => new ApplicationCommandPermissionsUpdateEventData(data),
    ],
    ["GUILD_MEMBER_ADD", data => new GuildMemberAddEventData(data)],
    ["GUILD_MEMBER_UPDATE", data => new GuildMemberUpdateEventData(data)],
    ["GUILD_MEMBER_REMOVE", data => new GuildMemberRemoveEventData(data)],
    ["GUILD_MEMBERS_CHUNK", data => new GuildMembersChunkEventData(data)],
    ["GUILD_ROLE_CREATE", data => new GuildRoleCreateEventData(data)],
    ["GUILD_ROLE_UPDATE", data => new GuildRoleUpdateEventData(data)],
    ["GUILD_ROLE_DELETE", data => new GuildRoleDeleteEventData(data)],
    ["GUILD_BAN_ADD", data => new GuildBanAddEventData(data)],
    ["GUILD_BAN_REMOVE", data => new GuildBanRemoveEventData(data)],
    ["GUILD_EMOJIS_UPDATE", data => new GuildEmojisUpdateEventData(data)],
    ["GUILD_STICKERS_UPDATE", data => new GuildStickersUpdateEventData(data)],
    [
      "GUILD_INTEGRATIONS_UPDATE",
      data => new GuildIntegrationsUpdateEventData(data),
    ],
    ["THREAD_CREATE", data => new ThreadCreateEventData(data)],
    ["THREAD_UPDATE", data => new ThreadUpdateEventData(data)],
    ["THREAD_DELETE", data => new ThreadDeleteEventData(data)],
    ["THREAD_LIST_SYNC", data => new ThreadListSyncEventData(data)],
    ["THREAD_MEMBER_UPDATE", data => new ThreadMemberUpdateEventData(data)],
    ["THREAD_MEMBERS_UPDATE", data => new ThreadMembersUpdateEventData(data)],
    ["INVITE_CREATE", data => new InviteCreateEventData(data)],
    ["INVITE_DELETE", data => new InviteDeleteEventData(data)],
    ["WEBHOOKS_UPDATE", data => new WebhooksUpdateEventData(data)],
    [
      "AUTO_MODERATION_RULE_CREATE",
      data => new AutoModerationRuleCreateEventData(data),
    ],
    [
      "AUTO_MODERATION_RULE_UPDATE",
      data => new AutoModerationRuleUpdateEventData(data),
    ],
    [
      "AUTO_MODERATION_RULE_DELETE",
      data => new AutoModerationRuleDeleteEventData(data),
    ],
    [
      "AUTO_MODERATION_ACTION_EXECUTION",
      data => new AutoModerationActionExecutionEventData(data),
    ],
    ["STAGE_INSTANCE_CREATE", data => new StageInstanceCreateEventData(data)],
    ["STAGE_INSTANCE_UPDATE", data => new StageInstanceUpdateEventData(data)],
    ["STAGE_INSTANCE_DELETE", data => new StageInstanceDeleteEventData(data)],
    [
      "GUILD_SCHEDULED_EVENT_CREATE",
      data => new GuildScheduledEventCreateEventData(data),
    ],
    [
      "GUILD_SCHEDULED_EVENT_UPDATE",
      data => new GuildScheduledEventUpdateEventData(data),
    ],
    [
      "GUILD_SCHEDULED_EVENT_DELETE",
      data => new GuildScheduledEventDeleteEventData(data),
    ],
    [
      "GUILD_SCHEDULED_EVENT_USER_ADD",
      data => new GuildScheduledEventUserAddEventData(data),
    ],
    [
      "GUILD_SCHEDULED_EVENT_USER_REMOVE",
      data => new GuildScheduledEventUserRemoveEventData(data),
    ],
    ["MESSAGE_POLL_VOTE_ADD", data => new MessagePollVoteAddEventData(data)],
    [
      "MESSAGE_POLL_VOTE_REMOVE",
      data => new MessagePollVoteRemoveEventData(data),
    ],
    ["ENTITLEMENT_CREATE", data => new EntitlementCreateEventData(data)],
    ["ENTITLEMENT_UPDATE", data => new EntitlementUpdateEventData(data)],
    ["ENTITLEMENT_DELETE", data => new EntitlementDeleteEventData(data)],
    ["INTEGRATION_CREATE", data => new IntegrationCreateEventData(data)],
    ["INTEGRATION_UPDATE", data => new IntegrationUpdateEventData(data)],
    ["INTEGRATION_DELETE", data => new IntegrationDeleteEventData(data)],
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
