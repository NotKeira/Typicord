import type { Client } from "@/client/Client";
import type { Guild } from "./Guild";
import type { Channel } from "./Channel";
import { User } from "./User";
import { Message } from "./Message";
/**
 * Interaction types
 */
export declare enum InteractionType {
    PING = 1,
    APPLICATION_COMMAND = 2,
    MESSAGE_COMPONENT = 3,
    APPLICATION_COMMAND_AUTOCOMPLETE = 4,
    MODAL_SUBMIT = 5
}
/**
 * Interaction response types
 */
export declare enum InteractionResponseType {
    PONG = 1,
    CHANNEL_MESSAGE_WITH_SOURCE = 4,
    DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5,
    DEFERRED_UPDATE_MESSAGE = 6,
    UPDATE_MESSAGE = 7,
    APPLICATION_COMMAND_AUTOCOMPLETE_RESULT = 8,
    MODAL = 9,
    PREMIUM_REQUIRED = 10
}
/**
 * Component types
 */
export declare enum ComponentType {
    ACTION_ROW = 1,
    BUTTON = 2,
    STRING_SELECT = 3,
    TEXT_INPUT = 4,
    USER_SELECT = 5,
    ROLE_SELECT = 6,
    MENTIONABLE_SELECT = 7,
    CHANNEL_SELECT = 8
}
/**
 * Button styles
 */
export declare enum ButtonStyle {
    PRIMARY = 1,
    SECONDARY = 2,
    SUCCESS = 3,
    DANGER = 4,
    LINK = 5
}
/**
 * Text input styles
 */
export declare enum TextInputStyle {
    SHORT = 1,
    PARAGRAPH = 2
}
/**
 * Select menu option interface
 */
export interface SelectMenuOption {
    label: string;
    value: string;
    description?: string;
    emoji?: {
        id?: string;
        name?: string;
        animated?: boolean;
    };
    default?: boolean;
}
/**
 * Component interfaces
 */
export interface BaseComponent {
    type: ComponentType;
}
export interface ButtonComponent extends BaseComponent {
    type: ComponentType.BUTTON;
    style: ButtonStyle;
    label?: string;
    emoji?: {
        id?: string;
        name?: string;
        animated?: boolean;
    };
    custom_id?: string;
    url?: string;
    disabled?: boolean;
}
export interface SelectMenuComponent extends BaseComponent {
    type: ComponentType.STRING_SELECT | ComponentType.USER_SELECT | ComponentType.ROLE_SELECT | ComponentType.MENTIONABLE_SELECT | ComponentType.CHANNEL_SELECT;
    custom_id: string;
    options?: SelectMenuOption[];
    channel_types?: number[];
    placeholder?: string;
    min_values?: number;
    max_values?: number;
    disabled?: boolean;
}
export interface TextInputComponent extends BaseComponent {
    type: ComponentType.TEXT_INPUT;
    custom_id: string;
    style: TextInputStyle;
    label: string;
    min_length?: number;
    max_length?: number;
    required?: boolean;
    value?: string;
    placeholder?: string;
}
export interface ActionRowComponent extends BaseComponent {
    type: ComponentType.ACTION_ROW;
    components: (ButtonComponent | SelectMenuComponent | TextInputComponent)[];
}
export type Component = ButtonComponent | SelectMenuComponent | TextInputComponent | ActionRowComponent;
/**
 * Base interaction data
 */
export interface InteractionData {
    id: string;
    application_id: string;
    type: InteractionType;
    data?: any;
    guild_id?: string;
    channel_id?: string;
    member?: any;
    user?: any;
    token: string;
    version: number;
    message?: any;
    app_permissions?: string;
    locale?: string;
    guild_locale?: string;
}
/**
 * Base class for all Discord interactions
 */
export declare class Interaction {
    readonly id: string;
    readonly applicationId: string;
    readonly type: InteractionType;
    readonly token: string;
    readonly version: number;
    guildId?: string;
    channelId?: string;
    member?: any;
    user?: any;
    message?: Message;
    appPermissions?: string;
    locale?: string;
    guildLocale?: string;
    raw: InteractionData;
    protected responded: boolean;
    protected deferred: boolean;
    protected readonly client: Client;
    constructor(client: Client, data: InteractionData);
    /**
     * Responds to the interaction
     */
    reply(options: {
        content?: string;
        embeds?: any[];
        components?: any[];
        ephemeral?: boolean;
        tts?: boolean;
        allowed_mentions?: any;
        files?: any[];
    }): Promise<void>;
    /**
     * Responds to the interaction with a modal
     */
    showModal(modal: {
        custom_id: string;
        title: string;
        components: ActionRowComponent[];
    }): Promise<void>;
    /**
     * Defers the interaction response
     */
    defer(ephemeral?: boolean): Promise<void>;
    /**
     * Edits the initial interaction response
     */
    editReply(options: {
        content?: string;
        embeds?: any[];
        components?: any[];
        allowed_mentions?: any;
        files?: any[];
    }): Promise<Message>;
    /**
     * Deletes the initial interaction response
     */
    deleteReply(): Promise<void>;
    /**
     * Sends a followup message
     */
    followUp(options: {
        content?: string;
        embeds?: any[];
        components?: any[];
        ephemeral?: boolean;
        tts?: boolean;
        allowed_mentions?: any;
        files?: any[];
    }): Promise<Message>;
    /**
     * Gets the guild this interaction happened in
     */
    fetchGuild(): Promise<Guild | null>;
    /**
     * Gets the channel this interaction happened in
     */
    fetchChannel(): Promise<Channel | null>;
    /**
     * Gets the user who triggered this interaction
     */
    getUser(): User | null;
    /**
     * Whether this interaction is in a guild
     */
    get inGuild(): boolean;
    /**
     * Whether this interaction is in DMs
     */
    get inDM(): boolean;
}
/**
 * Represents a slash command interaction
 */
export declare class CommandInteraction extends Interaction {
    commandName: string;
    commandId: string;
    options: Map<string, any>;
    subcommand?: string;
    subcommandGroup?: string;
    constructor(client: Client, data: InteractionData);
    private parseOptions;
    /**
     * Gets an option value by name
     */
    getOption(name: string): any;
    /**
     * Gets a string option
     */
    getString(name: string): string | null;
    /**
     * Gets an integer option
     */
    getInteger(name: string): number | null;
    /**
     * Gets a number option
     */
    getNumber(name: string): number | null;
    /**
     * Gets a boolean option
     */
    getBoolean(name: string): boolean | null;
    /**
     * Gets a user option
     */
    getUserOption(name: string): User | null;
    /**
     * Gets a channel option
     */
    getChannel(name: string): any;
    /**
     * Gets a role option
     */
    getRole(name: string): any;
}
/**
 * Represents a button or select menu interaction
 */
export declare class ComponentInteraction extends Interaction {
    customId: string;
    componentType: ComponentType;
    values?: string[];
    constructor(client: Client, data: InteractionData);
    /**
     * Updates the message that contains this component
     */
    update(options: {
        content?: string;
        embeds?: any[];
        components?: any[];
        allowed_mentions?: any;
    }): Promise<void>;
    /**
     * Defers the component update
     */
    deferUpdate(): Promise<void>;
    /**
     * Whether this is a button interaction
     */
    get isButton(): boolean;
    /**
     * Whether this is a select menu interaction
     */
    get isSelectMenu(): boolean;
    /**
     * Whether this is a string select menu
     */
    get isStringSelect(): boolean;
    /**
     * Whether this is a user select menu
     */
    get isUserSelect(): boolean;
    /**
     * Whether this is a role select menu
     */
    get isRoleSelect(): boolean;
    /**
     * Whether this is a channel select menu
     */
    get isChannelSelect(): boolean;
    /**
     * Whether this is a mentionable select menu
     */
    get isMentionableSelect(): boolean;
    /**
     * Gets the selected users (for user select menus)
     */
    getSelectedUsers(): User[];
    /**
     * Gets the selected roles (for role select menus)
     */
    getSelectedRoles(): any[];
    /**
     * Gets the selected channels (for channel select menus)
     */
    getSelectedChannels(): any[];
    /**
     * Gets the selected values as strings (for string select menus)
     */
    getSelectedValues(): string[];
}
/**
 * Represents a modal submit interaction
 */
export declare class ModalSubmitInteraction extends Interaction {
    customId: string;
    components: any[];
    constructor(client: Client, data: InteractionData);
    /**
     * Gets a text input value by custom ID
     */
    getTextInputValue(customId: string): string | null;
    /**
     * Gets all text input values as a Map
     */
    getAllTextInputValues(): Map<string, string>;
}
//# sourceMappingURL=Interaction.d.ts.map