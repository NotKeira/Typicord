# Typicord

<div align="center">

![Typicord Logo](https://img.shields.io/badge/Typicord-TypeScript%20Discord%20Library-5865F2?style=for-the-badge&logo=discord&logoColor=white)

[![npm version](https://img.shields.io/npm/v/typicord?style=flat-square)](https://www.npmjs.com/package/typicord)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=flat-square)](LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/NotKeira/Typicord/ci.yml?style=flat-square)](https://github.com/NotKeira/Typicord/actions)

**A modern, type-safe Discord API wrapper built with TypeScript**

[Documentation](docs/) • [Examples](examples/) • [Changelog](CHANGELOG.md) • [Contributing](#contributing)

</div>

## ✨ Features

- **🔷 TypeScript-First**: Built from the ground up with TypeScript for complete type safety
- **🎯 Modern API**: Clean, intuitive interface designed for developer experience
- **🔧 Modular Design**: Extensible architecture with plugin support
- **🚀 High Performance**: Optimized with connection pooling and intelligent caching
- **🛡️ Robust Error Handling**: Comprehensive error handling with detailed logging
- **🔄 Auto-Reconnection**: Smart reconnection logic with exponential backoff
- **📊 Built-in Debugging**: Environment variable-based debug system (`TYPI_DEBUG`)
- **🎪 Event System**: Comprehensive event handling with `Events` namespace
- **⚡ Gateway Management**: Modular, scalable gateway event handler system

## 📋 Table of Contents

- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Examples](#-examples)
- [API Reference](#-api-reference)
- [Event System](#-event-system)
- [Debugging](#-debugging)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Installation

```bash
# Using npm
npm install typicord

# Using yarn
yarn add typicord

# Using pnpm
pnpm add typicord
```

## ⚡ Quick Start

```typescript
import { Client, GatewayIntentBits, Events } from 'typicord';

const client = new Client('YOUR_BOT_TOKEN', GatewayIntentBits.Guilds | GatewayIntentBits.GuildMessages);

client.on('READY', (ready: Events.Ready) => {
  console.log(`🚀 ${ready.user.username} is online!`);
});

client.on('MESSAGE_CREATE', (message: Events.MessageCreate) => {
  if (message.content === '!ping') {
    client.sendMessage(message.channelId, 'Pong! 🏓');
  }
});

client.connect();
```

## 📚 Examples

Explore our comprehensive examples covering various use cases:

| Example | Description | Complexity |
|---------|-------------|------------|
| **[Basic Bot](examples/basic-bot.ts)** | Simple message handling and commands | ⭐ Beginner |
| **[Advanced Bot](examples/advanced-bot.ts)** | Complex bot with multiple features | ⭐⭐⭐ Advanced |
| **[Slash Commands](examples/slash-commands.ts)** | Interaction handling and responses | ⭐⭐ Intermediate |
| **[Guild Management](examples/guild-management.ts)** | Guild events and server management | ⭐⭐ Intermediate |
| **[Components Demo](examples/components-v2-demo.ts)** | Buttons, select menus, and components | ⭐⭐⭐ Advanced |
| **[Debug Example](examples/debug-example.ts)** | Using the debug system effectively | ⭐ Beginner |
| **[Reconnection Demo](examples/reconnection-demo.ts)** | Connection resilience and recovery | ⭐⭐ Intermediate |

## 📖 API Reference

### Core Classes

#### `Client`
The main client class for interacting with Discord.

```typescript
const client = new Client(token: string, intents: number);

// Event handling
client.on(event: string, handler: Function);
client.once(event: string, handler: Function);

// Messaging
client.sendMessage(channelId: string, content: string, options?: MessageOptions);

// Guild operations
client.fetchGuild(guildId: string): Promise<Guild>;
client.fetchGuilds(options?: FetchGuildsOptions): Promise<Guild[]>;

// User operations
client.fetchUser(userId: string): Promise<User>;
client.createDM(userId: string): Promise<Channel>;

// Connection management
client.connect(): void;
client.disconnect(): void;
client.destroy(): void;
```

#### `GatewayIntentBits`
Constants for Discord Gateway intents.

```typescript
import { GatewayIntentBits } from 'typicord';

const intents = GatewayIntentBits.Guilds | 
                GatewayIntentBits.GuildMessages | 
                GatewayIntentBits.MessageContent;
```

## 🎪 Event System

Typicord provides a comprehensive event system with TypeScript support:

```typescript
import { Events } from 'typicord';

// All events are fully typed
client.on('READY', (event: Events.Ready) => {
  console.log(`Logged in as ${event.user.username}`);
  console.log(`Connected to ${event.guilds.length} guilds`);
});

client.on('MESSAGE_CREATE', (event: Events.MessageCreate) => {
  console.log(`New message: ${event.content} from ${event.author.username}`);
});

client.on('GUILD_CREATE', (event: Events.GuildCreate) => {
  console.log(`Joined guild: ${event.guild.name}`);
});
```

### Available Events

- `READY` - Bot is ready and connected
- `MESSAGE_CREATE` - New message received
- `MESSAGE_UPDATE` - Message was edited
- `MESSAGE_DELETE` - Message was deleted
- `GUILD_CREATE` - Joined a guild or guild became available
- `GUILD_UPDATE` - Guild was updated
- `GUILD_DELETE` - Left a guild or guild became unavailable
- `CHANNEL_CREATE` - Channel was created
- `CHANNEL_UPDATE` - Channel was updated
- `CHANNEL_DELETE` - Channel was deleted
- `INTERACTION_CREATE` - Slash command or component interaction
- `USER_UPDATE` - User was updated
- And many more...

## 🔍 Debugging

Typicord includes a powerful debugging system using environment variables:

```bash
# Enable all debug output
TYPI_DEBUG=* node your-bot.js

# Enable specific namespaces
TYPI_DEBUG=gateway,events node your-bot.js

# Available namespaces: gateway, events, heartbeat, interaction, rest
```

See our [Debug Guide](docs/DEBUG.md) for detailed information.

## 🏗️ Architecture

### Modular Gateway System

Typicord uses a modular dispatch handler system for scalability:

```typescript
import { dispatchHandlerRegistry } from 'typicord/gateway';

// Register custom event handlers
dispatchHandlerRegistry.registerDispatchHandler('CUSTOM_EVENT', (client, data) => {
  // Handle custom event
});
```

### Type Safety

All Discord API structures are fully typed:

- **Guilds**: Complete guild structure with members, roles, channels
- **Messages**: Full message data with embeds, attachments, reactions
- **Users**: User profiles with presence and activity data
- **Interactions**: Slash commands, buttons, select menus
- **Channels**: All channel types with proper inheritance

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow our coding standards
4. **Add tests**: Ensure your code is well-tested
5. **Commit your changes**: `git commit -m 'feat: add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Setup

```bash
# Clone the repository
git clone https://github.com/NotKeira/Typicord.git
cd Typicord

# Install dependencies
pnpm install

# Build the project
pnpm build

# Run tests
pnpm test

# Run benchmarks
pnpm benchmark
```

### Commit Convention

We use [Conventional Commits](https://conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ by [Keira Hopkins](https://keirahopkins.co.uk)
- Inspired by Discord.js
- Thanks to all contributors and users

---

<div align="center">

**[⬆ Back to Top](#typicord)**

Made with 💜 for the Discord developer community

</div>
