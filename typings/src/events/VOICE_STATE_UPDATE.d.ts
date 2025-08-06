/**
 * VOICE_STATE_UPDATE Event
 *
 * Emitted when a user's voice state is updated (joins/leaves voice channels, mutes, etc.).
 */
import type { VoiceStateUpdateEvent } from "@/types/gateway/events";
export declare class VoiceStateUpdateData {
    data: VoiceStateUpdateEvent;
    constructor(data: VoiceStateUpdateEvent);
    /**
     * Guild ID (if in a guild voice channel)
     */
    get guildId(): string | undefined;
    /**
     * Channel ID (null if user left voice)
     */
    get channelId(): string | null;
    /**
     * User ID whose voice state changed
     */
    get userId(): string;
    /**
     * Guild member (if in a guild)
     */
    get member(): import("../types/structures/guild").GuildMember | undefined;
    /**
     * Voice session ID
     */
    get sessionId(): string;
    /**
     * Whether the user is server deafened
     */
    get deaf(): boolean;
    /**
     * Whether the user is server muted
     */
    get mute(): boolean;
    /**
     * Whether the user is self deafened
     */
    get selfDeaf(): boolean;
    /**
     * Whether the user is self muted
     */
    get selfMute(): boolean;
    /**
     * Whether the user is streaming
     */
    get selfStream(): boolean | undefined;
    /**
     * Whether the user has video enabled
     */
    get selfVideo(): boolean;
    /**
     * Whether the user is suppressed
     */
    get suppress(): boolean;
    /**
     * Whether the user joined a voice channel
     */
    get joined(): boolean;
    /**
     * Whether the user left a voice channel
     */
    get left(): boolean;
}
//# sourceMappingURL=VOICE_STATE_UPDATE.d.ts.map