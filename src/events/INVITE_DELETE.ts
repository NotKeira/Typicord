/**
 * INVITE_DELETE Event
 *
 * Sent when an invite is deleted.
 */

export interface InviteDeleteEventData {
  /** Channel of the invite */
  channel_id: string;
  /** Guild of the invite */
  guild_id?: string;
  /** Unique invite code */
  code: string;
}

export class InviteDeleteData {
  constructor(public data: InviteDeleteEventData) {}

  /**
   * The channel ID the invite was for
   */
  get channelId() {
    return this.data.channel_id;
  }

  /**
   * The guild ID the invite was for
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * The invite code that was deleted
   */
  get code() {
    return this.data.code;
  }

  /**
   * The full invite URL that was deleted
   */
  get url() {
    return `https://discord.gg/${this.data.code}`;
  }
}
