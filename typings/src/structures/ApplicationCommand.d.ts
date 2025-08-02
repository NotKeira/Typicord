import type { Client } from "@/client/Client";
/**
 * Application command option types
 */
export declare enum ApplicationCommandOptionType {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP = 2,
    STRING = 3,
    INTEGER = 4,
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7,
    ROLE = 8,
    MENTIONABLE = 9,
    NUMBER = 10,
    ATTACHMENT = 11
}
/**
 * Application command types
 */
export declare enum ApplicationCommandType {
    CHAT_INPUT = 1,
    USER = 2,
    MESSAGE = 3
}
/**
 * Application command option structure
 */
export interface ApplicationCommandOption {
    type: ApplicationCommandOptionType;
    name: string;
    description: string;
    required?: boolean;
    choices?: Array<{
        name: string;
        value: string | number;
    }>;
    options?: ApplicationCommandOption[];
    channel_types?: number[];
    min_value?: number;
    max_value?: number;
    min_length?: number;
    max_length?: number;
    autocomplete?: boolean;
}
/**
 * Application command data structure
 */
export interface ApplicationCommandData {
    id: string;
    type?: ApplicationCommandType;
    application_id: string;
    guild_id?: string;
    name: string;
    description: string;
    options?: ApplicationCommandOption[];
    default_member_permissions?: string | null;
    dm_permission?: boolean;
    default_permission?: boolean;
    nsfw?: boolean;
    version: string;
}
/**
 * Represents a Discord application command (slash command)
 */
export declare class ApplicationCommand {
    readonly id: string;
    readonly type: ApplicationCommandType;
    readonly applicationId: string;
    guildId?: string;
    name: string;
    description: string;
    options?: ApplicationCommandOption[];
    defaultMemberPermissions?: string | null;
    dmPermission?: boolean;
    nsfw?: boolean;
    version: string;
    raw: ApplicationCommandData;
    private readonly client;
    constructor(client: Client, data: ApplicationCommandData);
    /**
     * Edits this application command
     */
    edit(data: {
        name?: string;
        description?: string;
        options?: ApplicationCommandOption[];
        default_member_permissions?: string | null;
        dm_permission?: boolean;
        nsfw?: boolean;
    }): Promise<ApplicationCommand>;
    /**
     * Deletes this application command
     */
    delete(): Promise<void>;
    /**
     * Fetches the permissions for this command in a guild
     */
    fetchPermissions(guildId?: string): Promise<any>;
    /**
     * Sets the permissions for this command in a guild
     */
    setPermissions(guildId: string, permissions: Array<{
        id: string;
        type: 1 | 2 | 3;
        permission: boolean;
    }>): Promise<any>;
    /**
     * Whether this is a global command
     */
    get isGlobal(): boolean;
    /**
     * Whether this is a guild-specific command
     */
    get isGuildCommand(): boolean;
    /**
     * Whether this is a chat input (slash) command
     */
    get isChatInput(): boolean;
    /**
     * Whether this is a user context menu command
     */
    get isUserCommand(): boolean;
    /**
     * Whether this is a message context menu command
     */
    get isMessageCommand(): boolean;
}
/**
 * Application command manager for creating and managing commands
 */
export declare class ApplicationCommandManager {
    private readonly client;
    private readonly applicationId;
    constructor(client: Client, applicationId: string);
    /**
     * Creates a new global application command
     */
    createGlobal(data: {
        name: string;
        description: string;
        type?: ApplicationCommandType;
        options?: ApplicationCommandOption[];
        default_member_permissions?: string | null;
        dm_permission?: boolean;
        nsfw?: boolean;
    }): Promise<ApplicationCommand>;
    /**
     * Creates a new guild-specific application command
     */
    createGuild(guildId: string, data: {
        name: string;
        description: string;
        type?: ApplicationCommandType;
        options?: ApplicationCommandOption[];
        default_member_permissions?: string | null;
        nsfw?: boolean;
    }): Promise<ApplicationCommand>;
    /**
     * Fetches all global application commands
     */
    fetchGlobal(withLocalizations?: boolean): Promise<ApplicationCommand[]>;
    /**
     * Fetches all guild application commands
     */
    fetchGuild(guildId: string, withLocalizations?: boolean): Promise<ApplicationCommand[]>;
    /**
     * Bulk overwrites global application commands
     */
    setGlobal(commands: Array<{
        name: string;
        description: string;
        type?: ApplicationCommandType;
        options?: ApplicationCommandOption[];
        default_member_permissions?: string | null;
        dm_permission?: boolean;
        nsfw?: boolean;
    }>): Promise<ApplicationCommand[]>;
    /**
     * Bulk overwrites guild application commands
     */
    setGuild(guildId: string, commands: Array<{
        name: string;
        description: string;
        type?: ApplicationCommandType;
        options?: ApplicationCommandOption[];
        default_member_permissions?: string | null;
        nsfw?: boolean;
    }>): Promise<ApplicationCommand[]>;
}
//# sourceMappingURL=ApplicationCommand.d.ts.map