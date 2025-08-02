/**
 * Channel-related types for Discord API structures
 */

import type { User } from "./user";
import type { GuildMember } from "./guild";

/**
 * Channel types
 */
export enum ChannelType {
  /** A text channel within a server */
  GUILD_TEXT = 0,
  /** A direct message between users */
  DM = 1,
  /** A voice channel within a server */
  GUILD_VOICE = 2,
  /** A direct message between multiple users */
  GROUP_DM = 3,
  /** An organizational category that contains up to 50 channels */
  GUILD_CATEGORY = 4,
  /** A channel that users can follow and crosspost into their own server */
  GUILD_ANNOUNCEMENT = 5,
  /** A temporary sub-channel within a GUILD_ANNOUNCEMENT channel */
  ANNOUNCEMENT_THREAD = 10,
  /** A temporary sub-channel within a GUILD_TEXT or GUILD_FORUM channel */
  PUBLIC_THREAD = 11,
  /** A temporary sub-channel within a GUILD_TEXT channel that is only viewable by those invited and those with the MANAGE_THREADS permission */
  PRIVATE_THREAD = 12,
  /** A voice channel for hosting events with an audience */
  GUILD_STAGE_VOICE = 13,
  /** The channel in a hub containing the listed servers */
  GUILD_DIRECTORY = 14,
  /** Channel that can only contain threads */
  GUILD_FORUM = 15,
  /** Channel that can only contain threads in a gallery view */
  GUILD_MEDIA = 16,
}

/**
 * Represents a Discord channel
 */
export interface Channel {
  /** The ID of this channel */
  id: string;
  /** The type of channel */
  type: ChannelType;
  /** The ID of the guild (may be missing for some channel objects received over gateway guild dispatches) */
  guild_id?: string;
  /** Sorting position of the channel */
  position?: number;
  /** Explicit permission overwrites for members and roles */
  permission_overwrites?: PermissionOverwrite[];
  /** The name of the channel (1-100 characters) */
  name?: string;
  /** The channel topic (0-4096 characters for GUILD_FORUM and GUILD_MEDIA channels, 0-1024 characters for all others) */
  topic?: string | null;
  /** Whether the channel is nsfw */
  nsfw?: boolean;
  /** The ID of the last message sent in this channel (or thread for GUILD_FORUM or GUILD_MEDIA channels) (may not point to an existing or valid message or thread) */
  last_message_id?: string | null;
  /** The bitrate (in bits) of the voice channel */
  bitrate?: number;
  /** The user limit of the voice channel */
  user_limit?: number;
  /** Amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission manage_messages or manage_channel, are unaffected */
  rate_limit_per_user?: number;
  /** The recipients of the DM */
  recipients?: User[];
  /** Icon hash of the group DM */
  icon?: string | null;
  /** ID of the creator of the group DM or thread */
  owner_id?: string;
  /** Application ID of the group DM creator if it is bot-created */
  application_id?: string;
  /** For guild channels: id of the parent category for a channel (each parent category can contain up to 50 channels), for threads: id of the text channel this thread was created */
  parent_id?: string | null;
  /** When the last pinned message was pinned. This may be null in events such as GUILD_CREATE when a message is not pinned. */
  last_pin_timestamp?: string | null;
  /** Voice region ID for the voice channel, automatic when set to null */
  rtc_region?: string | null;
  /** The camera video quality mode of the voice channel, 1 when not present */
  video_quality_mode?: number;
  /** Number of messages (not including the initial message or deleted messages) in a thread. */
  message_count?: number;
  /** An approximate count of users in a thread, stops counting at 50 */
  member_count?: number;
  /** Thread-specific fields not needed by other channels */
  thread_metadata?: ThreadMetadata;
  /** Thread member object for the current user, if they have joined the thread, only included on certain API endpoints */
  member?: ThreadMember;
  /** Default duration, copied onto newly created threads, in minutes, threads will stop showing in the channel list after the specified period of inactivity, can be set to: 60, 1440, 4320, 10080 */
  default_auto_archive_duration?: number;
  /** Computed permissions for the invoking user in the channel, including overwrites, only included when part of the resolved data received on a slash command interaction */
  permissions?: string;
  /** Channel flags combined as a bitfield */
  flags?: number;
  /** Number of messages ever sent in a thread, it's similar to message_count on message creation, but will not decrement the number when a message is deleted */
  total_message_sent?: number;
  /** The set of tags that can be used in a GUILD_FORUM or a GUILD_MEDIA channel */
  available_tags?: ForumTag[];
  /** The IDs of the set of tags applied to a thread in a GUILD_FORUM or a GUILD_MEDIA channel */
  applied_tags?: string[];
  /** The emoji to show in the add reaction button on a thread in a GUILD_FORUM or a GUILD_MEDIA channel */
  default_reaction_emoji?: DefaultReaction | null;
  /** The initial rate_limit_per_user to set on newly created threads in a channel. this field is copied to the thread at creation time and does not live update. */
  default_thread_rate_limit_per_user?: number;
  /** The default sort order type used to order posts in GUILD_FORUM and GUILD_MEDIA channels. Defaults to null, which indicates a preferred sort order hasn't been set by a channel admin */
  default_sort_order?: number | null;
  /** The default forum layout view used to display posts in GUILD_FORUM channels. Defaults to 0, which indicates a layout view has not been set by a channel admin */
  default_forum_layout?: number;
}

/**
 * Represents a permission overwrite
 */
export interface PermissionOverwrite {
  /** Role or user ID */
  id: string;
  /** Either 0 (role) or 1 (member) */
  type: number;
  /** Permission bit set */
  allow: string;
  /** Permission bit set */
  deny: string;
}

/**
 * Thread metadata object
 */
export interface ThreadMetadata {
  /** Whether the thread is archived */
  archived: boolean;
  /** The thread will stop showing in the channel list after auto_archive_duration minutes of inactivity, can be set to: 60, 1440, 4320, 10080 */
  auto_archive_duration: number;
  /** Timestamp when the thread's archive status was last changed, used for calculating recent activity */
  archive_timestamp: string;
  /** Whether the thread is locked; when a thread is locked, only users with MANAGE_THREADS can unarchive it */
  locked: boolean;
  /** Whether non-moderators can add other non-moderators to a thread; only available on private threads */
  invitable?: boolean;
  /** Timestamp when the thread was created; only populated for threads created after 2022-01-09 */
  create_timestamp?: string | null;
}

/**
 * Thread member object
 */
export interface ThreadMember {
  /** The ID of the thread */
  id?: string;
  /** The ID of the user */
  user_id?: string;
  /** The time the current user last joined the thread */
  join_timestamp: string;
  /** Any user-thread settings, currently only used for notifications */
  flags: number;
  /** Additional information about the user */
  member?: GuildMember;
}

/**
 * Forum tag object
 */
export interface ForumTag {
  /** The ID of the tag */
  id: string;
  /** The name of the tag (0-20 characters) */
  name: string;
  /** Whether this tag can only be added to or removed from threads by a member with the MANAGE_THREADS permission */
  moderated: boolean;
  /** The ID of a guild's custom emoji */
  emoji_id?: string | null;
  /** The unicode character of the emoji */
  emoji_name?: string | null;
}

/**
 * Default reaction object
 */
export interface DefaultReaction {
  /** The ID of a guild's custom emoji */
  emoji_id?: string | null;
  /** The unicode character of the emoji */
  emoji_name?: string | null;
}
