/**
 * STAGE_INSTANCE_DELETE Event
 *
 * Sent when a stage instance has been deleted (i.e. the stage has been closed).
 */
export interface StageInstanceDeleteEventData {
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
export declare class StageInstanceDeleteData {
    data: StageInstanceDeleteEventData;
    constructor(data: StageInstanceDeleteEventData);
    /**
     * The stage instance ID
     */
    get id(): string;
    /**
     * The guild ID where the stage was deleted
     */
    get guildId(): string;
    /**
     * The stage channel ID
     */
    get channelId(): string;
    /**
     * The stage topic
     */
    get topic(): string;
    /**
     * The privacy level of the stage
     */
    get privacyLevel(): number;
    /**
     * Whether stage discovery was disabled
     */
    get wasDiscoverableDisabled(): boolean;
    /**
     * The scheduled event ID associated with this stage
     */
    get guildScheduledEventId(): string | null | undefined;
    /**
     * Whether this stage was public
     */
    get wasPublic(): boolean;
    /**
     * Whether this stage was guild-only
     */
    get wasGuildOnly(): boolean;
    /**
     * Whether this stage had an associated scheduled event
     */
    get hadScheduledEvent(): boolean;
}
//# sourceMappingURL=STAGE_INSTANCE_DELETE.d.ts.map