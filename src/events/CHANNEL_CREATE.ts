/**
 * CHANNEL_CREATE Event
 *
 * Emitted when a new channel is created.
 */

import type { Channel } from "@/types/structures/channel";

export class ChannelCreateEventData {
  constructor(public data: Channel) {}

  /**
   * The created channel data
   */
  get channel() {
    return this.data;
  }

  /**
   * Channel ID
   */
  get id() {
    return this.data.id;
  }

  /**
   * Channel name
   */
  get name() {
    return this.data.name;
  }

  /**
   * Channel type
   */
  get type() {
    return this.data.type;
  }

  /**
   * Guild ID (if in a guild)
   */
  get guildId() {
    return this.data.guild_id;
  }
}
