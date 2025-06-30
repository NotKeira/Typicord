import { Message } from "./structures/Message";

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
  application: {
    id: string;
    flags: number;
  };
}

export type MessageCreateEvent = Message;

export interface TypicordEvents {
  READY: ReadyEvent;
  RESUMED: void;
  MESSAGE_CREATE: import("@/structures/Message").Message;
  MESSAGE_UPDATE: Partial<Message>;
  MESSAGE_DELETE: {
    id: string;
    channel_id: string;
    guild_id?: string;
  };
  GUILD_CREATE: any;
  GUILD_UPDATE: any;
  GUILD_DELETE: { id: string; unavailable?: boolean };
  CHANNEL_CREATE: any;
  CHANNEL_UPDATE: any;
  CHANNEL_DELETE: any;
  INTERACTION_CREATE: any;
  TYPING_START: {
    channel_id: string;
    user_id: string;
    timestamp: number;
    guild_id?: string;
    member?: any;
  };
  MESSAGE_REACTION_ADD: any;
  MESSAGE_REACTION_REMOVE: any;
  MESSAGE_REACTION_REMOVE_ALL: {
    channel_id: string;
    message_id: string;
    guild_id?: string;
  };
  MESSAGE_REACTION_REMOVE_EMOJI: {
    channel_id: string;
    message_id: string;
    emoji: { id: string | null; name: string };
    guild_id?: string;
  };
  PRESENCE_UPDATE: any;
  VOICE_STATE_UPDATE: any;
  USER_UPDATE: any;
}
