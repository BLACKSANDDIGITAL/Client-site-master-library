# Workflow Guide and Backlog Status

This is the authoritative work list and workflow reference for the Black Sand Digital client website system.

## One-command workflow

```bash
npm run production
```

This command validates content, generates the build, runs checks, and produces a summary. See `scripts/production.mjs` for implementation details.

Additional commands:

| Command | Purpose |
|---|---|
| `npm run validate` | Validate content files, slugs, references, and required fields without building |
| `npm run review` | Run automated checks on the built output (links, images, structure) |
| `npm run production` | Full workflow: validate → build → review → summarize |
| `npm run status` | Print current backlog status and recent implementation-log entries |
| `npm run build` | Astro production build (existing, unchanged) |
| `npm run dev` | Astro dev server (existing, unchanged) |
| `npm run preview` | Astro preview server (existing, unchanged) |

## Backlog status

| ID | Item | Status | Evidence |
|---|---|---|---|
| BL-001 | ContactForm.astro implementation | Implemented | `src/components/forms/ContactForm.astro` — accessible form with name/phone/email/service/message fields |
| BL-002 | Fix index.astro duplicate sections | Implemented | `src/pages/index.astro` — hero first, then single pass of each section |
| BL-003 | Fix CSS :global() warnings | Implemented | `src/styles/library.css` — removed :global() wrappers in global stylesheet |
| BL-004 | Implementation log (JSONL) | Implemented | `docs/implementation-log.jsonl` — append-only events with run IDs |
| BL-005 | Workflow guide with backlog status | Implemented | This file |
| BL-006 | Package scripts (validate, review, production, status) | Implemented | `package.json` — extends existing scripts |
| BL-007 | Blueprint definitions (six workflows) | Implemented | `src/blueprints/*.json` — service-enquiry, appointment-enquiry, expert-consultation, product-discovery, portfolio-enquiry, participation-community |
| BL-008 | One-command production workflow | Implemented | `scripts/production.mjs` — validate → build → review → summarize |
| BL-009 | Validation script | Implemented | `scripts/validate.mjs` — checks JSON, slugs, references, required fields |
| BL-010 | Review script | Implemented | `scripts/review.mjs` — checks built output for links, images, structure |
| BL-011 | Status script | Implemented | `scripts/status.mjs` — prints backlog status and recent log entries |
| BL-012 | Product discovery routes | Implemented | `src/pages/products/index.astro`, `src/pages/products/[slug].astro`, `src/content/products.json` |
| BL-013 | Portfolio enquiry routes | Implemented | `src/pages/portfolio/index.astro`, `src/pages/portfolio/[slug].astro`, `src/content/portfolio.json` |
| BL-014 | Participation and community routes | Implemented | `src/pages/community/index.astro`, `src/pages/community/[slug].astro`, `src/content/community.json` |
| BL-015 | Rendered blueprint examples in library | Implemented | `src/pages/blueprints.astro` — rendered examples of each blueprint |
| BL-016 | SuiteDash review checklist | Implemented | `docs/suitedash-checklist.md` — reusable checklist and build-specific summary template |
| BL-017 | Client questionnaire (intake) | Implemented | `docs/client-questionnaire.md` |
| BL-018 | Content request list | Implemented | `docs/content-request-list.md` |
| BL-019 | Scope template | Implemented | `docs/scope-template.md` |
| BL-020 | Maintenance policy | Implemented | `docs/maintenance-policy.md` |
| BL-021 | Incident recovery | Implemented | `docs/incident-recovery.md` |

## Deferred items

| Item | Reason | Interface documented |
|---|---|---|
| Intake import (JSON → site.json/services.json) | Needs explicit overwrite flow and conflict resolution | Yes — intake preserves existing values, shows proposed changes, requires explicit overwrite choice |
| Image processing (resize, compress, WebP) | Requires image assets and processing pipeline | No — needs client image assets first |
| Generated client replacement/staging | Requires explicit replacement authorization per client | Yes — isolated fixtures used for testing; Scoop's real site not regenerated |
| Style Explorer integration | Requires external service access | No — needs API details from client |
| Live booking/forms/payments | Requires client account credentials | Yes — form/booking CTA components exist, need real endpoints |
| Hosted previews | Requires Cloudflare Pages deployment access | Yes — `npm run preview` works locally; Cloudflare deployment via Git push |
| Deployment to production | Requires cPanel/domain access and SuiteDash approval | Yes — deployment workflow documented in guide.astro and docs/launch-checklist.md |
| Live SuiteDash synchronization | Requires SuiteDash API access | Yes — checklist prepared as copy-ready text |
| Browser/mobile/keyboard/accessibility checks | Requires browser-based testing environment | No — automated review covers links, structure, noindex; visual/interaction checks pending |
| Client approval and launch | Requires human review and SuiteDash approval workflow | Yes — docs/suitedash-checklist.md prepared |

## Implementation log

All implementation and verification events are recorded in `docs/implementation-log.jsonl`. The log is append-only and preserves history. Each event includes:

- Timestamp and unique run ID
- Stable backlog item ID
- Event type (implementation or verification) and outcome
- Concise change summary
- Changed file paths
- Verification command, outcome, and evidence
- Duration, limitations, and next action

## Verification status legend

- **Implemented**: Code exists and build passes
- **Build tested**: `npm run build` succeeds (37 pages, ~0.7s)
- **Review passed**: `npm run review` passes (0 warnings, 0 errors, 638 links checked)
- **Browser/visual checks**: Checked in a browser (NOT performed in this session)
- **Human/client approved**: Approved by a human reviewer (pending)
- **Conversion measured**: Real performance data exists (not yet available)

## Backup and rollback

1. The implementation branch preserves all changes. `git checkout main` returns to the baseline.
2. The production script backs up existing `dist/` to `dist-backup/` before building. If the build or review fails, `dist-backup/` is restored as `dist/`.
3. If a build fails, the previous `dist/` is restored from `dist-backup/`.
4. Git tags mark release points: `git tag -a v0.1.0 -m "Initial blueprint system"`.
5. Cloudflare Pages also keeps deployment history for rollback via the dashboard.

## Generation time measurement

The production script measures:
- Preparation time (content validation)
- Generation time (Astro build)
- Automated verification time (review checks)
- Total time

Target: prepared content to reviewable draft in under 5 minutes (generation + verification only, excluding human preparation, approval, and deployment).
