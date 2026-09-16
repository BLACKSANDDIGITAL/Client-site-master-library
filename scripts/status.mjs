#!/usr/bin/env node
/**
 * Status script.
 * Prints current backlog status and recent implementation-log entries.
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

console.log("=".repeat(60));
console.log("BLACK SAND DIGITAL — CLIENT WEBSITE SYSTEM STATUS");
console.log("=".repeat(60));

// Read workflow guide for backlog table
const guidePath = join(projectRoot, "docs", "workflow-guide.md");
if (existsSync(guidePath)) {
  const guide = readFileSync(guidePath, "utf-8");
  // Extract backlog status table
  const tableMatch = guide.match(/\| ID \|[\s\S]*?(?=\n##|\n$)/);
  if (tableMatch) {
    console.log("\nBacklog Status:");
    console.log(tableMatch[0].trim());
  }
}

// Read recent implementation log entries
const logPath = join(projectRoot, "docs", "implementation-log.jsonl");
if (existsSync(logPath)) {
  const logContent = readFileSync(logPath, "utf-8").trim();
  const entries = logContent.split("\n");
  const recent = entries.slice(-5);
  console.log("\n" + "-".repeat(60));
  console.log("Recent Implementation Log Entries:");
  console.log("-".repeat(60));
  for (const entry of recent) {
    try {
      const e = JSON.parse(entry);
      console.log(`\n  [${e.timestamp}] ${e.backlogId} — ${e.eventType}`);
      console.log(`  ${e.summary}`);
      console.log(`  Outcome: ${e.outcome} | Duration: ${e.duration || "n/a"}`);
      if (e.nextAction) {
        console.log(`  Next: ${e.nextAction}`);
      }
    } catch {
      // Skip malformed entries
    }
  }
} else {
  console.log("\nNo implementation log found.");
}

// Check build output
const distDir = join(projectRoot, "dist");
if (existsSync(distDir)) {
  console.log("\n" + "-".repeat(60));
  console.log("Build output: dist/ exists");
} else {
  console.log("\n" + "-".repeat(60));
  console.log("Build output: not found (run 'npm run production')");
}

// Check build summary
const summaryPath = join(projectRoot, "docs", "build-summary.json");
if (existsSync(summaryPath)) {
  try {
    const summary = JSON.parse(readFileSync(summaryPath, "utf-8"));
    console.log(`\nLast build: ${summary.buildId} at ${summary.timestamp}`);
    console.log(`  Generation: ${summary.generationTimeSeconds}s | Total: ${summary.totalTimeSeconds}s`);
  } catch {
    // Skip
  }
}

console.log("\n" + "=".repeat(60));
console.log("Commands:");
console.log("  npm run validate    — Check content files");
console.log("  npm run build       — Astro build");
console.log("  npm run review      — Review built output");
console.log("  npm run production   — Full workflow");
console.log("  npm run status       — This status screen");
console.log("  npm run dev          — Dev server");
console.log("  npm run preview      — Preview built output");
console.log("=".repeat(60));
