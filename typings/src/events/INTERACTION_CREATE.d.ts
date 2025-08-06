/**
 * INTERACTION_CREATE Event
 *
 * Emitted when a user interacts with the bot (slash commands, buttons, etc.).
 */
import type { RawInteractionData } from "@/types/gateway/interaction";
import type { RESTClient } from "@/client/RESTClient";
export declare class InteractionCreateData {
    data: RawInteractionData;
    private readonly _client?;
    private _responded;
    constructor(data: RawInteractionData, client?: RESTClient);
    /**
     * The interaction data
     */
    get interaction(): RawInteractionData;
    /**
     * Interaction name
     */
    get name(): string | undefined;
    /**
     * Interaction ID
     */
    get id(): string;
    /**
     * Interaction type
     */
    get type(): number;
    /**
     * Application ID
     */
    get applicationId(): string;
    /**
     * Interaction token
     */
    get token(): string;
    /**
     * Channel ID where the interaction occurred
     */
    get channelId(): string | undefined;
    /**
     * Guild ID (if in a guild)
     */
    get guildId(): string | undefined;
    /**
     * The user who triggered the interaction
     */
    get user(): import("../types/structures/user").User | undefined;
    /**
     * The guild member (if in a guild)
     */
    get member(): import("../types/structures/guild").GuildMember | undefined;
    /**
     * Whether this interaction has been responded to
     */
    get isResponded(): boolean;
    /**
     * Check if this is a slash command interaction
     */
    isSlashCommand(): boolean;
    /**
     * Check if this is a message component interaction (button, select menu)
     */
    isMessageComponent(): boolean;
    /**
     * Check if this is an autocomplete interaction
     */
    isAutocomplete(): boolean;
    /**
     * Check if this is a modal submit interaction
     */
    isModalSubmit(): boolean;
    /**
     * Check if this interaction is from a guild
     */
    isInGuild(): boolean;
    /**
     * Check if this interaction is from a DM
     */
    isInDM(): boolean;
    /**
     * Get the custom ID (for components and modals)
     */
    get customId(): string | undefined;
    /**
     * Get the interaction options (for slash commands)
     */
    get options(): {
        name: string;
        type: number;
        value?: string | number | boolean;
        options?: Array<{
            name: string;
            type: number;
            value?: string | number | boolean;
        }>;
        focused?: boolean;
    }[];
    /**
     * Get a specific option value by name
     */
    getOption(name: string): any;
    /**
     * Get string option value
     */
    getStringOption(name: string): string | undefined;
    /**
     * Get integer option value
     */
    getIntegerOption(name: string): number | undefined;
    /**
     * Get number option value
     */
    getNumberOption(name: string): number | undefined;
    /**
     * Get boolean option value
     */
    getBooleanOption(name: string): boolean | undefined;
    /**
     * Get the component values (for select menus)
     */
    get values(): string[];
    /**
     * Get the resolved data (users, roles, channels, etc.)
     */
    get resolved(): {
        users?: Record<string, import("../types/structures/user").User>;
        members?: Record<string, import("../types/structures/guild").GuildMember>;
        roles?: Record<string, any>;
        channels?: Record<string, any>;
        messages?: Record<string, any>;
        attachments?: Record<string, any>;
    } | undefined;
    /**
     * Get resolved user by ID
     */
    getResolvedUser(userId: string): import("../types/structures/user").User | undefined;
    /**
     * Get resolved member by ID
     */
    getResolvedMember(userId: string): import("../types/structures/guild").GuildMember | undefined;
    /**
     * Get resolved role by ID
     */
    getResolvedRole(roleId: string): any;
    /**
     * Get resolved channel by ID
     */
    getResolvedChannel(channelId: string): any;
    /**
     * Get the target ID (for context menu commands)
     */
    get targetId(): string | undefined;
    /**
     * Check if this is a user context menu command
     */
    isUserCommand(): boolean;
    /**
     * Check if this is a message context menu command
     */
    isMessageCommand(): boolean;
    /**
     * Get the message attached to this interaction (for components)
     */
    get message(): import("../types/structures/message").Message | undefined;
    /**
     * Get the app permissions in this channel
     */
    get appPermissions(): string | undefined;
    /**
     * Get the user's locale
     */
    get locale(): string | undefined;
    /**
     * Get the guild's locale
     */
    get guildLocale(): string | undefined;
    /**
     * Get modal components (for modal submits)
     */
    get components(): {
        type: number;
        components: Array<{
            type: number;
            custom_id: string;
            value: string;
        }>;
    }[];
    /**
     * Get modal field value by custom ID
     */
    getModalValue(customId: string): string | undefined;
    /**
     * Reply to the interaction
     */
    reply(options: {
        content?: string;
        embeds?: any[];
        components?: any[];
        files?: any[];
        flags?: number;
        ephemeral?: boolean;
    }): Promise<unknown>;
    /**
     * Defer the interaction response (shows "thinking..." state)
     */
    defer(options?: {
        ephemeral?: boolean;
    }): Promise<unknown>;
    /**
     * Follow up to the interaction (after initial response or defer)
     */
    followUp(options: {
        content?: string;
        embeds?: any[];
        components?: any[];
        files?: any[];
        ephemeral?: boolean;
    }): Promise<unknown>;
    /**
     * Edit the original interaction response
     */
    editReply(options: {
        content?: string;
        embeds?: any[];
        components?: any[];
        files?: any[];
    }): Promise<unknown>;
    /**
     * Delete the original interaction response
     */
    deleteReply(): Promise<unknown>;
    /**
     * Show a modal to the user (only works for certain interaction types)
     */
    showModal(options: {
        title: string;
        custom_id: string;
        components: any[];
    }): Promise<unknown>;
    /**
     * Update the message that triggered this interaction (for component interactions)
     */
    update(options: {
        content?: string;
        embeds?: any[];
        components?: any[];
    }): Promise<unknown>;
    /**
     * Send an autocomplete response (for autocomplete interactions)
     */
    autocomplete(choices: Array<{
        name: string;
        value: string | number;
    }>): Promise<unknown>;
    /**
     * Create a deferred response (thinking...)
     * @deprecated Use defer() instead for actual API calls
     */
    deferResponse(ephemeral?: boolean): {
        type: number;
        data?: {
            flags?: number;
        };
    };
    /**
     * Create a response with content
     * @deprecated Use reply() instead for actual API calls
     */
    replyResponse(content: string, ephemeral?: boolean): {
        type: number;
        data: any;
    };
    /**
     * Create a response with embed
     * @deprecated Use reply() instead for actual API calls
     */
    replyEmbedResponse(embed: any, ephemeral?: boolean): {
        type: number;
        data: any;
    };
    /**
     * Create a modal response
     * @deprecated Use showModal() instead for actual API calls
     */
    showModalResponse(customId: string, title: string, components: any[]): {
        type: number;
        data: any;
    };
}
//# sourceMappingURL=INTERACTION_CREATE.d.ts.map