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

export class ThreadListSyncData {
  constructor(public data: ThreadListSyncEventData) {}

  /**
   * The guild ID where threads were synced
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * Parent channel IDs whose threads are being synced
   */
  get channelIds() {
    return this.data.channel_ids;
  }

  /**
   * All active threads being synced
   */
  get threads() {
    return this.data.threads;
  }

  /**
   * Thread member objects for the current user
   */
  get members() {
    return this.data.members;
  }

  /**
   * Whether this is a full guild sync
   */
  get isFullGuildSync() {
    return !this.data.channel_ids;
  }

  /**
   * Whether this is a partial channel sync
   */
  get isPartialChannelSync() {
    return !!this.data.channel_ids;
  }

  /**
   * Number of threads synced
   */
  get threadCount() {
    return this.data.threads.length;
  }

  /**
   * Number of thread memberships for current user
   */
  get membershipCount() {
    return this.data.members.length;
  }

  /**
   * Get threads for a specific parent channel
   */
  getThreadsForChannel(channelId: string) {
    return this.data.threads.filter(thread => thread.parentId === channelId);
  }

  /**
   * Get thread member for a specific thread
   */
  getMemberForThread(threadId: string) {
    return this.data.members.find(member => member.id === threadId);
  }
}
