#!/usr/bin/env tsx

/**
 * Comprehensive performance benchmark suite for Typicord
 * Run this to get detailed performance metrics for the library
 */

import { execSync } from "child_process";
import path from "path";

const benchmarks = [
  "rest-client.bench.ts",
  "message-processing.bench.ts",
  "gateway.bench.ts",
];

console.log("🏁 Starting Typicord Performance Benchmark Suite");
console.log("=".repeat(60));

for (const benchmark of benchmarks) {
  const benchmarkPath = path.join(__dirname, benchmark);
  console.log(`\n📊 Running ${benchmark}...`);
  console.log("-".repeat(40));

  try {
    execSync(`tsx ${benchmarkPath}`, { stdio: "inherit" });
  } catch (error) {
    console.error(`❌ Failed to run ${benchmark}:`, error);
  }

  console.log("-".repeat(40));
}

console.log("\n✅ Benchmark Suite Complete!");
console.log("=".repeat(60));
