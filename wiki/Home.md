# Typicord Wiki

Welcome to the Typicord documentation! Typicord is a modern, TypeScript-first Discord library designed to make bot development simple and enjoyable.

## Quick Navigation

### Getting Started
- [Installation](Installation.md)
- [Basic Setup](Basic-Setup.md)
- [Migration from v1.x](Migration-Guide.md)

### Core Features
- [Enhanced Event System](Enhanced-Event-System.md)
- [Client API](Client-API.md)
- [Gateway Events](Gateway-Events.md)

### Advanced Features
- [Utility Structures](Utility-Structures.md)
- [Caching](Caching.md)
- [Rate Limiting](Rate-Limiting.md)
- [File Uploads](File-Uploads.md)
- [Webhooks](Webhooks.md)
- [Permissions](Permissions.md)
- [Metrics & Monitoring](Metrics-and-Monitoring.md)
- [Audit Logging](Audit-Logging.md)

### Examples
- [Basic Bot](examples/Basic-Bot.md)
- [Advanced Bot](examples/Advanced-Bot.md)
- [Event Handling](examples/Event-Handling.md)
- [Slash Commands](examples/Slash-Commands.md)

## What's New in v2.0.0

🎉 **Major Release**: Typicord v2.0.0 introduces a complete rewrite with Discord.js-like event handling and advanced utility structures.

### Key Features
- **Enhanced Event System**: Discord.js-style event handling with `on()`, `once()`, `off()`, `waitFor()`
- **Comprehensive Gateway Events**: Support for all modern Discord events
- **Advanced Utilities**: Production-ready caching, logging, metrics, and more
- **Better TypeScript**: Improved type safety and developer experience

### Breaking Changes
- Client now extends `EnhancedClient` (see [Migration Guide](Migration-Guide.md))
- Enhanced event system replaces basic EventEmitter
- Some method signatures have changed for better TypeScript support

## Community

- [GitHub Repository](https://github.com/NotKeira/Typicord)
- [Issues & Bug Reports](https://github.com/NotKeira/Typicord/issues)
- [Contributing Guidelines](https://github.com/NotKeira/Typicord/blob/main/CONTRIBUTING.md)

## License

Typicord is released under the [MIT License](https://github.com/NotKeira/Typicord/blob/main/LICENSE).
