# Utility Structures

Typicord v2.0.0 includes powerful utility structures designed for production Discord bots. These utilities handle common tasks like caching, logging, file uploads, and more.

## Overview

The utility structures provide:
- **Production-ready implementations** with comprehensive error handling
- **Full TypeScript support** with detailed interfaces
- **Flexible configuration** for different use cases
- **Integration** with Discord API best practices

## AdvancedCache

High-performance caching with TTL, LRU eviction, and memory management.

### Basic Usage

```typescript
import { AdvancedCache } from 'typicord';

// Create cache with options
const cache = new AdvancedCache<string, any>({
  maxSize: 1000,        // Max 1000 entries
  defaultTTL: 300000,   // 5 minutes default TTL
  cleanupInterval: 60000, // Cleanup every minute
  enableStats: true     // Enable statistics
});

// Set values
cache.set('user:123', userData, 600000); // 10 minutes TTL
cache.set('guild:456', guildData); // Uses default TTL

// Get values
const user = cache.get('user:123');
if (user) {
  console.log('Cache hit!', user);
}

// Check if key exists (and not expired)
if (cache.has('guild:456')) {
  console.log('Guild data is cached');
}
```

### Advanced Features

```typescript
// Get or set pattern (cache-aside)
const userData = await cache.getOrSet('user:123', async () => {
  return await fetchUserFromAPI('123');
}, 300000);

// Bulk operations
cache.setMany([
  ['key1', value1, 60000],
  ['key2', value2, 120000],
  ['key3', value3] // Uses default TTL
]);

const results = cache.getMany(['key1', 'key2', 'key3']);

// Statistics
const stats = cache.getStats();
console.log(`Hit ratio: ${cache.getHitRatio()}`);
console.log(`Size: ${stats.size}, Memory: ${stats.memoryUsage} bytes`);
```

### Cache Management

```typescript
// Set TTL for existing key
cache.setTTL('user:123', 600000); // 10 minutes

// Get remaining TTL
const ttl = cache.getTTL('user:123');
console.log(`Expires in ${ttl}ms`);

// Touch key to update access time
cache.touch('user:123');

// Clear expired entries manually
cache.cleanup();

// Reset statistics
cache.resetStats();

// Destroy cache
cache.destroy();
```

## AuditLogger

Comprehensive audit logging with filtering, search, and export capabilities.

### Basic Usage

```typescript
import { AuditLogger, AuditLogLevel, AuditLogCategory } from 'typicord';

const logger = new AuditLogger({
  maxEntries: 10000,
  retentionDays: 30,
  minLevel: AuditLogLevel.INFO,
  enabledCategories: [
    AuditLogCategory.COMMAND,
    AuditLogCategory.USER_ACTION,
    AuditLogCategory.ADMIN_ACTION
  ]
});

// Log different levels
logger.info(AuditLogCategory.COMMAND, 'Command executed', {
  userId: '123',
  guildId: '456',
  details: { command: 'ping', success: true }
});

logger.warn(AuditLogCategory.SECURITY, 'Rate limit exceeded', {
  userId: '123',
  sourceIp: '192.168.1.1'
});

logger.error(AuditLogCategory.API, 'API request failed', new Error('Timeout'), {
  details: { endpoint: '/guilds/123', method: 'GET' }
});
```

### Specialized Logging Methods

```typescript
// Log Discord events
logger.logGatewayEvent('MESSAGE_CREATE', messageData, 15); // 15ms duration

// Log API requests
logger.logApiRequest('GET', '/users/@me', 200, 125, { cached: false });

// Log command execution
logger.logCommand('ping', '123', '456', '789', true, 50);

// Log user actions
logger.logUserAction('join_voice', '123', '456', '789', { channelName: 'General' });

// Log admin actions
logger.logAdminAction('ban_user', '456', '123', '789', { reason: 'Spam' });

// Log security events
logger.logSecurityEvent('failed_login', '123', '192.168.1.1', { attempts: 3 });

// Log performance metrics
logger.logPerformance('api_response_time', 125, 'ms', { endpoint: '/users/@me' });
```

### Querying and Analysis

```typescript
// Query logs
const recentErrors = logger.query({
  level: AuditLogLevel.ERROR,
  startTime: Date.now() - 86400000, // Last 24 hours
  limit: 50
});

// Search logs
const commandLogs = logger.query({
  category: AuditLogCategory.COMMAND,
  userId: '123',
  search: 'ping'
});

// Get user activity
const userActivity = logger.getUserActivity('123', 24); // Last 24 hours

// Get guild activity
const guildActivity = logger.getGuildActivity('456', 24);

// Get recent errors
const errors = logger.getRecentErrors(24);
```

### Statistics and Export

```typescript
// Get statistics
const stats = logger.getStatistics();
console.log(`Total entries: ${stats.totalEntries}`);
console.log(`Entries by level:`, stats.entriesByLevel);
console.log(`Average entries per day: ${stats.avgEntriesPerDay}`);

// Export logs
const jsonExport = logger.export('json', {
  startTime: Date.now() - 86400000,
  level: AuditLogLevel.INFO
});

const csvExport = logger.export('csv', {
  category: AuditLogCategory.COMMAND
});
```

## FileUploadManager

Handle file attachments with validation and Discord API integration.

### Basic Usage

```typescript
import { FileUploadManager } from 'typicord';

// Create from file path
const attachment = await FileUploadManager.fromPath('./image.png', {
  description: 'A cool image',
  spoiler: false
});

// Create from buffer
const buffer = Buffer.from('Hello, World!', 'utf-8');
const textFile = FileUploadManager.fromBuffer(buffer, 'hello.txt', {
  contentType: 'text/plain',
  description: 'A text file'
});

// Create image attachment
const imageAttachment = FileUploadManager.createImageAttachment(
  imageBuffer,
  'photo.jpg',
  {
    width: 1920,
    height: 1080,
    description: 'High-res photo',
    spoiler: false
  }
);
```

### Validation

```typescript
// Validate file size
const isValidSize = FileUploadManager.validateFileSize(buffer, true); // Premium server

// Check file types
const isImage = FileUploadManager.isValidImageType('image/png');
const isVideo = FileUploadManager.isValidVideoType('video/mp4');
const isAudio = FileUploadManager.isValidAudioType('audio/mp3');

// Resize image (requires additional library like sharp)
const resizedBuffer = await FileUploadManager.resizeImage(buffer, 800, 600);
```

### Discord Integration

```typescript
// Convert to Discord format
const discordAttachment = FileUploadManager.toDiscordFormat(attachment, 0);

// Create form data for uploads
const formData = FileUploadManager.createFormData(
  [attachment],
  JSON.stringify({ content: 'Here\'s your file!' })
);

// Use with message sending
await client.sendMessage(channelId, '', {
  files: [attachment.data],
  attachments: [discordAttachment]
});
```

## MetricsCollector

Performance monitoring with Prometheus export support.

### Basic Usage

```typescript
import { MetricsCollector } from 'typicord';

const metrics = new MetricsCollector();

// Counter metrics (always increment)
metrics.incrementCounter('discord_messages_processed_total', 1, {
  guild: '123',
  channel: '456'
});

// Gauge metrics (can go up or down)
metrics.setGauge('discord_active_connections', 5);
metrics.incrementGauge('discord_cached_users', 1);
metrics.decrementGauge('discord_cached_users', 1);

// Histogram metrics (for measuring distributions)
metrics.observeHistogram('discord_api_request_duration_ms', 125.5, {
  method: 'GET',
  endpoint: '/users/@me'
});
```

### Timing Functions

```typescript
// Time a function automatically
const result = await metrics.timeFunction(
  'discord_command_duration_ms',
  async () => {
    return await executeCommand(command);
  },
  { command: 'ping', guild: '123' }
);

// Manual timing
const stopTimer = metrics.startTimer('discord_database_query_duration_ms', {
  query: 'users'
});
// ... do work ...
stopTimer(); // Records the duration
```

### Built-in Bot Metrics

```typescript
// Register common Discord bot metrics
metrics.registerBotMetrics();

// Update system metrics periodically
setInterval(() => {
  metrics.updateSystemMetrics();
}, 30000); // Every 30 seconds

// Update Discord-specific metrics
metrics.setGauge('discord_guilds_total', client.guilds.length);
metrics.setGauge('discord_users_total', client.cache.users.size);
```

### Export and Monitoring

```typescript
// Get specific metrics
const metric = metrics.getMetric('discord_messages_processed_total', {
  guild: '123'
});

// Get all metrics
const allMetrics = metrics.getAllMetrics();

// Get metrics by prefix
const discordMetrics = metrics.getMetricsByPrefix('discord_');

// Export to Prometheus format
const prometheusData = metrics.exportPrometheus();

// Serve metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(metrics.exportPrometheus());
});
```

## RateLimiter

Advanced rate limiting for Discord API compliance.

### Basic Usage

```typescript
import { RateLimiter } from 'typicord';

const rateLimiter = new RateLimiter();

// Wait for rate limit clearance
const route = RateLimiter.createRouteKey('GET', '/channels/123/messages');
await rateLimiter.waitForRateLimit(route);

// Make API request
const response = await fetch(url);

// Update rate limits from response
rateLimiter.updateRateLimit(route, response.headers);
```

### Rate Limit Handling

```typescript
// Handle 429 responses
if (response.status === 429) {
  rateLimiter.handleRateLimitExceeded(route, response.headers);
  // Will automatically wait before allowing next request
}

// Check rate limit status
const status = rateLimiter.getRateLimitStatus(route);
console.log(`Can make request: ${status.canMakeRequest}`);
console.log(`Bucket remaining: ${status.bucket?.remaining}`);
console.log(`Global remaining: ${status.global?.remaining}`);
```

### Route Management

```typescript
// Create route keys for different endpoints
const messagesRoute = RateLimiter.createRouteKey('GET', '/channels/123/messages');
const userRoute = RateLimiter.createRouteKey('GET', '/users/456');
const guildRoute = RateLimiter.createRouteKey('PATCH', '/guilds/789');

// Route keys normalize similar endpoints
// /channels/123/messages -> /channels/{channel.id}/messages
// /channels/456/messages -> /channels/{channel.id}/messages (same bucket)
```

### Maintenance

```typescript
// Clean up expired rate limits
rateLimiter.cleanup();

// Reset all rate limits (for testing)
rateLimiter.reset();

// Automatic cleanup
setInterval(() => {
  rateLimiter.cleanup();
}, 300000); // Every 5 minutes
```

## Integration Examples

### Caching with Metrics

```typescript
const cache = new AdvancedCache<string, any>({ enableStats: true });
const metrics = new MetricsCollector();

// Monitor cache performance
setInterval(() => {
  const stats = cache.getStats();
  metrics.setGauge('cache_size', stats.size);
  metrics.setGauge('cache_memory_usage_bytes', stats.memoryUsage);
  metrics.setGauge('cache_hit_ratio', cache.getHitRatio());
}, 30000);
```

### Logging with Rate Limiting

```typescript
const logger = new AuditLogger();
const rateLimiter = new RateLimiter();

// Log rate limit events
client.on('rateLimit', (info) => {
  logger.logRateLimit(info.route, info.remaining, info.resetTime.getTime());
});

// Integrated API request logging
async function makeAPIRequest(method: string, endpoint: string, data?: any) {
  const route = RateLimiter.createRouteKey(method, endpoint);
  const start = Date.now();
  
  await rateLimiter.waitForRateLimit(route);
  
  try {
    const response = await fetch(endpoint, { method, body: data });
    const duration = Date.now() - start;
    
    rateLimiter.updateRateLimit(route, response.headers);
    logger.logApiRequest(method, endpoint, response.status, duration);
    
    return response;
  } catch (error) {
    logger.error(AuditLogCategory.API, 'API request failed', error as Error, {
      method,
      endpoint,
      duration: Date.now() - start
    });
    throw error;
  }
}
```

These utility structures provide the foundation for building robust, production-ready Discord bots with proper monitoring, caching, and logging capabilities.
