/**
 * GUILD_SCHEDULED_EVENT_DELETE Event
 *
 * Sent when a guild scheduled event is deleted.
 */

import type { User } from "@/structures/User";

export interface GuildScheduledEventDeleteEventData {
  /** The id of the scheduled event */
  id: string;
  /** The guild id which the scheduled event belongs to */
  guild_id: string;
  /** The channel id in which the scheduled event will be hosted, or null if scheduled entity type is EXTERNAL */
  channel_id?: string | null;
  /** The id of the user that created the scheduled event */
  creator_id?: string | null;
  /** The name of the scheduled event (1-100 characters) */
  name: string;
  /** The description of the scheduled event (1-1000 characters) */
  description?: string | null;
  /** The time the scheduled event will start */
  scheduled_start_time: string;
  /** The time the scheduled event will end, required if entity_type is EXTERNAL */
  scheduled_end_time?: string | null;
  /** The privacy level of the scheduled event */
  privacy_level: number;
  /** The status of the scheduled event */
  status: number;
  /** The type of the scheduled event */
  entity_type: number;
  /** The id of an entity associated with a guild scheduled event */
  entity_id?: string | null;
  /** Additional metadata for the guild scheduled event */
  entity_metadata?: {
    /** Location of the event (1-100 characters) */
    location?: string;
  } | null;
  /** The user that created the scheduled event */
  creator?: User;
  /** The number of users subscribed to the scheduled event */
  user_count?: number;
  /** The cover image hash of the scheduled event */
  image?: string | null;
}

export class GuildScheduledEventDeleteData {
  constructor(public data: GuildScheduledEventDeleteEventData) {}

  /**
   * The scheduled event ID
   */
  get id() {
    return this.data.id;
  }

  /**
   * The guild ID where the event was deleted
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * The channel ID where the event was hosted
   */
  get channelId() {
    return this.data.channel_id;
  }

  /**
   * The user who created the event
   */
  get creatorId() {
    return this.data.creator_id;
  }

  /**
   * The event name
   */
  get name() {
    return this.data.name;
  }

  /**
   * The event description
   */
  get description() {
    return this.data.description;
  }

  /**
   * When the event was scheduled to start
   */
  get scheduledStartTime() {
    return new Date(this.data.scheduled_start_time);
  }

  /**
   * When the event was scheduled to end
   */
  get scheduledEndTime() {
    return this.data.scheduled_end_time
      ? new Date(this.data.scheduled_end_time)
      : null;
  }

  /**
   * The privacy level of the event
   */
  get privacyLevel() {
    return this.data.privacy_level;
  }

  /**
   * The status of the event
   */
  get status() {
    return this.data.status;
  }

  /**
   * The type of the event
   */
  get entityType() {
    return this.data.entity_type;
  }

  /**
   * The entity ID associated with the event
   */
  get entityId() {
    return this.data.entity_id;
  }

  /**
   * Additional metadata for the event
   */
  get entityMetadata() {
    return this.data.entity_metadata;
  }

  /**
   * The user who created the event
   */
  get creator() {
    return this.data.creator;
  }

  /**
   * Number of users subscribed to the event
   */
  get userCount() {
    return this.data.user_count || 0;
  }

  /**
   * The cover image hash
   */
  get image() {
    return this.data.image;
  }

  /**
   * Whether this was a stage channel event
   */
  get wasStageChannelEvent() {
    return this.data.entity_type === 1; // STAGE_INSTANCE
  }

  /**
   * Whether this was a voice channel event
   */
  get wasVoiceChannelEvent() {
    return this.data.entity_type === 2; // VOICE
  }

  /**
   * Whether this was an external event
   */
  get wasExternalEvent() {
    return this.data.entity_type === 3; // EXTERNAL
  }

  /**
   * Whether the event was scheduled
   */
  get wasScheduled() {
    return this.data.status === 1; // SCHEDULED
  }

  /**
   * Whether the event was active
   */
  get wasActive() {
    return this.data.status === 2; // ACTIVE
  }

  /**
   * Whether the event was completed
   */
  get wasCompleted() {
    return this.data.status === 3; // COMPLETED
  }

  /**
   * Whether the event was canceled
   */
  get wasCanceled() {
    return this.data.status === 4; // CANCELED
  }

  /**
   * The location for external events
   */
  get location() {
    return this.data.entity_metadata?.location;
  }
}
