/**
 * GUILD_SCHEDULED_EVENT_USER_ADD Event
 *
 * Sent when a user has subscribed to a guild scheduled event.
 */
export interface GuildScheduledEventUserAddEventData {
    /** The id of the guild scheduled event */
    guild_scheduled_event_id: string;
    /** The id of the user */
    user_id: string;
    /** The id of the guild */
    guild_id: string;
}
export declare class GuildScheduledEventUserAddData {
    data: GuildScheduledEventUserAddEventData;
    constructor(data: GuildScheduledEventUserAddEventData);
    /**
     * The scheduled event ID
     */
    get guildScheduledEventId(): string;
    /**
     * The user ID who subscribed
     */
    get userId(): string;
    /**
     * The guild ID where the event is
     */
    get guildId(): string;
}
//# sourceMappingURL=GUILD_SCHEDULED_EVENT_USER_ADD.d.ts.map