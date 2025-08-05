# Gateway Events

Typicord v2.0.0 provides comprehensive support for all Discord gateway events with full TypeScript interfaces and convenient wrapper classes.

## Overview

All Discord gateway events are now supported with:
- **Type-safe interfaces** for all event data
- **Wrapper classes** with convenient getters and utility methods
- **Complete coverage** of Discord's latest API features
- **Consistent naming** using Discord's official event names

## Event Categories

### Guild Management Events

#### Member Events
```typescript
// Guild member joins
client.on('GUILD_MEMBER_ADD', (member) => {
  console.log(`${member.user.username} joined ${member.guildId}`);
  console.log(`Member count: ${member.memberCount}`);
});

// Guild member updates (nickname, roles, etc.)
client.on('GUILD_MEMBER_UPDATE', (member) => {
  console.log(`${member.user.username} was updated`);
  console.log(`Roles: ${member.roles.join(', ')}`);
});

// Guild member leaves
client.on('GUILD_MEMBER_REMOVE', (member) => {
  console.log(`${member.user.username} left the server`);
});

// Bulk member data (for large servers)
client.on('GUILD_MEMBERS_CHUNK', (chunk) => {
  console.log(`Received ${chunk.members.length} members for ${chunk.guildId}`);
});
```

#### Role Events
```typescript
// Role created
client.on('GUILD_ROLE_CREATE', (role) => {
  console.log(`New role created: ${role.name}`);
  console.log(`Color: ${role.colorHex}, Position: ${role.position}`);
});

// Role updated
client.on('GUILD_ROLE_UPDATE', (role) => {
  console.log(`Role updated: ${role.name}`);
  console.log(`Permissions: ${role.permissions}`);
});

// Role deleted
client.on('GUILD_ROLE_DELETE', (role) => {
  console.log(`Role deleted: ${role.roleId} in ${role.guildId}`);
});
```

#### Ban Events
```typescript
// User banned
client.on('GUILD_BAN_ADD', (ban) => {
  console.log(`${ban.user.username} was banned from ${ban.guildId}`);
});

// User unbanned
client.on('GUILD_BAN_REMOVE', (ban) => {
  console.log(`${ban.user.username} was unbanned from ${ban.guildId}`);
});
```

#### Guild Content Updates
```typescript
// Emojis updated
client.on('GUILD_EMOJIS_UPDATE', (emojis) => {
  console.log(`${emojis.guildId} now has ${emojis.emojiCount} emojis`);
  console.log(`Animated emojis: ${emojis.animatedEmojiCount}`);
});

// Stickers updated
client.on('GUILD_STICKERS_UPDATE', (stickers) => {
  console.log(`${stickers.guildId} now has ${stickers.stickerCount} stickers`);
  console.log(`Available stickers: ${stickers.availableStickers.length}`);
});

// Integrations updated
client.on('GUILD_INTEGRATIONS_UPDATE', (integration) => {
  console.log(`Integrations updated in ${integration.guildId}`);
});
```

### Thread Events

```typescript
// Thread created or user added to existing thread
client.on('THREAD_CREATE', (thread) => {
  console.log(`Thread created: ${thread.name}`);
  console.log(`Parent channel: ${thread.parentId}`);
  console.log(`Newly created: ${thread.isNewlyCreated}`);
  console.log(`Message count: ${thread.messageCount}`);
});

// Thread updated
client.on('THREAD_UPDATE', (thread) => {
  console.log(`Thread updated: ${thread.name}`);
  console.log(`Archived: ${thread.isArchived}, Locked: ${thread.isLocked}`);
});

// Thread deleted
client.on('THREAD_DELETE', (thread) => {
  console.log(`Thread deleted: ${thread.threadId}`);
  console.log(`Type: ${thread.type}`);
});

// Thread list sync (when gaining access to channel)
client.on('THREAD_LIST_SYNC', (sync) => {
  console.log(`Synced ${sync.threadCount} threads in ${sync.guildId}`);
  console.log(`Full guild sync: ${sync.isFullGuildSync}`);
});

// Thread member updated (current user)
client.on('THREAD_MEMBER_UPDATE', (member) => {
  console.log(`Thread member updated: ${member.userId} in ${member.threadId}`);
  console.log(`Notifications enabled: ${member.hasNotifications}`);
});

// Thread members updated (anyone added/removed)
client.on('THREAD_MEMBERS_UPDATE', (update) => {
  console.log(`Thread ${update.threadId} member update`);
  console.log(`Added: ${update.addedCount}, Removed: ${update.removedCount}`);
  console.log(`Total members: ${update.memberCount}`);
});
```

### Stage Instance Events

```typescript
// Stage started
client.on('STAGE_INSTANCE_CREATE', (stage) => {
  console.log(`Stage started: ${stage.topic}`);
  console.log(`Channel: ${stage.channelId}, Guild: ${stage.guildId}`);
  console.log(`Privacy: ${stage.isPublic ? 'Public' : 'Guild Only'}`);
  console.log(`Discoverable: ${!stage.isDiscoverableDisabled}`);
});

// Stage updated
client.on('STAGE_INSTANCE_UPDATE', (stage) => {
  console.log(`Stage updated: ${stage.topic}`);
  console.log(`Has scheduled event: ${stage.hasScheduledEvent}`);
});

// Stage ended
client.on('STAGE_INSTANCE_DELETE', (stage) => {
  console.log(`Stage ended: ${stage.topic}`);
  console.log(`Was public: ${stage.wasPublic}`);
});
```

### Guild Scheduled Events

```typescript
// Scheduled event created
client.on('GUILD_SCHEDULED_EVENT_CREATE', (event) => {
  console.log(`Event scheduled: ${event.name}`);
  console.log(`Start: ${event.scheduledStartTime}`);
  console.log(`Type: ${event.isVoiceEvent ? 'Voice' : event.isExternalEvent ? 'External' : 'Stage'}`);
  console.log(`Location: ${event.location || event.channelId}`);
});

// Scheduled event updated
client.on('GUILD_SCHEDULED_EVENT_UPDATE', (event) => {
  console.log(`Event updated: ${event.name}`);
  console.log(`Status: ${event.status}, User count: ${event.userCount}`);
});

// Scheduled event deleted
client.on('GUILD_SCHEDULED_EVENT_DELETE', (event) => {
  console.log(`Event cancelled: ${event.name}`);
});

// User subscribed to event
client.on('GUILD_SCHEDULED_EVENT_USER_ADD', (subscription) => {
  console.log(`User ${subscription.userId} subscribed to event ${subscription.guildScheduledEventId}`);
});

// User unsubscribed from event
client.on('GUILD_SCHEDULED_EVENT_USER_REMOVE', (subscription) => {
  console.log(`User ${subscription.userId} unsubscribed from event ${subscription.guildScheduledEventId}`);
});
```

### Auto Moderation Events

```typescript
// Auto mod rule created
client.on('AUTO_MODERATION_RULE_CREATE', (rule) => {
  console.log(`Auto mod rule created: ${rule.name}`);
  console.log(`Type: ${rule.triggerTypeDescription}`);
  console.log(`Actions: ${rule.actionCount} configured`);
});

// Auto mod rule updated
client.on('AUTO_MODERATION_RULE_UPDATE', (rule) => {
  console.log(`Auto mod rule updated: ${rule.name}`);
  console.log(`Enabled: ${rule.enabled}`);
});

// Auto mod rule deleted
client.on('AUTO_MODERATION_RULE_DELETE', (rule) => {
  console.log(`Auto mod rule deleted: ${rule.name}`);
});

// Auto mod action executed
client.on('AUTO_MODERATION_ACTION_EXECUTION', (execution) => {
  console.log(`Auto mod action executed on ${execution.userId}`);
  console.log(`Rule: ${execution.ruleName}, Action: ${execution.actionTypeDescription}`);
  console.log(`Content flagged: "${execution.content}"`);
});
```

### Message and Channel Events

```typescript
// Channel pins updated
client.on('CHANNEL_PINS_UPDATE', (pins) => {
  console.log(`Pins updated in ${pins.channelId}`);
  console.log(`Last pin timestamp: ${pins.lastPinTimestamp}`);
});

// Bulk message delete
client.on('MESSAGE_DELETE_BULK', (deletion) => {
  console.log(`${deletion.count} messages deleted in ${deletion.channelId}`);
  console.log(`Message IDs: ${deletion.messageIds.join(', ')}`);
});

// Poll vote added
client.on('MESSAGE_POLL_VOTE_ADD', (vote) => {
  console.log(`User ${vote.userId} voted for answer ${vote.answerId}`);
  console.log(`Message: ${vote.messageId}, Channel: ${vote.channelId}`);
  console.log(`In guild: ${vote.isInGuild}`);
});

// Poll vote removed
client.on('MESSAGE_POLL_VOTE_REMOVE', (vote) => {
  console.log(`User ${vote.userId} removed vote for answer ${vote.answerId}`);
});
```

### Invite Events

```typescript
// Invite created
client.on('INVITE_CREATE', (invite) => {
  console.log(`Invite created: ${invite.url}`);
  console.log(`Channel: ${invite.channelId}, Max uses: ${invite.maxUses}`);
  console.log(`Expires: ${invite.neverExpires ? 'Never' : invite.maxAge + 's'}`);
  console.log(`Temporary: ${invite.isTemporary}`);
});

// Invite deleted
client.on('INVITE_DELETE', (invite) => {
  console.log(`Invite deleted: ${invite.url}`);
  console.log(`Code: ${invite.code}`);
});
```

### Integration Events

```typescript
// Integration created
client.on('INTEGRATION_CREATE', (integration) => {
  console.log(`Integration created: ${integration.name}`);
  console.log(`Type: ${integration.type}, Enabled: ${integration.isEnabled}`);
  console.log(`YouTube: ${integration.isYouTubeIntegration}`);
  console.log(`Twitch: ${integration.isTwitchIntegration}`);
});

// Integration updated
client.on('INTEGRATION_UPDATE', (integration) => {
  console.log(`Integration updated: ${integration.name}`);
  console.log(`Syncing: ${integration.isSyncing}, Revoked: ${integration.isRevoked}`);
  console.log(`Subscribers: ${integration.subscriberCount}`);
});

// Integration deleted
client.on('INTEGRATION_DELETE', (integration) => {
  console.log(`Integration deleted: ${integration.id} in ${integration.guildId}`);
  console.log(`Was Discord bot: ${integration.wasDiscordBotIntegration}`);
});
```

### Monetization Events

```typescript
// Entitlement created (user purchased something)
client.on('ENTITLEMENT_CREATE', (entitlement) => {
  console.log(`Entitlement created for user ${entitlement.userId}`);
  console.log(`SKU: ${entitlement.skuId}, Type: ${entitlement.typeDescription}`);
  console.log(`In guild: ${entitlement.isGuildEntitlement}`);
});

// Entitlement updated
client.on('ENTITLEMENT_UPDATE', (entitlement) => {
  console.log(`Entitlement updated: ${entitlement.id}`);
  console.log(`Active: ${entitlement.isActive}`);
});

// Entitlement deleted (subscription ended, etc.)
client.on('ENTITLEMENT_DELETE', (entitlement) => {
  console.log(`Entitlement deleted: ${entitlement.id}`);
  console.log(`Was consumed: ${entitlement.wasConsumed}`);
});
```

### Voice and Webhook Events

```typescript
// Voice server updated
client.on('VOICE_SERVER_UPDATE', (voice) => {
  console.log(`Voice server updated for ${voice.guildId}`);
  console.log(`Endpoint: ${voice.endpoint}, Available: ${voice.isAvailable}`);
});

// Webhooks updated
client.on('WEBHOOKS_UPDATE', (webhook) => {
  console.log(`Webhooks updated in ${webhook.channelId} (${webhook.guildId})`);
});
```

### Application Command Events

```typescript
// Application command permissions updated
client.on('APPLICATION_COMMAND_PERMISSIONS_UPDATE', (permissions) => {
  console.log(`Command permissions updated: ${permissions.applicationId}`);
  console.log(`Command: ${permissions.commandId || 'All commands'}`);
  console.log(`Guild: ${permissions.guildId}`);
  console.log(`Permissions: ${permissions.permissions.length} rules`);
});
```

## Event Data Access

All events provide rich data through wrapper classes:

```typescript
client.on('GUILD_MEMBER_ADD', (member) => {
  // Raw Discord data
  console.log(member.data);
  
  // Convenient getters
  console.log(member.user.username);
  console.log(member.joinedAt);
  console.log(member.roles);
  console.log(member.hasPermissions);
  
  // Utility methods
  console.log(member.isBot);
  console.log(member.isPending);
  console.log(member.displayName);
});
```

## Best Practices

### 1. Use Specific Events
```typescript
// Instead of listening to all message events
client.on('MESSAGE_CREATE', (message) => {
  if (message.author.bot) return; // Filter bots
  // Handle user messages
});

// Use specific thread events
client.on('THREAD_CREATE', (thread) => {
  if (thread.isNewlyCreated) {
    // Handle new threads
  } else {
    // Handle being added to existing thread
  }
});
```

### 2. Handle Event-Specific Data
```typescript
client.on('AUTO_MODERATION_ACTION_EXECUTION', (execution) => {
  // Log auto mod actions for review
  console.log(`Auto mod triggered: ${execution.ruleName}`);
  console.log(`User: ${execution.userId}, Content: "${execution.content}"`);
  
  // Take additional action if needed
  if (execution.isTimeoutAction) {
    console.log(`User was timed out for: ${execution.actionMetadata?.duration}s`);
  }
});
```

### 3. Use Type Guards
```typescript
client.on('GUILD_SCHEDULED_EVENT_CREATE', (event) => {
  if (event.isVoiceEvent) {
    console.log(`Voice event in channel ${event.channelId}`);
  } else if (event.isStageEvent) {
    console.log(`Stage event in channel ${event.channelId}`);
  } else if (event.isExternalEvent) {
    console.log(`External event at ${event.location}`);
  }
});
```

The comprehensive gateway event system ensures you never miss important Discord events and have all the data you need to build powerful bots!
