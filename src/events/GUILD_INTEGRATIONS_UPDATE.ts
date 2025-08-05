/**
 * GUILD_INTEGRATIONS_UPDATE Event
 *
 * Sent when a guild integration is updated.
 */

export interface GuildIntegrationsUpdateData {
  /** ID of the guild whose integrations were updated */
  guild_id: string;
}

export class GuildIntegrationsUpdateEventData {
  constructor(public data: GuildIntegrationsUpdateData) {}

  /**
   * The guild ID where integrations were updated
   */
  get guildId() {
    return this.data.guild_id;
  }
}
