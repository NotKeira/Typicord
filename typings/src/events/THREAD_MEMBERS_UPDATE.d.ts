/**
 * THREAD_MEMBERS_UPDATE Event
 *
 * Sent when anyone is added to or removed from a thread.
 */
import type { ThreadMember } from "@/structures/Channel";
export interface ThreadMembersUpdateEventData {
    /** The id of the thread */
    id: string;
    /** The guild id */
    guild_id: string;
    /** The approximate number of members in the thread, capped at 50 */
    member_count: number;
    /** The users who were added to the thread */
    added_members?: ThreadMember[];
    /** The id of the users who were removed from the thread */
    removed_member_ids?: string[];
}
export declare class ThreadMembersUpdateData {
    data: ThreadMembersUpdateEventData;
    constructor(data: ThreadMembersUpdateEventData);
    /**
     * The thread ID
     */
    get threadId(): string;
    /**
     * The guild ID
     */
    get guildId(): string;
    /**
     * Approximate member count (capped at 50)
     */
    get memberCount(): number;
    /**
     * Members who were added
     */
    get addedMembers(): ThreadMember[];
    /**
     * IDs of members who were removed
     */
    get removedMemberIds(): string[];
    /**
     * Whether members were added
     */
    get hasMembersAdded(): boolean;
    /**
     * Whether members were removed
     */
    get hasMembersRemoved(): boolean;
    /**
     * Number of members added
     */
    get addedCount(): number;
    /**
     * Number of members removed
     */
    get removedCount(): number;
    /**
     * Net change in member count (added - removed)
     */
    get memberDelta(): number;
}
//# sourceMappingURL=THREAD_MEMBERS_UPDATE.d.ts.map