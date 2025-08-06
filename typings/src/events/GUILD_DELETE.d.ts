/**
 * GUILD_DELETE Event
 *
 * Emitted when the bot leaves a guild or when a guild becomes unavailable.
 */
export interface GuildDeleteEventData {
    id: string;
    unavailable?: boolean;
}
export declare class GuildDeleteData {
    data: GuildDeleteEventData;
    constructor(data: GuildDeleteEventData);
    /**
     * The guild ID
     */
    get guildId(): string;
    /**
     * Whether the guild is unavailable (outage) or actually removed
     */
    get unavailable(): boolean | undefined;
    /**
     * Whether the bot was removed from the guild
     */
    get removed(): boolean;
}
//# sourceMappingURL=GUILD_DELETE.d.ts.map