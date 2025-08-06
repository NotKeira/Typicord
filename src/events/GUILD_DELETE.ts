/**
 * GUILD_DELETE Event
 *
 * Emitted when the bot leaves a guild or when a guild becomes unavailable.
 */

export interface GuildDeleteEventData {
  id: string;
  unavailable?: boolean;
}

export class GuildDeleteData {
  constructor(public data: GuildDeleteEventData) {}

  /**
   * The guild ID
   */
  get guildId() {
    return this.data.id;
  }

  /**
   * Whether the guild is unavailable (outage) or actually removed
   */
  get unavailable() {
    return this.data.unavailable;
  }

  /**
   * Whether the bot was removed from the guild
   */
  get removed() {
    return !this.data.unavailable;
  }
}
