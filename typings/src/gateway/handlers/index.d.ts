/**
 * Centralized handler registration for all gateway dispatch events.
 *
 * This file imports and registers all individual event handlers with the dispatch registry.
 * Adding a new handler is as simple as creating a new handler file and importing it here.
 */
import "./ready";
import "./resumed";
import "./messageCreate";
import "./guildCreate";
import "./interactionCreate";
export { dispatchHandlerRegistry, type DispatchHandler, } from "../DispatchHandlerRegistry";
export { handleReady } from "./ready";
export { handleResumed } from "./resumed";
export { handleMessageCreate } from "./messageCreate";
export { handleGuildCreate } from "./guildCreate";
export { handleInteractionCreate } from "./interactionCreate";
//# sourceMappingURL=index.d.ts.map