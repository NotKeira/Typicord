/**
 * CHANNEL_UPDATE Event
 *
 * Emitted when a channel is updated.
 */
import type { Channel } from "@/types/structures/channel";
export declare class ChannelUpdateData {
    data: Channel;
    constructor(data: Channel);
    /**
     * The updated channel data
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
//# sourceMappingURL=CHANNEL_UPDATE.d.ts.map