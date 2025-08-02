/**
 * VOICE_STATE_UPDATE Event
 *
 * Emitted when a user's voice state is updated (joins/leaves voice channels, mutes, etc.).
 */

import type { VoiceStateUpdateEvent } from "@/types/gateway/events";

export class VoiceStateUpdateEventData {
  constructor(public data: VoiceStateUpdateEvent) {}

  /**
   * Guild ID (if in a guild voice channel)
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * Channel ID (null if user left voice)
   */
  get channelId() {
    return this.data.channel_id;
  }

  /**
   * User ID whose voice state changed
   */
  get userId() {
    return this.data.user_id;
  }

  /**
   * Guild member (if in a guild)
   */
  get member() {
    return this.data.member;
  }

  /**
   * Voice session ID
   */
  get sessionId() {
    return this.data.session_id;
  }

  /**
   * Whether the user is server deafened
   */
  get deaf() {
    return this.data.deaf;
  }

  /**
   * Whether the user is server muted
   */
  get mute() {
    return this.data.mute;
  }

  /**
   * Whether the user is self deafened
   */
  get selfDeaf() {
    return this.data.self_deaf;
  }

  /**
   * Whether the user is self muted
   */
  get selfMute() {
    return this.data.self_mute;
  }

  /**
   * Whether the user is streaming
   */
  get selfStream() {
    return this.data.self_stream;
  }

  /**
   * Whether the user has video enabled
   */
  get selfVideo() {
    return this.data.self_video;
  }

  /**
   * Whether the user is suppressed
   */
  get suppress() {
    return this.data.suppress;
  }

  /**
   * Whether the user joined a voice channel
   */
  get joined() {
    return this.data.channel_id !== null;
  }

  /**
   * Whether the user left a voice channel
   */
  get left() {
    return this.data.channel_id === null;
  }
}
