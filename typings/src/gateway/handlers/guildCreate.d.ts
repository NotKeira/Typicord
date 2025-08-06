/**
 * Handler for GUILD_CREATE gateway event
 *
 * The GUILD_CREATE event is sent when the bot joins a guild or when a guild
 * becomes available after being previously unavailable.
 */
import { type DispatchHandler } from "../DispatchHandlerRegistry";
import type { Guild } from "@/types/structures/guild";
/**
 * Handles the GUILD_CREATE gateway event
 * @param client The Typicord client instance
 * @param data The GUILD_CREATE event payload
 */
export declare const handleGuildCreate: DispatchHandler<Guild>;
//# sourceMappingURL=guildCreate.d.ts.map