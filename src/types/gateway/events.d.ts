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
  GUILD_CREATE: import("@/events/GUILD_CREATE").GuildCreateEventData;
  GUILD_UPDATE: import("@/events/GUILD_UPDATE").GuildUpdateEventData;
  GUILD_DELETE: import("@/events/GUILD_DELETE").GuildDeleteEventData;
  CHANNEL_CREATE: import("@/events/CHANNEL_CREATE").ChannelCreateEventData;
  CHANNEL_UPDATE: import("@/events/CHANNEL_UPDATE").ChannelUpdateEventData;
  CHANNEL_DELETE: import("@/events/CHANNEL_DELETE").ChannelDeleteEventData;
  INTERACTION_CREATE: import("@/events/INTERACTION_CREATE").InteractionCreateEventData;
  TYPING_START: import("@/events/TYPING_START").TypingStartEventData;
  MESSAGE_REACTION_ADD: import("@/events/MESSAGE_REACTION_ADD").MessageReactionAddEventData;
  MESSAGE_REACTION_REMOVE: import("@/events/MESSAGE_REACTION_REMOVE").MessageReactionRemoveEventData;
  MESSAGE_REACTION_REMOVE_ALL: import("@/events/MESSAGE_REACTION_REMOVE_ALL").MessageReactionRemoveAllEventData;
  MESSAGE_REACTION_REMOVE_EMOJI: import("@/events/MESSAGE_REACTION_REMOVE_EMOJI").MessageReactionRemoveEmojiEventData;
  PRESENCE_UPDATE: import("@/events/PRESENCE_UPDATE").PresenceUpdateEventData;
  VOICE_STATE_UPDATE: import("@/events/VOICE_STATE_UPDATE").VoiceStateUpdateEventData;
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
