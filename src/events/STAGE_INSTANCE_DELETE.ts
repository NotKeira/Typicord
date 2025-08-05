/**
 * STAGE_INSTANCE_DELETE Event
 *
 * Sent when a stage instance has been deleted (i.e. the stage has been closed).
 */

export interface StageInstanceDeleteData {
  /** The id of this stage instance */
  id: string;
  /** The guild id of the associated stage channel */
  guild_id: string;
  /** The id of the associated stage channel */
  channel_id: string;
  /** The topic of the stage instance (1-120 characters) */
  topic: string;
  /** The privacy level of the stage instance */
  privacy_level: number;
  /** Whether or not stage discovery is disabled */
  discoverable_disabled: boolean;
  /** The id of the scheduled event for this stage instance */
  guild_scheduled_event_id?: string | null;
}

export class StageInstanceDeleteEventData {
  constructor(public data: StageInstanceDeleteData) {}

  /**
   * The stage instance ID
   */
  get id() {
    return this.data.id;
  }

  /**
   * The guild ID where the stage was deleted
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * The stage channel ID
   */
  get channelId() {
    return this.data.channel_id;
  }

  /**
   * The stage topic
   */
  get topic() {
    return this.data.topic;
  }

  /**
   * The privacy level of the stage
   */
  get privacyLevel() {
    return this.data.privacy_level;
  }

  /**
   * Whether stage discovery was disabled
   */
  get wasDiscoverableDisabled() {
    return this.data.discoverable_disabled;
  }

  /**
   * The scheduled event ID associated with this stage
   */
  get guildScheduledEventId() {
    return this.data.guild_scheduled_event_id;
  }

  /**
   * Whether this stage was public
   */
  get wasPublic() {
    return this.data.privacy_level === 1; // PUBLIC
  }

  /**
   * Whether this stage was guild-only
   */
  get wasGuildOnly() {
    return this.data.privacy_level === 2; // GUILD_ONLY
  }

  /**
   * Whether this stage had an associated scheduled event
   */
  get hadScheduledEvent() {
    return !!this.data.guild_scheduled_event_id;
  }
}
