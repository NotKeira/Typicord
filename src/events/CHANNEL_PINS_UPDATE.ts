/**
 * CHANNEL_PINS_UPDATE Event
 *
 * Sent when a message is pinned or unpinned in a text channel.
 */

export interface ChannelPinsUpdateEventData {
  /** ID of the guild */
  guild_id?: string;
  /** ID of the channel */
  channel_id: string;
  /** Time at which the most recent pinned message was pinned */
  last_pin_timestamp?: string | null;
}

export class ChannelPinsUpdateData {
  constructor(public data: ChannelPinsUpdateEventData) {}

  /**
   * The guild ID where pins were updated
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * The channel ID where pins were updated
   */
  get channelId() {
    return this.data.channel_id;
  }

  /**
   * When the most recent pin was created
   */
  get lastPinTimestamp() {
    return this.data.last_pin_timestamp
      ? new Date(this.data.last_pin_timestamp)
      : null;
  }
}
