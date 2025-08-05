/**
 * GUILD_SCHEDULED_EVENT_USER_ADD Event
 *
 * Sent when a user has subscribed to a guild scheduled event.
 */

export interface GuildScheduledEventUserAddData {
  /** The id of the guild scheduled event */
  guild_scheduled_event_id: string;
  /** The id of the user */
  user_id: string;
  /** The id of the guild */
  guild_id: string;
}

export class GuildScheduledEventUserAddEventData {
  constructor(public data: GuildScheduledEventUserAddData) {}

  /**
   * The scheduled event ID
   */
  get guildScheduledEventId() {
    return this.data.guild_scheduled_event_id;
  }

  /**
   * The user ID who subscribed
   */
  get userId() {
    return this.data.user_id;
  }

  /**
   * The guild ID where the event is
   */
  get guildId() {
    return this.data.guild_id;
  }
}
