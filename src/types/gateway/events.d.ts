import { Message } from "./structures/Message";
import type { GuildMember } from "../structures/guild";
import type { User } from "../structures/user";

export interface ReadyEvent {
  v: number;
  user: {
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
    bot?: boolean;
  };
  guilds: { id: string; unavailable?: boolean }[];
  session_id: string;
  resume_gateway_url: string;
  application: {
    id: string;
    flags: number;
  };
}

export type MessageCreateEvent = Message;

export interface TypicordEvents {
  READY: import("@/events/READY").ReadyData;
  RESUMED: import("@/events/RESUMED").ResumedData;
  MESSAGE_CREATE: import("@/events/MESSAGE_CREATE").MessageCreateData;
  MESSAGE_UPDATE: import("@/events/MESSAGE_UPDATE").MessageUpdateData;
  MESSAGE_DELETE: import("@/events/MESSAGE_DELETE").MessageDeleteData;
  MESSAGE_DELETE_BULK: import("@/events/MESSAGE_DELETE_BULK").MessageDeleteBulkData;
  MESSAGE_POLL_VOTE_ADD: import("@/events/MESSAGE_POLL_VOTE_ADD").MessagePollVoteAddData;
  MESSAGE_POLL_VOTE_REMOVE: import("@/events/MESSAGE_POLL_VOTE_REMOVE").MessagePollVoteRemoveData;
  GUILD_CREATE: import("@/events/GUILD_CREATE").GuildCreateData;
  GUILD_UPDATE: import("@/events/GUILD_UPDATE").GuildUpdateData;
  GUILD_DELETE: import("@/events/GUILD_DELETE").GuildDeleteData;
  GUILD_MEMBER_ADD: import("@/events/GUILD_MEMBER_ADD").GuildMemberAddData;
  GUILD_MEMBER_UPDATE: import("@/events/GUILD_MEMBER_UPDATE").GuildMemberUpdateData;
  GUILD_MEMBER_REMOVE: import("@/events/GUILD_MEMBER_REMOVE").GuildMemberRemoveData;
  GUILD_MEMBERS_CHUNK: import("@/events/GUILD_MEMBERS_CHUNK").GuildMembersChunkData;
  GUILD_ROLE_CREATE: import("@/events/GUILD_ROLE_CREATE").GuildRoleCreateData;
  GUILD_ROLE_UPDATE: import("@/events/GUILD_ROLE_UPDATE").GuildRoleUpdateData;
  GUILD_ROLE_DELETE: import("@/events/GUILD_ROLE_DELETE").GuildRoleDeleteData;
  GUILD_BAN_ADD: import("@/events/GUILD_BAN_ADD").GuildBanAddData;
  GUILD_BAN_REMOVE: import("@/events/GUILD_BAN_REMOVE").GuildBanRemoveData;
  GUILD_EMOJIS_UPDATE: import("@/events/GUILD_EMOJIS_UPDATE").GuildEmojisUpdateData;
  GUILD_STICKERS_UPDATE: import("@/events/GUILD_STICKERS_UPDATE").GuildStickersUpdateData;
  GUILD_INTEGRATIONS_UPDATE: import("@/events/GUILD_INTEGRATIONS_UPDATE").GuildIntegrationsUpdateData;
  GUILD_SCHEDULED_EVENT_CREATE: import("@/events/GUILD_SCHEDULED_EVENT_CREATE").GuildScheduledEventCreateData;
  GUILD_SCHEDULED_EVENT_UPDATE: import("@/events/GUILD_SCHEDULED_EVENT_UPDATE").GuildScheduledEventUpdateData;
  GUILD_SCHEDULED_EVENT_DELETE: import("@/events/GUILD_SCHEDULED_EVENT_DELETE").GuildScheduledEventDeleteData;
  GUILD_SCHEDULED_EVENT_USER_ADD: import("@/events/GUILD_SCHEDULED_EVENT_USER_ADD").GuildScheduledEventUserAddData;
  GUILD_SCHEDULED_EVENT_USER_REMOVE: import("@/events/GUILD_SCHEDULED_EVENT_USER_REMOVE").GuildScheduledEventUserRemoveData;
  CHANNEL_CREATE: import("@/events/CHANNEL_CREATE").ChannelCreateData;
  CHANNEL_UPDATE: import("@/events/CHANNEL_UPDATE").ChannelUpdateData;
  CHANNEL_DELETE: import("@/events/CHANNEL_DELETE").ChannelDeleteData;
  CHANNEL_PINS_UPDATE: import("@/events/CHANNEL_PINS_UPDATE").ChannelPinsUpdateData;
  THREAD_CREATE: import("@/events/THREAD_CREATE").ThreadCreateData;
  THREAD_UPDATE: import("@/events/THREAD_UPDATE").ThreadUpdateData;
  THREAD_DELETE: import("@/events/THREAD_DELETE").ThreadDeleteData;
  THREAD_LIST_SYNC: import("@/events/THREAD_LIST_SYNC").ThreadListSyncData;
  THREAD_MEMBER_UPDATE: import("@/events/THREAD_MEMBER_UPDATE").ThreadMemberUpdateData;
  THREAD_MEMBERS_UPDATE: import("@/events/THREAD_MEMBERS_UPDATE").ThreadMembersUpdateData;
  STAGE_INSTANCE_CREATE: import("@/events/STAGE_INSTANCE_CREATE").StageInstanceCreateData;
  STAGE_INSTANCE_UPDATE: import("@/events/STAGE_INSTANCE_UPDATE").StageInstanceUpdateData;
  STAGE_INSTANCE_DELETE: import("@/events/STAGE_INSTANCE_DELETE").StageInstanceDeleteData;
  INTERACTION_CREATE: import("@/events/INTERACTION_CREATE").InteractionCreateData;
  INVITE_CREATE: import("@/events/INVITE_CREATE").InviteCreateData;
  INVITE_DELETE: import("@/events/INVITE_DELETE").InviteDeleteData;
  TYPING_START: import("@/events/TYPING_START").TypingStartData;
  MESSAGE_REACTION_ADD: import("@/events/MESSAGE_REACTION_ADD").MessageReactionAddData;
  MESSAGE_REACTION_REMOVE: import("@/events/MESSAGE_REACTION_REMOVE").MessageReactionRemoveData;
  MESSAGE_REACTION_REMOVE_ALL: import("@/events/MESSAGE_REACTION_REMOVE_ALL").MessageReactionRemoveAllData;
  MESSAGE_REACTION_REMOVE_EMOJI: import("@/events/MESSAGE_REACTION_REMOVE_EMOJI").MessageReactionRemoveEmojiData;
  PRESENCE_UPDATE: import("@/events/PRESENCE_UPDATE").PresenceUpdateData;
  VOICE_STATE_UPDATE: import("@/events/VOICE_STATE_UPDATE").VoiceStateUpdateData;
  VOICE_SERVER_UPDATE: import("@/events/VOICE_SERVER_UPDATE").VoiceServerUpdateData;
  WEBHOOKS_UPDATE: import("@/events/WEBHOOKS_UPDATE").WebhooksUpdateData;
  INTEGRATION_CREATE: import("@/events/INTEGRATION_CREATE").IntegrationCreateData;
  INTEGRATION_UPDATE: import("@/events/INTEGRATION_UPDATE").IntegrationUpdateData;
  INTEGRATION_DELETE: import("@/events/INTEGRATION_DELETE").IntegrationDeleteData;
  AUTO_MODERATION_RULE_CREATE: import("@/events/AUTO_MODERATION_RULE_CREATE").AutoModerationRuleCreateData;
  AUTO_MODERATION_RULE_UPDATE: import("@/events/AUTO_MODERATION_RULE_UPDATE").AutoModerationRuleUpdateData;
  AUTO_MODERATION_RULE_DELETE: import("@/events/AUTO_MODERATION_RULE_DELETE").AutoModerationRuleDeleteData;
  AUTO_MODERATION_ACTION_EXECUTION: import("@/events/AUTO_MODERATION_ACTION_EXECUTION").AutoModerationActionExecutionData;
  APPLICATION_COMMAND_PERMISSIONS_UPDATE: import("@/events/APPLICATION_COMMAND_PERMISSIONS_UPDATE").ApplicationCommandPermissionsUpdateData;
  ENTITLEMENT_CREATE: import("@/events/ENTITLEMENT_CREATE").EntitlementCreateData;
  ENTITLEMENT_UPDATE: import("@/events/ENTITLEMENT_UPDATE").EntitlementUpdateData;
  ENTITLEMENT_DELETE: import("@/events/ENTITLEMENT_DELETE").EntitlementDeleteData;
  USER_UPDATE: import("@/events/USER_UPDATE").UserUpdateData;
}

export interface MessageReactionEvent {
  user_id: string;
  channel_id: string;
  message_id: string;
  guild_id?: string;
  member?: GuildMember;
  emoji: {
    id: string | null;
    name: string | null;
    animated?: boolean;
  };
}

export interface PresenceUpdateEvent {
  user: User;
  guild_id: string;
  status: "idle" | "dnd" | "online" | "offline";
  activities: Activity[];
  client_status: {
    desktop?: string;
    mobile?: string;
    web?: string;
  };
}

export interface Activity {
  name: string;
  type: number;
  url?: string | null;
  created_at: number;
  timestamps?: {
    start?: number;
    end?: number;
  };
  application_id?: string;
  details?: string | null;
  state?: string | null;
  emoji?: {
    name: string;
    id?: string;
    animated?: boolean;
  } | null;
  party?: {
    id?: string;
    size?: [number, number];
  };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  secrets?: {
    join?: string;
    spectate?: string;
    match?: string;
  };
  instance?: boolean;
  flags?: number;
  buttons?: ActivityButton[];
}

export interface ActivityButton {
  label: string;
  url: string;
}

export interface VoiceStateUpdateEvent {
  guild_id?: string;
  channel_id: string | null;
  user_id: string;
  member?: GuildMember;
  session_id: string;
  deaf: boolean;
  mute: boolean;
  self_deaf: boolean;
  self_mute: boolean;
  self_stream?: boolean;
  self_video: boolean;
  suppress: boolean;
  request_to_speak_timestamp: string | null;
}
