/**
 * WEBHOOKS_UPDATE Event
 *
 * Sent when a guild channel's webhook is created, updated, or deleted.
 */

export interface WebhooksUpdateEventData {
  /** ID of the guild */
  guild_id: string;
  /** ID of the channel */
  channel_id: string;
}

export class WebhooksUpdateData {
  constructor(public data: WebhooksUpdateEventData) {}

  /**
   * The guild ID where webhooks were updated
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * The channel ID where webhooks were updated
   */
  get channelId() {
    return this.data.channel_id;
  }
}
