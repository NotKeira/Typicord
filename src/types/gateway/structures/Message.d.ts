import type { Attachment } from "./Attachment";
import type { Embed } from "./Embed";
import type { Component } from "./Component";

export interface Message {
  id: string;
  channel_id: string;
  guild_id?: string;
  author: {
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
    bot?: boolean;
  };
  content: string;
  timestamp: string;
  edited_timestamp: string | null;
  tts?: boolean;
  mention_everyone?: boolean;
  mentions?: Array<{
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
    bot?: boolean;
  }>;
  attachments?: Attachment[];
  embeds?: Embed[];
  components?: Component[];
}
