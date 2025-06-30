# Typicord Performance Benchmarks

This directory contains comprehensive performance benchmarks for the Typicord Discord library.

## Available Benchmarks

### 🌐 REST Client Performance (`rest-client.bench.ts`)
- REST client initialization
- Request header construction  
- Rate limit checking
- JSON parsing for small and large payloads

### 🏗️ Message Processing (`message-processing.bench.ts`)
- Message structure creation
- Message data parsing
- Cache operations (user caching)
- Bulk message processing (100 messages)
- Event emission

### ⚡ Gateway Performance (`gateway.bench.ts`)
- ReconnectionManager operations
- Exponential backoff calculations
- HeartbeatManager operations
- Latency calculations
- Gateway payload processing
- WebSocket message handling simulation

### 🧠 Memory Usage (`memory.bench.ts`)
- Client creation memory overhead
- Message processing memory usage
- Cache operations memory impact
- Memory leak detection
- Garbage collection effectiveness

## Running Benchmarks

```bash
# Run all benchmarks
pnpm bench

# Run individual benchmarks
pnpm bench:rest         # REST client performance
pnpm bench:messages     # Message processing performance  
pnpm bench:gateway      # Gateway performance
pnpm bench:memory       # Memory usage analysis
```

## Interpreting Results

### Performance Benchmarks
- **ops/sec**: Operations per second (higher is better)
- **±%**: Margin of error percentage (lower is better)
- **runs sampled**: Number of test runs used for the benchmark

### Memory Benchmarks
- **RSS**: Resident Set Size - total memory used by the process
- **Heap Used**: Memory currently being used by JavaScript objects
- **Heap Total**: Total heap memory allocated
- **External**: Memory used by C++ objects bound to JavaScript

## Typical Performance Expectations

Based on our benchmarks, you can expect:

- **Message Creation**: ~200M+ ops/sec (extremely fast)
- **REST Client Init**: ~100K+ ops/sec (very fast)
- **Gateway Operations**: ~1M+ ops/sec (very fast)
- **Memory per Client**: ~0.01 MB (very efficient)
- **Memory per Message**: ~0.0005 MB (very efficient)

## Using Benchmarks for Development

### Before Making Changes
1. Run `pnpm bench` to establish baseline performance
2. Save the results for comparison

### After Making Changes
1. Run benchmarks again
2. Compare results to identify performance impacts
3. Focus on operations that might be affected by your changes

### Performance Regression Detection
If you see significant drops in performance:
- Check for inefficient loops or algorithms
- Look for memory leaks or excessive object creation
- Verify that connection pooling and caching are working properly

## Contributing

When adding new features:
1. Add relevant benchmarks for new functionality
2. Ensure benchmarks cover both fast path and edge cases
3. Include memory usage tests for long-running operations

## Notes

- Benchmarks use mock data and services where possible
- Some benchmarks may show high variance on the first run (JIT warming up)
- Memory benchmarks work best with `--expose-gc` flag for accurate cleanup testing
- Results may vary significantly between different Node.js versions and systems
