/**
 * GUILD_INTEGRATIONS_UPDATE Event
 *
 * Sent when a guild integration is updated.
 */
export interface GuildIntegrationsUpdateEventData {
    /** ID of the guild whose integrations were updated */
    guild_id: string;
}
export declare class GuildIntegrationsUpdateData {
    data: GuildIntegrationsUpdateEventData;
    constructor(data: GuildIntegrationsUpdateEventData);
    /**
     * The guild ID where integrations were updated
     */
    get guildId(): string;
}
//# sourceMappingURL=GUILD_INTEGRATIONS_UPDATE.d.ts.map