/**
 * GUILD_INTEGRATIONS_UPDATE Event
 *
 * Sent when a guild integration is updated.
 */

export interface GuildIntegrationsUpdateEventData {
  /** ID of the guild whose integrations were updated */
  guild_id: string;
}

export class GuildIntegrationsUpdateData {
  constructor(public data: GuildIntegrationsUpdateEventData) {}

  /**
   * The guild ID where integrations were updated
   */
  get guildId() {
    return this.data.guild_id;
  }
}
