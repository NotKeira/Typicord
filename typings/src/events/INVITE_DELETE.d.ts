/**
 * INVITE_DELETE Event
 *
 * Sent when an invite is deleted.
 */
export interface InviteDeleteEventData {
    /** Channel of the invite */
    channel_id: string;
    /** Guild of the invite */
    guild_id?: string;
    /** Unique invite code */
    code: string;
}
export declare class InviteDeleteData {
    data: InviteDeleteEventData;
    constructor(data: InviteDeleteEventData);
    /**
     * The channel ID the invite was for
     */
    get channelId(): string;
    /**
     * The guild ID the invite was for
     */
    get guildId(): string | undefined;
    /**
     * The invite code that was deleted
     */
    get code(): string;
    /**
     * The full invite URL that was deleted
     */
    get url(): string;
}
//# sourceMappingURL=INVITE_DELETE.d.ts.map