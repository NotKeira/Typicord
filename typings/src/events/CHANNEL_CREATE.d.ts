/**
 * CHANNEL_CREATE Event
 *
 * Emitted when a new channel is created.
 */
import type { Channel } from "@/types/structures/channel";
export declare class ChannelCreateData {
    data: Channel;
    constructor(data: Channel);
    /**
     * The created channel data
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
//# sourceMappingURL=CHANNEL_CREATE.d.ts.map