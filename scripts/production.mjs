#!/usr/bin/env node
/**
 * Production workflow script.
 * Validates → generates (build) → runs review checks → summarizes.
 * Backs up existing dist/ to dist-backup/ before building; restores on failure.
 * Requires --force when existing output is present.
 * Reports timing, build ID, and SuiteDash-ready summary. Appends to implementation log.
 */
import { execSync } from "node:child_process";
import { existsSync, rmSync, renameSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const distDir = join(projectRoot, "dist");
const stagingDir = join(projectRoot, "dist-staging");
const backupDir = join(projectRoot, "dist-backup");

const runId = `run-${crypto.randomUUID().slice(0, 8)}`;
const startTime = Date.now();
const phases = {};

function timePhase(name, fn) {
  const start = Date.now();
  const result = fn();
  phases[name] = Date.now() - start;
  return result;
}

function log(msg) {
  console.log(`[${runId}] ${msg}`);
}

function logError(msg) {
  console.error(`[${runId}] ✗ ${msg}`);
}

// --- Phase 1: Validate ---
log("Phase 1: Validating content...");
try {
  timePhase("validation", () => {
    execSync("node scripts/validate.mjs", { cwd: projectRoot, stdio: "inherit" });
  });
  log("  Validation passed.");
} catch (e) {
  logError("Validation failed. Stopping.");
  logError("Fix the validation errors above before proceeding.");
  process.exit(1);
}

// --- Phase 2: Generate (build with backup) ---
log("Phase 2: Generating build...");

// Check for existing output
const hasExistingOutput = existsSync(distDir);

// If existing output exists and no --force flag, require it
if (hasExistingOutput && !process.argv.includes("--force")) {
  logError("Existing build output found. Use --force to replace.");
  process.exit(1);
}

// Back up existing output before building
if (hasExistingOutput) {
  if (existsSync(backupDir)) rmSync(backupDir, { recursive: true });
  renameSync(distDir, backupDir);
  log("  Backed up existing output to dist-backup/");
}

try {
  timePhase("generation", () => {
    execSync("npm run build", { cwd: projectRoot, stdio: "inherit" });
  });
  log("  Build completed successfully.");
} catch (e) {
  logError("Build failed. Restoring previous output from backup.");
  if (existsSync(backupDir)) {
    // Remove any partial output left by failed build before restoring
    if (existsSync(distDir)) rmSync(distDir, { recursive: true });
    renameSync(backupDir, distDir);
    log("  Previous output restored.");
  }
  process.exit(1);
}

// --- Phase 3: Review ---
log("Phase 3: Running review checks...");
try {
  timePhase("review", () => {
    execSync("node scripts/review.mjs", { cwd: projectRoot, stdio: "inherit" });
  });
  log("  Review passed.");
} catch (e) {
  logError("Review found issues. Check warnings above.");
  // Don't fail on warnings, only on errors
  if (e.status !== 0) {
    logError("Review errors detected. Restoring previous output from backup.");
    if (existsSync(backupDir)) {
      if (existsSync(distDir)) rmSync(distDir, { recursive: true });
      renameSync(backupDir, distDir);
      log("  Previous output restored.");
    }
    process.exit(1);
  }
}

// --- Phase 4: Finalize ---
// Clean up backup (build succeeded and was reviewed)
if (existsSync(backupDir)) {
  rmSync(backupDir, { recursive: true });
}

// Clean up staging (legacy)
if (existsSync(stagingDir)) {
  rmSync(stagingDir, { recursive: true });
}

const totalTime = Date.now() - startTime;
const buildId = crypto.randomUUID().slice(0, 8);

// --- Phase 5: Summarize ---
log("Phase 5: Generating summary...");

const summary = {
  runId,
  buildId,
  timestamp: new Date().toISOString(),
  status: "success",
  phases: {
    validation: `${phases.validation || 0}ms`,
    generation: `${phases.generation || 0}ms`,
    review: `${phases.review || 0}ms`,
    total: `${totalTime}ms`,
  },
  generationTimeSeconds: ((phases.generation || 0) / 1000).toFixed(2),
  totalTimeSeconds: (totalTime / 1000).toFixed(2),
  outputPath: distDir,
  previewCommand: "npm run preview",
  backlogStatus: "See docs/workflow-guide.md",
  implementationLog: "docs/implementation-log.jsonl",
  notes: "Generation time excludes preparation, human review, and deployment.",
};

// Print summary
console.log("\n" + "=".repeat(60));
console.log("PRODUCTION SUMMARY");
console.log("=".repeat(60));
console.log(`  Run ID:       ${summary.runId}`);
console.log(`  Build ID:     ${summary.buildId}`);
console.log(`  Status:       ${summary.status}`);
console.log(`  Timestamp:    ${summary.timestamp}`);
console.log(`  Validation:   ${summary.phases.validation}`);
console.log(`  Generation:   ${summary.phases.generation} (${summary.generationTimeSeconds}s)`);
console.log(`  Review:       ${summary.phases.review}`);
console.log(`  Total:        ${summary.phases.total} (${summary.totalTimeSeconds}s)`);
console.log(`  Output:       ${summary.outputPath}`);
console.log(`  Preview:      ${summary.previewCommand}`);
console.log(`  Log:          ${summary.implementationLog}`);
console.log(`  Backlog:      ${summary.backlogStatus}`);
console.log("=".repeat(60));

// Write summary to file
const summaryPath = join(projectRoot, "docs", "build-summary.json");
writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
log(`Summary written to ${summaryPath}`);

// SuiteDash-ready summary
console.log("\n--- SuiteDash Summary ---");
console.log(`Client: (set in site.json)`);
console.log(`Build ID: ${summary.buildId}`);
console.log(`Blueprint: (set in src/blueprints/)`);
console.log(`Theme: (set in src/styles/theme.css)`);
console.log(`Findings: See review output above`);
console.log(`Review Status: Automated checks passed. Pending human review.`);
console.log(`Preview: Run '${summary.previewCommand}' to view locally`);

// Append to implementation log
const logEntry = {
  timestamp: summary.timestamp,
  runId: summary.runId,
  buildId: summary.buildId,
  eventType: "verification",
  outcome: "pass",
  summary: `Production run completed. Validation: ${summary.phases.validation}, Generation: ${summary.phases.generation}, Review: ${summary.phases.review}, Total: ${summary.phases.total}`,
  verificationCommand: "npm run production",
  verificationOutcome: "pass",
  evidence: `Build summary at ${summaryPath}`,
  duration: summary.phases.total,
  limitations: "Browser/mobile/accessibility checks not performed. Human review pending.",
  nextAction: "Run browser/mobile checks, then obtain client approval via SuiteDash.",
};
const logPath = join(projectRoot, "docs", "implementation-log.jsonl");
const logLine = JSON.stringify(logEntry) + "\n";
writeFileSync(logPath, logLine, { flag: "a" });
log(`Implementation log updated: ${logPath}`);

process.exit(0);
