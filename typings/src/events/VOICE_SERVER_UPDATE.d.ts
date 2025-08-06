/**
 * VOICE_SERVER_UPDATE Event
 *
 * Sent when a guild's voice server is updated.
 */
export interface VoiceServerUpdateEventData {
    /** Voice connection token */
    token: string;
    /** Guild this voice server update is for */
    guild_id: string;
    /** Voice server host */
    endpoint: string | null;
}
export declare class VoiceServerUpdateData {
    data: VoiceServerUpdateEventData;
    constructor(data: VoiceServerUpdateEventData);
    /**
     * Voice connection token
     */
    get token(): string;
    /**
     * The guild ID for this voice server update
     */
    get guildId(): string;
    /**
     * Voice server host endpoint
     */
    get endpoint(): string | null;
    /**
     * Whether the voice server is available
     */
    get isAvailable(): boolean;
}
//# sourceMappingURL=VOICE_SERVER_UPDATE.d.ts.map