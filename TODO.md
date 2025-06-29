# TODO List

## Core Functionality

- [x] Implement proper error handling and custom error classes
- [x] Add rate limit handling for API requests
- [x] Create a REST API client class to handle HTTP requests
- [x] Add support for Discord API version configuration
- [ ] Implement reconnection logic with exponential backoff

## Gateway

- [ ] Add session resuming functionality
- [ ] Implement proper shard management
- [ ] Add compression support for gateway payloads
- [x] Create gateway event validation and custom cache system (basic cache managers for guilds/users implemented)
- [x] Add sequence number tracking for resume capability (partial: event flow and cache tracking implemented)
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

- [ ] Configure proper build system
- [ ] Set up proper package exports
- [ ] Add TypeScript declaration file generation
- [ ] Configure package bundling
