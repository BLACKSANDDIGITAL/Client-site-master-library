# Master Library Changelog

Use this file to record deliberate improvements to the team-owned master library.

## Entry format

| Date | Change | Affected files | Upgrade instructions | Tested status |
|---|---|---|---|---|
| YYYY-MM-DD | Concise summary | Exact paths | How new or existing sites can adopt it | Desktop, mobile, build, accessibility checks |

## 2026-09-15

| Date | Change | Affected files | Upgrade instructions | Tested status |
|---|---|---|---|---|
| 2026-09-15 | Added a dedicated operating manual alongside the existing visual component library. | `src/pages/guide.astro`, `src/styles/library.css`, `src/pages/library.astro` | Link the Library overview to `/guide`. Preserve component previews and use the guide for procedural work. | Run `npm run build`, test `/library`, test `/guide`, and review mobile layouts. |

## Rules

- Record date, summary, exact affected files, upgrade instruction, and tested status.
- Do not add client-specific work to this changelog.
- Do not force existing client sites to upgrade automatically.
- State known limitations or migration risks clearly.
