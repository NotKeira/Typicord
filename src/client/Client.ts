// This is replaced at build time by tsup
declare const __CLIENT_VERSION__: string;
import { GatewayClient } from "@/gateway/GatewayClient";

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
