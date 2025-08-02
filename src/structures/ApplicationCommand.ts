import type { Client } from "@/client/Client";

/**
 * Application command option types
 */
export enum ApplicationCommandOptionType {
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
  ATTACHMENT = 11,
}

/**
 * Application command types
 */
export enum ApplicationCommandType {
  CHAT_INPUT = 1,
  USER = 2,
  MESSAGE = 3,
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
export class ApplicationCommand {
  public readonly id: string;
  public readonly type: ApplicationCommandType;
  public readonly applicationId: string;
  public guildId?: string;
  public name: string;
  public description: string;
  public options?: ApplicationCommandOption[];
  public defaultMemberPermissions?: string | null;
  public dmPermission?: boolean;
  public nsfw?: boolean;
  public version: string;
  public raw: ApplicationCommandData;
  private readonly client: Client;

  constructor(client: Client, data: ApplicationCommandData) {
    this.client = client;
    this.id = data.id;
    this.type = data.type ?? ApplicationCommandType.CHAT_INPUT;
    this.applicationId = data.application_id;
    this.guildId = data.guild_id;
    this.name = data.name;
    this.description = data.description;
    this.options = data.options;
    this.defaultMemberPermissions = data.default_member_permissions;
    this.dmPermission = data.dm_permission;
    this.nsfw = data.nsfw;
    this.version = data.version;
    this.raw = data;
  }

  /**
   * Edits this application command
   */
  public async edit(data: {
    name?: string;
    description?: string;
    options?: ApplicationCommandOption[];
    default_member_permissions?: string | null;
    dm_permission?: boolean;
    nsfw?: boolean;
  }): Promise<ApplicationCommand> {
    const endpoint = this.guildId
      ? `/applications/${this.applicationId}/guilds/${this.guildId}/commands/${this.id}`
      : `/applications/${this.applicationId}/commands/${this.id}`;

    const updated = await this.client.rest.patch(endpoint, data);
    return new ApplicationCommand(this.client, updated as any);
  }

  /**
   * Deletes this application command
   */
  public async delete(): Promise<void> {
    const endpoint = this.guildId
      ? `/applications/${this.applicationId}/guilds/${this.guildId}/commands/${this.id}`
      : `/applications/${this.applicationId}/commands/${this.id}`;

    await this.client.rest.delete(endpoint);
  }

  /**
   * Fetches the permissions for this command in a guild
   */
  public async fetchPermissions(guildId?: string): Promise<any> {
    const targetGuildId = guildId || this.guildId;
    if (!targetGuildId) {
      throw new Error("Guild ID is required for fetching command permissions");
    }

    return this.client.rest.get(
      `/applications/${this.applicationId}/guilds/${targetGuildId}/commands/${this.id}/permissions`
    );
  }

  /**
   * Sets the permissions for this command in a guild
   */
  public async setPermissions(
    guildId: string,
    permissions: Array<{
      id: string;
      type: 1 | 2 | 3; // 1 = ROLE, 2 = USER, 3 = CHANNEL
      permission: boolean;
    }>
  ): Promise<any> {
    return this.client.rest.put(
      `/applications/${this.applicationId}/guilds/${guildId}/commands/${this.id}/permissions`,
      { permissions }
    );
  }

  /**
   * Whether this is a global command
   */
  public get isGlobal(): boolean {
    return !this.guildId;
  }

  /**
   * Whether this is a guild-specific command
   */
  public get isGuildCommand(): boolean {
    return !!this.guildId;
  }

  /**
   * Whether this is a chat input (slash) command
   */
  public get isChatInput(): boolean {
    return this.type === ApplicationCommandType.CHAT_INPUT;
  }

  /**
   * Whether this is a user context menu command
   */
  public get isUserCommand(): boolean {
    return this.type === ApplicationCommandType.USER;
  }

  /**
   * Whether this is a message context menu command
   */
  public get isMessageCommand(): boolean {
    return this.type === ApplicationCommandType.MESSAGE;
  }
}

/**
 * Application command manager for creating and managing commands
 */
export class ApplicationCommandManager {
  private readonly client: Client;
  private readonly applicationId: string;

  constructor(client: Client, applicationId: string) {
    this.client = client;
    this.applicationId = applicationId;
  }

  /**
   * Creates a new global application command
   */
  public async createGlobal(data: {
    name: string;
    description: string;
    type?: ApplicationCommandType;
    options?: ApplicationCommandOption[];
    default_member_permissions?: string | null;
    dm_permission?: boolean;
    nsfw?: boolean;
  }): Promise<ApplicationCommand> {
    const command = await this.client.rest.post(
      `/applications/${this.applicationId}/commands`,
      data
    );
    return new ApplicationCommand(this.client, command as any);
  }

  /**
   * Creates a new guild-specific application command
   */
  public async createGuild(
    guildId: string,
    data: {
      name: string;
      description: string;
      type?: ApplicationCommandType;
      options?: ApplicationCommandOption[];
      default_member_permissions?: string | null;
      nsfw?: boolean;
    }
  ): Promise<ApplicationCommand> {
    const command = await this.client.rest.post(
      `/applications/${this.applicationId}/guilds/${guildId}/commands`,
      data
    );
    return new ApplicationCommand(this.client, command as any);
  }

  /**
   * Fetches all global application commands
   */
  public async fetchGlobal(
    withLocalizations?: boolean
  ): Promise<ApplicationCommand[]> {
    const query = withLocalizations ? "?with_localizations=true" : "";
    const commands = await this.client.rest.get(
      `/applications/${this.applicationId}/commands${query}`
    );
    return (commands as ApplicationCommandData[]).map(
      (data: ApplicationCommandData) =>
        new ApplicationCommand(this.client, data)
    );
  }

  /**
   * Fetches all guild application commands
   */
  public async fetchGuild(
    guildId: string,
    withLocalizations?: boolean
  ): Promise<ApplicationCommand[]> {
    const query = withLocalizations ? "?with_localizations=true" : "";
    const commands = await this.client.rest.get(
      `/applications/${this.applicationId}/guilds/${guildId}/commands${query}`
    );
    return (commands as ApplicationCommandData[]).map(
      (data: ApplicationCommandData) =>
        new ApplicationCommand(this.client, data)
    );
  }

  /**
   * Bulk overwrites global application commands
   */
  public async setGlobal(
    commands: Array<{
      name: string;
      description: string;
      type?: ApplicationCommandType;
      options?: ApplicationCommandOption[];
      default_member_permissions?: string | null;
      dm_permission?: boolean;
      nsfw?: boolean;
    }>
  ): Promise<ApplicationCommand[]> {
    const updated = await this.client.rest.put(
      `/applications/${this.applicationId}/commands`,
      commands
    );
    return (updated as ApplicationCommandData[]).map(
      (data: ApplicationCommandData) =>
        new ApplicationCommand(this.client, data)
    );
  }

  /**
   * Bulk overwrites guild application commands
   */
  public async setGuild(
    guildId: string,
    commands: Array<{
      name: string;
      description: string;
      type?: ApplicationCommandType;
      options?: ApplicationCommandOption[];
      default_member_permissions?: string | null;
      nsfw?: boolean;
    }>
  ): Promise<ApplicationCommand[]> {
    const updated = await this.client.rest.put(
      `/applications/${this.applicationId}/guilds/${guildId}/commands`,
      commands
    );
    return (updated as ApplicationCommandData[]).map(
      (data: ApplicationCommandData) =>
        new ApplicationCommand(this.client, data)
    );
  }
}
