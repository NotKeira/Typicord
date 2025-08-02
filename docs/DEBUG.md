# Typicord Debug System

Typicord includes a comprehensive debug system that helps you troubleshoot issues and understand what's happening under the hood.

## Enabling Debug Mode

To enable debug output from Typicord, simply set the `TYPI_DEBUG` environment variable to `true` in your `.env` file:

```bash
TYPI_DEBUG=true
```

That's it! No imports or configuration needed. Typicord will automatically detect this environment variable and start outputting debug information.

## Debug Output

When debug mode is enabled, you'll see detailed logging for:

- **Gateway**: WebSocket connection, reconnection, session management
- **REST**: API requests, response times, rate limiting
- **Events**: Event processing, interaction handling
- **Cache**: Cache operations and management
- **Heartbeat**: WebSocket heartbeat and latency tracking
- **Interactions**: Command and component interaction processing
- **Structures**: Object creation and manipulation

## Example Output

```
[2025-08-02T10:30:45.123Z][Typicord][GATEWAY][INFO] Initializing GatewayClient
[2025-08-02T10:30:45.125Z][Typicord][GATEWAY][INFO] Starting gateway connection
[2025-08-02T10:30:45.234Z][Typicord][GATEWAY][INFO] WebSocket connection established
[2025-08-02T10:30:45.345Z][Typicord][GATEWAY][INFO] Received HELLO opcode { heartbeat_interval: 41250 }
[2025-08-02T10:30:45.456Z][Typicord][EVENTS][INFO] Received DISPATCH event: READY
[2025-08-02T10:30:45.567Z][Typicord][REST][DEBUG] Making request to /channels/123456789/messages
```

## Development vs Production

Debug mode should typically only be enabled during development. The debug output can be quite verbose and may impact performance in production environments.

For production, simply ensure `TYPI_DEBUG` is not set or set to `false`:

```bash
# Production .env
TYPI_DEBUG=false
```

## Advanced Configuration

While the environment variable controls the main debug toggle, you can also programmatically configure specific debug namespaces if needed:

```typescript
import { configureDebugNamespaces, DebugNamespace } from "typicord";

// Only show gateway and REST debug info
configureDebugNamespaces([DebugNamespace.GATEWAY, DebugNamespace.REST]);
```

But for most use cases, simply setting `TYPI_DEBUG=true` is all you need!
