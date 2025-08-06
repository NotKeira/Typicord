/**
 * THREAD_LIST_SYNC Event
 *
 * Sent when gaining access to a channel, contains all active threads in that channel.
 */
import type { Channel, ThreadMember } from "@/structures/Channel";
export interface ThreadListSyncEventData {
    /** The guild id */
    guild_id: string;
    /** The parent channel ids whose threads are being synced. If omitted, then threads were synced for the entire guild. This array may contain channel_ids that have no active threads as well, so you know to clear that data. */
    channel_ids?: string[];
    /** All active threads in the given channels that the current user can access */
    threads: Channel[];
    /** All thread member objects from the synced threads for the current user, indicating which threads the current user has been added to */
    members: ThreadMember[];
}
export declare class ThreadListSyncData {
    data: ThreadListSyncEventData;
    constructor(data: ThreadListSyncEventData);
    /**
     * The guild ID where threads were synced
     */
    get guildId(): string;
    /**
     * Parent channel IDs whose threads are being synced
     */
    get channelIds(): string[] | undefined;
    /**
     * All active threads being synced
     */
    get threads(): Channel[];
    /**
     * Thread member objects for the current user
     */
    get members(): ThreadMember[];
    /**
     * Whether this is a full guild sync
     */
    get isFullGuildSync(): boolean;
    /**
     * Whether this is a partial channel sync
     */
    get isPartialChannelSync(): boolean;
    /**
     * Number of threads synced
     */
    get threadCount(): number;
    /**
     * Number of thread memberships for current user
     */
    get membershipCount(): number;
    /**
     * Get threads for a specific parent channel
     */
    getThreadsForChannel(channelId: string): Channel[];
    /**
     * Get thread member for a specific thread
     */
    getMemberForThread(threadId: string): ThreadMember | undefined;
}
//# sourceMappingURL=THREAD_LIST_SYNC.d.ts.map