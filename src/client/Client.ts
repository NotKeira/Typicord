import { GatewayClient } from "@/gateway/GatewayClient";
// import { GatewayEvents } from "@/gateway/constants";
import { EventEmitter } from "@/events/EventEmitter";
import { Message } from "@/structures/Message";
import type { TypicordEvents } from "@/types/gateway/events";
import { GuildCacheManager } from "@/cache/GuildCacheManager";
import { UserCacheManager } from "@/cache/UserCacheManager";
export class Client extends EventEmitter {
  private gatewayInstance: GatewayClient;
  public token: string;
  public intents: number;
  public cache: {
    guilds: GuildCacheManager;
    users: UserCacheManager;
  };

  constructor(token: string, intents: number) {
    super();
    this.token = token;
    this.intents = intents;
    this.gatewayInstance = new GatewayClient(this);
    this.cache = {
      guilds: new GuildCacheManager(),
      users: new UserCacheManager(),
    };
  }

  public connect(): void {
    this.gatewayInstance.connect();
  }

  public get gateway(): GatewayClient {
    return this.gatewayInstance;
  }

  public override on<K extends keyof TypicordEvents>(
    event: K,
    listener: (data: TypicordEvents[K]) => void
  ): this {
    super.on(event, listener);
    return this;
  }

  async sendMessage(
    channelId: string,
    content: string,
    options?: { message_reference?: { message_id: string } }
  ) {
    const body: any = { content, ...options };
    const url = `https://discord.com/api/v10/channels/${channelId}/messages`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${this.token}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Failed to send message: ${res.statusText}`);
    const data = await res.json();
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
