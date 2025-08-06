/**
 * CHANNEL_DELETE Event
 *
 * Emitted when a channel is deleted.
 */
import type { Channel } from "@/types/structures/channel";
export declare class ChannelDeleteData {
    data: Channel;
    constructor(data: Channel);
    /**
     * The deleted channel data
     */
    get channel(): Channel;
    /**
     * Channel ID
     */
    get id(): string;
    /**
     * Channel name
     */
    get name(): string | undefined;
    /**
     * Channel type
     */
    get type(): import("@/types/structures/channel").ChannelType;
    /**
     * Guild ID (if in a guild)
     */
    get guildId(): string | undefined;
}
//# sourceMappingURL=CHANNEL_DELETE.d.ts.map