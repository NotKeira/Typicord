/**
 * Events module - exports all event classes for user-end usage
 *
 * Usage:
 * import { Events } from 'typicord';
 *
 * client.on('READY', (event: Events.Ready) => {
 *   console.log(`Bot is ready as ${event.user.username}`);
 * });
 */

// Import all event classes
export { ReadyEventData as Ready } from "./READY";
export { ResumedEventData as Resumed } from "./RESUMED";
export { MessageCreateEventData as MessageCreate } from "./MESSAGE_CREATE";
export { MessageUpdateEventData as MessageUpdate } from "./MESSAGE_UPDATE";
export { MessageDeleteEventData as MessageDelete } from "./MESSAGE_DELETE";
export { GuildCreateEventData as GuildCreate } from "./GUILD_CREATE";
export { GuildUpdateEventData as GuildUpdate } from "./GUILD_UPDATE";
export { GuildDeleteEventData as GuildDelete } from "./GUILD_DELETE";
export { ChannelCreateEventData as ChannelCreate } from "./CHANNEL_CREATE";
export { ChannelUpdateEventData as ChannelUpdate } from "./CHANNEL_UPDATE";
export { ChannelDeleteEventData as ChannelDelete } from "./CHANNEL_DELETE";
export { InteractionCreateEventData as InteractionCreate } from "./INTERACTION_CREATE";
export { TypingStartEventData as TypingStart } from "./TYPING_START";
export { MessageReactionAddEventData as MessageReactionAdd } from "./MESSAGE_REACTION_ADD";
export { MessageReactionRemoveEventData as MessageReactionRemove } from "./MESSAGE_REACTION_REMOVE";
export { MessageReactionRemoveAllEventData as MessageReactionRemoveAll } from "./MESSAGE_REACTION_REMOVE_ALL";
export { MessageReactionRemoveEmojiEventData as MessageReactionRemoveEmoji } from "./MESSAGE_REACTION_REMOVE_EMOJI";
export { PresenceUpdateEventData as PresenceUpdate } from "./PRESENCE_UPDATE";
export { VoiceStateUpdateEventData as VoiceStateUpdate } from "./VOICE_STATE_UPDATE";
export { UserUpdateEventData as UserUpdate } from "./USER_UPDATE";

// Export all event data interfaces as well
export type { ReadyEvent } from "./READY";
export type { MessageDeleteData } from "./MESSAGE_DELETE";
export type { GuildDeleteData } from "./GUILD_DELETE";
export type { TypingStartData } from "./TYPING_START";
export type { MessageReactionRemoveAllData } from "./MESSAGE_REACTION_REMOVE_ALL";
export type { MessageReactionRemoveEmojiData } from "./MESSAGE_REACTION_REMOVE_EMOJI";
