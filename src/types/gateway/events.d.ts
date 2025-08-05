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
  READY: import("@/events/READY").ReadyEventData;
  RESUMED: import("@/events/RESUMED").ResumedEventData;
  MESSAGE_CREATE: import("@/events/MESSAGE_CREATE").MessageCreateEventData;
  MESSAGE_UPDATE: import("@/events/MESSAGE_UPDATE").MessageUpdateEventData;
  MESSAGE_DELETE: import("@/events/MESSAGE_DELETE").MessageDeleteEventData;
  MESSAGE_DELETE_BULK: import("@/events/MESSAGE_DELETE_BULK").MessageDeleteBulkEventData;
  MESSAGE_POLL_VOTE_ADD: import("@/events/MESSAGE_POLL_VOTE_ADD").MessagePollVoteAddEventData;
  MESSAGE_POLL_VOTE_REMOVE: import("@/events/MESSAGE_POLL_VOTE_REMOVE").MessagePollVoteRemoveEventData;
  GUILD_CREATE: import("@/events/GUILD_CREATE").GuildCreateEventData;
  GUILD_UPDATE: import("@/events/GUILD_UPDATE").GuildUpdateEventData;
  GUILD_DELETE: import("@/events/GUILD_DELETE").GuildDeleteEventData;
  GUILD_MEMBER_ADD: import("@/events/GUILD_MEMBER_ADD").GuildMemberAddEventData;
  GUILD_MEMBER_UPDATE: import("@/events/GUILD_MEMBER_UPDATE").GuildMemberUpdateEventData;
  GUILD_MEMBER_REMOVE: import("@/events/GUILD_MEMBER_REMOVE").GuildMemberRemoveEventData;
  GUILD_MEMBERS_CHUNK: import("@/events/GUILD_MEMBERS_CHUNK").GuildMembersChunkEventData;
  GUILD_ROLE_CREATE: import("@/events/GUILD_ROLE_CREATE").GuildRoleCreateEventData;
  GUILD_ROLE_UPDATE: import("@/events/GUILD_ROLE_UPDATE").GuildRoleUpdateEventData;
  GUILD_ROLE_DELETE: import("@/events/GUILD_ROLE_DELETE").GuildRoleDeleteEventData;
  GUILD_BAN_ADD: import("@/events/GUILD_BAN_ADD").GuildBanAddEventData;
  GUILD_BAN_REMOVE: import("@/events/GUILD_BAN_REMOVE").GuildBanRemoveEventData;
  GUILD_EMOJIS_UPDATE: import("@/events/GUILD_EMOJIS_UPDATE").GuildEmojisUpdateEventData;
  GUILD_STICKERS_UPDATE: import("@/events/GUILD_STICKERS_UPDATE").GuildStickersUpdateEventData;
  GUILD_INTEGRATIONS_UPDATE: import("@/events/GUILD_INTEGRATIONS_UPDATE").GuildIntegrationsUpdateEventData;
  GUILD_SCHEDULED_EVENT_CREATE: import("@/events/GUILD_SCHEDULED_EVENT_CREATE").GuildScheduledEventCreateEventData;
  GUILD_SCHEDULED_EVENT_UPDATE: import("@/events/GUILD_SCHEDULED_EVENT_UPDATE").GuildScheduledEventUpdateEventData;
  GUILD_SCHEDULED_EVENT_DELETE: import("@/events/GUILD_SCHEDULED_EVENT_DELETE").GuildScheduledEventDeleteEventData;
  GUILD_SCHEDULED_EVENT_USER_ADD: import("@/events/GUILD_SCHEDULED_EVENT_USER_ADD").GuildScheduledEventUserAddEventData;
  GUILD_SCHEDULED_EVENT_USER_REMOVE: import("@/events/GUILD_SCHEDULED_EVENT_USER_REMOVE").GuildScheduledEventUserRemoveEventData;
  CHANNEL_CREATE: import("@/events/CHANNEL_CREATE").ChannelCreateEventData;
  CHANNEL_UPDATE: import("@/events/CHANNEL_UPDATE").ChannelUpdateEventData;
  CHANNEL_DELETE: import("@/events/CHANNEL_DELETE").ChannelDeleteEventData;
  CHANNEL_PINS_UPDATE: import("@/events/CHANNEL_PINS_UPDATE").ChannelPinsUpdateEventData;
  THREAD_CREATE: import("@/events/THREAD_CREATE").ThreadCreateEventData;
  THREAD_UPDATE: import("@/events/THREAD_UPDATE").ThreadUpdateEventData;
  THREAD_DELETE: import("@/events/THREAD_DELETE").ThreadDeleteEventData;
  THREAD_LIST_SYNC: import("@/events/THREAD_LIST_SYNC").ThreadListSyncEventData;
  THREAD_MEMBER_UPDATE: import("@/events/THREAD_MEMBER_UPDATE").ThreadMemberUpdateEventData;
  THREAD_MEMBERS_UPDATE: import("@/events/THREAD_MEMBERS_UPDATE").ThreadMembersUpdateEventData;
  STAGE_INSTANCE_CREATE: import("@/events/STAGE_INSTANCE_CREATE").StageInstanceCreateEventData;
  STAGE_INSTANCE_UPDATE: import("@/events/STAGE_INSTANCE_UPDATE").StageInstanceUpdateEventData;
  STAGE_INSTANCE_DELETE: import("@/events/STAGE_INSTANCE_DELETE").StageInstanceDeleteEventData;
  INTERACTION_CREATE: import("@/events/INTERACTION_CREATE").InteractionCreateEventData;
  INVITE_CREATE: import("@/events/INVITE_CREATE").InviteCreateEventData;
  INVITE_DELETE: import("@/events/INVITE_DELETE").InviteDeleteEventData;
  TYPING_START: import("@/events/TYPING_START").TypingStartEventData;
  MESSAGE_REACTION_ADD: import("@/events/MESSAGE_REACTION_ADD").MessageReactionAddEventData;
  MESSAGE_REACTION_REMOVE: import("@/events/MESSAGE_REACTION_REMOVE").MessageReactionRemoveEventData;
  MESSAGE_REACTION_REMOVE_ALL: import("@/events/MESSAGE_REACTION_REMOVE_ALL").MessageReactionRemoveAllEventData;
  MESSAGE_REACTION_REMOVE_EMOJI: import("@/events/MESSAGE_REACTION_REMOVE_EMOJI").MessageReactionRemoveEmojiEventData;
  PRESENCE_UPDATE: import("@/events/PRESENCE_UPDATE").PresenceUpdateEventData;
  VOICE_STATE_UPDATE: import("@/events/VOICE_STATE_UPDATE").VoiceStateUpdateEventData;
  VOICE_SERVER_UPDATE: import("@/events/VOICE_SERVER_UPDATE").VoiceServerUpdateEventData;
  WEBHOOKS_UPDATE: import("@/events/WEBHOOKS_UPDATE").WebhooksUpdateEventData;
  INTEGRATION_CREATE: import("@/events/INTEGRATION_CREATE").IntegrationCreateEventData;
  INTEGRATION_UPDATE: import("@/events/INTEGRATION_UPDATE").IntegrationUpdateEventData;
  INTEGRATION_DELETE: import("@/events/INTEGRATION_DELETE").IntegrationDeleteEventData;
  AUTO_MODERATION_RULE_CREATE: import("@/events/AUTO_MODERATION_RULE_CREATE").AutoModerationRuleCreateEventData;
  AUTO_MODERATION_RULE_UPDATE: import("@/events/AUTO_MODERATION_RULE_UPDATE").AutoModerationRuleUpdateEventData;
  AUTO_MODERATION_RULE_DELETE: import("@/events/AUTO_MODERATION_RULE_DELETE").AutoModerationRuleDeleteEventData;
  AUTO_MODERATION_ACTION_EXECUTION: import("@/events/AUTO_MODERATION_ACTION_EXECUTION").AutoModerationActionExecutionEventData;
  APPLICATION_COMMAND_PERMISSIONS_UPDATE: import("@/events/APPLICATION_COMMAND_PERMISSIONS_UPDATE").ApplicationCommandPermissionsUpdateEventData;
  ENTITLEMENT_CREATE: import("@/events/ENTITLEMENT_CREATE").EntitlementCreateEventData;
  ENTITLEMENT_UPDATE: import("@/events/ENTITLEMENT_UPDATE").EntitlementUpdateEventData;
  ENTITLEMENT_DELETE: import("@/events/ENTITLEMENT_DELETE").EntitlementDeleteEventData;
  USER_UPDATE: import("@/events/USER_UPDATE").UserUpdateEventData;
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
