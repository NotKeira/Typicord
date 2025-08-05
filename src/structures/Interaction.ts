import type { Client } from "@/client/Client";
import type { Guild } from "./Guild";
import type { Channel } from "./Channel";
import { User } from "./User";
import { Message } from "./Message";

/**
 * Interaction callback types
 */
export enum InteractionCallbackType {
  PONG = 1,
  CHANNEL_MESSAGE_WITH_SOURCE = 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5,
  DEFERRED_UPDATE_MESSAGE = 6,
  UPDATE_MESSAGE = 7,
  APPLICATION_COMMAND_AUTOCOMPLETE_RESULT = 8,
  MODAL = 9,
  PREMIUM_REQUIRED = 10,
}

/**
 * Allowed mentions structure
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
 * Interaction types
 */
export enum InteractionType {
  PING = 1,
  APPLICATION_COMMAND = 2,
  MESSAGE_COMPONENT = 3,
  APPLICATION_COMMAND_AUTOCOMPLETE = 4,
  MODAL_SUBMIT = 5,
}

/**
 * Interaction response types
 */
export enum InteractionResponseType {
  PONG = 1,
  CHANNEL_MESSAGE_WITH_SOURCE = 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5,
  DEFERRED_UPDATE_MESSAGE = 6,
  UPDATE_MESSAGE = 7,
  APPLICATION_COMMAND_AUTOCOMPLETE_RESULT = 8,
  MODAL = 9,
  PREMIUM_REQUIRED = 10,
}

/**
 * Component types
 */
export enum ComponentType {
  ACTION_ROW = 1,
  BUTTON = 2,
  STRING_SELECT = 3,
  TEXT_INPUT = 4,
  USER_SELECT = 5,
  ROLE_SELECT = 6,
  MENTIONABLE_SELECT = 7,
  CHANNEL_SELECT = 8,
}

/**
 * Button styles
 */
export enum ButtonStyle {
  PRIMARY = 1,
  SECONDARY = 2,
  SUCCESS = 3,
  DANGER = 4,
  LINK = 5,
}

/**
 * Text input styles
 */
export enum TextInputStyle {
  SHORT = 1,
  PARAGRAPH = 2,
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
  type:
    | ComponentType.STRING_SELECT
    | ComponentType.USER_SELECT
    | ComponentType.ROLE_SELECT
    | ComponentType.MENTIONABLE_SELECT
    | ComponentType.CHANNEL_SELECT;
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

export type Component =
  | ButtonComponent
  | SelectMenuComponent
  | TextInputComponent
  | ActionRowComponent;

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
export class Interaction {
  public readonly id: string;
  public readonly applicationId: string;
  public readonly type: InteractionType;
  public readonly token: string;
  public readonly version: number;
  public guildId?: string;
  public channelId?: string;
  public member?: any;
  public user?: any;
  public message?: Message;
  public appPermissions?: string;
  public locale?: string;
  public guildLocale?: string;
  public raw: InteractionData;
  protected responded: boolean = false;
  protected deferred: boolean = false;
  protected readonly client: Client;

  constructor(client: Client, data: InteractionData) {
    this.client = client;
    this.id = data.id;
    this.applicationId = data.application_id;
    this.type = data.type;
    this.token = data.token;
    this.version = data.version;
    this.guildId = data.guild_id;
    this.channelId = data.channel_id;
    this.member = data.member;
    this.user = data.user;
    this.appPermissions = data.app_permissions;
    this.locale = data.locale;
    this.guildLocale = data.guild_locale;
    this.raw = data;

    if (data.message) {
      this.message = new Message(client, data.message);
    }
  }

  /**
   * Responds to the interaction
   */
  public async reply(options: {
    content?: string;
    embeds?: any[];
    components?: any[];
    ephemeral?: boolean;
    tts?: boolean;
    allowed_mentions?: any;
    files?: any[];
  }): Promise<void> {
    if (this.responded || this.deferred) {
      throw new Error("Interaction has already been responded to or deferred");
    }

    const data: any = {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        ...options,
        flags: options.ephemeral ? 64 : undefined,
      },
    };

    await this.client.rest.post(
      `/interactions/${this.id}/${this.token}/callback`,
      data
    );
    this.responded = true;
  }

  /**
   * Responds to the interaction with a modal
   */
  public async showModal(modal: {
    custom_id: string;
    title: string;
    components: ActionRowComponent[];
  }): Promise<void> {
    if (this.responded || this.deferred) {
      throw new Error("Interaction has already been responded to or deferred");
    }

    const data = {
      type: InteractionResponseType.MODAL,
      data: modal,
    };

    await this.client.rest.post(
      `/interactions/${this.id}/${this.token}/callback`,
      data
    );
    this.responded = true;
  }

  /**
   * Defers the interaction response
   */
  public async defer(ephemeral: boolean = false): Promise<void> {
    if (this.responded || this.deferred) {
      throw new Error("Interaction has already been responded to or deferred");
    }

    const data = {
      type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        flags: ephemeral ? 64 : undefined,
      },
    };

    await this.client.rest.post(
      `/interactions/${this.id}/${this.token}/callback`,
      data
    );
    this.deferred = true;
  }

  /**
   * Edits the initial interaction response
   */
  public async editReply(options: {
    content?: string;
    embeds?: any[];
    components?: any[];
    allowed_mentions?: any;
    files?: any[];
  }): Promise<Message> {
    if (!this.responded && !this.deferred) {
      throw new Error(
        "Interaction must be responded to or deferred before editing"
      );
    }

    const data = await this.client.rest.patch(
      `/webhooks/${this.applicationId}/${this.token}/messages/@original`,
      options
    );
    return new Message(this.client, data as any);
  }

  /**
   * Deletes the initial interaction response
   */
  public async deleteReply(): Promise<void> {
    await this.client.rest.delete(
      `/webhooks/${this.applicationId}/${this.token}/messages/@original`
    );
  }

  /**
   * Sends a followup message
   */
  public async followUp(options: {
    content?: string;
    embeds?: any[];
    components?: any[];
    ephemeral?: boolean;
    tts?: boolean;
    allowed_mentions?: any;
    files?: any[];
  }): Promise<Message> {
    const data = await this.client.rest.post(
      `/webhooks/${this.applicationId}/${this.token}`,
      {
        ...options,
        flags: options.ephemeral ? 64 : undefined,
      }
    );
    return new Message(this.client, data as any);
  }

  /**
   * Gets the guild this interaction happened in
   */
  public async fetchGuild(): Promise<Guild | null> {
    if (!this.guildId) return null;
    return this.client.fetchGuild(this.guildId);
  }

  /**
   * Gets the channel this interaction happened in
   */
  public async fetchChannel(): Promise<Channel | null> {
    if (!this.channelId) return null;
    return this.client.fetchChannel(this.channelId);
  }

  /**
   * Gets the user who triggered this interaction
   */
  public getUser(): User | null {
    const userData = this.user || this.member?.user;
    if (!userData) return null;
    return new User(userData);
  }

  /**
   * Whether this interaction is in a guild
   */
  public get inGuild(): boolean {
    return !!this.guildId;
  }

  /**
   * Whether this interaction is in DMs
   */
  public get inDM(): boolean {
    return !this.guildId;
  }
}

/**
 * Represents a slash command interaction
 */
export class CommandInteraction extends Interaction {
  public commandName: string;
  public commandId: string;
  public options: Map<string, any> = new Map();
  public subcommand?: string;
  public subcommandGroup?: string;

  constructor(client: Client, data: InteractionData) {
    super(client, data);

    if (data.data) {
      this.commandName = data.data.name;
      this.commandId = data.data.id;
      this.parseOptions(data.data.options || []);
    } else {
      this.commandName = "";
      this.commandId = "";
    }
  }

  private parseOptions(options: any[], prefix: string = ""): void {
    for (const option of options) {
      const key = prefix ? `${prefix}.${option.name}` : option.name;

      if (option.type === 1) {
        // SUB_COMMAND
        this.subcommand = option.name;
        if (option.options) {
          this.parseOptions(option.options, option.name);
        }
      } else if (option.type === 2) {
        // SUB_COMMAND_GROUP
        this.subcommandGroup = option.name;
        if (option.options) {
          this.parseOptions(option.options, option.name);
        }
      } else {
        this.options.set(key, option.value);
      }
    }
  }

  /**
   * Gets an option value by name
   */
  public getOption(name: string): any {
    return this.options.get(name);
  }

  /**
   * Gets a string option
   */
  public getString(name: string): string | null {
    return this.getOption(name) || null;
  }

  /**
   * Gets an integer option
   */
  public getInteger(name: string): number | null {
    const value = this.getOption(name);
    return typeof value === "number" ? Math.floor(value) : null;
  }

  /**
   * Gets a number option
   */
  public getNumber(name: string): number | null {
    const value = this.getOption(name);
    return typeof value === "number" ? value : null;
  }

  /**
   * Gets a boolean option
   */
  public getBoolean(name: string): boolean | null {
    const value = this.getOption(name);
    return typeof value === "boolean" ? value : null;
  }

  /**
   * Gets a user option
   */
  public getUserOption(name: string): User | null {
    const userId = this.getOption(name);
    if (!userId) return null;

    // Try to find user in resolved data first
    const resolved = this.raw.data?.resolved;
    if (resolved?.users?.[userId]) {
      return new User(resolved.users[userId]);
    }

    return null;
  }

  /**
   * Gets a channel option
   */
  public getChannel(name: string): any {
    const channelId = this.getOption(name);
    if (!channelId) return null;

    // Try to find channel in resolved data
    const resolved = this.raw.data?.resolved;
    if (resolved?.channels?.[channelId]) {
      return resolved.channels[channelId];
    }

    return null;
  }

  /**
   * Gets a role option
   */
  public getRole(name: string): any {
    const roleId = this.getOption(name);
    if (!roleId) return null;

    // Try to find role in resolved data
    const resolved = this.raw.data?.resolved;
    if (resolved?.roles?.[roleId]) {
      return resolved.roles[roleId];
    }

    return null;
  }
}

/**
 * Represents a button or select menu interaction
 */
export class ComponentInteraction extends Interaction {
  public customId: string;
  public componentType: ComponentType;
  public values?: string[];

  constructor(client: Client, data: InteractionData) {
    super(client, data);

    if (data.data) {
      this.customId = data.data.custom_id;
      this.componentType = data.data.component_type;
      this.values = data.data.values;
    } else {
      this.customId = "";
      this.componentType = ComponentType.BUTTON;
    }
  }

  /**
   * Updates the message that contains this component
   */
  public async update(options: {
    content?: string;
    embeds?: any[];
    components?: any[];
    allowed_mentions?: any;
  }): Promise<void> {
    if (this.responded) {
      throw new Error("Interaction has already been responded to");
    }

    const data = {
      type: InteractionResponseType.UPDATE_MESSAGE,
      data: options,
    };

    await this.client.rest.post(
      `/interactions/${this.id}/${this.token}/callback`,
      data
    );
    this.responded = true;
  }

  /**
   * Defers the component update
   */
  public async deferUpdate(): Promise<void> {
    if (this.responded || this.deferred) {
      throw new Error("Interaction has already been responded to or deferred");
    }

    const data = {
      type: InteractionResponseType.DEFERRED_UPDATE_MESSAGE,
    };

    await this.client.rest.post(
      `/interactions/${this.id}/${this.token}/callback`,
      data
    );
    this.deferred = true;
  }

  /**
   * Whether this is a button interaction
   */
  public get isButton(): boolean {
    return this.componentType === ComponentType.BUTTON;
  }

  /**
   * Whether this is a select menu interaction
   */
  public get isSelectMenu(): boolean {
    return [
      ComponentType.STRING_SELECT,
      ComponentType.USER_SELECT,
      ComponentType.ROLE_SELECT,
      ComponentType.MENTIONABLE_SELECT,
      ComponentType.CHANNEL_SELECT,
    ].includes(this.componentType);
  }

  /**
   * Whether this is a string select menu
   */
  public get isStringSelect(): boolean {
    return this.componentType === ComponentType.STRING_SELECT;
  }

  /**
   * Whether this is a user select menu
   */
  public get isUserSelect(): boolean {
    return this.componentType === ComponentType.USER_SELECT;
  }

  /**
   * Whether this is a role select menu
   */
  public get isRoleSelect(): boolean {
    return this.componentType === ComponentType.ROLE_SELECT;
  }

  /**
   * Whether this is a channel select menu
   */
  public get isChannelSelect(): boolean {
    return this.componentType === ComponentType.CHANNEL_SELECT;
  }

  /**
   * Whether this is a mentionable select menu
   */
  public get isMentionableSelect(): boolean {
    return this.componentType === ComponentType.MENTIONABLE_SELECT;
  }

  /**
   * Gets the selected users (for user select menus)
   */
  public getSelectedUsers(): User[] {
    if (!this.isUserSelect || !this.values) return [];

    const resolved = this.raw.data?.resolved;
    if (!resolved?.users) return [];

    return this.values
      .map(userId => resolved.users[userId])
      .filter(Boolean)
      .map(userData => new User(userData));
  }

  /**
   * Gets the selected roles (for role select menus)
   */
  public getSelectedRoles(): any[] {
    if (!this.isRoleSelect || !this.values) return [];

    const resolved = this.raw.data?.resolved;
    if (!resolved?.roles) return [];

    return this.values.map(roleId => resolved.roles[roleId]).filter(Boolean);
  }

  /**
   * Gets the selected channels (for channel select menus)
   */
  public getSelectedChannels(): any[] {
    if (!this.isChannelSelect || !this.values) return [];

    const resolved = this.raw.data?.resolved;
    if (!resolved?.channels) return [];

    return this.values
      .map(channelId => resolved.channels[channelId])
      .filter(Boolean);
  }

  /**
   * Gets the selected values as strings (for string select menus)
   */
  public getSelectedValues(): string[] {
    return this.values || [];
  }
}

/**
 * Represents a modal submit interaction
 */
export class ModalSubmitInteraction extends Interaction {
  public customId: string;
  public components: any[];

  constructor(client: Client, data: InteractionData) {
    super(client, data);

    if (data.data) {
      this.customId = data.data.custom_id;
      this.components = data.data.components || [];
    } else {
      this.customId = "";
      this.components = [];
    }
  }

  /**
   * Gets a text input value by custom ID
   */
  public getTextInputValue(customId: string): string | null {
    for (const actionRow of this.components) {
      if (actionRow.components) {
        for (const component of actionRow.components) {
          if (
            component.custom_id === customId &&
            component.type === ComponentType.TEXT_INPUT
          ) {
            return component.value || null;
          }
        }
      }
    }
    return null;
  }

  /**
   * Gets all text input values as a Map
   */
  public getAllTextInputValues(): Map<string, string> {
    const values = new Map<string, string>();

    for (const actionRow of this.components) {
      if (actionRow.components) {
        for (const component of actionRow.components) {
          if (
            component.type === ComponentType.TEXT_INPUT &&
            component.custom_id
          ) {
            values.set(component.custom_id, component.value || "");
          }
        }
      }
    }

    return values;
  }
}
