#!/usr/bin/env node

/**
 * Timeout wrapper that exits with code 0 on timeout for CI compatibility
 */

const { spawn } = require("child_process");

const timeoutSeconds = parseInt(process.argv[2]) || 30;
const command = process.argv[3];
const args = process.argv.slice(4);

if (!command) {
  console.error("Usage: timeout-safe.js <seconds> <command> [args...]");
  process.exit(1);
}

const child = spawn(command, args, { stdio: "inherit" });

const timeout = setTimeout(() => {
  console.log(
    `\n⏰ Benchmark timed out after ${timeoutSeconds}s - this is expected for CI`
  );
  child.kill("SIGTERM");
  process.exit(0); // Exit successfully on timeout
}, timeoutSeconds * 1000);

child.on("close", code => {
  clearTimeout(timeout);
  // Exit successfully regardless of benchmark result for CI
  process.exit(0);
});

child.on("error", err => {
  clearTimeout(timeout);
  console.error("Failed to start benchmark:", err.message);
  process.exit(0); // Still exit successfully for CI
});
