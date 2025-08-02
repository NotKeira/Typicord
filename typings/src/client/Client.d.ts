import { GatewayClient } from "@/gateway/GatewayClient";
import { EventEmitter } from "@/events/EventEmitter";
import { Message } from "@/structures/Message";
import { Guild } from "@/structures/Guild";
import { Channel } from "@/structures/Channel";
import { User } from "@/structures/User";
import { ApplicationCommandManager } from "@/structures/ApplicationCommand";
import type { TypicordEvents } from "@/types/gateway/events";
import { GuildCacheManager } from "@/cache/GuildCacheManager";
import { UserCacheManager } from "@/cache/UserCacheManager";
import { RESTClient } from "@/client/RESTClient";
/**
 * The main Typicord client - this is what you'll be using to interact with Discord!
 * Handles connecting to the gateway, sending messages, and all that good stuff.
 */
export declare class Client extends EventEmitter {
    /**
     * What version of Typicord this is
     */
    static readonly version: string;
    token: string;
    intents: number;
    rest: RESTClient;
    cache: {
        guilds: GuildCacheManager;
        users: UserCacheManager;
    };
    user: import("@/structures/User").User | null;
    guilds: any[];
    commands: ApplicationCommandManager | null;
    private readonly _gateway;
    /**
     * Creates a new Typicord client instance
     * @param token Your bot's token from Discord
     * @param intents What events you want to receive (use GatewayIntentBits)
     */
    constructor(token: string, intents: number);
    /**
     * Actually connects to Discord - this starts everything up!
     */
    connect(): void;
    /**
     * Initializes application commands manager
     * Call this after connecting to set up slash commands
     */
    initializeCommands(): Promise<void>;
    /**
     * Cleanly disconnects from Discord
     */
    disconnect(): void;
    /**
     * Disconnects from Discord and cleans up all resources
     * Call this when you're shutting down your bot to free up connections
     */
    destroy(): void;
    /**
     * Gets our gateway client for advanced usage
     */
    get gateway(): GatewayClient;
    on<K extends keyof TypicordEvents>(event: K, listener: (data: TypicordEvents[K]) => void): this;
    /**
     * Sends a message to a channel - the bread and butter of Discord bots!
     * @param channelId Where to send the message
     * @param content What to say
     * @param options Extra stuff like replying to a message, embeds, etc.
     */
    sendMessage(channelId: string, content: string, options?: {
        message_reference?: {
            message_id: string;
        };
        tts?: boolean;
        embeds?: any[];
        allowed_mentions?: any;
        components?: any[];
        sticker_ids?: string[];
        files?: any[];
    }): Promise<Message>;
    /**
     * Fetches a specific channel by ID
     * @param channelId The channel ID to fetch
     */
    fetchChannel(channelId: string): Promise<Channel>;
    /**
     * Fetches a specific guild by ID
     * @param guildId The guild ID to fetch
     */
    fetchGuild(guildId: string): Promise<Guild>;
    /**
     * Fetches a specific user by ID
     * @param userId The user ID to fetch
     */
    fetchUser(userId: string): Promise<User>;
    /**
     * Creates a DM channel with a user
     * @param userId The user to create a DM with
     */
    createDM(userId: string): Promise<Channel>;
    /**
     * Fetches all guilds the bot is in
     */
    fetchGuilds(options?: {
        before?: string;
        after?: string;
        limit?: number;
        with_counts?: boolean;
    }): Promise<Guild[]>;
    /**
     * Leaves a guild
     * @param guildId The guild to leave
     */
    leaveGuild(guildId: string): Promise<void>;
    /**
     * Sets the bot's activity/status
     * @param options Activity options
     */
    setActivity(options: {
        name: string;
        type?: 0 | 1 | 2 | 3 | 4 | 5;
        url?: string;
        status?: "online" | "dnd" | "idle" | "invisible";
    }): void;
    /**
     * Gets the bot's application info
     */
    fetchApplication(): Promise<any>;
    /**
     * Fetches an invite by code
     * @param code The invite code
     * @param withCounts Whether to include member counts
     */
    fetchInvite(code: string, withCounts?: boolean): Promise<any>;
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