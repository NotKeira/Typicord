/**
 * THREAD_CREATE Event
 *
 * Sent when a thread is created, relevant to the current user,
 * or when the current user is added to a thread.
 */

import type { Channel, ThreadMember } from "@/types/structures/channel";

export interface ThreadCreateEventData extends Channel {
  /** Whether this thread was newly created */
  newly_created?: boolean;
  /** Thread member object for the current user if added to existing thread */
  member?: ThreadMember;
}

export class ThreadCreateData {
  constructor(public data: ThreadCreateEventData) {}

  /**
   * The thread (channel) that was created
   */
  get thread() {
    return this.data;
  }

  /**
   * The thread's ID
   */
  get threadId() {
    return this.data.id;
  }

  /**
   * The thread's name
   */
  get name() {
    return this.data.name;
  }

  /**
   * The guild ID where the thread was created
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * The parent channel ID
   */
  get parentId() {
    return this.data.parent_id;
  }

  /**
   * Whether this thread was newly created
   */
  get isNewlyCreated() {
    return this.data.newly_created || false;
  }

  /**
   * Thread member object if user was added to existing thread
   */
  get member() {
    return this.data.member;
  }

  /**
   * The thread's type
   */
  get type() {
    return this.data.type;
  }

  /**
   * Whether this thread is archived
   */
  get isArchived() {
    return this.data.thread_metadata?.archived || false;
  }

  /**
   * Whether this thread is locked
   */
  get isLocked() {
    return this.data.thread_metadata?.locked || false;
  }

  /**
   * The thread's message count
   */
  get messageCount() {
    return this.data.message_count || 0;
  }

  /**
   * The thread's member count
   */
  get memberCount() {
    return this.data.member_count || 0;
  }
}
