// This is replaced at build time by tsup
declare const __CLIENT_VERSION__: string;
import { GatewayClient } from "@/gateway/GatewayClient";
// import { GatewayEvents } from "@/gateway/constants";
import { EventEmitter } from "@/events/EventEmitter";
import { Message } from "@/structures/Message";
import type { TypicordEvents } from "@/types/gateway/events";
import { GuildCacheManager } from "@/cache/GuildCacheManager";
import { UserCacheManager } from "@/cache/UserCacheManager";
import { RESTClient } from "@/client/RESTClient";

/**
 * The main Typicord client for interacting with Discord's API and Gateway.
 * Handles events, caching, and REST actions.
 */
export class Client extends EventEmitter {
  /**
   * The Typicord client version.
   */
  public static version: string = __CLIENT_VERSION__;
  public token: string;
  public intents: number;
  public rest: RESTClient;
  public cache: {
    guilds: GuildCacheManager;
    users: UserCacheManager;
  };
  public user: import("@/structures/User").User | null = null;
  public guilds: any[] = [];
  private _gateway: GatewayClient;

  /**
   * Create a new Typicord client instance.
   * @param token The bot token
   * @param intents The gateway intents bitfield
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
   * Connect to the Discord Gateway.
   */
  public connect(): void {
    this._gateway.connect();
  }

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
   * Send a message to a channel via the Discord REST API.
   * @param channelId The channel ID
   * @param content The message content
   * @param options Additional message options (e.g., message_reference)
   */
  async sendMessage(
    channelId: string,
    content: string,
    options?: { message_reference?: { message_id: string } }
  ) {
    const body: any = { content, ...options };
    const data = await this.rest.post(`/channels/${channelId}/messages`, body);
    return new Message(this, data);
  }
}

export enum GatewayIntentBits {
  Guilds = 1 << 0,
  GuildMembers = 1 << 1,
  GuildModeration = 1 << 2,
  GuildEmojisAndStickers = 1 << 3,
  GuildIntegrations = 1 << 4,
  GuildWebhooks = 1 << 5,
  GuildInvites = 1 << 6,
  GuildVoiceStates = 1 << 7,
  GuildPresences = 1 << 8,
  GuildMessages = 1 << 9,
  GuildMessageReactions = 1 << 10,
  GuildMessageTyping = 1 << 11,
  DirectMessages = 1 << 12,
  DirectMessageReactions = 1 << 13,
  DirectMessageTyping = 1 << 14,
  MessageContent = 1 << 15,
  GuildScheduledEvents = 1 << 16,
  AutoModerationConfiguration = 1 << 20,
  AutoModerationExecution = 1 << 21,
}
