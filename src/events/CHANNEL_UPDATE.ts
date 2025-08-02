/**
 * CHANNEL_UPDATE Event
 *
 * Emitted when a channel is updated.
 */

import type { Channel } from "@/types/structures/channel";

export class ChannelUpdateEventData {
  constructor(public data: Channel) {}

  /**
   * The updated channel data
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
