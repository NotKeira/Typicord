# Enhanced Event System

Typicord v2.0.0 introduces a powerful, Discord.js-like event system with full TypeScript support and advanced features.

## Overview

The enhanced event system provides:
- **TypedEventEmitter**: Advanced event emitter with Discord.js-like methods
- **Static Methods**: `Client.once()` for one-time event handling
- **Type Safety**: Full TypeScript support with event data types
- **Enhanced Features**: `waitFor()`, filtering, timeouts, and more

## TypedEventEmitter

The new event emitter provides familiar methods:

```typescript
import { Client } from 'typicord';

const client = new Client('your-token', intents);

// Listen for events
client.on('MESSAGE_CREATE', (message) => {
  console.log(`Message from ${message.author.username}: ${message.content}`);
});

// Listen once
client.once('READY', (ready) => {
  console.log(`Bot is ready as ${ready.user.username}!`);
});

// Remove listeners
const messageHandler = (message) => {
  // Handle message
};
client.on('MESSAGE_CREATE', messageHandler);
client.off('MESSAGE_CREATE', messageHandler);

// Remove all listeners
client.removeAllListeners('MESSAGE_CREATE');
```

## Static Once Method

Use the static `once` method for one-time event handling:

```typescript
import { Client } from 'typicord';

// Wait for the bot to be ready
const [ready] = await Client.once(client, 'READY');
console.log(`Bot is ready as ${ready.user.username}!`);

// Wait for a specific message
const [message] = await Client.once(client, 'MESSAGE_CREATE');
console.log(`Received message: ${message.content}`);
```

## Advanced Features

### waitFor Method

Wait for events with filtering and timeouts:

```typescript
// Wait for a message with a filter
const message = await client.waitFor('MESSAGE_CREATE', {
  filter: (msg) => msg.content.startsWith('!hello'),
  timeout: 30000 // 30 seconds
});

// Wait for a user to react
const reaction = await client.waitFor('MESSAGE_REACTION_ADD', {
  filter: (reaction) => reaction.userId === targetUserId,
  timeout: 60000
});
```

### Event Listener Counts

```typescript
// Get listener count
const count = client.listenerCount('MESSAGE_CREATE');
console.log(`${count} listeners for MESSAGE_CREATE`);

// Get all event names with listeners
const events = client.eventNames();
console.log('Events with listeners:', events);
```

### Error Handling

The event system includes built-in error handling:

```typescript
client.on('MESSAGE_CREATE', (message) => {
  // If this throws an error, it won't crash the bot
  throw new Error('Something went wrong!');
});

// Listen for errors
client.on('error', (error) => {
  console.error('Client error:', error);
});
```

## Client Events

The enhanced system includes client-specific events:

```typescript
// Rate limiting
client.on('rateLimit', (info) => {
  console.log(`Rate limited on ${info.route}: ${info.remaining}/${info.limit}`);
});

// Connection events
client.on('shardConnect', ({ shardId }) => {
  console.log(`Shard ${shardId} connected`);
});

client.on('shardDisconnect', ({ shardId, code, reason }) => {
  console.log(`Shard ${shardId} disconnected: ${code} ${reason}`);
});

// Debug information
client.on('debug', (info) => {
  console.log('Debug:', info);
});

// Warnings
client.on('warn', (warning) => {
  console.warn('Warning:', warning);
});
```

## Migration from v1.x

If you're upgrading from Typicord v1.x:

### Before (v1.x)
```typescript
client.on('message', (message) => {
  // Handle message
});
```

### After (v2.0.0)
```typescript
client.on('MESSAGE_CREATE', (message) => {
  // Handle message - now with full type support!
});
```

### Event Name Changes
- `message` → `MESSAGE_CREATE`
- `ready` → `READY`
- `guildCreate` → `GUILD_CREATE`
- All events now use Discord's official gateway event names

## Best Practices

### 1. Use TypeScript
```typescript
import { Client } from 'typicord';
import type { MessageCreateEventData } from 'typicord';

client.on('MESSAGE_CREATE', (message: MessageCreateEventData) => {
  // Full type safety and autocomplete
});
```

### 2. Handle Errors
```typescript
client.on('error', (error) => {
  console.error('Client error:', error);
});

client.on('warn', (warning) => {
  console.warn('Client warning:', warning);
});
```

### 3. Clean Up Listeners
```typescript
// Store references to remove later
const handlers = new Map();

const messageHandler = (message) => {
  // Handle message
};

handlers.set('message', messageHandler);
client.on('MESSAGE_CREATE', messageHandler);

// Later, clean up
client.off('MESSAGE_CREATE', handlers.get('message'));
```

### 4. Use Once for One-Time Events
```typescript
// Instead of removing manually
client.once('READY', (ready) => {
  console.log('Bot ready!');
});

// Or use static method
const [ready] = await Client.once(client, 'READY');
```

## Advanced Usage

### Custom Event Filtering
```typescript
// Create a helper for specific message types
async function waitForCommand(client, commandName, timeout = 30000) {
  return await client.waitFor('MESSAGE_CREATE', {
    filter: (message) => message.content.startsWith(`!${commandName}`),
    timeout
  });
}

// Usage
const message = await waitForCommand(client, 'help');
```

### Event Debugging
```typescript
// Log all events
client.on('debug', (info) => {
  if (info.includes('event')) {
    console.log('Event debug:', info);
  }
});

// Monitor listener counts
setInterval(() => {
  const events = client.eventNames();
  events.forEach(event => {
    console.log(`${event}: ${client.listenerCount(event)} listeners`);
  });
}, 60000); // Every minute
```

The enhanced event system makes Typicord more powerful and familiar for developers coming from Discord.js while maintaining the simplicity that makes Typicord great!
