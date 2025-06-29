import { GatewayClient } from "@/gateway/GatewayClient";
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
export declare class Client extends EventEmitter {
    token: string;
    intents: number;
    rest: RESTClient;
    cache: {
        guilds: GuildCacheManager;
        users: UserCacheManager;
    };
    private _gateway;
    /**
     * Create a new Typicord client instance.
     * @param token The bot token
     * @param intents The gateway intents bitfield
     */
    constructor(token: string, intents: number);
    /**
     * Connect to the Discord Gateway.
     */
    connect(): void;
    get gateway(): GatewayClient;
    on<K extends keyof TypicordEvents>(event: K, listener: (data: TypicordEvents[K]) => void): this;
    /**
     * Send a message to a channel via the Discord REST API.
     * @param channelId The channel ID
     * @param content The message content
     * @param options Additional message options (e.g., message_reference)
     */
    sendMessage(channelId: string, content: string, options?: {
        message_reference?: {
            message_id: string;
        };
    }): Promise<Message>;
}
export declare enum GatewayIntentBits {
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
    AutoModerationExecution = 2097152
}
//# sourceMappingURL=Client.d.ts.map