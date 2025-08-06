/**
 * THREAD_DELETE Event
 *
 * Sent when a thread relevant to the current user is deleted.
 */
export interface ThreadDeleteEventData {
    /** The thread's ID */
    id: string;
    /** The guild ID */
    guild_id?: string;
    /** The parent channel ID */
    parent_id?: string;
    /** The thread's type */
    type: number;
}
export declare class ThreadDeleteData {
    data: ThreadDeleteEventData;
    constructor(data: ThreadDeleteEventData);
    /**
     * The deleted thread's ID
     */
    get threadId(): string;
    /**
     * The guild ID where the thread was deleted
     */
    get guildId(): string | undefined;
    /**
     * The parent channel ID
     */
    get parentId(): string | undefined;
    /**
     * The thread's type
     */
    get type(): number;
}
//# sourceMappingURL=THREAD_DELETE.d.ts.map