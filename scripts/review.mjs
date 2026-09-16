#!/usr/bin/env node
/**
 * Post-build review script.
 * Checks built output for link integrity, image references, script sources,
 * page structure, and library exclusion from client output.
 * Exits with nonzero code on review errors.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const distDir = join(projectRoot, "dist");

const errors = [];
const warnings = [];
let pagesChecked = 0;
let linksChecked = 0;
let imagesChecked = 0;

function walkDir(dir, callback) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, callback);
    } else {
      callback(fullPath);
    }
  }
}

function extractAttrs(html, tag, attr) {
  const results = [];
  const regex = new RegExp(`<${tag}[^>]*${attr}=["']([^"']+)["']`, "gi");
  let match;
  while ((match = regex.exec(html)) !== null) {
    results.push(match[1]);
  }
  return results;
}

if (!existsSync(distDir)) {
  console.error("✗ Build output not found. Run 'npm run build' first.");
  process.exit(1);
}

walkDir(distDir, (filePath) => {
  if (!filePath.endsWith(".html")) return;
  pagesChecked++;
  const html = readFileSync(filePath, "utf-8");
  const relPath = relative(distDir, filePath);

  // Check for internal links
  const hrefs = extractAttrs(html, "a", "href");
  for (const href of hrefs) {
    linksChecked++;
    if (href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    if (href.startsWith("http://") || href.startsWith("https://")) continue;
    if (href.startsWith("#")) continue;

    // Normalize internal link
    let linkPath = href.split("#")[0].split("?")[0];
    if (linkPath === "/") linkPath = "/index.html";
    if (linkPath.endsWith("/")) linkPath = linkPath + "index.html";
    if (!linkPath.endsWith(".html")) {
      if (!linkPath.startsWith("/")) linkPath = "/" + linkPath;
      linkPath = linkPath + "/index.html";
    }

    const targetPath = join(distDir, linkPath);
    if (!existsSync(targetPath)) {
      // Check if it's a route that exists as a directory
      const dirPath = join(distDir, linkPath.replace("/index.html", ""));
      if (!existsSync(dirPath)) {
        errors.push(`Broken internal link in ${relPath}: ${href} → ${linkPath}`);
      }
    }
  }

  // Check for image references
  const imgSrcs = extractAttrs(html, "img", "src");
  for (const src of imgSrcs) {
    imagesChecked++;
    if (src.startsWith("http://") || src.startsWith("https://")) continue;
    if (src.startsWith("data:")) continue;

    let imgPath = src;
    if (imgPath.startsWith("/")) {
      imgPath = imgPath.substring(1);
    }
    const fullPath = join(distDir, imgPath);
    if (!existsSync(fullPath)) {
      warnings.push(`Image not found in ${relPath}: ${src}`);
    }
  }

  // Check for script sources
  const scriptSrcs = extractAttrs(html, "script", "src");
  for (const src of scriptSrcs) {
    if (src.startsWith("http://") || src.startsWith("https://")) continue;
    let scriptPath = src;
    if (scriptPath.startsWith("/")) {
      scriptPath = scriptPath.substring(1);
    }
    const fullPath = join(distDir, scriptPath);
    if (!existsSync(fullPath)) {
      warnings.push(`Script not found in ${relPath}: ${src}`);
    }
  }

  // Check for H1 presence
  // Internal library/guide/blueprints pages showcase multiple components that each have their own H1;
  // multiple H1 tags are expected there and should not trigger a warning.
  const isInternalShowcase =
    relPath.startsWith("library/") ||
    relPath.startsWith("guide/") ||
    relPath.startsWith("blueprints/") ||
    relPath.startsWith("examples/");
  const h1Matches = html.match(/<h1[^>]*>/gi);
  if (!h1Matches || h1Matches.length === 0) {
    warnings.push(`No H1 found in ${relPath}`);
  } else if (h1Matches.length > 1 && !isInternalShowcase) {
    warnings.push(`Multiple H1 tags in ${relPath}: ${h1Matches.length} found`);
  }

  // Check for library exclusion (library pages should have noindex)
  if (relPath.includes("library") || relPath.includes("guide") || relPath.includes("blueprints") || relPath.includes("examples")) {
    if (!html.includes('name="robots" content="noindex, nofollow"')) {
      warnings.push(`Internal page ${relPath} missing noindex meta tag`);
    }
  }
});

// --- Report ---
console.log(`\nReview Summary:`);
console.log(`  Pages checked: ${pagesChecked}`);
console.log(`  Links checked: ${linksChecked}`);
console.log(`  Images checked: ${imagesChecked}`);

if (warnings.length > 0) {
  console.log(`\n⚠ Warnings (${warnings.length}):`);
  warnings.slice(0, 20).forEach((w) => console.log(`  ${w}`));
  if (warnings.length > 20) {
    console.log(`  ... and ${warnings.length - 20} more`);
  }
}

if (errors.length > 0) {
  console.error(`\n✗ Review errors (${errors.length}):`);
  errors.forEach((e) => console.error(`  ${e}`));
  process.exit(1);
} else {
  console.log(`\n✓ Review completed. No broken links or critical issues found.`);
  process.exit(0);
}
