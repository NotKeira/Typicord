/**
 * REST API response types for various Discord endpoints
 */

import type { Guild, GuildMember } from "./guild";
import type { User } from "./user";
import type { Channel } from "./channel";
import type { Embed, MessageComponent } from "./message";

/**
 * Generic REST response wrapper
 */
export interface RESTResponse<T = unknown> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

/**
 * Error response from Discord API
 */
export interface RESTError {
  code: number;
  message: string;
  errors?: Record<string, any>;
}

/**
 * Rate limit response headers
 */
export interface RateLimitHeaders {
  "x-ratelimit-limit"?: string;
  "x-ratelimit-remaining"?: string;
  "x-ratelimit-reset"?: string;
  "x-ratelimit-reset-after"?: string;
  "x-ratelimit-bucket"?: string;
  "x-ratelimit-global"?: string;
  "x-ratelimit-scope"?: string;
  "retry-after"?: string;
}

/**
 * Application object from /applications/@me
 */
export interface Application {
  id: string;
  name: string;
  icon?: string | null;
  description: string;
  rpc_origins?: string[];
  bot_public: boolean;
  bot_require_code_grant: boolean;
  terms_of_service_url?: string;
  privacy_policy_url?: string;
  owner?: User;
  verify_key: string;
  team?: object | null;
  guild_id?: string;
  primary_sku_id?: string;
  slug?: string;
  cover_image?: string;
  flags?: number;
}

/**
 * Gateway bot response
 */
export interface GatewayBot {
  url: string;
  shards: number;
  session_start_limit: SessionStartLimit;
}

/**
 * Session start limit object
 */
export interface SessionStartLimit {
  total: number;
  remaining: number;
  reset_after: number;
  max_concurrency: number;
}

/**
 * Channel creation options
 */
export interface CreateChannelOptions {
  name: string;
  type?: number;
  topic?: string;
  bitrate?: number;
  user_limit?: number;
  rate_limit_per_user?: number;
  position?: number;
  permission_overwrites?: PermissionOverwrite[];
  parent_id?: string;
  nsfw?: boolean;
  rtc_region?: string;
  video_quality_mode?: number;
  default_auto_archive_duration?: number;
  default_reaction_emoji?: DefaultReactionEmoji;
  available_tags?: ForumTag[];
  default_sort_order?: number;
  default_forum_layout?: number;
  default_thread_rate_limit_per_user?: number;
}

/**
 * Permission overwrite object
 */
export interface PermissionOverwrite {
  id: string;
  type: number;
  allow: string;
  deny: string;
}

/**
 * Default reaction emoji object
 */
export interface DefaultReactionEmoji {
  emoji_id?: string | null;
  emoji_name?: string | null;
}

/**
 * Forum tag object
 */
export interface ForumTag {
  id: string;
  name: string;
  moderated: boolean;
  emoji_id?: string | null;
  emoji_name?: string | null;
}

/**
 * Message send options
 */
export interface MessageSendOptions {
  content?: string;
  nonce?: string | number;
  tts?: boolean;
  embeds?: Embed[];
  allowed_mentions?: AllowedMentions;
  message_reference?: MessageReference;
  components?: MessageComponent[];
  sticker_ids?: string[];
  files?: FileData[];
  payload_json?: string;
  attachments?: Attachment[];
  flags?: number;
}

/**
 * Allowed mentions object
 */
export interface AllowedMentions {
  parse?: ("roles" | "users" | "everyone")[];
  roles?: string[];
  users?: string[];
  replied_user?: boolean;
}

/**
 * Message reference object
 */
export interface MessageReference {
  message_id?: string;
  channel_id?: string;
  guild_id?: string;
  fail_if_not_exists?: boolean;
}

/**
 * File data for uploads
 */
export interface FileData {
  name: string;
  data: Buffer | Uint8Array;
  contentType?: string;
}

/**
 * Attachment object for messages
 */
export interface Attachment {
  id: string;
  filename: string;
  description?: string;
  content_type?: string;
  size: number;
  url: string;
  proxy_url: string;
  height?: number | null;
  width?: number | null;
  ephemeral?: boolean;
  duration_secs?: number;
  waveform?: string;
  flags?: number;
}

/**
 * Guild modification options
 */
export interface ModifyGuildOptions {
  name?: string;
  verification_level?: number;
  default_message_notifications?: number;
  explicit_content_filter?: number;
  afk_channel_id?: string | null;
  afk_timeout?: number;
  icon?: string | null;
  owner_id?: string;
  splash?: string | null;
  discovery_splash?: string | null;
  banner?: string | null;
  system_channel_id?: string | null;
  system_channel_flags?: number;
  rules_channel_id?: string | null;
  public_updates_channel_id?: string | null;
  preferred_locale?: string;
  features?: string[];
  description?: string | null;
  premium_progress_bar_enabled?: boolean;
  safety_alerts_channel_id?: string | null;
}

/**
 * Role modification options
 */
export interface ModifyRoleOptions {
  name?: string;
  permissions?: string;
  color?: number;
  hoist?: boolean;
  icon?: string | null;
  unicode_emoji?: string | null;
  mentionable?: boolean;
}

/**
 * Member modification options
 */
export interface ModifyMemberOptions {
  nick?: string | null;
  roles?: string[];
  mute?: boolean;
  deaf?: boolean;
  channel_id?: string | null;
  communication_disabled_until?: string | null;
}

/**
 * Ban options
 */
export interface BanOptions {
  delete_message_days?: number;
  delete_message_seconds?: number;
}

/**
 * Thread creation options
 */
export interface CreateThreadOptions {
  name: string;
  auto_archive_duration?: number;
  type?: number;
  invitable?: boolean;
  rate_limit_per_user?: number;
}

/**
 * Webhook object
 */
export interface Webhook {
  id: string;
  type: number;
  guild_id?: string;
  channel_id?: string;
  user?: User;
  name?: string | null;
  avatar?: string | null;
  token?: string;
  application_id?: string | null;
  source_guild?: Guild;
  source_channel?: Channel;
  url?: string;
}

/**
 * Invite object
 */
export interface Invite {
  code: string;
  guild?: Guild;
  channel?: Channel;
  inviter?: User;
  target_type?: number;
  target_user?: User;
  target_application?: Application;
  approximate_presence_count?: number;
  approximate_member_count?: number;
  expires_at?: string | null;
  stage_instance?: InviteStageInstance;
  guild_scheduled_event?: GuildScheduledEvent;
}

/**
 * Invite stage instance object
 */
export interface InviteStageInstance {
  members: GuildMember[];
  participant_count: number;
  speaker_count: number;
  topic: string;
}

/**
 * Guild scheduled event object
 */
export interface GuildScheduledEvent {
  id: string;
  guild_id: string;
  channel_id?: string | null;
  creator_id?: string | null;
  name: string;
  description?: string | null;
  scheduled_start_time: string;
  scheduled_end_time?: string | null;
  privacy_level: number;
  status: number;
  entity_type: number;
  entity_id?: string | null;
  entity_metadata?: GuildScheduledEventEntityMetadata | null;
  creator?: User;
  user_count?: number;
  image?: string | null;
}

/**
 * Guild scheduled event entity metadata
 */
export interface GuildScheduledEventEntityMetadata {
  location?: string;
}

/**
 * Audit log object
 */
export interface AuditLog {
  application_commands: ApplicationCommand[];
  audit_log_entries: AuditLogEntry[];
  auto_moderation_rules: AutoModerationRule[];
  guild_scheduled_events: GuildScheduledEvent[];
  integrations: Integration[];
  threads: Channel[];
  users: User[];
  webhooks: Webhook[];
}

/**
 * Application command object
 */
export interface ApplicationCommand {
  id: string;
  type?: number;
  application_id: string;
  guild_id?: string;
  name: string;
  name_localizations?: Record<string, string> | null;
  description: string;
  description_localizations?: Record<string, string> | null;
  options?: ApplicationCommandOption[];
  default_member_permissions?: string | null;
  dm_permission?: boolean;
  default_permission?: boolean | null;
  nsfw?: boolean;
  version: string;
}

/**
 * Application command option object
 */
export interface ApplicationCommandOption {
  type: number;
  name: string;
  name_localizations?: Record<string, string> | null;
  description: string;
  description_localizations?: Record<string, string> | null;
  required?: boolean;
  choices?: ApplicationCommandOptionChoice[];
  options?: ApplicationCommandOption[];
  channel_types?: number[];
  min_value?: number;
  max_value?: number;
  min_length?: number;
  max_length?: number;
  autocomplete?: boolean;
}

/**
 * Application command option choice object
 */
export interface ApplicationCommandOptionChoice {
  name: string;
  name_localizations?: Record<string, string> | null;
  value: string | number;
}

/**
 * Audit log entry object
 */
export interface AuditLogEntry {
  target_id?: string | null;
  changes?: AuditLogChange[];
  user_id?: string | null;
  id: string;
  action_type: number;
  options?: OptionalAuditEntryInfo;
  reason?: string;
}

/**
 * Audit log change object
 */
export interface AuditLogChange {
  new_value?: unknown;
  old_value?: unknown;
  key: string;
}

/**
 * Optional audit entry info object
 */
export interface OptionalAuditEntryInfo {
  application_id?: string;
  auto_moderation_rule_name?: string;
  auto_moderation_rule_trigger_type?: string;
  channel_id?: string;
  count?: string;
  delete_member_days?: string;
  id?: string;
  members_removed?: string;
  message_id?: string;
  role_name?: string;
  type?: string;
  integration_type?: string;
}

/**
 * Auto moderation rule object
 */
export interface AutoModerationRule {
  id: string;
  guild_id: string;
  name: string;
  creator_id: string;
  event_type: number;
  trigger_type: number;
  trigger_metadata: AutoModerationTriggerMetadata;
  actions: AutoModerationAction[];
  enabled: boolean;
  exempt_roles: string[];
  exempt_channels: string[];
}

/**
 * Auto moderation trigger metadata object
 */
export interface AutoModerationTriggerMetadata {
  keyword_filter?: string[];
  regex_patterns?: string[];
  presets?: number[];
  allow_list?: string[];
  mention_total_limit?: number;
  mention_raid_protection_enabled?: boolean;
}

/**
 * Auto moderation action object
 */
export interface AutoModerationAction {
  type: number;
  metadata?: AutoModerationActionMetadata;
}

/**
 * Auto moderation action metadata object
 */
export interface AutoModerationActionMetadata {
  channel_id?: string;
  duration_seconds?: number;
  custom_message?: string;
}

/**
 * Integration object
 */
export interface Integration {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  syncing?: boolean;
  role_id?: string;
  enable_emoticons?: boolean;
  expire_behavior?: number;
  expire_grace_period?: number;
  user?: User;
  account: IntegrationAccount;
  synced_at?: string;
  subscriber_count?: number;
  revoked?: boolean;
  application?: IntegrationApplication;
  scopes?: string[];
}

/**
 * Integration account object
 */
export interface IntegrationAccount {
  id: string;
  name: string;
}

/**
 * Integration application object
 */
export interface IntegrationApplication {
  id: string;
  name: string;
  icon?: string | null;
  description: string;
  bot?: User;
}
