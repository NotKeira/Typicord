/**
 * VOICE_SERVER_UPDATE Event
 *
 * Sent when a guild's voice server is updated.
 */

export interface VoiceServerUpdateData {
  /** Voice connection token */
  token: string;
  /** Guild this voice server update is for */
  guild_id: string;
  /** Voice server host */
  endpoint: string | null;
}

export class VoiceServerUpdateEventData {
  constructor(public data: VoiceServerUpdateData) {}

  /**
   * Voice connection token
   */
  get token() {
    return this.data.token;
  }

  /**
   * The guild ID for this voice server update
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * Voice server host endpoint
   */
  get endpoint() {
    return this.data.endpoint;
  }

  /**
   * Whether the voice server is available
   */
  get isAvailable() {
    return this.data.endpoint !== null;
  }
}
