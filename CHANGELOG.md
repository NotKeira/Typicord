# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.2.1] - 2025-08-07

### Fixed
- Fixed TypeScript build errors related to incorrect type imports
- Resolved `GuildMember` import issue in `GUILD_MEMBERS_CHUNK.ts` - now correctly imports from `@/structures/GuildMember`
- Fixed type compatibility issues in thread-related events by using proper type imports:
  - `THREAD_CREATE.ts`: Changed to import `ThreadMember` from `@/types/structures/channel`
  - `THREAD_LIST_SYNC.ts`: Fixed imports and corrected property access from `parentId` to `parent_id`
  - `THREAD_MEMBERS_UPDATE.ts`: Updated to use correct `ThreadMember` type import
- Resolved DTS build errors caused by mixing class imports with interface types
- Ensured consistent type usage across event handlers for better type safety

## [3.2.0] - 2025-08-07

### Added
- **Enhanced Event System**: Event data now provides full class functionality instead of raw interfaces
- **Complete User Class**: Added all missing User methods including `avatarDecorationURL`, `bannerURL`, `createDM`, `deleteDM`, `displayAvatarURL`, `equals`, `fetch`, `fetchFlags`, `send`, `toJSON`, `toString`, `valueOf`
- **New GuildMember Class**: Full-featured GuildMember wrapper with methods for member management, role operations, timeouts, kicks, bans, and voice control
- **Improved Type System**: Resolved User type conflicts between different interface definitions
- **Event Data Enhancement**: Updated GUILD_MEMBER_ADD, GUILD_MEMBER_UPDATE, and MESSAGE_CREATE events to return class instances with full method access

### Fixed
- Fixed type conflicts where `User$1` and `User$2` errors occurred in event handlers
- Resolved event system returning raw interfaces instead of class instances
- Fixed missing methods in User class that users expected from event data
- Corrected GuildMember event data to provide access to full User class functionality

### Changed
- **Breaking**: Event data objects now return class instances instead of raw interfaces
- `member.user` in events now provides full User class with all methods
- `message.author` now provides full User class functionality
- Enhanced all guild member events to use proper GuildMember class wrapper

### Removed
- Removed example bots and test files to clean up repository for production use
- Cleaned up development artifacts and benchmarks

## [3.1.2] - 2025-08-06

### Fixed
- Fixed duplicate `getStats` methods in ShardManager causing TypeScript compilation errors
- Completed shard-to-client event communication pipeline
- Added proper gateway packet processing in Client class
- Resolved build errors and ensured clean TypeScript compilation

### Added
- Added `handleGatewayPacket` method for processing Discord gateway events
- Enhanced event forwarding from shards through ShardManager to Client
- Added debug logging for shard event processing

## [3.1.1] - 2025-08-06

### Added
- Added backwards compatibility methods for gateway access
  - `client.gateway` property as alias for `client.shards`
  - `getWebSocketLatency()` method for retrieving average shard latency
  
### Fixed
- Fixed missing gateway property access in client for backwards compatibility
- Resolved WebSocket latency retrieval for existing code patterns
- Updated event type exports and gateway events interface

## [3.0.0] - 2025-08-06

### Added
- **Enterprise-Grade Sharding System**: Production-ready multi-shard architecture
  - `ShardManager`: Coordinated management of multiple WebSocket connections
  - `Shard`: Individual shard management with automatic reconnection and heartbeat handling
  - Automatic shard discovery and load balancing for large Discord bots
  - Session resumption and comprehensive error recovery
  - Support for horizontal scaling across multiple processes
  - Real-time shard health monitoring and statistics

- **Advanced Rate Limiting**: Discord API compliant rate limiting system
  - `RateLimitManager`: Bucket-based rate limiting following Discord's official guidelines
  - Global rate limit detection and handling
  - Request queueing with priority management and automatic retry logic
  - Per-route rate limit tracking with proactive limit avoidance
  - Integration with RESTClient for seamless API compliance

- **Enhanced Client Architecture**: Enterprise-ready Discord bot framework
  - Updated `Client` class with sharding and rate limiting integration
  - Support for enterprise configuration options (shard count, distribution, etc.)
  - Graceful scaling for production environments with 10,000+ guilds
  - Comprehensive monitoring and observability features

- **Production Examples and Documentation**:
  - `examples/enterprise-bot.ts`: Complete enterprise bot implementation
  - Best practices for different bot scales (small, medium, large, enterprise)
  - Migration guide from basic to enterprise setup

### Changed
- **BREAKING**: Event class naming convention updated across all event types
  - All event classes renamed from `EventTypeEventData` to `EventTypeData` format
  - Examples: `MessageCreateEventData` → `MessageCreateData`, `GuildCreateEventData` → `GuildCreateData`
  - This affects all 59+ event classes for consistency and better naming convention
  - Updated imports and references throughout the codebase

- **Client Architecture Overhaul**:
  - Replaced single `GatewayClient` with enterprise `ShardManager` system
  - Enhanced constructor to accept sharding configuration options
  - Updated connection, disconnection, and destroy methods for multi-shard support

- **RESTClient Enhancement**:
  - Integrated with `RateLimitManager` for advanced rate limiting
  - Improved error handling and retry logic
  - Better support for high-volume API usage

### Removed
- Legacy single-connection gateway implementation (replaced by sharding system)
- Basic rate limiting (replaced by enterprise-grade bucket system)

### Technical Improvements
- Zero compilation errors across all new enterprise systems
- Comprehensive TypeScript typing for all new features
- Discord API compliance for production bot deployments
- Optimized memory usage and connection pooling
- Enhanced error handling and automatic recovery mechanisms

### Migration Notes
- Bots using basic `Client` constructor will continue to work with single shard
- For enterprise features, use new constructor options: `new Client(token, intents, { shardCount: 4 })`
- Event handler code remains unchanged despite internal class renames

## [2.0.0] - 2025-08-05

### Added
- **Enhanced Event System**: Complete Discord.js-like event handling with TypeScript support
  - `TypedEventEmitter` class with `on()`, `once()`, `off()`, `waitFor()` methods
  - `EnhancedClient` base class with static `once()` method
  - `ClientEvents` interface extending TypicordEvents with client lifecycle events
- **Comprehensive Gateway Events**: Support for all modern Discord gateway events
  - Auto moderation events (rule create/update/delete, action execution)
  - Stage instance events (create/update/delete) 
  - Guild scheduled events (create/update/delete/user_add/user_remove)
  - Thread events (create/update/delete/list_sync/member_update/members_update)
  - Poll events (vote_add/vote_remove)
  - Entitlement events (create/update/delete)
  - Integration events (create/update/delete)
  - Guild management events (ban_add/remove, member_*, role_*, emojis_update, stickers_update)
  - Channel & messaging events (pins_update, delete_bulk)
  - Invite events (create/delete)
  - Voice & webhook events (server_update, webhooks_update)
  - Application command permission updates
- **Advanced Utility Structures**: Production-ready utility classes
  - `AdvancedCache`: TTL-based caching with LRU eviction and memory management
  - `AuditLogger`: Comprehensive audit logging with filtering, search, and export
  - `FileUploadManager`: File attachment handling with Discord API integration
  - `MetricsCollector`: Performance monitoring with Prometheus export support
  - `PermissionCalculator`: Discord permission utilities with bitfield operations
  - `RateLimiter`: Advanced rate limiting for Discord API compliance
  - `WebhookManager`: Complete webhook management with execution and editing

### Changed
- **BREAKING**: Client now extends `EnhancedClient` instead of basic EventEmitter
- Refactored `emitRaw` method with efficient event mapping (replaces large switch statement)
- Enhanced gateway handlers with better connection handling and reliability
- Improved component builders with additional Discord component support
- Enhanced embed structure with more customization options
- Updated CI workflow for automated publishing
- Better error handling and TypeScript support across all components

### Fixed
- Resolved linting warnings in Client.ts (reduced switch statement complexity)
- Removed unnecessary type assertions throughout codebase
- Improved memory management in event handling

## [1.9.2] - 2025-08-05

### Added
- Comprehensive type definitions directly in structure files for better accessibility
- `PartialUser` interface in User structure
- `GuildMember`, `WelcomeScreen`, `WelcomeScreenChannel`, and `Sticker` interfaces in Guild structure
- `ThreadMetadata`, `ThreadMember`, `ForumTag`, `DefaultReaction`, and `PermissionOverwrite` interfaces in Channel structure
- `MessageReference`, `MessageActivity`, `Attachment`, and `MessageType` enum in Message structure
- `InteractionCallbackType` enum, `AllowedMentions`, and `ApplicationCommandOptionChoice` interfaces in Interaction structure

### Changed
- Reorganised main export structure with clear section comments (Clients, Gateway, Event, Structures, Cache)
- Updated type exports to use structure files instead of separate type files
- Improved overall export organisation and readability
- Consolidated all important type definitions within their respective structure files

### Fixed
- Missing `GuildMember` type export that was preventing proper TypeScript usage
- Export conflicts by moving type definitions to structure files
- Eliminated need for separate type imports by consolidating everything in structures

This release significantly improves the developer experience by making all types directly available
from their respective structure imports, eliminating the confusion around missing exports like `GuildMember`.

## [1.9.1] - 2025-08-03

### Fixed
- CI pipeline configuration issues with pnpm commands
- ESLint configuration for benchmark files with proper TypeScript project inclusion
- GitHub Actions workflows now use correct `pnpm run ci` instead of non-existent `pnpm ci`
- Removed unsupported `--dry-run` flag from pnpm pack command
- Removed `--frozen-lockfile` flags to avoid lockfile mismatch issues
- Added proper ESLint rules for benchmark files (disabled no-unused-expressions and no-loss-of-precision)
- Security improvements by removing Discord tokens from test files

### Changed
- Updated tsconfig.json to include benchmarks directory
- Enhanced workflow reliability with proper dependency installation
- Improved ESLint configuration for different file types (tests, examples, benchmarks)

## [1.9.0] - 2025-08-03

### Added
- Comprehensive example implementations demonstrating progressive complexity
- Professional README with complete documentation overhaul
- Automated npm publishing workflow with GitHub Actions
- Apache 2.0 license migration for better patent protection
- Improved test reliability with proper exit code handling

### Changed
- Migrated from MIT to Apache License 2.0 for enhanced legal protection
- Updated all package scripts to use 'pnpm tsx' instead of direct tsx
- Enhanced test files with proper Promise handling and graceful shutdown
- Updated .gitignore to include test files in repository
- Professional documentation structure with API reference and contribution guidelines

### Added Examples
- basic-bot.ts: Simple message handling with ping/echo commands
- guild-management.ts: Guild events, caching, and server management
- slash-commands.ts: Interaction handling and command responses
- All examples include proper TypeScript typing and error handling

### Infrastructure
- GitHub Actions workflow for automated npm publishing on version tags
- CI pipeline with build, quality checks, tests, and benchmarks
- npm provenance for enhanced package security and transparency
- Environment variable support for skipping integration tests in CI
- Automatic GitHub release creation with changelog links

### Documentation
- Complete README overhaul with professional structure
- Comprehensive API reference with code examples
- Development setup instructions and contribution guidelines
- Feature highlights and examples table with complexity ratings
- Debug system documentation with environment variable usage

## [1.8.2] - 2025-08-03

### Changed
- Enhanced TypeScript configuration with stricter type checking
- Updated tsup.config.ts for better build optimisation and type generation
- Improved benchmark files with proper typing and performance tests
- Updated .gitignore for better file exclusion patterns
- Enhanced pnpm workspace configuration
- Updated generated typings structure

### Removed
- Removed obsolete TODO.md file

## [1.8.1] - 2025-08-03

### Added
- Comprehensive documentation and example implementations
- DEBUG.md with detailed debugging guide and environment variable usage
- advanced-bot.ts example showcasing complex bot patterns
- components-v2-demo.ts for Discord components interaction examples
- debug-example.ts demonstrating debug system usage
- simple-enhanced-bot.ts as improved basic bot template
- Updated documentation structure for better developer experience

## [1.8.0] - 2025-08-03

### Added
- Client.once() method for one-time event listening with automatic cleanup
- Extended EventEmitter with once() functionality and proper listener management
- emitRaw() internal method for gateway to emit raw Discord data
- Automatic event data wrapping in Client.emit() for user-friendly API

### Changed
- Enhanced RESTClient with improved error handling and type safety
- Updated Client import/export structure for better modularity

## [1.7.0] - 2025-08-03

### Added
- Modular, scalable Gateway dispatch event handler system
- DispatchHandlerRegistry for centralised event handler management
- Individual handler files (ready.ts, messageCreate.ts, guildCreate.ts, etc.)
- Dynamic handler registration via registerDispatchHandler()
- Plugin-based architecture support with expandable registry
- Strong TypeScript typing for known gateway events
- Automatic handler lookup and invocation with error handling
- Warning logs for unhandled events

### Changed
- Updated GatewayClient to use modular dispatch system instead of hardcoded handlers

## [1.6.0] - 2025-08-03

### Added
- Dynamic event system with Events namespace export
- Individual event files for all Discord Gateway events (READY, MESSAGE_CREATE, etc.)
- Wrapper classes for each event type (ReadyEventData, MessageCreateEventData, etc.)
- Events namespace for clean user API: `import { Events } from 'typicord'`
- Structured event data access with getter methods and TypeScript safety

### Changed
- Updated main index.ts to export Events namespace

## [1.5.0] - 2025-08-03

### Added
- Comprehensive TypeScript type safety overhaul
- Complete type definitions for all Discord structures (guild, channel, user, message, etc.)
- GuildMember type and proper guild structure types
- Interaction, role, emoji, and REST API type definitions

### Changed
- Replaced all 'any' types with proper Discord API type definitions
- Enhanced Message, Guild, Channel, and other structure classes with proper typing

## [1.4.4] - 2025-08-03

### Added
- TYPI_DEBUG environment variable debug system
- Namespace-based debug logging with conditional output
- Support for TYPI_DEBUG=* for all namespaces or specific filtering
- Gateway, events, heartbeat, and interaction debug namespaces
- Structured logging for development and troubleshooting

## Key Features Added in This Release Cycle

### 🔧 Debug System
- Environment variable-based debugging with `TYPI_DEBUG`
- Namespace filtering for targeted debugging
- Structured logging for better development experience

### 🛡️ Type Safety
- Complete elimination of 'any' types
- Comprehensive Discord API type definitions
- Full TypeScript safety across all structures

### 🎯 Event System
- Individual event files for each Discord Gateway event
- Clean Events namespace export
- User-friendly event data wrapper classes
- Type-safe event handling

### 🔌 Modular Architecture
- Plugin-based gateway event handler system
- Dynamic handler registration
- Scalable dispatch system
- Clean separation of concerns

### 🚀 Enhanced Client
- One-time event listening with `client.once()`
- Automatic event data wrapping
- Improved error handling
- Better TypeScript integration

### 📚 Documentation
- Comprehensive debugging guide
- Multiple bot examples
- Component interaction demos
- Developer-friendly documentation structure
