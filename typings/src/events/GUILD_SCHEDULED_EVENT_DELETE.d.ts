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
export declare class GuildScheduledEventDeleteData {
    data: GuildScheduledEventDeleteEventData;
    constructor(data: GuildScheduledEventDeleteEventData);
    /**
     * The scheduled event ID
     */
    get id(): string;
    /**
     * The guild ID where the event was deleted
     */
    get guildId(): string;
    /**
     * The channel ID where the event was hosted
     */
    get channelId(): string | null | undefined;
    /**
     * The user who created the event
     */
    get creatorId(): string | null | undefined;
    /**
     * The event name
     */
    get name(): string;
    /**
     * The event description
     */
    get description(): string | null | undefined;
    /**
     * When the event was scheduled to start
     */
    get scheduledStartTime(): Date;
    /**
     * When the event was scheduled to end
     */
    get scheduledEndTime(): Date | null;
    /**
     * The privacy level of the event
     */
    get privacyLevel(): number;
    /**
     * The status of the event
     */
    get status(): number;
    /**
     * The type of the event
     */
    get entityType(): number;
    /**
     * The entity ID associated with the event
     */
    get entityId(): string | null | undefined;
    /**
     * Additional metadata for the event
     */
    get entityMetadata(): {
        /** Location of the event (1-100 characters) */
        location?: string;
    } | null | undefined;
    /**
     * The user who created the event
     */
    get creator(): User | undefined;
    /**
     * Number of users subscribed to the event
     */
    get userCount(): number;
    /**
     * The cover image hash
     */
    get image(): string | null | undefined;
    /**
     * Whether this was a stage channel event
     */
    get wasStageChannelEvent(): boolean;
    /**
     * Whether this was a voice channel event
     */
    get wasVoiceChannelEvent(): boolean;
    /**
     * Whether this was an external event
     */
    get wasExternalEvent(): boolean;
    /**
     * Whether the event was scheduled
     */
    get wasScheduled(): boolean;
    /**
     * Whether the event was active
     */
    get wasActive(): boolean;
    /**
     * Whether the event was completed
     */
    get wasCompleted(): boolean;
    /**
     * Whether the event was canceled
     */
    get wasCanceled(): boolean;
    /**
     * The location for external events
     */
    get location(): string | undefined;
}
//# sourceMappingURL=GUILD_SCHEDULED_EVENT_DELETE.d.ts.map