/**
 * WEBHOOKS_UPDATE Event
 *
 * Sent when a guild channel's webhook is created, updated, or deleted.
 */
export interface WebhooksUpdateEventData {
    /** ID of the guild */
    guild_id: string;
    /** ID of the channel */
    channel_id: string;
}
export declare class WebhooksUpdateData {
    data: WebhooksUpdateEventData;
    constructor(data: WebhooksUpdateEventData);
    /**
     * The guild ID where webhooks were updated
     */
    get guildId(): string;
    /**
     * The channel ID where webhooks were updated
     */
    get channelId(): string;
}
//# sourceMappingURL=WEBHOOKS_UPDATE.d.ts.map