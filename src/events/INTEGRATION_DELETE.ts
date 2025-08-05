/**
 * INTEGRATION_DELETE Event
 *
 * Sent when an integration is deleted.
 */

export interface IntegrationDeleteData {
  /** Integration id */
  id: string;
  /** The guild id */
  guild_id: string;
  /** ID of the bot/OAuth2 application for this discord integration */
  application_id?: string;
}

export class IntegrationDeleteEventData {
  constructor(public data: IntegrationDeleteData) {}

  /**
   * The integration ID that was deleted
   */
  get id() {
    return this.data.id;
  }

  /**
   * The guild ID where the integration was deleted
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * The application ID (for Discord integrations)
   */
  get applicationId() {
    return this.data.application_id;
  }

  /**
   * Whether this was a Discord bot integration
   */
  get wasDiscordBotIntegration() {
    return !!this.data.application_id;
  }
}
