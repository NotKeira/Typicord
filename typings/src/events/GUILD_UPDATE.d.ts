/**
 * GUILD_UPDATE Event
 *
 * Emitted when a guild is updated.
 */
import type { Guild } from "@/types/structures/guild";
export declare class GuildUpdateData {
    data: Guild;
    constructor(data: Guild);
    /**
     * The updated guild data
     */
    get guild(): Guild;
    /**
     * Guild ID
     */
    get id(): string;
    /**
     * Guild name
     */
    get name(): string;
    /**
     * Guild owner ID
     */
    get ownerId(): string;
}
//# sourceMappingURL=GUILD_UPDATE.d.ts.map