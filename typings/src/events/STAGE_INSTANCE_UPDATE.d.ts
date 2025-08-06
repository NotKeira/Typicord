/**
 * STAGE_INSTANCE_UPDATE Event
 *
 * Sent when a stage instance has been updated.
 */
export interface StageInstanceUpdateEventData {
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
export declare class StageInstanceUpdateData {
    data: StageInstanceUpdateEventData;
    constructor(data: StageInstanceUpdateEventData);
    /**
     * The stage instance ID
     */
    get id(): string;
    /**
     * The guild ID where the stage was updated
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
     * Whether stage discovery is disabled
     */
    get isDiscoverableDisabled(): boolean;
    /**
     * The scheduled event ID associated with this stage
     */
    get guildScheduledEventId(): string | null | undefined;
    /**
     * Whether this stage is public
     */
    get isPublic(): boolean;
    /**
     * Whether this stage is guild-only
     */
    get isGuildOnly(): boolean;
    /**
     * Whether this stage has an associated scheduled event
     */
    get hasScheduledEvent(): boolean;
}
//# sourceMappingURL=STAGE_INSTANCE_UPDATE.d.ts.map