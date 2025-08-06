/**
 * INTEGRATION_DELETE Event
 *
 * Sent when an integration is deleted.
 */
export interface IntegrationDeleteEventData {
    /** Integration id */
    id: string;
    /** The guild id */
    guild_id: string;
    /** ID of the bot/OAuth2 application for this discord integration */
    application_id?: string;
}
export declare class IntegrationDeleteData {
    data: IntegrationDeleteEventData;
    constructor(data: IntegrationDeleteEventData);
    /**
     * The integration ID that was deleted
     */
    get id(): string;
    /**
     * The guild ID where the integration was deleted
     */
    get guildId(): string;
    /**
     * The application ID (for Discord integrations)
     */
    get applicationId(): string | undefined;
    /**
     * Whether this was a Discord bot integration
     */
    get wasDiscordBotIntegration(): boolean;
}
//# sourceMappingURL=INTEGRATION_DELETE.d.ts.map