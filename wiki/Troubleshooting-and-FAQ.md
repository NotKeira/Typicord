# Troubleshooting and FAQ

This page covers common issues, troubleshooting steps, and frequently asked questions for Typicord v2.0.0.

## Common Issues

### Connection Issues

#### Issue: Bot doesn't connect to Discord

**Symptoms:**
- No "Ready" event fired
- Connection timeouts
- Gateway errors

**Solutions:**

1. **Check your bot token:**
```typescript
// Make sure token is valid and not expired
const client = new Client('YOUR_ACTUAL_BOT_TOKEN', options);
```

2. **Verify intents:**
```typescript
// Ensure you have the required intents
const client = new Client(token, {
  intents: [
    GatewayIntentBits.GUILDS, // Required for basic functionality
    GatewayIntentBits.GUILD_MESSAGES,
    GatewayIntentBits.MESSAGE_CONTENT // Privileged intent
  ]
});
```

3. **Check privileged intent settings:**
- Go to [Discord Developer Portal](https://discord.com/developers/applications)
- Select your application
- Go to "Bot" section
- Enable required privileged intents

4. **Network connectivity:**
```typescript
// Add connection error handling
client.on('error', (error) => {
  console.error('Connection error:', error);
});

client.on('warn', (warning) => {
  console.warn('Connection warning:', warning);
});
```

#### Issue: Bot connects but frequently disconnects

**Symptoms:**
- Frequent reconnection attempts
- "Connection lost" messages
- Inconsistent bot behavior

**Solutions:**

1. **Increase reconnection settings:**
```typescript
const client = new Client(token, {
  intents: [...],
  maxReconnectAttempts: 10,
  reconnectDelay: 5000
});
```

2. **Handle disconnection gracefully:**
```typescript
client.on('shardDisconnect', (shardId, code) => {
  console.log(`Shard ${shardId} disconnected with code ${code}`);
});

client.on('shardReconnecting', (shardId) => {
  console.log(`Shard ${shardId} attempting to reconnect`);
});
```

3. **Check for memory leaks:**
```typescript
// Monitor memory usage
setInterval(() => {
  const usage = process.memoryUsage();
  console.log('Memory:', Math.round(usage.heapUsed / 1024 / 1024) + 'MB');
}, 60000);
```

### Event Issues

#### Issue: Events not firing

**Symptoms:**
- Event listeners don't trigger
- Missing event data
- Bot not responding to messages

**Solutions:**

1. **Check event names (v2.0.0 uses SCREAMING_SNAKE_CASE):**
```typescript
// ❌ Wrong
client.on('message', handler);
client.on('messageCreate', handler);

// ✅ Correct
client.on('MESSAGE_CREATE', handler);
```

2. **Verify intents for specific events:**
```typescript
// For message events
GatewayIntentBits.GUILD_MESSAGES,
GatewayIntentBits.MESSAGE_CONTENT, // Required for message content

// For member events
GatewayIntentBits.GUILD_MEMBERS, // Privileged

// For presence events
GatewayIntentBits.GUILD_PRESENCES, // Privileged
```

3. **Check event listener syntax:**
```typescript
// ✅ Correct event listener
client.on('MESSAGE_CREATE', (message) => {
  console.log('Message received:', message.content);
});

// ❌ Wrong - missing parameter
client.on('MESSAGE_CREATE', () => {
  // message parameter missing
});
```

#### Issue: Event data is undefined or missing properties

**Symptoms:**
- `undefined` error when accessing event data
- Missing properties on event objects
- TypeScript errors

**Solutions:**

1. **Use proper TypeScript types:**
```typescript
import type { MessageCreateEventData } from 'typicord';

client.on('MESSAGE_CREATE', (message: MessageCreateEventData) => {
  // Now has full type support
  console.log(message.content);
  console.log(message.author.username);
});
```

2. **Check for bot message filtering:**
```typescript
client.on('MESSAGE_CREATE', (message) => {
  // Make sure to filter bot messages
  if (message.isFromBot) return;
  
  // Handle user messages
  console.log(message.content);
});
```

3. **Access raw data if needed:**
```typescript
client.on('MESSAGE_CREATE', (message) => {
  // Use wrapper methods (recommended)
  console.log(message.createdAt);
  console.log(message.isFromBot);
  
  // Or access raw Discord API data
  console.log(message.data.timestamp);
  console.log(message.data.author.bot);
});
```

### Permission Issues

#### Issue: Bot can't perform actions (send messages, ban users, etc.)

**Symptoms:**
- "Missing permissions" errors
- API calls returning 403 Forbidden
- Commands not working

**Solutions:**

1. **Check bot permissions in Discord:**
- Right-click the server name
- Go to Server Settings → Roles
- Find your bot's role
- Ensure it has necessary permissions

2. **Check channel-specific permissions:**
- Right-click the channel
- Go to Edit Channel → Permissions
- Ensure bot role has required permissions

3. **Verify role hierarchy:**
```typescript
// Bot's role must be above target user's highest role
// Check role positions before moderating users
```

4. **Handle permission errors gracefully:**
```typescript
try {
  await client.rest.post(`/channels/${channelId}/messages`, {
    body: { content: 'Hello!' }
  });
} catch (error) {
  if (error.status === 403) {
    console.error('Missing permissions to send message');
  } else if (error.status === 404) {
    console.error('Channel not found');
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Performance Issues

#### Issue: Bot is slow or unresponsive

**Symptoms:**
- High latency
- Delayed responses
- Memory usage increasing over time

**Solutions:**

1. **Monitor performance metrics:**
```typescript
import { MetricsCollector } from 'typicord';

const metrics = new MetricsCollector();
metrics.registerBotMetrics();

// Monitor regularly
setInterval(() => {
  console.log('Latency:', client.gateway.latency);
  console.log('Memory:', process.memoryUsage());
}, 30000);
```

2. **Optimize event listeners:**
```typescript
// ❌ Avoid creating functions in loops
for (let i = 0; i < 10; i++) {
  client.on('MESSAGE_CREATE', (message) => {
    // New function created each iteration
  });
}

// ✅ Create function once
const messageHandler = (message) => {
  // Handle message
};

client.on('MESSAGE_CREATE', messageHandler);
```

3. **Use caching efficiently:**
```typescript
import { AdvancedCache } from 'typicord';

const cache = new AdvancedCache({
  maxSize: 1000,
  defaultTTL: 300000, // 5 minutes
  cleanupInterval: 60000 // Clean every minute
});
```

4. **Avoid blocking operations:**
```typescript
// ❌ Blocking operation
client.on('MESSAGE_CREATE', (message) => {
  // This blocks the event loop
  const result = someHeavyCalculation();
});

// ✅ Non-blocking with async
client.on('MESSAGE_CREATE', async (message) => {
  // This doesn't block
  const result = await someAsyncOperation();
});
```

## Frequently Asked Questions

### General Questions

#### Q: What's the difference between v1.x and v2.0.0?

**A:** Typicord v2.0.0 includes major improvements:
- **Enhanced Event System**: Discord.js-like event handling with `on()`, `once()`, `off()`, `waitFor()`
- **Official Event Names**: Uses Discord's gateway event names (SCREAMING_SNAKE_CASE)
- **Better TypeScript**: Improved type safety and developer experience
- **New Gateway Events**: Support for 50+ modern Discord events
- **Utility Structures**: Advanced caching, logging, and monitoring tools
- **Production Ready**: Better error handling, performance monitoring

See the [Migration Guide](Migration-Guide.md) for detailed changes.

#### Q: Do I need to update my existing bot code?

**A:** Yes, there are breaking changes:
1. Event names changed from camelCase to SCREAMING_SNAKE_CASE
2. Client now extends EnhancedClient with additional methods
3. Event data comes wrapped in convenient classes

Follow the [Migration Guide](Migration-Guide.md) for step-by-step instructions.

#### Q: Which Node.js version do I need?

**A:** Typicord v2.0.0 requires Node.js 16.0.0 or higher. We recommend using the LTS version.

```bash
# Check your Node.js version
node --version

# Should be v16.0.0 or higher
```

### Event System Questions

#### Q: How do I wait for a specific event?

**A:** Use the `waitFor` method:

```typescript
// Wait for any message
const [message] = await client.waitFor('MESSAGE_CREATE');

// Wait for specific message with timeout
const [message] = await client.waitFor('MESSAGE_CREATE', {
  filter: (msg) => msg.content === '!ready',
  timeout: 30000 // 30 seconds
});

// Static method
const [ready] = await Client.once(client, 'READY');
```

#### Q: Can I remove event listeners?

**A:** Yes, use the `off` method:

```typescript
const handler = (message) => console.log(message.content);

// Add listener
client.on('MESSAGE_CREATE', handler);

// Remove specific listener
client.off('MESSAGE_CREATE', handler);

// Remove all listeners for an event
client.removeAllListeners('MESSAGE_CREATE');
```

#### Q: What's the difference between `on` and `once`?

**A:**
- `on()`: Listener fires every time the event occurs
- `once()`: Listener fires only the first time the event occurs, then removes itself

```typescript
// Fires every time a message is created
client.on('MESSAGE_CREATE', handler);

// Fires only once when bot becomes ready
client.once('READY', handler);
```

### Gateway Events Questions

#### Q: Which events are new in v2.0.0?

**A:** v2.0.0 adds 50+ new events including:
- Auto moderation events (`AUTO_MODERATION_*`)
- Thread events (`THREAD_*`)
- Stage instance events (`STAGE_INSTANCE_*`)
- Scheduled event events (`GUILD_SCHEDULED_EVENT_*`)
- Poll events (`MESSAGE_POLL_*`)
- And many more!

See [Gateway Events](Gateway-Events.md) for the complete list.

#### Q: How do I handle auto moderation events?

**A:**

```typescript
client.on('AUTO_MODERATION_ACTION_EXECUTION', (execution) => {
  console.log(`Auto mod rule "${execution.ruleName}" triggered`);
  console.log(`Action: ${execution.action.type}`);
  console.log(`User: ${execution.userId}`);
});

client.on('AUTO_MODERATION_RULE_CREATE', (rule) => {
  console.log(`New auto mod rule created: ${rule.name}`);
});
```

#### Q: How do I handle thread events?

**A:**

```typescript
client.on('THREAD_CREATE', (thread) => {
  console.log(`Thread created: ${thread.name}`);
  
  if (thread.isNewlyCreated) {
    // Auto-join the thread
    client.rest.put(`/channels/${thread.id}/thread-members/@me`);
  }
});

client.on('THREAD_MEMBER_UPDATE', (member) => {
  console.log(`Thread member updated: ${member.userId}`);
});
```

### Utility Structures Questions

#### Q: When should I use the utility structures?

**A:** Use utility structures for production bots:
- `AdvancedCache`: Better memory management and caching
- `AuditLogger`: Comprehensive logging and audit trails
- `MetricsCollector`: Performance monitoring and metrics
- `RateLimiter`: Prevent API rate limiting
- `PermissionCalculator`: Calculate complex permissions
- `WebhookManager`: Manage webhooks efficiently
- `FileUploadManager`: Handle file uploads with validation

#### Q: How do I use the AuditLogger?

**A:**

```typescript
import { AuditLogger, AuditLogCategory } from 'typicord';

const logger = new AuditLogger({
  maxEntries: 10000,
  retentionDays: 30
});

// Log different types of events
logger.info(AuditLogCategory.SYSTEM, 'Bot started');
logger.error(AuditLogCategory.ERROR, 'Database connection failed', error);
logger.logCommand('ping', userId, guildId, channelId, true);
logger.logModeration(userId, 'BAN', 'Spam', guildId, channelId, 'Excessive spam');

// Get audit logs
const recentLogs = logger.getRecentLogs(100);
const errorLogs = logger.getLogsByCategory(AuditLogCategory.ERROR);
```

#### Q: How do I monitor performance with MetricsCollector?

**A:**

```typescript
import { MetricsCollector } from 'typicord';

const metrics = new MetricsCollector();

// Register default bot metrics
metrics.registerBotMetrics();

// Custom metrics
metrics.incrementCounter('commands_executed', 1, { command: 'ping' });
metrics.setGauge('active_users', activeUserCount);
metrics.recordHistogram('command_duration', executionTime, { command: 'ping' });

// Get metrics
const allMetrics = metrics.getAllMetrics();
console.log('Command executions:', allMetrics.counters.get('commands_executed'));
```

### Development Questions

#### Q: How do I debug my bot?

**A:**

1. **Enable debug logging:**
```typescript
client.on('debug', (info) => {
  console.debug('Debug:', info);
});
```

2. **Use proper error handling:**
```typescript
client.on('error', (error) => {
  console.error('Client error:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});
```

3. **Monitor events:**
```typescript
// Log all events for debugging
const originalEmit = client.emit;
client.emit = function(event, ...args) {
  console.log(`Event: ${event}`, args.length > 0 ? 'with data' : 'no data');
  return originalEmit.call(this, event, ...args);
};
```

#### Q: How do I test my bot locally?

**A:**

1. **Create a test server:**
- Create a Discord server for testing
- Invite your bot with minimal permissions
- Test in isolation

2. **Use environment variables:**
```typescript
// .env
DISCORD_TOKEN_DEV=your_development_token
DISCORD_TOKEN_PROD=your_production_token
NODE_ENV=development

// bot.ts
const token = process.env.NODE_ENV === 'production' 
  ? process.env.DISCORD_TOKEN_PROD
  : process.env.DISCORD_TOKEN_DEV;
```

3. **Implement test commands:**
```typescript
client.on('MESSAGE_CREATE', (message) => {
  if (message.content === '!test' && message.author.id === 'YOUR_USER_ID') {
    // Test functionality
  }
});
```

#### Q: How do I deploy my bot to production?

**A:**

1. **Use process managers:**
```bash
# PM2
npm install -g pm2
pm2 start bot.js --name "discord-bot"

# Forever
npm install -g forever
forever start bot.js
```

2. **Docker deployment:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["node", "bot.js"]
```

3. **Environment configuration:**
```bash
# Production environment variables
export NODE_ENV=production
export DISCORD_TOKEN=your_production_token
export DATABASE_URL=your_database_url
```

### Troubleshooting Steps

#### When your bot isn't working:

1. **Check the basics:**
   - Bot token is correct
   - Bot is invited to the server
   - Bot has necessary permissions
   - Required intents are enabled

2. **Enable logging:**
   ```typescript
   client.on('error', console.error);
   client.on('warn', console.warn);
   client.on('debug', console.debug);
   ```

3. **Test minimal setup:**
   ```typescript
   const client = new Client(token, {
     intents: [GatewayIntentBits.GUILDS]
   });
   
   client.once('READY', (ready) => {
     console.log('✅ Bot is working!', ready.user.username);
   });
   
   client.connect();
   ```

4. **Check event names:**
   - Use SCREAMING_SNAKE_CASE (e.g., `MESSAGE_CREATE`)
   - Refer to [Gateway Events](Gateway-Events.md) for correct names

5. **Verify TypeScript setup:**
   ```typescript
   import type { MessageCreateEventData } from 'typicord';
   
   client.on('MESSAGE_CREATE', (message: MessageCreateEventData) => {
     // Proper typing
   });
   ```

## Getting Help

If you're still having issues:

1. **Check the documentation:**
   - [Installation and Setup](Installation-and-Setup.md)
   - [Enhanced Event System](Enhanced-Event-System.md)
   - [Gateway Events](Gateway-Events.md)
   - [Examples and Use Cases](Examples-and-Use-Cases.md)

2. **Search existing issues:**
   - [GitHub Issues](https://github.com/NotKeira/Typicord/issues)
   - Check for similar problems and solutions

3. **Create a new issue:**
   - Provide your code (remove sensitive tokens)
   - Include error messages
   - Specify your environment (Node.js version, OS, etc.)
   - Describe expected vs actual behavior

4. **Join the community:**
   - Discord server (if available)
   - GitHub Discussions

Remember to never share your bot token publicly! 🔒
