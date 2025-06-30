# TODO List

## Core Functionality

- [x] Implement proper error handling and custom error classes
- [x] Add rate limit handling for API requests
- [x] Create a REST API client class to handle HTTP requests
- [x] Add support for Discord API version configuration
- [x] Implement reconnection logic with exponential backoff
- [x] Add session resuming functionality with proper state management

## Gateway

- [x] Optimize gateway heartbeat and ws latency reporting (ACK-based, accurate getWebSocketLatency)
- [x] Add session resuming functionality
- [x] Implement proper reconnection logic with exponential backoff and smart error handling
- [ ] Implement proper shard management
- [ ] Add compression support for gateway payloads
- [x] Create gateway event validation and custom cache system (basic cache managers for guilds/users implemented)
- [x] Add sequence number tracking for resume capability (fully implemented with state management)
- [x] Add GatewayIntentBits for easier intent management

## Structures

- [x] Complete Message structure with most Discord properties (partial, extensible)
- [ ] Add support for message components (buttons, select menus)
- [ ] Add Channel structure implementation
- [ ] Add Guild structure implementation
- [ ] Add Member structure implementation
- [ ] Add Role structure implementation

## Features

- [ ] Add webhook support
- [ ] Implement slash command handling
- [ ] Add voice support
- [ ] Add support for message threading
- [ ] Implement interaction handling
- [ ] Add support for auto moderation

## Documentation

- [x] Add API latency callback and logging to RESTClient
- [x] Add rate limit logging for REST
- [x] Add JSDoc comments to all classes and methods
- [ ] Create comprehensive API documentation
- [ ] Add usage examples
- [ ] Create contributing guidelines
- [x] Add unit tests (RESTClient and integration tests)

## Development

- [ ] Set up CI/CD pipeline
- [ ] Add ESLint configuration
- [ ] Add Prettier configuration
- [x] Create automated testing setup (test script runs all test:\* scripts)
- [ ] Add performance benchmarks

## Package Management

- [x] Configure proper build system (tsup, ESM/CJS, typings)
- [x] Set up proper package exports (discord.js style, ESM/CJS/types)
- [x] Add TypeScript declaration file generation (auto with tsup)
- [x] Configure package bundling (tsup, undici for REST)
- [x] Use undici for REST API (fastest Node.js HTTP client)
- [x] Add Discord-like user-agent header to REST requests
- [ ] Configure proper build system
- [ ] Set up proper package exports
- [ ] Add TypeScript declaration file generation
- [ ] Configure package bundling
