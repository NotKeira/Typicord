/**
 * THREAD_CREATE Event
 *
 * Sent when a thread is created, relevant to the current user,
 * or when the current user is added to a thread.
 */
import type { Channel } from "@/types/structures/channel";
import type { ThreadMember } from "@/structures/Channel";
export interface ThreadCreateEventData extends Channel {
    /** Whether this thread was newly created */
    newly_created?: boolean;
    /** Thread member object for the current user if added to existing thread */
    member?: ThreadMember;
}
export declare class ThreadCreateData {
    data: ThreadCreateEventData;
    constructor(data: ThreadCreateEventData);
    /**
     * The thread (channel) that was created
     */
    get thread(): ThreadCreateEventData;
    /**
     * The thread's ID
     */
    get threadId(): string;
    /**
     * The thread's name
     */
    get name(): string | undefined;
    /**
     * The guild ID where the thread was created
     */
    get guildId(): string | undefined;
    /**
     * The parent channel ID
     */
    get parentId(): string | null | undefined;
    /**
     * Whether this thread was newly created
     */
    get isNewlyCreated(): boolean;
    /**
     * Thread member object if user was added to existing thread
     */
    get member(): ThreadMember | undefined;
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
}
//# sourceMappingURL=THREAD_CREATE.d.ts.map