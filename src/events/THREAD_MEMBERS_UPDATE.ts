/**
 * THREAD_MEMBERS_UPDATE Event
 *
 * Sent when anyone is added to or removed from a thread.
 */

import type { ThreadMember } from "@/types/structures/channel";

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

export class ThreadMembersUpdateData {
  constructor(public data: ThreadMembersUpdateEventData) {}

  /**
   * The thread ID
   */
  get threadId() {
    return this.data.id;
  }

  /**
   * The guild ID
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * Approximate member count (capped at 50)
   */
  get memberCount() {
    return this.data.member_count;
  }

  /**
   * Members who were added
   */
  get addedMembers() {
    return this.data.added_members || [];
  }

  /**
   * IDs of members who were removed
   */
  get removedMemberIds() {
    return this.data.removed_member_ids || [];
  }

  /**
   * Whether members were added
   */
  get hasMembersAdded() {
    return !!this.data.added_members?.length;
  }

  /**
   * Whether members were removed
   */
  get hasMembersRemoved() {
    return !!this.data.removed_member_ids?.length;
  }

  /**
   * Number of members added
   */
  get addedCount() {
    return this.data.added_members?.length || 0;
  }

  /**
   * Number of members removed
   */
  get removedCount() {
    return this.data.removed_member_ids?.length || 0;
  }

  /**
   * Net change in member count (added - removed)
   */
  get memberDelta() {
    return this.addedCount - this.removedCount;
  }
}
