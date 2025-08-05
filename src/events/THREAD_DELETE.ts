/**
 * THREAD_DELETE Event
 *
 * Sent when a thread relevant to the current user is deleted.
 */

export interface ThreadDeleteData {
  /** The thread's ID */
  id: string;
  /** The guild ID */
  guild_id?: string;
  /** The parent channel ID */
  parent_id?: string;
  /** The thread's type */
  type: number;
}

export class ThreadDeleteEventData {
  constructor(public data: ThreadDeleteData) {}

  /**
   * The deleted thread's ID
   */
  get threadId() {
    return this.data.id;
  }

  /**
   * The guild ID where the thread was deleted
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
}
