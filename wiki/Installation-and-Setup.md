# Installation and Setup

This guide covers installation and basic setup of Typicord v2.0.0.

## Requirements

- **Node.js**: 16.0.0 or higher
- **TypeScript**: 4.5.0 or higher (optional but recommended)
- **Discord Bot Token**: Required for connecting to Discord

## Installation

### Using npm

```bash
npm install typicord
```

### Using pnpm (recommended)

```bash
pnpm add typicord
```

### Using yarn

```bash
yarn add typicord
```

## Basic Setup

### 1. Import Typicord

```typescript
// TypeScript/ESM
import { Client, GatewayIntentBits } from 'typicord';

// CommonJS
const { Client, GatewayIntentBits } = require('typicord');
```

### 2. Create a Client

```typescript
const client = new Client('YOUR_BOT_TOKEN', {
  intents: [
    GatewayIntentBits.GUILDS,
    GatewayIntentBits.GUILD_MESSAGES,
    GatewayIntentBits.MESSAGE_CONTENT
  ]
});
```

### 3. Add Event Listeners

```typescript
client.on('READY', (ready) => {
  console.log(`Logged in as ${ready.user.username}!`);
});

client.on('MESSAGE_CREATE', (message) => {
  if (message.isFromBot) return;
  
  if (message.content === '!ping') {
    // Reply to the message
    message.reply('Pong!');
    // or
    
    client.rest.post(`/channels/${message.channelId}/messages`, {
      body: { content: 'Pong!' }
    });
  }
});
```
### 4. Connect to Discord

```typescript
client.connect().catch(console.error);
```

## Complete Basic Example

Here's a complete basic bot setup:

```typescript
import { Client, GatewayIntentBits } from 'typicord';

const client = new Client('YOUR_BOT_TOKEN', {
  intents: [
    GatewayIntentBits.GUILDS,
    GatewayIntentBits.GUILD_MESSAGES,
    GatewayIntentBits.MESSAGE_CONTENT
  ]
});

client.on('READY', (ready) => {
  console.log(`🤖 Bot ready! Logged in as ${ready.user.username}`);
  console.log(`📊 Connected to ${ready.guilds.length} guilds`);
});

client.on('MESSAGE_CREATE', async (message) => {
  // Ignore bot messages
  if (message.isFromBot) return;
  
  // Basic ping command
  if (message.content === '!ping') {
    try {
      await client.rest.post(`/channels/${message.channelId}/messages`, {
        body: { 
          content: `🏓 Pong! Latency: ${client.gateway.latency}ms` 
        }
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }
  
  // Info command
  if (message.content === '!info') {
    const embed = {
      title: 'Bot Information',
      color: 0x5865F2,
      fields: [
        {
          name: 'Latency',
          value: `${client.gateway.latency}ms`,
          inline: true
        },
        {
          name: 'Uptime',
          value: formatUptime(process.uptime()),
          inline: true
        }
      ],
      timestamp: new Date().toISOString()
    };
    
    try {
      await client.rest.post(`/channels/${message.channelId}/messages`, {
        body: { embeds: [embed] }
      });
    } catch (error) {
      console.error('Failed to send embed:', error);
    }
  }
});

client.on('error', (error) => {
  console.error('❌ Client error:', error);
});

client.on('warn', (warning) => {
  console.warn('⚠️ Client warning:', warning);
});

// Helper function
function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${hours}h ${minutes}m ${secs}s`;
}

// Start the bot
client.connect().catch(console.error);
```

## Advanced Setup

### Using Environment Variables

For better security, use environment variables:

```typescript
// .env file
DISCORD_TOKEN=your_bot_token_here
NODE_ENV=production

// bot.ts
import 'dotenv/config';
import { Client, GatewayIntentBits } from 'typicord';

const client = new Client(process.env.DISCORD_TOKEN!, {
  intents: [
    GatewayIntentBits.GUILDS,
    GatewayIntentBits.GUILD_MESSAGES,
    GatewayIntentBits.MESSAGE_CONTENT
  ]
});
```

### TypeScript Configuration

Create a `tsconfig.json` for better TypeScript support:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Package.json Scripts

Add useful scripts to your `package.json`:

```json
{
  "name": "my-discord-bot",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/bot.ts",
    "build": "tsc",
    "start": "node dist/bot.js",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  },
  "dependencies": {
    "typicord": "^2.0.0",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

## Gateway Intents

Gateway intents control what events your bot can receive. Choose only the intents you need:

### Common Intents

```typescript
import { GatewayIntentBits } from 'typicord';

const client = new Client(token, {
  intents: [
    // Required for basic guild operations
    GatewayIntentBits.GUILDS,
    
    // For receiving messages
    GatewayIntentBits.GUILD_MESSAGES,
    GatewayIntentBits.DIRECT_MESSAGES,
    
    // For reading message content (privileged)
    GatewayIntentBits.MESSAGE_CONTENT,
    
    // For member-related events
    GatewayIntentBits.GUILD_MEMBERS,
    
    // For presence updates
    GatewayIntentBits.GUILD_PRESENCES,
    
    // For reaction events
    GatewayIntentBits.GUILD_MESSAGE_REACTIONS,
    GatewayIntentBits.DIRECT_MESSAGE_REACTIONS,
    
    // For voice state updates
    GatewayIntentBits.GUILD_VOICE_STATES,
    
    // For typing indicators
    GatewayIntentBits.GUILD_MESSAGE_TYPING,
    GatewayIntentBits.DIRECT_MESSAGE_TYPING
  ]
});
```

### Privileged Intents

Some intents require approval from Discord:

```typescript
// These require verification for bots in 100+ servers
const privilegedIntents = [
  GatewayIntentBits.GUILD_MEMBERS,    // Member join/leave/update events
  GatewayIntentBits.GUILD_PRESENCES,  // User presence/status updates
  GatewayIntentBits.MESSAGE_CONTENT   // Access to message content
];
```

Enable privileged intents in the [Discord Developer Portal](https://discord.com/developers/applications).

### Intent Calculator

Use this helper to calculate intents:

```typescript
function calculateIntents(...intents: number[]): number {
  return intents.reduce((acc, intent) => acc | intent, 0);
}

const myIntents = calculateIntents(
  GatewayIntentBits.GUILDS,
  GatewayIntentBits.GUILD_MESSAGES,
  GatewayIntentBits.MESSAGE_CONTENT
);

const client = new Client(token, { intents: myIntents });
```

## Error Handling

Implement comprehensive error handling:

```typescript
client.on('error', (error) => {
  console.error('❌ Client error:', error);
  
  // Log to file or external service
  // logError(error);
});

client.on('warn', (warning) => {
  console.warn('⚠️ Client warning:', warning);
});

client.on('debug', (info) => {
  if (process.env.NODE_ENV === 'development') {
    console.debug('🐛 Debug:', info);
  }
});

// Handle unhandled promises
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
```

## Graceful Shutdown

Implement graceful shutdown:

```typescript
async function shutdown() {
  console.log('🔄 Shutting down gracefully...');
  
  try {
    await client.disconnect();
    console.log('✅ Bot disconnected successfully');
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
  }
  
  process.exit(0);
}

// Handle shutdown signals
process.on('SIGINT', shutdown);  // Ctrl+C
process.on('SIGTERM', shutdown); // Termination signal
```

## Testing Your Setup

Test your bot setup with this checklist:

### 1. Connection Test

```typescript
client.once('READY', (ready) => {
  console.log('✅ Connection successful');
  console.log(`📊 Bot: ${ready.user.username}#${ready.user.discriminator}`);
  console.log(`🏢 Guilds: ${ready.guilds.length}`);
});
```

### 2. Message Test

```typescript
client.on('MESSAGE_CREATE', (message) => {
  if (message.content === '!test' && !message.isFromBot) {
    console.log('✅ Message event working');
  }
});
```

### 3. Error Test

```typescript
client.on('error', (error) => {
  console.log('✅ Error handling working:', error.message);
});
```

## Next Steps

After basic setup:

1. 📖 Read the [Enhanced Event System](Enhanced-Event-System.md) guide
2. 🎯 Explore [Gateway Events](Gateway-Events.md) for advanced features
3. 🛠️ Check out [Utility Structures](Utility-Structures.md) for production features
4. 📚 Browse [Examples](examples/) for practical implementations
5. 🔄 Review [Migration Guide](Migration-Guide.md) if upgrading from v1.x

## Common Issues

### Issue: Bot Not Responding

**Symptoms**: Bot connects but doesn't respond to messages.

**Solutions**:
1. Check intents include `MESSAGE_CONTENT`
2. Verify message event name is `MESSAGE_CREATE`
3. Ensure bot has permission to read messages
4. Check if filtering bot messages correctly

### Issue: Permission Errors

**Symptoms**: API calls fail with permission errors.

**Solutions**:
1. Verify bot has necessary permissions in Discord
2. Check role hierarchy (bot role above target roles)
3. Ensure bot is in the guild/channel

### Issue: Rate Limiting

**Symptoms**: Messages fail to send or bot gets rate limited.

**Solutions**:
1. Implement proper rate limiting
2. Use the built-in `RateLimiter` utility
3. Add delays between API calls

## Development vs Production

### Development Setup

```typescript
// Enable debug logging
client.on('debug', console.debug);

// More detailed error logging
client.on('error', (error) => {
  console.error('Full error details:', error);
});

// Hot reload with tsx
// npm run dev
```

### Production Setup

```typescript
// Minimal logging
client.on('error', (error) => {
  logger.error('Client error:', error.message);
});

// Performance monitoring
const metrics = new MetricsCollector();
metrics.registerBotMetrics();

// Health checks
setInterval(() => {
  if (client.gateway.isConnected) {
    // Report healthy status
  }
}, 30000);
```

You're now ready to build amazing Discord bots with Typicord v2.0.0! 🚀
