#!/usr/bin/env node
/**
 * Content validation script.
 * Checks JSON files, slugs, references, required fields, and route conventions.
 * Exits with nonzero code on validation errors.
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const contentDir = join(projectRoot, "src", "content");

const errors = [];
const warnings = [];

function readJSON(name) {
  const path = join(contentDir, name);
  if (!existsSync(path)) {
    errors.push(`Missing content file: ${name}`);
    return null;
  }
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch (e) {
    errors.push(`Invalid JSON in ${name}: ${e.message}`);
    return null;
  }
}

function checkSlug(value, file, field) {
  if (!value) return;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    errors.push(`Invalid slug "${value}" in ${file} (${field}): must be lowercase kebab-case`);
  }
}

function checkRequired(obj, requiredFields, file) {
  if (!obj) return;
  for (const field of requiredFields) {
    if (obj[field] === undefined || obj[field] === null || obj[field] === "") {
      errors.push(`Missing required field "${field}" in ${file}`);
    }
  }
}

// --- Validate site.json ---
const site = readJSON("site.json");
if (site) {
  checkRequired(site, ["businessName", "phoneDisplay", "phoneLink", "email", "address"], "site.json");
  if (site.phoneLink && !/^\+[\d]+$/.test(site.phoneLink)) {
    warnings.push(`phoneLink in site.json should start with + and contain only digits (got: ${site.phoneLink})`);
  }
  if (site.primaryCta) {
    checkRequired(site.primaryCta, ["label", "href"], "site.json (primaryCta)");
  }
}

// --- Validate services.json ---
const services = readJSON("services.json");
if (services && Array.isArray(services)) {
  services.forEach((s, i) => {
    checkRequired(s, ["slug", "name", "shortDescription"], `services.json[${i}]`);
    checkSlug(s.slug, "services.json", `services[${i}].slug`);
  });
}

// --- Validate navigation.json ---
const nav = readJSON("navigation.json");
if (nav) {
  if (!nav.main || !Array.isArray(nav.main) || nav.main.length === 0) {
    errors.push("navigation.json: main navigation array is empty or missing");
  }
  if (nav.main) {
    nav.main.forEach((item, i) => {
      checkRequired(item, ["label", "href"], `navigation.json main[${i}]`);
    });
  }
}

// --- Validate testimonials.json ---
const testimonials = readJSON("testimonials.json");
if (testimonials && Array.isArray(testimonials)) {
  testimonials.forEach((t, i) => {
    checkRequired(t, ["quote", "name"], `testimonials.json[${i}]`);
  });
}

// --- Validate faq.json ---
const faq = readJSON("faq.json");
if (faq && Array.isArray(faq)) {
  faq.forEach((f, i) => {
    checkRequired(f, ["question", "answer"], `faq.json[${i}]`);
  });
}

// --- Validate service-areas.json ---
const serviceAreas = readJSON("service-areas.json");
if (serviceAreas && Array.isArray(serviceAreas)) {
  serviceAreas.forEach((sa, i) => {
    checkRequired(sa, ["name", "slug"], `service-areas.json[${i}]`);
    checkSlug(sa.slug, "service-areas.json", `service-areas[${i}].slug`);
  });
}

// --- Validate products.json (if exists) ---
const products = readJSON("products.json");
if (products && Array.isArray(products)) {
  products.forEach((p, i) => {
    checkRequired(p, ["slug", "name", "shortDescription"], `products.json[${i}]`);
    checkSlug(p.slug, "products.json", `products[${i}].slug`);
  });
}

// --- Validate portfolio.json (if exists) ---
const portfolio = readJSON("portfolio.json");
if (portfolio && Array.isArray(portfolio)) {
  portfolio.forEach((p, i) => {
    checkRequired(p, ["slug", "title", "category"], `portfolio.json[${i}]`);
    checkSlug(p.slug, "portfolio.json", `portfolio[${i}].slug`);
  });
}

// --- Validate community.json (if exists) ---
const community = readJSON("community.json");
if (community && Array.isArray(community)) {
  community.forEach((c, i) => {
    checkRequired(c, ["slug", "title", "type"], `community.json[${i}]`);
    checkSlug(c.slug, "community.json", `community[${i}].slug`);
  });
}

// --- Validate blueprints ---
const blueprintsDir = join(projectRoot, "src", "blueprints");
const expectedBlueprints = [
  "service-enquiry.json",
  "appointment-enquiry.json",
  "expert-consultation.json",
  "product-discovery.json",
  "portfolio-enquiry.json",
  "participation-community.json",
];
for (const bp of expectedBlueprints) {
  const bpPath = join(blueprintsDir, bp);
  if (!existsSync(bpPath)) {
    errors.push(`Missing blueprint: src/blueprints/${bp}`);
  } else {
    try {
      const data = JSON.parse(readFileSync(bpPath, "utf-8"));
      checkRequired(data, ["id", "name", "pages", "ctaBehavior"], `blueprints/${bp}`);
    } catch (e) {
      errors.push(`Invalid JSON in blueprints/${bp}: ${e.message}`);
    }
  }
}

// --- Report ---
if (warnings.length > 0) {
  console.log("\n⚠ Warnings:");
  warnings.forEach((w) => console.log(`  ${w}`));
}

if (errors.length > 0) {
  console.error("\n✗ Validation errors:");
  errors.forEach((e) => console.error(`  ${e}`));
  console.error(`\n${errors.length} error(s) found. Fix these before building.`);
  process.exit(1);
} else {
  console.log("✓ All content validation checks passed.");
  process.exit(0);
}
