/**
 * GUILD_SCHEDULED_EVENT_USER_REMOVE Event
 *
 * Sent when a user has unsubscribed from a guild scheduled event.
 */
export interface GuildScheduledEventUserRemoveEventData {
    /** The id of the guild scheduled event */
    guild_scheduled_event_id: string;
    /** The id of the user */
    user_id: string;
    /** The id of the guild */
    guild_id: string;
}
export declare class GuildScheduledEventUserRemoveData {
    data: GuildScheduledEventUserRemoveEventData;
    constructor(data: GuildScheduledEventUserRemoveEventData);
    /**
     * The scheduled event ID
     */
    get guildScheduledEventId(): string;
    /**
     * The user ID who unsubscribed
     */
    get userId(): string;
    /**
     * The guild ID where the event is
     */
    get guildId(): string;
}
//# sourceMappingURL=GUILD_SCHEDULED_EVENT_USER_REMOVE.d.ts.map