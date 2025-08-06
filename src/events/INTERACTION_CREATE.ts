/**
 * INTERACTION_CREATE Event
 *
 * Emitted when a user interacts with the bot (slash commands, buttons, etc.).
 */

import type { RawInteractionData } from "@/types/gateway/interaction";
import type { RESTClient } from "@/client/RESTClient";

export class InteractionCreateData {
  private readonly _client?: RESTClient;
  private _responded = false;

  constructor(
    public data: RawInteractionData,
    client?: RESTClient
  ) {
    this._client = client;
  }

  /**
   * The interaction data
   */
  get interaction() {
    return this.data;
  }

  /**
   * Interaction name
   */
  get name() {
    return this.data.data?.name;
  }

  /**
   * Interaction ID
   */
  get id() {
    return this.data.id;
  }

  /**
   * Interaction type
   */
  get type() {
    return this.data.type;
  }

  /**
   * Application ID
   */
  get applicationId() {
    return this.data.application_id;
  }

  /**
   * Interaction token
   */
  get token() {
    return this.data.token;
  }

  /**
   * Channel ID where the interaction occurred
   */
  get channelId() {
    return this.data.channel_id;
  }

  /**
   * Guild ID (if in a guild)
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * The user who triggered the interaction
   */
  get user() {
    return this.data.user || this.data.member?.user;
  }

  /**
   * The guild member (if in a guild)
   */
  get member() {
    return this.data.member;
  }

  /**
   * Whether this interaction has been responded to
   */
  get isResponded() {
    return this._responded;
  }

  /**
   * Check if this is a slash command interaction
   */
  isSlashCommand(): boolean {
    return this.data.type === 2; // APPLICATION_COMMAND
  }

  /**
   * Check if this is a message component interaction (button, select menu)
   */
  isMessageComponent(): boolean {
    return this.data.type === 3; // MESSAGE_COMPONENT
  }

  /**
   * Check if this is an autocomplete interaction
   */
  isAutocomplete(): boolean {
    return this.data.type === 4; // APPLICATION_COMMAND_AUTOCOMPLETE
  }

  /**
   * Check if this is a modal submit interaction
   */
  isModalSubmit(): boolean {
    return this.data.type === 5; // MODAL_SUBMIT
  }

  /**
   * Check if this interaction is from a guild
   */
  isInGuild(): boolean {
    return !!this.data.guild_id;
  }

  /**
   * Check if this interaction is from a DM
   */
  isInDM(): boolean {
    return !this.data.guild_id;
  }

  /**
   * Get the custom ID (for components and modals)
   */
  get customId(): string | undefined {
    return this.data.data?.custom_id;
  }

  /**
   * Get the interaction options (for slash commands)
   */
  get options() {
    return this.data.data?.options || [];
  }

  /**
   * Get a specific option value by name
   */
  getOption(name: string): any {
    const option = this.options.find(opt => opt.name === name);
    return option?.value;
  }

  /**
   * Get string option value
   */
  getStringOption(name: string): string | undefined {
    const value = this.getOption(name);
    return typeof value === "string" ? value : undefined;
  }

  /**
   * Get integer option value
   */
  getIntegerOption(name: string): number | undefined {
    const value = this.getOption(name);
    return typeof value === "number" && Number.isInteger(value)
      ? value
      : undefined;
  }

  /**
   * Get number option value
   */
  getNumberOption(name: string): number | undefined {
    const value = this.getOption(name);
    return typeof value === "number" ? value : undefined;
  }

  /**
   * Get boolean option value
   */
  getBooleanOption(name: string): boolean | undefined {
    const value = this.getOption(name);
    return typeof value === "boolean" ? value : undefined;
  }

  /**
   * Get the component values (for select menus)
   */
  get values(): string[] {
    return this.data.data?.values || [];
  }

  /**
   * Get the resolved data (users, roles, channels, etc.)
   */
  get resolved() {
    return this.data.data?.resolved;
  }

  /**
   * Get resolved user by ID
   */
  getResolvedUser(userId: string) {
    return this.resolved?.users?.[userId];
  }

  /**
   * Get resolved member by ID
   */
  getResolvedMember(userId: string) {
    return this.resolved?.members?.[userId];
  }

  /**
   * Get resolved role by ID
   */
  getResolvedRole(roleId: string) {
    return this.resolved?.roles?.[roleId];
  }

  /**
   * Get resolved channel by ID
   */
  getResolvedChannel(channelId: string) {
    return this.resolved?.channels?.[channelId];
  }

  /**
   * Get the target ID (for context menu commands)
   */
  get targetId(): string | undefined {
    return this.data.data?.target_id;
  }

  /**
   * Check if this is a user context menu command
   */
  isUserCommand(): boolean {
    return this.isSlashCommand() && this.data.data?.type === 2; // USER command
  }

  /**
   * Check if this is a message context menu command
   */
  isMessageCommand(): boolean {
    return this.isSlashCommand() && this.data.data?.type === 3; // MESSAGE command
  }

  /**
   * Get the message attached to this interaction (for components)
   */
  get message() {
    return this.data.message;
  }

  /**
   * Get the app permissions in this channel
   */
  get appPermissions(): string | undefined {
    return this.data.app_permissions;
  }

  /**
   * Get the user's locale
   */
  get locale(): string | undefined {
    return this.data.locale;
  }

  /**
   * Get the guild's locale
   */
  get guildLocale(): string | undefined {
    return this.data.guild_locale;
  }

  /**
   * Get modal components (for modal submits)
   */
  get components() {
    return this.data.data?.components || [];
  }

  /**
   * Get modal field value by custom ID
   */
  getModalValue(customId: string): string | undefined {
    for (const actionRow of this.components) {
      for (const component of actionRow.components) {
        if (component.custom_id === customId) {
          return component.value;
        }
      }
    }
    return undefined;
  }

  // ============= ENHANCED UTILITY METHODS WITH REST API CALLS =============

  /**
   * Reply to the interaction
   */
  async reply(options: {
    content?: string;
    embeds?: any[];
    components?: any[];
    files?: any[];
    flags?: number;
    ephemeral?: boolean;
  }) {
    if (!this._client) {
      throw new Error("REST client not available for this interaction");
    }

    if (this._responded) {
      throw new Error(
        "This interaction has already been responded to. Use followUp() instead."
      );
    }

    const body: any = {
      type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
      data: {
        content: options.content,
        embeds: options.embeds,
        components: options.components,
        flags: options.ephemeral ? 64 : options.flags,
      },
    };

    const response = await this._client.post(
      `/interactions/${this.id}/${this.token}/callback`,
      {
        body,
      }
    );

    this._responded = true;
    return response;
  }

  /**
   * Defer the interaction response (shows "thinking..." state)
   */
  async defer(options: { ephemeral?: boolean } = {}) {
    if (!this._client) {
      throw new Error("REST client not available for this interaction");
    }

    if (this._responded) {
      throw new Error("This interaction has already been responded to.");
    }

    const body = {
      type: this.isSlashCommand() ? 5 : 6, // DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE or DEFERRED_UPDATE_MESSAGE
      data: options.ephemeral ? { flags: 64 } : undefined,
    };

    const response = await this._client.post(
      `/interactions/${this.id}/${this.token}/callback`,
      {
        body,
      }
    );

    this._responded = true;
    return response;
  }

  /**
   * Follow up to the interaction (after initial response or defer)
   */
  async followUp(options: {
    content?: string;
    embeds?: any[];
    components?: any[];
    files?: any[];
    ephemeral?: boolean;
  }) {
    if (!this._client) {
      throw new Error("REST client not available for this interaction");
    }

    if (!this._responded) {
      throw new Error(
        "You must respond to or defer the interaction first before using followUp()"
      );
    }

    const body = {
      content: options.content,
      embeds: options.embeds,
      components: options.components,
      flags: options.ephemeral ? 64 : undefined,
    };

    return await this._client.post(
      `/webhooks/${this.applicationId}/${this.token}`,
      {
        body,
      }
    );
  }

  /**
   * Edit the original interaction response
   */
  async editReply(options: {
    content?: string;
    embeds?: any[];
    components?: any[];
    files?: any[];
  }) {
    if (!this._client) {
      throw new Error("REST client not available for this interaction");
    }

    return await this._client.patch(
      `/webhooks/${this.applicationId}/${this.token}/messages/@original`,
      {
        body: options,
      }
    );
  }

  /**
   * Delete the original interaction response
   */
  async deleteReply() {
    if (!this._client) {
      throw new Error("REST client not available for this interaction");
    }

    return await this._client.delete(
      `/webhooks/${this.applicationId}/${this.token}/messages/@original`
    );
  }

  /**
   * Show a modal to the user (only works for certain interaction types)
   */
  async showModal(options: {
    title: string;
    custom_id: string;
    components: any[];
  }) {
    if (!this._client) {
      throw new Error("REST client not available for this interaction");
    }

    if (this._responded) {
      throw new Error("This interaction has already been responded to.");
    }

    const body = {
      type: 9, // MODAL
      data: options,
    };

    const response = await this._client.post(
      `/interactions/${this.id}/${this.token}/callback`,
      {
        body,
      }
    );

    this._responded = true;
    return response;
  }

  /**
   * Update the message that triggered this interaction (for component interactions)
   */
  async update(options: {
    content?: string;
    embeds?: any[];
    components?: any[];
  }) {
    if (!this._client) {
      throw new Error("REST client not available for this interaction");
    }

    if (this._responded) {
      throw new Error("This interaction has already been responded to.");
    }

    const body = {
      type: 7, // UPDATE_MESSAGE
      data: options,
    };

    const response = await this._client.post(
      `/interactions/${this.id}/${this.token}/callback`,
      {
        body,
      }
    );

    this._responded = true;
    return response;
  }

  /**
   * Send an autocomplete response (for autocomplete interactions)
   */
  async autocomplete(choices: Array<{ name: string; value: string | number }>) {
    if (!this._client) {
      throw new Error("REST client not available for this interaction");
    }

    if (this._responded) {
      throw new Error("This interaction has already been responded to.");
    }

    if (!this.isAutocomplete()) {
      throw new Error(
        "This method can only be used with autocomplete interactions"
      );
    }

    const body = {
      type: 8, // APPLICATION_COMMAND_AUTOCOMPLETE_RESULT
      data: {
        choices: choices.slice(0, 25), // Discord limits to 25 choices
      },
    };

    const response = await this._client.post(
      `/interactions/${this.id}/${this.token}/callback`,
      {
        body,
      }
    );

    this._responded = true;
    return response;
  }

  /**
   * Create a deferred response (thinking...)
   * @deprecated Use defer() instead for actual API calls
   */
  deferResponse(ephemeral = false): {
    type: number;
    data?: { flags?: number };
  } {
    return {
      type: this.isSlashCommand() ? 5 : 6, // DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE or DEFERRED_UPDATE_MESSAGE
      data: ephemeral ? { flags: 64 } : undefined, // EPHEMERAL flag
    };
  }

  /**
   * Create a response with content
   * @deprecated Use reply() instead for actual API calls
   */
  replyResponse(
    content: string,
    ephemeral = false
  ): { type: number; data: any } {
    return {
      type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
      data: {
        content,
        flags: ephemeral ? 64 : undefined,
      },
    };
  }

  /**
   * Create a response with embed
   * @deprecated Use reply() instead for actual API calls
   */
  replyEmbedResponse(
    embed: any,
    ephemeral = false
  ): { type: number; data: any } {
    return {
      type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
      data: {
        embeds: [embed],
        flags: ephemeral ? 64 : undefined,
      },
    };
  }

  /**
   * Create a modal response
   * @deprecated Use showModal() instead for actual API calls
   */
  showModalResponse(
    customId: string,
    title: string,
    components: any[]
  ): { type: number; data: any } {
    return {
      type: 9, // MODAL
      data: {
        custom_id: customId,
        title,
        components,
      },
    };
  }
}
