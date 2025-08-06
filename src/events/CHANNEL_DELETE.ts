/**
 * CHANNEL_DELETE Event
 *
 * Emitted when a channel is deleted.
 */

import type { Channel } from "@/types/structures/channel";

export class ChannelDeleteData {
  constructor(public data: Channel) {}

  /**
   * The deleted channel data
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
