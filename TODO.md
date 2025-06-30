# TODO List

## Core Functionality

- [x] Implement proper error handling and custom error classes
- [x] Add rate limit handling for API requests
- [x] Create a REST API client class to handle HTTP requests
- [x] Add support for Discord API version configuration
- [x] Implement reconnection logic with exponential backoff
- [x] Add session resuming functionality with proper state management
- [x] Optimize REST client with persistent HTTP agent for connection pooling

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
- [ ] Implement support for scheduled events
- [ ] Implement support for components v2
- [ ] Add message reactions
- [ ] Add support for components v1 (buttons, select menus, etc.)
## Documentation

- [x] Add API latency callback and logging to RESTClient
- [x] Add rate limit logging for REST
- [x] Add JSDoc comments to all classes and methods
- [x] Improve comment friendliness and readability throughout codebase
- [ ] Create comprehensive API documentation
- [ ] Add usage examples
- [ ] Create contributing guidelines
- [x] Add unit tests (RESTClient and integration tests)

## Development

- [ ] Set up CI/CD pipeline
- [x] Add ESLint configuration
- [x] Add Prettier configuration
- [x] Add lint and format scripts to package.json
- [x] Create automated testing setup (test script runs all test:\* scripts)
- [ ] Add performance benchmarks

## Package Management

- [x] Configure proper build system (tsup, ESM/CJS, typings)
- [x] Set up proper package exports (discord.js style, ESM/CJS/types)
- [x] Add TypeScript declaration file generation (auto with tsup)
- [x] Configure package bundling (tsup, undici for REST)
- [x] Use undici for REST API (fastest Node.js HTTP client)
- [x] Add Discord-like user-agent header to REST requests
- [x] Add proper resource cleanup methods (destroy() for client and REST)
