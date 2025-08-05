/**
 * THREAD_UPDATE Event
 *
 * Sent when a thread is updated.
 */

import type { Channel } from "@/types/structures/channel";

export type ThreadUpdateData = Channel;

export class ThreadUpdateEventData {
  constructor(public data: ThreadUpdateData) {}

  /**
   * The thread (channel) that was updated
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
   * The guild ID where the thread was updated
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

  /**
   * Thread metadata
   */
  get metadata() {
    return this.data.thread_metadata;
  }

  /**
   * Auto archive duration in minutes
   */
  get autoArchiveDuration() {
    return this.data.thread_metadata?.auto_archive_duration;
  }
}
