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
 * The main Typicord client - this is what you'll be using to interact with Discord!
 * Handles connecting to the gateway, sending messages, and all that good stuff.
 */
export class Client extends EventEmitter {
  /**
   * What version of Typicord this is
   */
  public static version: string =
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
  private _gateway: GatewayClient;

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
   * Sends a message to a channel - the bread and butter of Discord bots!
   * @param channelId Where to send the message
   * @param content What to say
   * @param options Extra stuff like replying to a message
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
