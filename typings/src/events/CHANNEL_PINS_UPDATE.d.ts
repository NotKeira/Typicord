/**
 * CHANNEL_PINS_UPDATE Event
 *
 * Sent when a message is pinned or unpinned in a text channel.
 */
export interface ChannelPinsUpdateEventData {
    /** ID of the guild */
    guild_id?: string;
    /** ID of the channel */
    channel_id: string;
    /** Time at which the most recent pinned message was pinned */
    last_pin_timestamp?: string | null;
}
export declare class ChannelPinsUpdateData {
    data: ChannelPinsUpdateEventData;
    constructor(data: ChannelPinsUpdateEventData);
    /**
     * The guild ID where pins were updated
     */
    get guildId(): string | undefined;
    /**
     * The channel ID where pins were updated
     */
    get channelId(): string;
    /**
     * When the most recent pin was created
     */
    get lastPinTimestamp(): Date | null;
}
//# sourceMappingURL=CHANNEL_PINS_UPDATE.d.ts.map