/**
 * THREAD_UPDATE Event
 *
 * Sent when a thread is updated.
 */
import type { Channel } from "@/types/structures/channel";
export type ThreadUpdateEventData = Channel;
export declare class ThreadUpdateData {
    data: ThreadUpdateEventData;
    constructor(data: ThreadUpdateEventData);
    /**
     * The thread (channel) that was updated
     */
    get thread(): Channel;
    /**
     * The thread's ID
     */
    get threadId(): string;
    /**
     * The thread's name
     */
    get name(): string | undefined;
    /**
     * The guild ID where the thread was updated
     */
    get guildId(): string | undefined;
    /**
     * The parent channel ID
     */
    get parentId(): string | null | undefined;
    /**
     * The thread's type
     */
    get type(): import("@/types/structures/channel").ChannelType;
    /**
     * Whether this thread is archived
     */
    get isArchived(): boolean;
    /**
     * Whether this thread is locked
     */
    get isLocked(): boolean;
    /**
     * The thread's message count
     */
    get messageCount(): number;
    /**
     * The thread's member count
     */
    get memberCount(): number;
    /**
     * Thread metadata
     */
    get metadata(): import("@/types/structures/channel").ThreadMetadata | undefined;
    /**
     * Auto archive duration in minutes
     */
    get autoArchiveDuration(): number | undefined;
}
//# sourceMappingURL=THREAD_UPDATE.d.ts.map