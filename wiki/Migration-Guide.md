# Migration Guide

This guide helps you migrate from Typicord v1.x to v2.0.0, which includes breaking changes and new features.

## Overview of Changes

Typicord v2.0.0 introduces:
- **Enhanced Event System**: Discord.js-like event handling
- **New Client Base**: Client now extends `EnhancedClient`
- **Gateway Event Names**: Uses Discord's official event names
- **Comprehensive Events**: Support for all modern Discord events
- **Utility Structures**: Advanced caching, logging, and monitoring
- **Better TypeScript**: Improved type safety and developer experience

## Breaking Changes

### 1. Client Class Changes

#### Before (v1.x)
```typescript
import { Client } from 'typicord';

const client = new Client('token', intents);
// Client extended basic EventEmitter
```

#### After (v2.0.0)
```typescript
import { Client } from 'typicord';

const client = new Client('token', intents);
// Client now extends EnhancedClient with advanced event handling
```

**Impact**: The Client class now has additional methods and capabilities. Existing code should continue to work, but you can now use enhanced features.

### 2. Event Name Changes

All event names now use Discord's official gateway event names in SCREAMING_SNAKE_CASE.

#### Before (v1.x)
```typescript
client.on('message', (message) => {
  console.log(message.content);
});

client.on('ready', (ready) => {
  console.log('Bot ready!');
});

client.on('guildCreate', (guild) => {
  console.log('Joined guild:', guild.name);
});
```

#### After (v2.0.0)
```typescript
client.on('MESSAGE_CREATE', (message) => {
  console.log(message.content);
});

client.on('READY', (ready) => {
  console.log('Bot ready!');
});

client.on('GUILD_CREATE', (guild) => {
  console.log('Joined guild:', guild.name);
});
```

**Impact**: You must update all event listeners to use the new event names.

### Event Name Mapping Table

| v1.x Event Name | v2.0.0 Event Name | Notes |
|----------------|-------------------|-------|
| `message` | `MESSAGE_CREATE` | - |
| `messageUpdate` | `MESSAGE_UPDATE` | - |
| `messageDelete` | `MESSAGE_DELETE` | - |
| `ready` | `READY` | - |
| `resumed` | `RESUMED` | - |
| `guildCreate` | `GUILD_CREATE` | - |
| `guildUpdate` | `GUILD_UPDATE` | - |
| `guildDelete` | `GUILD_DELETE` | - |
| `channelCreate` | `CHANNEL_CREATE` | - |
| `channelUpdate` | `CHANNEL_UPDATE` | - |
| `channelDelete` | `CHANNEL_DELETE` | - |
| `interactionCreate` | `INTERACTION_CREATE` | - |
| `typingStart` | `TYPING_START` | - |
| `messageReactionAdd` | `MESSAGE_REACTION_ADD` | - |
| `messageReactionRemove` | `MESSAGE_REACTION_REMOVE` | - |
| `messageReactionRemoveAll` | `MESSAGE_REACTION_REMOVE_ALL` | - |
| `messageReactionRemoveEmoji` | `MESSAGE_REACTION_REMOVE_EMOJI` | - |
| `presenceUpdate` | `PRESENCE_UPDATE` | - |
| `voiceStateUpdate` | `VOICE_STATE_UPDATE` | - |
| `userUpdate` | `USER_UPDATE` | - |

### 3. Enhanced Event Data

Event data now comes wrapped in classes with convenient methods:

#### Before (v1.x)
```typescript
client.on('message', (messageData) => {
  // Raw Discord API data
  console.log(messageData.author.username);
  console.log(messageData.timestamp);
});
```

#### After (v2.0.0)
```typescript
client.on('MESSAGE_CREATE', (message) => {
  // Wrapped with convenient methods
  console.log(message.author.username);
  console.log(message.createdAt); // Date object
  console.log(message.isFromBot);
  console.log(message.isInGuild);
  console.log(message.hasAttachments);
});
```

**Impact**: You can access more convenient methods and properties, but raw data is still available via `.data` property.

## New Features to Adopt

### 1. Enhanced Event Methods

```typescript
// New methods available
client.once('READY', (ready) => {
  console.log('Bot ready!');
});

client.off('MESSAGE_CREATE', messageHandler);
client.removeAllListeners('MESSAGE_CREATE');

// Wait for events with filtering
const message = await client.waitFor('MESSAGE_CREATE', {
  filter: (msg) => msg.content.startsWith('!hello'),
  timeout: 30000
});

// Static once method
const [ready] = await Client.once(client, 'READY');
```

### 2. New Gateway Events

Take advantage of new events not available in v1.x:

```typescript
// Auto moderation
client.on('AUTO_MODERATION_ACTION_EXECUTION', (execution) => {
  console.log(`Auto mod triggered: ${execution.ruleName}`);
});

// Threads
client.on('THREAD_CREATE', (thread) => {
  console.log(`Thread created: ${thread.name}`);
});

// Stage instances
client.on('STAGE_INSTANCE_CREATE', (stage) => {
  console.log(`Stage started: ${stage.topic}`);
});

// Guild scheduled events
client.on('GUILD_SCHEDULED_EVENT_CREATE', (event) => {
  console.log(`Event scheduled: ${event.name}`);
});

// Polls
client.on('MESSAGE_POLL_VOTE_ADD', (vote) => {
  console.log(`User voted for answer ${vote.answerId}`);
});
```

### 3. Utility Structures

Consider adopting the new utility structures for better performance and monitoring:

```typescript
import { 
  AdvancedCache, 
  AuditLogger, 
  MetricsCollector,
  PermissionCalculator 
} from 'typicord';

// Advanced caching
const cache = new AdvancedCache({
  maxSize: 1000,
  defaultTTL: 300000
});

// Comprehensive logging
const logger = new AuditLogger({
  maxEntries: 10000,
  retentionDays: 30
});

// Performance monitoring
const metrics = new MetricsCollector();
metrics.registerBotMetrics();
```

## Step-by-Step Migration

### Step 1: Update Dependencies

```bash
npm update typicord
# or
pnpm update typicord
```

### Step 2: Update Event Names

Create a search and replace mapping for your IDE:

```typescript
// Find and replace these patterns:
".on('message'" → ".on('MESSAGE_CREATE'"
".on('ready'" → ".on('READY'"
".on('guildCreate'" → ".on('GUILD_CREATE'"
// ... etc for all events you use
```

### Step 3: Update Event Handlers

Review and update your event handlers:

```typescript
// Before
client.on('message', (msg) => {
  if (msg.author.bot) return;
  // Handle message
});

// After
client.on('MESSAGE_CREATE', (message) => {
  if (message.isFromBot) return; // More convenient method
  // Handle message
});
```

### Step 4: Adopt New Features

Gradually adopt new features:

```typescript
// Use enhanced event methods
client.once('READY', (ready) => {
  console.log(`Ready as ${ready.user.username}`);
  logger.info(AuditLogCategory.SYSTEM, 'Bot started successfully');
});

// Use new events
client.on('THREAD_CREATE', (thread) => {
  if (thread.isNewlyCreated && thread.parentId === supportChannelId) {
    // Auto-respond to new support threads
  }
});
```

### Step 5: Add Monitoring

Add monitoring and logging:

```typescript
import { AuditLogger, MetricsCollector, AuditLogCategory } from 'typicord';

const logger = new AuditLogger();
const metrics = new MetricsCollector();

// Monitor commands
client.on('INTERACTION_CREATE', (interaction) => {
  if (interaction.isCommand()) {
    logger.logCommand(
      interaction.commandName,
      interaction.user.id,
      interaction.guildId,
      interaction.channelId,
      true
    );
    
    metrics.incrementCounter('discord_commands_executed_total', 1, {
      command: interaction.commandName
    });
  }
});

// Monitor errors
client.on('error', (error) => {
  logger.error(AuditLogCategory.ERROR, 'Client error', error);
});
```

## Testing Your Migration

### 1. Gradual Migration

Start with basic event name changes and test thoroughly:

```typescript
// Test basic events first
client.on('READY', (ready) => {
  console.log('✅ READY event working');
});

client.on('MESSAGE_CREATE', (message) => {
  console.log('✅ MESSAGE_CREATE event working');
});
```

### 2. Feature Testing

Test new features incrementally:

```typescript
// Test enhanced event methods
client.once('GUILD_CREATE', (guild) => {
  console.log('✅ Enhanced once() method working');
});

// Test new events
client.on('THREAD_CREATE', (thread) => {
  console.log('✅ New thread events working');
});
```

### 3. Error Handling

Ensure error handling still works:

```typescript
client.on('error', (error) => {
  console.error('❌ Client error:', error);
});

client.on('warn', (warning) => {
  console.warn('⚠️ Client warning:', warning);
});
```

## Common Issues and Solutions

### Issue 1: Event Not Firing

**Problem**: Event listeners not triggering after migration.

**Solution**: Check event name spelling and casing:
```typescript
// Wrong
client.on('message_create', handler); // lowercase
client.on('messageCreate', handler);  // camelCase

// Correct
client.on('MESSAGE_CREATE', handler); // SCREAMING_SNAKE_CASE
```

### Issue 2: TypeScript Errors

**Problem**: TypeScript complaining about event data types.

**Solution**: Use proper typing:
```typescript
import type { MessageCreateEventData } from 'typicord';

client.on('MESSAGE_CREATE', (message: MessageCreateEventData) => {
  // Now has full type support
});
```

### Issue 3: Missing Event Data

**Problem**: Cannot access expected properties on event data.

**Solution**: Use wrapper class methods or access raw data:
```typescript
client.on('MESSAGE_CREATE', (message) => {
  // Use wrapper methods
  console.log(message.createdAt);
  console.log(message.isFromBot);
  
  // Or access raw data
  console.log(message.data.timestamp);
  console.log(message.data.author.bot);
});
```

## Performance Considerations

### Memory Usage

v2.0.0 includes better memory management:

```typescript
// Use advanced cache for better memory control
const cache = new AdvancedCache({
  maxSize: 1000,
  cleanupInterval: 60000
});

// Monitor memory usage
const metrics = new MetricsCollector();
setInterval(() => {
  metrics.updateSystemMetrics();
}, 30000);
```

### Event Listener Management

Better manage event listeners:

```typescript
// Store handler references for cleanup
const handlers = new Map();

const messageHandler = (message) => {
  // Handle message
};

handlers.set('message', messageHandler);
client.on('MESSAGE_CREATE', messageHandler);

// Clean up when needed
client.off('MESSAGE_CREATE', handlers.get('message'));
```

## Getting Help

If you encounter issues during migration:

1. Check the [API Documentation](API-Documentation.md)
2. Review [Examples](examples/)
3. Search [GitHub Issues](https://github.com/NotKeira/Typicord/issues)
4. Create a new issue with migration details

The migration to v2.0.0 provides significant improvements in functionality and developer experience. Take your time to migrate gradually and test thoroughly!
