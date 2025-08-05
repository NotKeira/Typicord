# Examples and Use Cases

This page provides practical examples and common use cases for Typicord v2.0.0.

## Table of Contents

- [Basic Bot Examples](#basic-bot-examples)
- [Advanced Event Handling](#advanced-event-handling)
- [Command Systems](#command-systems)
- [Moderation Bots](#moderation-bots)
- [Utility Bots](#utility-bots)
- [Gaming Bots](#gaming-bots)
- [Integration Examples](#integration-examples)
- [Production Patterns](#production-patterns)

## Basic Bot Examples

### Simple Ping Bot

```typescript
import { Client, GatewayIntentBits } from 'typicord';

const client = new Client(process.env.DISCORD_TOKEN!, {
  intents: [
    GatewayIntentBits.GUILDS,
    GatewayIntentBits.GUILD_MESSAGES,
    GatewayIntentBits.MESSAGE_CONTENT
  ]
});

client.on('READY', (ready) => {
  console.log(`🤖 ${ready.user.username} is ready!`);
});

client.on('MESSAGE_CREATE', async (message) => {
  if (message.isFromBot) return;
  
  if (message.content === '!ping') {
    const startTime = Date.now();
    
    const response = await client.rest.post(`/channels/${message.channelId}/messages`, {
      body: { content: 'Pinging...' }
    });
    
    const latency = Date.now() - startTime;
    
    await client.rest.patch(`/channels/${message.channelId}/messages/${response.id}`, {
      body: {
        content: `🏓 Pong! 
Gateway Latency: ${client.gateway.latency}ms
API Latency: ${latency}ms`
      }
    });
  }
});

client.connect();
```

### Welcome Bot

```typescript
import { Client, GatewayIntentBits } from 'typicord';

const client = new Client(process.env.DISCORD_TOKEN!, {
  intents: [
    GatewayIntentBits.GUILDS,
    GatewayIntentBits.GUILD_MEMBERS
  ]
});

client.on('GUILD_MEMBER_ADD', async (member) => {
  const welcomeChannelId = '123456789012345678'; // Your welcome channel ID
  
  const embed = {
    title: '👋 Welcome!',
    description: `Welcome to the server, <@${member.user.id}>!`,
    color: 0x00ff00,
    thumbnail: {
      url: `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`
    },
    fields: [
      {
        name: 'Member Count',
        value: `You are member #${member.guild.memberCount}`,
        inline: true
      },
      {
        name: 'Account Created',
        value: new Date(parseInt(member.user.id) / 4194304 + 1420070400000).toDateString(),
        inline: true
      }
    ],
    timestamp: new Date().toISOString()
  };
  
  await client.rest.post(`/channels/${welcomeChannelId}/messages`, {
    body: { embeds: [embed] }
  });
});

client.on('GUILD_MEMBER_REMOVE', async (member) => {
  const goodbyeChannelId = '123456789012345678'; // Your goodbye channel ID
  
  await client.rest.post(`/channels/${goodbyeChannelId}/messages`, {
    body: {
      content: `👋 **${member.user.username}** has left the server. We'll miss you!`
    }
  });
});

client.connect();
```

## Advanced Event Handling

### Event-Driven Architecture

```typescript
import { Client, GatewayIntentBits } from 'typicord';
import { EventEmitter } from 'events';

class BotEventHandler extends EventEmitter {
  constructor(private client: Client) {
    super();
    this.setupEventListeners();
  }
  
  private setupEventListeners() {
    // Message events
    this.client.on('MESSAGE_CREATE', this.handleMessage.bind(this));
    this.client.on('MESSAGE_REACTION_ADD', this.handleReactionAdd.bind(this));
    
    // Guild events
    this.client.on('GUILD_MEMBER_ADD', this.handleMemberJoin.bind(this));
    this.client.on('GUILD_MEMBER_REMOVE', this.handleMemberLeave.bind(this));
    
    // Moderation events
    this.client.on('GUILD_BAN_ADD', this.handleBanAdd.bind(this));
    this.client.on('CHANNEL_DELETE', this.handleChannelDelete.bind(this));
  }
  
  private async handleMessage(message) {
    if (message.isFromBot) return;
    
    // Emit custom events for different message types
    if (message.content.startsWith('!')) {
      this.emit('command', message);
    } else if (message.hasAttachments) {
      this.emit('attachment', message);
    } else if (message.mentions.length > 0) {
      this.emit('mention', message);
    }
    
    // Auto-delete messages with certain content
    if (this.containsProhibitedContent(message.content)) {
      this.emit('prohibited_content', message);
    }
  }
  
  private async handleReactionAdd(reaction) {
    // Role reactions
    if (reaction.emoji.name === '✅' && reaction.channelId === ROLES_CHANNEL_ID) {
      this.emit('role_reaction', reaction);
    }
    
    // Starboard
    if (reaction.emoji.name === '⭐' && reaction.count >= 3) {
      this.emit('starboard', reaction);
    }
  }
  
  private async handleMemberJoin(member) {
    this.emit('member_welcome', member);
    
    // Auto-role assignment
    if (this.shouldAssignAutoRole(member)) {
      this.emit('auto_role', member);
    }
  }
  
  private async handleMemberLeave(member) {
    this.emit('member_goodbye', member);
    
    // Log member leave for audit
    this.emit('member_audit', { type: 'leave', member });
  }
  
  private async handleBanAdd(ban) {
    this.emit('moderation_ban', ban);
  }
  
  private async handleChannelDelete(channel) {
    this.emit('channel_audit', { type: 'delete', channel });
  }
  
  private containsProhibitedContent(content: string): boolean {
    const prohibitedWords = ['spam', 'badword1', 'badword2'];
    return prohibitedWords.some(word => content.toLowerCase().includes(word));
  }
  
  private shouldAssignAutoRole(member): boolean {
    // Logic to determine if member should get auto role
    return !member.user.bot;
  }
}

// Usage
const client = new Client(process.env.DISCORD_TOKEN!, {
  intents: [
    GatewayIntentBits.GUILDS,
    GatewayIntentBits.GUILD_MESSAGES,
    GatewayIntentBits.MESSAGE_CONTENT,
    GatewayIntentBits.GUILD_MEMBERS,
    GatewayIntentBits.GUILD_MESSAGE_REACTIONS
  ]
});

const eventHandler = new BotEventHandler(client);

// Handle custom events
eventHandler.on('command', (message) => {
  console.log(`Command received: ${message.content}`);
});

eventHandler.on('starboard', async (reaction) => {
  // Add message to starboard
  console.log(`Message starred: ${reaction.messageId}`);
});

client.connect();
```

### Multi-Event Coordination

```typescript
import { Client, GatewayIntentBits } from 'typicord';

class MultiEventCoordinator {
  private pendingSetups = new Map();
  
  constructor(private client: Client) {
    this.setupEventListeners();
  }
  
  private setupEventListeners() {
    // Coordinate multiple events for server setup
    this.client.on('GUILD_CREATE', this.handleGuildJoin.bind(this));
    this.client.on('CHANNEL_CREATE', this.handleChannelCreate.bind(this));
    this.client.on('GUILD_ROLE_CREATE', this.handleRoleCreate.bind(this));
    this.client.on('MESSAGE_CREATE', this.handleSetupCommand.bind(this));
  }
  
  private async handleGuildJoin(guild) {
    console.log(`Joined guild: ${guild.name}`);
    
    // Wait for guild to be fully loaded
    await this.waitForGuildReady(guild.id);
    
    // Send setup instructions
    await this.sendSetupInstructions(guild);
  }
  
  private async handleSetupCommand(message) {
    if (message.content === '!setup' && message.member?.permissions.includes('ADMINISTRATOR')) {
      const guildId = message.guildId;
      
      this.pendingSetups.set(guildId, {
        channelId: message.channelId,
        userId: message.author.id,
        step: 'channels'
      });
      
      await this.startSetupProcess(guildId);
    }
  }
  
  private async startSetupProcess(guildId: string) {
    const setup = this.pendingSetups.get(guildId);
    if (!setup) return;
    
    await client.rest.post(`/channels/${setup.channelId}/messages`, {
      body: {
        content: '🔧 Starting server setup... Creating channels...',
        components: [{
          type: 1,
          components: [{
            type: 2,
            style: 2,
            label: 'Cancel Setup',
            custom_id: 'cancel_setup'
          }]
        }]
      }
    });
    
    // Create channels
    await this.createDefaultChannels(guildId);
  }
  
  private async createDefaultChannels(guildId: string) {
    const channels = [
      { name: 'welcome', type: 0 },
      { name: 'general', type: 0 },
      { name: 'announcements', type: 0 },
      { name: 'General Voice', type: 2 }
    ];
    
    for (const channel of channels) {
      await client.rest.post(`/guilds/${guildId}/channels`, {
        body: channel
      });
    }
    
    const setup = this.pendingSetups.get(guildId);
    if (setup) {
      setup.step = 'roles';
      await this.createDefaultRoles(guildId);
    }
  }
  
  private async createDefaultRoles(guildId: string) {
    const roles = [
      { name: 'Moderator', color: 0xff6b6b, permissions: '8' },
      { name: 'Member', color: 0x4ecdc4, permissions: '0' },
      { name: 'Muted', color: 0x95a5a6, permissions: '0' }
    ];
    
    for (const role of roles) {
      await client.rest.post(`/guilds/${guildId}/roles`, {
        body: role
      });
    }
    
    await this.completeSetup(guildId);
  }
  
  private async completeSetup(guildId: string) {
    const setup = this.pendingSetups.get(guildId);
    if (!setup) return;
    
    await client.rest.post(`/channels/${setup.channelId}/messages`, {
      body: {
        embeds: [{
          title: '✅ Server Setup Complete!',
          description: 'Your server has been configured with default channels and roles.',
          color: 0x00ff00,
          fields: [
            { name: 'Channels Created', value: '4 channels', inline: true },
            { name: 'Roles Created', value: '3 roles', inline: true },
            { name: 'Next Steps', value: 'Customize permissions and settings as needed!' }
          ]
        }]
      }
    });
    
    this.pendingSetups.delete(guildId);
  }
  
  private async waitForGuildReady(guildId: string): Promise<void> {
    return new Promise((resolve) => {
      const checkReady = () => {
        // Check if guild is fully loaded
        setTimeout(() => resolve(), 2000); // Simple timeout for demo
      };
      
      checkReady();
    });
  }
  
  private async sendSetupInstructions(guild) {
    // Find a channel to send instructions to
    const channels = await client.rest.get(`/guilds/${guild.id}/channels`);
    const textChannel = channels.find(c => c.type === 0);
    
    if (textChannel) {
      await client.rest.post(`/channels/${textChannel.id}/messages`, {
        body: {
          embeds: [{
            title: '👋 Thanks for adding me!',
            description: 'Type `!setup` to automatically configure your server with default channels and roles.',
            color: 0x5865f2
          }]
        }
      });
    }
  }
}

const coordinator = new MultiEventCoordinator(client);
```

## Command Systems

### Simple Command Handler

```typescript
import { Client, GatewayIntentBits } from 'typicord';

interface Command {
  name: string;
  description: string;
  aliases?: string[];
  cooldown?: number;
  permissions?: string[];
  execute: (message: any, args: string[]) => Promise<void>;
}

class CommandHandler {
  private commands = new Map<string, Command>();
  private cooldowns = new Map<string, Map<string, number>>();
  
  constructor(private client: Client) {
    this.setupCommands();
    this.client.on('MESSAGE_CREATE', this.handleMessage.bind(this));
  }
  
  private setupCommands() {
    const commands: Command[] = [
      {
        name: 'ping',
        description: 'Check bot latency',
        cooldown: 5,
        execute: async (message, args) => {
          await client.rest.post(`/channels/${message.channelId}/messages`, {
            body: { content: `🏓 Pong! Latency: ${client.gateway.latency}ms` }
          });
        }
      },
      {
        name: 'userinfo',
        description: 'Get information about a user',
        aliases: ['ui', 'user'],
        execute: async (message, args) => {
          const userId = args[0]?.replace(/[<@!>]/g, '') || message.author.id;
          const user = await client.rest.get(`/users/${userId}`);
          
          const embed = {
            title: `User Info: ${user.username}`,
            thumbnail: { url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` },
            fields: [
              { name: 'ID', value: user.id, inline: true },
              { name: 'Created', value: new Date(parseInt(user.id) / 4194304 + 1420070400000).toDateString(), inline: true },
              { name: 'Bot', value: user.bot ? 'Yes' : 'No', inline: true }
            ],
            color: 0x5865f2
          };
          
          await client.rest.post(`/channels/${message.channelId}/messages`, {
            body: { embeds: [embed] }
          });
        }
      },
      {
        name: 'serverinfo',
        description: 'Get server information',
        aliases: ['si', 'guild'],
        execute: async (message, args) => {
          const guild = await client.rest.get(`/guilds/${message.guildId}`);
          
          const embed = {
            title: guild.name,
            thumbnail: { url: `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` },
            fields: [
              { name: 'Owner', value: `<@${guild.owner_id}>`, inline: true },
              { name: 'Members', value: guild.approximate_member_count?.toString() || 'Unknown', inline: true },
              { name: 'Created', value: new Date(parseInt(guild.id) / 4194304 + 1420070400000).toDateString(), inline: true },
              { name: 'Verification Level', value: guild.verification_level.toString(), inline: true },
              { name: 'Boost Tier', value: guild.premium_tier.toString(), inline: true },
              { name: 'Boost Count', value: guild.premium_subscription_count?.toString() || '0', inline: true }
            ],
            color: 0x5865f2
          };
          
          await client.rest.post(`/channels/${message.channelId}/messages`, {
            body: { embeds: [embed] }
          });
        }
      }
    ];
    
    // Register commands
    commands.forEach(cmd => {
      this.commands.set(cmd.name, cmd);
      cmd.aliases?.forEach(alias => this.commands.set(alias, cmd));
    });
  }
  
  private async handleMessage(message) {
    if (message.isFromBot || !message.content.startsWith('!')) return;
    
    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();
    
    if (!commandName) return;
    
    const command = this.commands.get(commandName);
    if (!command) return;
    
    // Check cooldown
    if (!this.cooldowns.has(command.name)) {
      this.cooldowns.set(command.name, new Map());
    }
    
    const now = Date.now();
    const timestamps = this.cooldowns.get(command.name)!;
    const cooldownAmount = (command.cooldown || 3) * 1000;
    
    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id)! + cooldownAmount;
      
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        await client.rest.post(`/channels/${message.channelId}/messages`, {
          body: { content: `⏰ Please wait ${timeLeft.toFixed(1)} more seconds before reusing the \`${command.name}\` command.` }
        });
        return;
      }
    }
    
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    
    // Execute command
    try {
      await command.execute(message, args);
    } catch (error) {
      console.error(`Error executing command ${command.name}:`, error);
      await client.rest.post(`/channels/${message.channelId}/messages`, {
        body: { content: '❌ There was an error executing this command!' }
      });
    }
  }
}

const commandHandler = new CommandHandler(client);
```

### Slash Command Handler

```typescript
import { Client, GatewayIntentBits } from 'typicord';

class SlashCommandHandler {
  constructor(private client: Client) {
    this.registerCommands();
    this.client.on('INTERACTION_CREATE', this.handleInteraction.bind(this));
  }
  
  private async registerCommands() {
    const commands = [
      {
        name: 'ping',
        description: 'Check bot latency'
      },
      {
        name: 'echo',
        description: 'Echo a message',
        options: [
          {
            name: 'message',
            description: 'Message to echo',
            type: 3, // STRING
            required: true
          }
        ]
      },
      {
        name: 'ban',
        description: 'Ban a user',
        default_member_permissions: '4', // BAN_MEMBERS
        options: [
          {
            name: 'user',
            description: 'User to ban',
            type: 6, // USER
            required: true
          },
          {
            name: 'reason',
            description: 'Reason for ban',
            type: 3, // STRING
            required: false
          }
        ]
      }
    ];
    
    // Register commands globally
    await client.rest.put('/applications/@me/commands', { body: commands });
  }
  
  private async handleInteraction(interaction) {
    if (interaction.type !== 2) return; // APPLICATION_COMMAND
    
    const { data } = interaction;
    
    switch (data.name) {
      case 'ping':
        await this.respondToPing(interaction);
        break;
      case 'echo':
        await this.respondToEcho(interaction);
        break;
      case 'ban':
        await this.respondToBan(interaction);
        break;
    }
  }
  
  private async respondToPing(interaction) {
    await client.rest.post(`/interactions/${interaction.id}/${interaction.token}/callback`, {
      body: {
        type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
        data: {
          content: `🏓 Pong! Latency: ${client.gateway.latency}ms`
        }
      }
    });
  }
  
  private async respondToEcho(interaction) {
    const message = interaction.data.options.find(opt => opt.name === 'message')?.value;
    
    await client.rest.post(`/interactions/${interaction.id}/${interaction.token}/callback`, {
      body: {
        type: 4,
        data: {
          content: message
        }
      }
    });
  }
  
  private async respondToBan(interaction) {
    const user = interaction.data.options.find(opt => opt.name === 'user')?.value;
    const reason = interaction.data.options.find(opt => opt.name === 'reason')?.value || 'No reason provided';
    
    try {
      await client.rest.put(`/guilds/${interaction.guild_id}/bans/${user}`, {
        body: { reason }
      });
      
      await client.rest.post(`/interactions/${interaction.id}/${interaction.token}/callback`, {
        body: {
          type: 4,
          data: {
            content: `✅ Successfully banned <@${user}> for: ${reason}`
          }
        }
      });
    } catch (error) {
      await client.rest.post(`/interactions/${interaction.id}/${interaction.token}/callback`, {
        body: {
          type: 4,
          data: {
            content: '❌ Failed to ban user. Check permissions and try again.',
            flags: 64 // EPHEMERAL
          }
        }
      });
    }
  }
}

const slashHandler = new SlashCommandHandler(client);
```

## Moderation Bots

### Auto-Moderation System

```typescript
import { Client, GatewayIntentBits, AuditLogger, AuditLogCategory } from 'typicord';

class AutoModerationBot {
  private logger = new AuditLogger();
  private warnCounts = new Map<string, number>();
  
  constructor(private client: Client) {
    this.setupModerationEvents();
  }
  
  private setupModerationEvents() {
    // Auto moderation events
    this.client.on('AUTO_MODERATION_ACTION_EXECUTION', this.handleAutoModAction.bind(this));
    this.client.on('MESSAGE_CREATE', this.handleMessage.bind(this));
    this.client.on('MESSAGE_UPDATE', this.handleMessageUpdate.bind(this));
    this.client.on('GUILD_MEMBER_ADD', this.handleMemberJoin.bind(this));
  }
  
  private async handleAutoModAction(execution) {
    const embed = {
      title: '🛡️ Auto Moderation Action',
      color: 0xff6b6b,
      fields: [
        { name: 'Rule', value: execution.ruleName, inline: true },
        { name: 'Action', value: execution.action.type, inline: true },
        { name: 'User', value: `<@${execution.userId}>`, inline: true },
        { name: 'Channel', value: `<#${execution.channelId}>`, inline: true },
        { name: 'Content', value: execution.content || 'N/A', inline: false }
      ],
      timestamp: new Date().toISOString()
    };
    
    // Log to moderation channel
    const modChannelId = '123456789012345678'; // Your mod channel
    await client.rest.post(`/channels/${modChannelId}/messages`, {
      body: { embeds: [embed] }
    });
    
    // Log to audit system
    this.logger.logModeration(
      execution.userId,
      'AUTO_MOD',
      execution.action.type,
      execution.guildId,
      execution.channelId,
      execution.ruleName
    );
  }
  
  private async handleMessage(message) {
    if (message.isFromBot) return;
    
    // Check for spam
    if (await this.isSpam(message)) {
      await this.handleSpam(message);
      return;
    }
    
    // Check for prohibited content
    if (this.containsProhibitedContent(message.content)) {
      await this.handleProhibitedContent(message);
      return;
    }
    
    // Check for excessive caps
    if (this.hasExcessiveCaps(message.content)) {
      await this.handleExcessiveCaps(message);
      return;
    }
    
    // Check for invite links
    if (this.containsInviteLinks(message.content)) {
      await this.handleInviteLinks(message);
      return;
    }
  }
  
  private async handleMessageUpdate(message) {
    // Handle edited messages that might violate rules
    if (this.containsProhibitedContent(message.content)) {
      await this.handleProhibitedContent(message, true);
    }
  }
  
  private async handleMemberJoin(member) {
    // Check for suspicious accounts
    const accountAge = Date.now() - parseInt(member.user.id) / 4194304 - 1420070400000;
    const dayInMs = 24 * 60 * 60 * 1000;
    
    if (accountAge < dayInMs * 7) { // Account less than 7 days old
      await this.flagSuspiciousAccount(member);
    }
    
    // Check username for prohibited content
    if (this.containsProhibitedContent(member.user.username)) {
      await this.handleProhibitedUsername(member);
    }
  }
  
  private async isSpam(message): Promise<boolean> {
    // Simple spam detection - check if user sent multiple messages quickly
    // In production, use more sophisticated spam detection
    return false; // Simplified for example
  }
  
  private containsProhibitedContent(content: string): boolean {
    const prohibitedWords = [
      'badword1', 'badword2', 'spam',
      // Add your prohibited words here
    ];
    
    return prohibitedWords.some(word => 
      content.toLowerCase().includes(word.toLowerCase())
    );
  }
  
  private hasExcessiveCaps(content: string): boolean {
    if (content.length < 10) return false;
    
    const capsCount = (content.match(/[A-Z]/g) || []).length;
    const capsPercentage = capsCount / content.length;
    
    return capsPercentage > 0.7; // More than 70% caps
  }
  
  private containsInviteLinks(content: string): boolean {
    const inviteRegex = /(discord\.gg|discordapp\.com\/invite|discord\.com\/invite)\/[a-zA-Z0-9]+/gi;
    return inviteRegex.test(content);
  }
  
  private async handleSpam(message) {
    // Delete message
    await client.rest.delete(`/channels/${message.channelId}/messages/${message.id}`);
    
    // Warn user
    await this.warnUser(message.author.id, message.guildId, 'Spam detected');
    
    // Log action
    this.logger.logModeration(
      message.author.id,
      'SPAM_DETECTION',
      'MESSAGE_DELETE',
      message.guildId,
      message.channelId,
      'Automatic spam detection'
    );
  }
  
  private async handleProhibitedContent(message, isEdit = false) {
    // Delete message
    await client.rest.delete(`/channels/${message.channelId}/messages/${message.id}`);
    
    // Send warning to user
    const warningEmbed = {
      title: '⚠️ Content Violation',
      description: 'Your message contained prohibited content and has been removed.',
      color: 0xff6b6b,
      footer: { text: 'Please review the server rules.' }
    };
    
    await client.rest.post(`/channels/${message.channelId}/messages`, {
      body: {
        content: `<@${message.author.id}>`,
        embeds: [warningEmbed]
      }
    });
    
    // Warn user
    await this.warnUser(message.author.id, message.guildId, 'Prohibited content');
  }
  
  private async handleExcessiveCaps(message) {
    // Delete message
    await client.rest.delete(`/channels/${message.channelId}/messages/${message.id}`);
    
    // Send gentle reminder
    await client.rest.post(`/channels/${message.channelId}/messages`, {
      body: {
        content: `<@${message.author.id}> Please avoid using excessive capital letters. Your message has been removed.`
      }
    });
  }
  
  private async handleInviteLinks(message) {
    // Delete message
    await client.rest.delete(`/channels/${message.channelId}/messages/${message.id}`);
    
    // Warn user
    await this.warnUser(message.author.id, message.guildId, 'Unauthorized invite link');
  }
  
  private async flagSuspiciousAccount(member) {
    const modChannelId = '123456789012345678'; // Your mod channel
    
    const embed = {
      title: '🚨 Suspicious Account Alert',
      description: `New member <@${member.user.id}> has a recently created account.`,
      color: 0xffa500,
      fields: [
        { name: 'User', value: `${member.user.username}#${member.user.discriminator}`, inline: true },
        { name: 'Account Created', value: new Date(parseInt(member.user.id) / 4194304 + 1420070400000).toDateString(), inline: true },
        { name: 'Joined', value: new Date().toISOString(), inline: true }
      ],
      thumbnail: { url: `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png` }
    };
    
    await client.rest.post(`/channels/${modChannelId}/messages`, {
      body: { embeds: [embed] }
    });
  }
  
  private async handleProhibitedUsername(member) {
    // Give user a temporary nickname
    await client.rest.patch(`/guilds/${member.guildId}/members/${member.user.id}`, {
      body: { nick: 'Please change your username' }
    });
    
    // Warn user via DM
    try {
      const dmChannel = await client.rest.post('/users/@me/channels', {
        body: { recipient_id: member.user.id }
      });
      
      await client.rest.post(`/channels/${dmChannel.id}/messages`, {
        body: {
          content: 'Your username contains prohibited content. Please change it to continue using the server.'
        }
      });
    } catch (error) {
      console.log('Could not DM user about username violation');
    }
  }
  
  private async warnUser(userId: string, guildId: string, reason: string) {
    const currentWarns = this.warnCounts.get(`${guildId}:${userId}`) || 0;
    const newWarnCount = currentWarns + 1;
    
    this.warnCounts.set(`${guildId}:${userId}`, newWarnCount);
    
    // Log warning
    this.logger.logModeration(userId, 'WARN', reason, guildId, null, `Warning ${newWarnCount}`);
    
    // Check if user should be punished
    if (newWarnCount >= 3) {
      await this.timeoutUser(userId, guildId, 'Too many warnings');
    } else if (newWarnCount >= 5) {
      await this.kickUser(userId, guildId, 'Excessive warnings');
    }
  }
  
  private async timeoutUser(userId: string, guildId: string, reason: string) {
    const timeoutUntil = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    await client.rest.patch(`/guilds/${guildId}/members/${userId}`, {
      body: {
        communication_disabled_until: timeoutUntil.toISOString()
      }
    });
    
    this.logger.logModeration(userId, 'TIMEOUT', reason, guildId, null, '10 minutes');
  }
  
  private async kickUser(userId: string, guildId: string, reason: string) {
    await client.rest.delete(`/guilds/${guildId}/members/${userId}`, {
      body: { reason }
    });
    
    this.logger.logModeration(userId, 'KICK', reason, guildId, null, reason);
  }
}

const moderationBot = new AutoModerationBot(client);
```

This is a comprehensive set of examples covering the most common use cases for Typicord v2.0.0. Each example demonstrates different aspects of the enhanced event system and shows how to build production-ready Discord bots.
