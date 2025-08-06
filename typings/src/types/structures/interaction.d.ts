/**
 * Interaction-related types for Discord API structures
 */
import type { User } from "./user";
import type { GuildMember } from "./guild";
import type { Message, ResolvedData } from "./message";
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
 * Application command types
 */
export declare enum ApplicationCommandType {
    /** Slash commands; a text-based command that shows up when a user types / */
    CHAT_INPUT = 1,
    /** A UI-based command that shows up when you right click or tap on a user */
    USER = 2,
    /** A UI-based command that shows up when you right click or tap on a message */
    MESSAGE = 3
}
/**
 * Base interaction object
 */
export interface BaseInteraction {
    /** ID of the interaction */
    id: string;
    /** ID of the application this interaction is for */
    application_id: string;
    /** Type of interaction */
    type: InteractionType;
    /** Guild that the interaction was sent from */
    guild_id?: string;
    /** Channel that the interaction was sent from */
    channel_id?: string;
    /** Guild member data for the invoking user, including permissions */
    member?: GuildMember;
    /** User object for the invoking user, if invoked in a DM */
    user?: User;
    /** Continuation token for responding to the interaction */
    token: string;
    /** Read-only property, always 1 */
    version: number;
    /** For components, the message they were attached to */
    message?: Message;
    /** Bitwise set of permissions the app or bot has within the channel the interaction was sent from */
    app_permissions?: string;
    /** Selected language of the invoking user */
    locale?: string;
    /** Guild's preferred locale, if invoked in a guild */
    guild_locale?: string;
}
/**
 * Application command interaction
 */
export interface ApplicationCommandInteraction extends BaseInteraction {
    type: InteractionType.APPLICATION_COMMAND;
    /** Interaction data payload */
    data: ApplicationCommandInteractionData;
}
/**
 * Message component interaction
 */
export interface MessageComponentInteraction extends BaseInteraction {
    type: InteractionType.MESSAGE_COMPONENT;
    /** Interaction data payload */
    data: MessageComponentInteractionData;
    /** For components, the message they were attached to */
    message: Message;
}
/**
 * Modal submit interaction
 */
export interface ModalSubmitInteraction extends BaseInteraction {
    type: InteractionType.MODAL_SUBMIT;
    /** Interaction data payload */
    data: ModalSubmitInteractionData;
}
/**
 * Autocomplete interaction
 */
export interface AutocompleteInteraction extends BaseInteraction {
    type: InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE;
    /** Interaction data payload */
    data: ApplicationCommandInteractionData;
}
/**
 * Union type for all interaction types
 */
export type Interaction = ApplicationCommandInteraction | MessageComponentInteraction | ModalSubmitInteraction | AutocompleteInteraction | BaseInteraction;
/**
 * Application command interaction data
 */
export interface ApplicationCommandInteractionData {
    /** ID of the invoked command */
    id: string;
    /** Name of the invoked command */
    name: string;
    /** Type of the invoked command */
    type: ApplicationCommandType;
    /** Converted users + roles + channels + attachments */
    resolved?: ResolvedData;
    /** Parameters + values from the user */
    options?: ApplicationCommandInteractionDataOption[];
    /** For guild commands, the id of the guild the command is registered to */
    guild_id?: string;
    /** ID of the user or message targeted by a user or message command */
    target_id?: string;
}
/**
 * Application command interaction data option
 */
export interface ApplicationCommandInteractionDataOption {
    /** Name of the parameter */
    name: string;
    /** Value of application command option type */
    type: number;
    /** Value of the option resulting from user input */
    value?: string | number | boolean;
    /** Present if this option is a group or subcommand */
    options?: ApplicationCommandInteractionDataOption[];
    /** True if this option is the currently focused option for autocomplete */
    focused?: boolean;
}
/**
 * Message component interaction data
 */
export interface MessageComponentInteractionData {
    /** The custom_id of the component */
    custom_id: string;
    /** Type of the component */
    component_type: number;
    /** Values the user selected in a select menu component */
    values?: string[];
    /** Resolved entities from selected options */
    resolved?: ResolvedData;
}
/**
 * Modal submit interaction data
 */
export interface ModalSubmitInteractionData {
    /** The custom_id of the modal */
    custom_id: string;
    /** Values submitted by the user */
    components: ModalSubmitComponent[];
}
/**
 * Modal submit component
 */
export interface ModalSubmitComponent {
    /** Type of the component */
    type: number;
    /** List of child components */
    components: ModalSubmitActionRowComponent[];
}
/**
 * Modal submit action row component
 */
export interface ModalSubmitActionRowComponent {
    /** Type of the component */
    type: number;
    /** Developer-defined identifier for the component */
    custom_id: string;
    /** Value entered by the user */
    value: string;
}
/**
 * Interaction callback types
 */
export declare enum InteractionCallbackType {
    /** ACK a Ping */
    PONG = 1,
    /** Respond to an interaction with a message */
    CHANNEL_MESSAGE_WITH_SOURCE = 4,
    /** ACK an interaction and edit a response later, the user sees a loading state */
    DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5,
    /** For components, ACK an interaction and edit the original message later; the user does not see a loading state */
    DEFERRED_UPDATE_MESSAGE = 6,
    /** For components, edit the message the component was attached to */
    UPDATE_MESSAGE = 7,
    /** Respond to an autocomplete interaction with suggested choices */
    APPLICATION_COMMAND_AUTOCOMPLETE_RESULT = 8,
    /** Respond to an interaction with a popup modal */
    MODAL = 9
}
/**
 * Interaction response
 */
export interface InteractionResponse {
    /** Type of response */
    type: InteractionCallbackType;
    /** An optional response message */
    data?: InteractionCallbackData;
}
/**
 * Interaction callback data
 */
export interface InteractionCallbackData {
    /** Is the response TTS */
    tts?: boolean;
    /** Message content */
    content?: string;
    /** Supports up to 10 embeds */
    embeds?: import("./message").Embed[];
    /** Allowed mentions object */
    allowed_mentions?: AllowedMentions;
    /** Message flags combined as a bitfield (only SUPPRESS_EMBEDS and EPHEMERAL can be set) */
    flags?: number;
    /** Message components */
    components?: import("./message").MessageComponent[];
    /** Attachment objects with filename and description */
    attachments?: Partial<import("./message").Attachment>[];
    /** Autocomplete choices (max of 25 choices) */
    choices?: ApplicationCommandOptionChoice[];
    /** Custom ID for components */
    custom_id?: string;
    /** Title for modals */
    title?: string;
}
/**
 * Application command option choice
 */
export interface ApplicationCommandOptionChoice {
    /** 1-100 character choice name */
    name: string;
    /** Localization dictionary for the name field */
    name_localizations?: Record<string, string> | null;
    /** Value for the choice, up to 100 characters if string */
    value: string | number;
}
/**
 * Allowed mentions object
 */
export interface AllowedMentions {
    /** An array of allowed mention types to parse from the content */
    parse?: ("roles" | "users" | "everyone")[];
    /** Array of role_ids to mention (Maximum of 100) */
    roles?: string[];
    /** Array of user_ids to mention (Maximum of 100) */
    users?: string[];
    /** For replies, whether to mention the author of the message being replied to (default false) */
    replied_user?: boolean;
}
//# sourceMappingURL=interaction.d.ts.map