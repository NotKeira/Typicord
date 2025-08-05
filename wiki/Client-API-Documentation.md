# Client API Documentation

This page documents the Typicord Client API, including all methods, properties, and events available in v2.0.0.

## Client Class

The `Client` class is the main entry point for Typicord bots. It extends `EnhancedClient` and provides Discord gateway connection management.

### Constructor

```typescript
new Client(token: string, options: ClientOptions)
```

**Parameters:**
- `token`: Your Discord bot token
- `options`: Client configuration options

### ClientOptions

```typescript
interface ClientOptions {
  intents: number;                    // Gateway intents bitfield
  shardId?: number;                   // Shard ID (default: 0)
  shardCount?: number;                // Total shard count (default: 1)
  maxReconnectAttempts?: number;      // Max reconnection attempts (default: 5)
  reconnectDelay?: number;            // Delay between reconnects in ms (default: 5000)
  heartbeatInterval?: number;         // Custom heartbeat interval (optional)
  compress?: boolean;                 // Enable payload compression (default: true)
  largeThreshold?: number;            // Large guild threshold (default: 50)
  properties?: GatewayConnectionProperties; // Connection properties
  presence?: PresenceUpdateData;      // Initial presence data
}
```

### Properties

#### `client.gateway`
Gateway connection manager.

```typescript
client.gateway.isConnected: boolean;     // Connection status
client.gateway.latency: number;          // Current latency in ms
client.gateway.lastHeartbeat: Date;      // Last heartbeat timestamp
client.gateway.shardId: number;          // Current shard ID
```

#### `client.rest`
REST API client for making Discord API requests.

```typescript
// Make API requests
await client.rest.get('/users/@me');
await client.rest.post('/channels/123/messages', {
  body: { content: 'Hello!' }
});
```

#### `client.cache`
Caching system for Discord entities.

```typescript
client.cache.guilds: GuildCacheManager;   // Guild cache
client.cache.users: UserCacheManager;     // User cache
```

### Methods

#### Connection Management

##### `connect()`
```typescript
async connect(): Promise<void>
```
Connects to Discord gateway.

**Example:**
```typescript
await client.connect();
console.log('Connected to Discord!');
```

##### `disconnect()`
```typescript
async disconnect(): Promise<void>
```
Disconnects from Discord gateway.

**Example:**
```typescript
await client.disconnect();
console.log('Disconnected from Discord');
```

##### `reconnect()`
```typescript
async reconnect(): Promise<void>
```
Reconnects to Discord gateway.

**Example:**
```typescript
await client.reconnect();
```

#### Event Management

Typicord Client extends `EnhancedClient` with Discord.js-like event handling.

##### `on(event, listener)`
```typescript
on<K extends keyof ClientEvents>(
  event: K, 
  listener: (...args: ClientEvents[K]) => void
): this
```
Adds an event listener.

**Example:**
```typescript
client.on('MESSAGE_CREATE', (message) => {
  console.log(`Message: ${message.content}`);
});
```

##### `once(event, listener)`
```typescript
once<K extends keyof ClientEvents>(
  event: K, 
  listener: (...args: ClientEvents[K]) => void
): this
```
Adds a one-time event listener.

**Example:**
```typescript
client.once('READY', (ready) => {
  console.log(`Bot ready as ${ready.user.username}`);
});
```

##### `off(event, listener)`
```typescript
off<K extends keyof ClientEvents>(
  event: K, 
  listener: (...args: ClientEvents[K]) => void
): this
```
Removes an event listener.

**Example:**
```typescript
const handler = (message) => console.log(message.content);
client.on('MESSAGE_CREATE', handler);
client.off('MESSAGE_CREATE', handler);
```

##### `waitFor(event, options?)`
```typescript
async waitFor<K extends keyof ClientEvents>(
  event: K,
  options?: {
    filter?: (...args: ClientEvents[K]) => boolean;
    timeout?: number;
  }
): Promise<ClientEvents[K]>
```
Waits for an event with optional filtering and timeout.

**Example:**
```typescript
// Wait for a specific message
const [message] = await client.waitFor('MESSAGE_CREATE', {
  filter: (msg) => msg.content.startsWith('!hello'),
  timeout: 30000 // 30 seconds
});

// Wait for ready event
const [ready] = await client.waitFor('READY');
```

##### Static `Client.once(client, event, options?)`
```typescript
static async once<K extends keyof ClientEvents>(
  client: Client,
  event: K,
  options?: {
    filter?: (...args: ClientEvents[K]) => boolean;
    timeout?: number;
  }
): Promise<ClientEvents[K]>
```
Static method to wait for an event once.

**Example:**
```typescript
// Wait for bot to be ready
const [ready] = await Client.once(client, 'READY');
console.log(`Ready as ${ready.user.username}`);

// Wait for specific guild to be available
const [guild] = await Client.once(client, 'GUILD_CREATE', {
  filter: (g) => g.name === 'My Server'
});
```

## Events

### Client Lifecycle Events

#### `READY`
Emitted when the client successfully connects and is ready.

```typescript
client.on('READY', (ready: ReadyEventData) => {
  console.log(`Ready as ${ready.user.username}`);
  console.log(`Connected to ${ready.guilds.length} guilds`);
});
```

**ReadyEventData Properties:**
- `user`: Bot user information
- `guilds`: Array of unavailable guilds
- `sessionId`: Current session ID
- `resumeGatewayUrl`: Gateway URL for resuming
- `shard`: Shard information

#### `RESUMED`
Emitted when connection is resumed after disconnect.

```typescript
client.on('RESUMED', (resumed: ResumedEventData) => {
  console.log('Connection resumed');
});
```

#### `error`
Emitted when an error occurs.

```typescript
client.on('error', (error: Error) => {
  console.error('Client error:', error);
});
```

#### `warn`
Emitted for warnings.

```typescript
client.on('warn', (warning: string) => {
  console.warn('Client warning:', warning);
});
```

#### `debug`
Emitted for debug information.

```typescript
client.on('debug', (info: string) => {
  console.debug('Debug:', info);
});
```

#### `rateLimit`
Emitted when rate limited.

```typescript
client.on('rateLimit', (rateLimitInfo: RateLimitData) => {
  console.warn('Rate limited:', rateLimitInfo);
});
```

#### `shardDisconnect`
Emitted when shard disconnects.

```typescript
client.on('shardDisconnect', (shardId: number, code: number) => {
  console.log(`Shard ${shardId} disconnected with code ${code}`);
});
```

#### `shardReconnecting`
Emitted when shard starts reconnecting.

```typescript
client.on('shardReconnecting', (shardId: number) => {
  console.log(`Shard ${shardId} reconnecting`);
});
```

#### `shardReady`
Emitted when shard becomes ready.

```typescript
client.on('shardReady', (shardId: number) => {
  console.log(`Shard ${shardId} ready`);
});
```

#### `shardResume`
Emitted when shard resumes.

```typescript
client.on('shardResume', (shardId: number, replayedEvents: number) => {
  console.log(`Shard ${shardId} resumed, replayed ${replayedEvents} events`);
});
```

### Discord Gateway Events

All Discord gateway events are available with their official names. See [Gateway Events](Gateway-Events.md) for complete documentation.

**Message Events:**
- `MESSAGE_CREATE`
- `MESSAGE_UPDATE`
- `MESSAGE_DELETE`
- `MESSAGE_DELETE_BULK`
- `MESSAGE_REACTION_ADD`
- `MESSAGE_REACTION_REMOVE`
- `MESSAGE_REACTION_REMOVE_ALL`
- `MESSAGE_REACTION_REMOVE_EMOJI`

**Guild Events:**
- `GUILD_CREATE`
- `GUILD_UPDATE`
- `GUILD_DELETE`
- `GUILD_BAN_ADD`
- `GUILD_BAN_REMOVE`
- `GUILD_EMOJIS_UPDATE`
- `GUILD_STICKERS_UPDATE`
- `GUILD_INTEGRATIONS_UPDATE`
- `GUILD_MEMBER_ADD`
- `GUILD_MEMBER_REMOVE`
- `GUILD_MEMBER_UPDATE`
- `GUILD_MEMBERS_CHUNK`
- `GUILD_ROLE_CREATE`
- `GUILD_ROLE_UPDATE`
- `GUILD_ROLE_DELETE`

**Channel Events:**
- `CHANNEL_CREATE`
- `CHANNEL_UPDATE`
- `CHANNEL_DELETE`
- `CHANNEL_PINS_UPDATE`
- `THREAD_CREATE`
- `THREAD_UPDATE`
- `THREAD_DELETE`
- `THREAD_LIST_SYNC`
- `THREAD_MEMBER_UPDATE`
- `THREAD_MEMBERS_UPDATE`

**Interaction Events:**
- `INTERACTION_CREATE`

**Voice Events:**
- `VOICE_STATE_UPDATE`
- `VOICE_SERVER_UPDATE`

**And many more!** See [Gateway Events](Gateway-Events.md) for the complete list.

## Advanced Usage

### Custom Event Handling

Create custom event handlers with proper typing:

```typescript
import type { MessageCreateEventData } from 'typicord';

class MessageHandler {
  constructor(private client: Client) {
    this.client.on('MESSAGE_CREATE', this.handleMessage);
  }
  
  private handleMessage = (message: MessageCreateEventData) => {
    if (message.isFromBot) return;
    
    if (message.content.startsWith('!')) {
      this.handleCommand(message);
    }
  };
  
  private handleCommand(message: MessageCreateEventData) {
    const [command, ...args] = message.content.slice(1).split(' ');
    
    switch (command) {
      case 'ping':
        this.sendReply(message, 'Pong!');
        break;
      case 'info':
        this.sendInfo(message);
        break;
    }
  }
  
  private async sendReply(message: MessageCreateEventData, content: string) {
    await this.client.rest.post(`/channels/${message.channelId}/messages`, {
      body: { content }
    });
  }
  
  private async sendInfo(message: MessageCreateEventData) {
    const embed = {
      title: 'Bot Information',
      fields: [
        {
          name: 'Latency',
          value: `${this.client.gateway.latency}ms`,
          inline: true
        }
      ]
    };
    
    await this.client.rest.post(`/channels/${message.channelId}/messages`, {
      body: { embeds: [embed] }
    });
  }
}

// Use the handler
const messageHandler = new MessageHandler(client);
```

### Event Filtering

Use advanced event filtering:

```typescript
// Wait for specific user to send a message
const [userMessage] = await client.waitFor('MESSAGE_CREATE', {
  filter: (msg) => msg.author.id === '123456789' && !msg.isFromBot,
  timeout: 60000
});

// Wait for message in specific channel
const [channelMessage] = await client.waitFor('MESSAGE_CREATE', {
  filter: (msg) => msg.channelId === '987654321',
  timeout: 30000
});

// Wait for command message
const [commandMessage] = await client.waitFor('MESSAGE_CREATE', {
  filter: (msg) => msg.content.startsWith('!setup') && msg.isInGuild,
  timeout: 120000
});
```

### Bulk Event Management

Manage multiple events efficiently:

```typescript
class EventManager {
  private handlers = new Map<string, Function>();
  
  constructor(private client: Client) {}
  
  registerHandler(event: string, handler: Function) {
    this.handlers.set(event, handler);
    this.client.on(event as any, handler);
  }
  
  unregisterHandler(event: string) {
    const handler = this.handlers.get(event);
    if (handler) {
      this.client.off(event as any, handler);
      this.handlers.delete(event);
    }
  }
  
  unregisterAll() {
    for (const [event, handler] of this.handlers) {
      this.client.off(event as any, handler);
    }
    this.handlers.clear();
  }
}

const eventManager = new EventManager(client);
eventManager.registerHandler('MESSAGE_CREATE', messageHandler);
eventManager.registerHandler('GUILD_CREATE', guildHandler);

// Clean up when needed
eventManager.unregisterAll();
```

### Error Handling Patterns

Implement robust error handling:

```typescript
class ErrorHandler {
  constructor(private client: Client) {
    this.setupErrorHandling();
  }
  
  private setupErrorHandling() {
    // Client errors
    this.client.on('error', this.handleError);
    this.client.on('warn', this.handleWarning);
    
    // Process errors
    process.on('unhandledRejection', this.handleUnhandledRejection);
    process.on('uncaughtException', this.handleUncaughtException);
  }
  
  private handleError = (error: Error) => {
    console.error('❌ Client Error:', error);
    
    // Log to external service
    this.logError('CLIENT_ERROR', error);
    
    // Attempt recovery
    if (error.message.includes('connection')) {
      this.attemptReconnection();
    }
  };
  
  private handleWarning = (warning: string) => {
    console.warn('⚠️ Client Warning:', warning);
    this.logWarning('CLIENT_WARNING', warning);
  };
  
  private handleUnhandledRejection = (reason: any) => {
    console.error('🔥 Unhandled Rejection:', reason);
    this.logError('UNHANDLED_REJECTION', reason);
  };
  
  private handleUncaughtException = (error: Error) => {
    console.error('💥 Uncaught Exception:', error);
    this.logError('UNCAUGHT_EXCEPTION', error);
    
    // Graceful shutdown
    this.gracefulShutdown();
  };
  
  private async attemptReconnection() {
    try {
      await this.client.reconnect();
      console.log('✅ Reconnection successful');
    } catch (error) {
      console.error('❌ Reconnection failed:', error);
    }
  }
  
  private async gracefulShutdown() {
    console.log('🔄 Initiating graceful shutdown...');
    
    try {
      await this.client.disconnect();
      console.log('✅ Client disconnected');
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
    }
    
    process.exit(1);
  }
  
  private logError(type: string, error: any) {
    // Log to file, database, or external service
    // Example: winston, sentry, etc.
  }
  
  private logWarning(type: string, warning: string) {
    // Log warning to appropriate service
  }
}

const errorHandler = new ErrorHandler(client);
```

## Performance Considerations

### Memory Management

Monitor and manage memory usage:

```typescript
// Monitor memory usage
setInterval(() => {
  const usage = process.memoryUsage();
  console.log('Memory Usage:', {
    rss: Math.round(usage.rss / 1024 / 1024) + 'MB',
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + 'MB',
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024) + 'MB'
  });
}, 30000);

// Clean up event listeners periodically
setInterval(() => {
  // Remove old listeners if needed
  client.removeAllListeners('SOME_TEMPORARY_EVENT');
}, 300000); // Every 5 minutes
```

### Connection Optimization

Optimize gateway connection:

```typescript
const client = new Client(token, {
  intents: calculateIntents(...requiredIntents), // Only necessary intents
  compress: true,                                // Enable compression
  largeThreshold: 50,                           // Optimize for guild size
  maxReconnectAttempts: 3,                      // Limit reconnection attempts
  reconnectDelay: 5000                          // Reasonable reconnect delay
});
```

## See Also

- [Enhanced Event System](Enhanced-Event-System.md) - Detailed event handling guide
- [Gateway Events](Gateway-Events.md) - Complete list of Discord events
- [Utility Structures](Utility-Structures.md) - Additional utility classes
- [Examples](examples/) - Practical implementation examples
