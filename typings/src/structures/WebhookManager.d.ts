/**
 * Webhook Management Utilities for Discord API
 * Handles creating, editing, and executing webhooks
 */
import type { RESTClient } from "@/client/RESTClient";
export interface WebhookCreateOptions {
    /** Name of the webhook (1-80 characters) */
    name: string;
    /** Image data for the default webhook avatar */
    avatar?: string | null;
}
export interface WebhookEditOptions {
    /** The default name of the webhook */
    name?: string;
    /** Image data for the default webhook avatar */
    avatar?: string | null;
    /** The new channel id this webhook should be moved to */
    channel_id?: string;
}
export interface WebhookExecuteOptions {
    /** The message contents (up to 2000 characters) */
    content?: string;
    /** Override the default username of the webhook */
    username?: string;
    /** Override the default avatar of the webhook */
    avatar_url?: string;
    /** True if this is a TTS message */
    tts?: boolean;
    /** Embedded rich content */
    embeds?: any[];
    /** Allowed mentions for the message */
    allowed_mentions?: {
        parse?: ("roles" | "users" | "everyone")[];
        roles?: string[];
        users?: string[];
        replied_user?: boolean;
    };
    /** The components to include with the message */
    components?: any[];
    /** Contents of the file being sent */
    files?: Buffer[];
    /** JSON encoded body of non-file params */
    payload_json?: string;
    /** Attachment objects with filename and description */
    attachments?: any[];
    /** Message flags combined as a bitfield */
    flags?: number;
    /** Name of thread to create (requires the webhook channel to be a forum channel) */
    thread_name?: string;
}
export interface Webhook {
    /** The id of the webhook */
    id: string;
    /** The type of the webhook */
    type: number;
    /** The guild id this webhook is for, if any */
    guild_id?: string | null;
    /** The channel id this webhook is for, if any */
    channel_id?: string | null;
    /** The user this webhook was created by (not returned when getting a webhook with its token) */
    user?: any;
    /** The default name of the webhook */
    name?: string | null;
    /** The default user avatar hash of the webhook */
    avatar?: string | null;
    /** The secure token of the webhook (returned for Incoming Webhooks) */
    token?: string;
    /** The bot/OAuth2 application that created this webhook */
    application_id?: string | null;
    /** The guild of the channel that this webhook is following (returned for Channel Follower Webhooks) */
    source_guild?: any;
    /** The channel that this webhook is following (returned for Channel Follower Webhooks) */
    source_channel?: any;
    /** The url used for executing the webhook (returned by the webhooks OAuth2 flow) */
    url?: string;
}
export declare class WebhookManager {
    private readonly rest;
    constructor(rest: RESTClient);
    /**
     * Create a new webhook for a channel
     */
    create(channelId: string, options: WebhookCreateOptions): Promise<Webhook>;
    /**
     * Get all webhooks for a channel
     */
    getChannelWebhooks(channelId: string): Promise<Webhook[]>;
    /**
     * Get all webhooks for a guild
     */
    getGuildWebhooks(guildId: string): Promise<Webhook[]>;
    /**
     * Get a webhook by ID
     */
    get(webhookId: string): Promise<Webhook>;
    /**
     * Get a webhook by ID and token
     */
    getWithToken(webhookId: string, token: string): Promise<Webhook>;
    /**
     * Edit a webhook
     */
    edit(webhookId: string, options: WebhookEditOptions): Promise<Webhook>;
    /**
     * Edit a webhook with token
     */
    editWithToken(webhookId: string, token: string, options: WebhookEditOptions): Promise<Webhook>;
    /**
     * Delete a webhook
     */
    delete(webhookId: string): Promise<void>;
    /**
     * Delete a webhook with token
     */
    deleteWithToken(webhookId: string, token: string): Promise<void>;
    /**
     * Execute a webhook
     */
    execute(webhookId: string, token: string, options: WebhookExecuteOptions): Promise<any>;
    /**
     * Execute a webhook and wait for the message response
     */
    executeAndWait(webhookId: string, token: string, options: WebhookExecuteOptions): Promise<any>;
    /**
     * Get a webhook message
     */
    getMessage(webhookId: string, token: string, messageId: string, threadId?: string): Promise<any>;
    /**
     * Edit a webhook message
     */
    editMessage(webhookId: string, token: string, messageId: string, options: {
        content?: string;
        embeds?: any[];
        allowed_mentions?: any;
        components?: any[];
        files?: Buffer[];
        attachments?: any[];
    }, threadId?: string): Promise<any>;
    /**
     * Delete a webhook message
     */
    deleteMessage(webhookId: string, token: string, messageId: string, threadId?: string): Promise<void>;
    /**
     * Get webhook URL for easy access
     */
    static getWebhookUrl(webhookId: string, token: string): string;
    /**
     * Parse webhook URL to get ID and token
     */
    static parseWebhookUrl(url: string): {
        id: string;
        token: string;
    } | null;
}
//# sourceMappingURL=WebhookManager.d.ts.map