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
export { ReadyData as Ready } from "./READY";
export { ResumedData as Resumed } from "./RESUMED";
export { ApplicationCommandPermissionsUpdateEventData as ApplicationCommandPermissionsUpdate } from "./APPLICATION_COMMAND_PERMISSIONS_UPDATE";
export { MessageCreateData as MessageCreate } from "./MESSAGE_CREATE";
export { MessageUpdateEventData as MessageUpdate } from "./MESSAGE_UPDATE";
export { MessageDeleteEventData as MessageDelete } from "./MESSAGE_DELETE";
export { MessageDeleteBulkEventData as MessageDeleteBulk } from "./MESSAGE_DELETE_BULK";
export { GuildCreateData as GuildCreate } from "./GUILD_CREATE";
export { GuildUpdateEventData as GuildUpdate } from "./GUILD_UPDATE";
export { GuildDeleteEventData as GuildDelete } from "./GUILD_DELETE";
export { GuildMemberAddData as GuildMemberAdd } from "./GUILD_MEMBER_ADD";
export { GuildMemberUpdateEventData as GuildMemberUpdate } from "./GUILD_MEMBER_UPDATE";
export { GuildMemberRemoveData as GuildMemberRemove } from "./GUILD_MEMBER_REMOVE";
export { GuildMembersChunkEventData as GuildMembersChunk } from "./GUILD_MEMBERS_CHUNK";
export { GuildRoleCreateEventData as GuildRoleCreate } from "./GUILD_ROLE_CREATE";
export { GuildRoleUpdateEventData as GuildRoleUpdate } from "./GUILD_ROLE_UPDATE";
export { GuildRoleDeleteEventData as GuildRoleDelete } from "./GUILD_ROLE_DELETE";
export { GuildRoleRemoveEventData as GuildRoleRemove } from "./GUILD_ROLE_REMOVE";
export { GuildBanAddEventData as GuildBanAdd } from "./GUILD_BAN_ADD";
export { GuildBanRemoveEventData as GuildBanRemove } from "./GUILD_BAN_REMOVE";
export { GuildEmojisUpdateEventData as GuildEmojisUpdate } from "./GUILD_EMOJIS_UPDATE";
export { GuildStickersUpdateEventData as GuildStickersUpdate } from "./GUILD_STICKERS_UPDATE";
export { GuildIntegrationsUpdateEventData as GuildIntegrationsUpdate } from "./GUILD_INTEGRATIONS_UPDATE";
export { ChannelCreateEventData as ChannelCreate } from "./CHANNEL_CREATE";
export { ChannelUpdateEventData as ChannelUpdate } from "./CHANNEL_UPDATE";
export { ChannelDeleteEventData as ChannelDelete } from "./CHANNEL_DELETE";
export { ChannelPinsUpdateEventData as ChannelPinsUpdate } from "./CHANNEL_PINS_UPDATE";
export { ThreadCreateEventData as ThreadCreate } from "./THREAD_CREATE";
export { ThreadUpdateEventData as ThreadUpdate } from "./THREAD_UPDATE";
export { ThreadDeleteEventData as ThreadDelete } from "./THREAD_DELETE";
export { ThreadListSyncEventData as ThreadListSync } from "./THREAD_LIST_SYNC";
export { ThreadMemberUpdateEventData as ThreadMemberUpdate } from "./THREAD_MEMBER_UPDATE";
export { ThreadMembersUpdateEventData as ThreadMembersUpdate } from "./THREAD_MEMBERS_UPDATE";
export { InteractionCreateData as InteractionCreate } from "./INTERACTION_CREATE";
export { InviteCreateEventData as InviteCreate } from "./INVITE_CREATE";
export { InviteDeleteEventData as InviteDelete } from "./INVITE_DELETE";
export { TypingStartEventData as TypingStart } from "./TYPING_START";
export { MessageReactionAddEventData as MessageReactionAdd } from "./MESSAGE_REACTION_ADD";
export { MessageReactionRemoveEventData as MessageReactionRemove } from "./MESSAGE_REACTION_REMOVE";
export { MessageReactionRemoveAllEventData as MessageReactionRemoveAll } from "./MESSAGE_REACTION_REMOVE_ALL";
export { MessageReactionRemoveEmojiEventData as MessageReactionRemoveEmoji } from "./MESSAGE_REACTION_REMOVE_EMOJI";
export { PresenceUpdateEventData as PresenceUpdate } from "./PRESENCE_UPDATE";
export { VoiceStateUpdateEventData as VoiceStateUpdate } from "./VOICE_STATE_UPDATE";
export { VoiceServerUpdateEventData as VoiceServerUpdate } from "./VOICE_SERVER_UPDATE";
export { WebhooksUpdateEventData as WebhooksUpdate } from "./WEBHOOKS_UPDATE";
export { UserUpdateEventData as UserUpdate } from "./USER_UPDATE";

// Auto Moderation Events
export { AutoModerationRuleCreateEventData as AutoModerationRuleCreate } from "./AUTO_MODERATION_RULE_CREATE";
export { AutoModerationRuleUpdateEventData as AutoModerationRuleUpdate } from "./AUTO_MODERATION_RULE_UPDATE";
export { AutoModerationRuleDeleteEventData as AutoModerationRuleDelete } from "./AUTO_MODERATION_RULE_DELETE";
export { AutoModerationActionExecutionEventData as AutoModerationActionExecution } from "./AUTO_MODERATION_ACTION_EXECUTION";

// Stage Instance Events
export { StageInstanceCreateEventData as StageInstanceCreate } from "./STAGE_INSTANCE_CREATE";
export { StageInstanceUpdateEventData as StageInstanceUpdate } from "./STAGE_INSTANCE_UPDATE";
export { StageInstanceDeleteEventData as StageInstanceDelete } from "./STAGE_INSTANCE_DELETE";

// Guild Scheduled Events
export { GuildScheduledEventCreateEventData as GuildScheduledEventCreate } from "./GUILD_SCHEDULED_EVENT_CREATE";
export { GuildScheduledEventUpdateEventData as GuildScheduledEventUpdate } from "./GUILD_SCHEDULED_EVENT_UPDATE";
export { GuildScheduledEventDeleteEventData as GuildScheduledEventDelete } from "./GUILD_SCHEDULED_EVENT_DELETE";
export { GuildScheduledEventUserAddEventData as GuildScheduledEventUserAdd } from "./GUILD_SCHEDULED_EVENT_USER_ADD";
export { GuildScheduledEventUserRemoveEventData as GuildScheduledEventUserRemove } from "./GUILD_SCHEDULED_EVENT_USER_REMOVE";

// Poll Events
export { MessagePollVoteAddEventData as MessagePollVoteAdd } from "./MESSAGE_POLL_VOTE_ADD";
export { MessagePollVoteRemoveEventData as MessagePollVoteRemove } from "./MESSAGE_POLL_VOTE_REMOVE";

// Entitlement Events (Monetization)
export { EntitlementCreateEventData as EntitlementCreate } from "./ENTITLEMENT_CREATE";
export { EntitlementUpdateEventData as EntitlementUpdate } from "./ENTITLEMENT_UPDATE";
export { EntitlementDeleteEventData as EntitlementDelete } from "./ENTITLEMENT_DELETE";

// Integration Events
export { IntegrationCreateEventData as IntegrationCreate } from "./INTEGRATION_CREATE";
export { IntegrationUpdateEventData as IntegrationUpdate } from "./INTEGRATION_UPDATE";
export { IntegrationDeleteEventData as IntegrationDelete } from "./INTEGRATION_DELETE";

// Export all event data interfaces as well
export type { ReadyEvent } from "./READY";
export type { MessageDeleteData } from "./MESSAGE_DELETE";
export type { MessageDeleteBulkData } from "./MESSAGE_DELETE_BULK";
export type { GuildDeleteData } from "./GUILD_DELETE";
export type { GuildMemberAddData } from "./GUILD_MEMBER_ADD";
export type { GuildMemberUpdateData } from "./GUILD_MEMBER_UPDATE";
export type { GuildMemberRemoveData } from "./GUILD_MEMBER_REMOVE";
export type { GuildMembersChunkData } from "./GUILD_MEMBERS_CHUNK";
export type { GuildRoleCreateData } from "./GUILD_ROLE_CREATE";
export type { GuildRoleUpdateData } from "./GUILD_ROLE_UPDATE";
export type { GuildRoleDeleteData } from "./GUILD_ROLE_DELETE";
export type { GuildRoleRemoveData } from "./GUILD_ROLE_REMOVE";
export type { GuildBanAddData } from "./GUILD_BAN_ADD";
export type { GuildBanRemoveData } from "./GUILD_BAN_REMOVE";
export type { GuildEmojisUpdateData } from "./GUILD_EMOJIS_UPDATE";
export type { GuildStickersUpdateData } from "./GUILD_STICKERS_UPDATE";
export type { ChannelPinsUpdateData } from "./CHANNEL_PINS_UPDATE";
export type { ThreadCreateData } from "./THREAD_CREATE";
export type { ThreadUpdateData } from "./THREAD_UPDATE";
export type { ThreadDeleteData } from "./THREAD_DELETE";
export type { ThreadListSyncData } from "./THREAD_LIST_SYNC";
export type { ThreadMemberUpdateData } from "./THREAD_MEMBER_UPDATE";
export type { ThreadMembersUpdateData } from "./THREAD_MEMBERS_UPDATE";
export type { InviteCreateData } from "./INVITE_CREATE";
export type { InviteDeleteData } from "./INVITE_DELETE";
export type { VoiceServerUpdateData } from "./VOICE_SERVER_UPDATE";
export type { WebhooksUpdateData } from "./WEBHOOKS_UPDATE";

// Auto Moderation Types
export type { AutoModerationRuleCreateData } from "./AUTO_MODERATION_RULE_CREATE";
export type { AutoModerationRuleUpdateData } from "./AUTO_MODERATION_RULE_UPDATE";
export type { AutoModerationRuleDeleteData } from "./AUTO_MODERATION_RULE_DELETE";
export type { AutoModerationActionExecutionData } from "./AUTO_MODERATION_ACTION_EXECUTION";

// Stage Instance Types
export type { StageInstanceCreateData } from "./STAGE_INSTANCE_CREATE";
export type { StageInstanceUpdateData } from "./STAGE_INSTANCE_UPDATE";
export type { StageInstanceDeleteData } from "./STAGE_INSTANCE_DELETE";

// Guild Scheduled Event Types
export type { GuildScheduledEventCreateData } from "./GUILD_SCHEDULED_EVENT_CREATE";
export type { GuildScheduledEventUpdateData } from "./GUILD_SCHEDULED_EVENT_UPDATE";
export type { GuildScheduledEventDeleteData } from "./GUILD_SCHEDULED_EVENT_DELETE";
export type { GuildScheduledEventUserAddData } from "./GUILD_SCHEDULED_EVENT_USER_ADD";
export type { GuildScheduledEventUserRemoveData } from "./GUILD_SCHEDULED_EVENT_USER_REMOVE";

// Poll Types
export type { MessagePollVoteAddData } from "./MESSAGE_POLL_VOTE_ADD";
export type { MessagePollVoteRemoveData } from "./MESSAGE_POLL_VOTE_REMOVE";

// Entitlement Types
export type { EntitlementCreateData } from "./ENTITLEMENT_CREATE";
export type { EntitlementUpdateData } from "./ENTITLEMENT_UPDATE";
export type { EntitlementDeleteData } from "./ENTITLEMENT_DELETE";

// Integration Types
export type { IntegrationCreateData } from "./INTEGRATION_CREATE";
export type { IntegrationUpdateData } from "./INTEGRATION_UPDATE";
export type { IntegrationDeleteData } from "./INTEGRATION_DELETE";
export type { TypingStartData } from "./TYPING_START";
export type { MessageReactionRemoveAllData } from "./MESSAGE_REACTION_REMOVE_ALL";
export type { MessageReactionRemoveEmojiData } from "./MESSAGE_REACTION_REMOVE_EMOJI";
