# Client Onboarding SOP

**Version:** 1.0  
**Repository:** `BLACKSANDDIGITAL/Client-site-master-library`  
**Stack:** Astro 7 + Bootstrap 5 + custom CSS theme system  
**Target:** Prepared content to reviewable draft in under 5 minutes

---

## How to use this SOP

This document is a reusable Standard Operating Procedure for onboarding a new client website from intake to published site. It can be followed manually in a terminal or given to an AI assistant as structured instructions.

**Variable placeholders** are written in `{BRACE_CASE}`. Replace them with the actual client values before or during execution.

| Placeholder | Example | Description |
|---|---|---|
| `{CLIENT_NAME}` | Acme Cleaning | Client business name |
| `{CLIENT_SLUG}` | acme-cleaning | Lowercase hyphenated identifier |
| `{BRANCH_NAME}` | client/acme-cleaning | Git branch name |
| `{DOMAIN}` | acmecleaning.com | Client's final domain |
| `{BLUEPRINT}` | service-enquiry | Blueprint ID from `src/blueprints/` |
| `{PRIMARY_COLOR}` | #0d6efd | Brand primary color hex |
| `{SECONDARY_COLOR}` | #6c757d | Brand secondary color hex |
| `{FONT_FAMILY}` | Inter | Google Fonts body font name |
| `{HEADING_FONT}` | Poppins | Google Fonts heading font name |
| `{PHONE}` | (555) 123-4567 | Business phone |
| `{EMAIL}` | info@acmecleaning.com | Business email |

---

## Prerequisites

### Environment

- Node.js >= 22.12 (managed via `fnm`)
- Git configured with GitHub access
- Repository cloned locally
- Cloudflare Pages project configured (for deployment)
- SuiteDash account (for client review workflow)

### Verify environment

```bash
fnm use 22
node --version    # Must be v22.12+
git --version
```

### Access required

| Service | Purpose | Required for |
|---|---|---|
| GitHub | Repository access | All phases |
| Cloudflare Pages | Hosting and deployment | Phase 9 only |
| SuiteDash | Client review and approval | Phase 8 only |
| Google Search Console | Sitemap submission | Phase 10 only |

---

## Phase 1: Project Initialization

**Goal:** Create a clean working branch from the master library.

**Automatable:** Yes, fully scriptable.

### Steps

```bash
# 1. Navigate to the repository
cd /path/to/Client-site-master-library

# 2. Ensure main is up to date
git checkout main
git pull origin main

# 3. Create a new branch for this client
git checkout -b {BRANCH_NAME}

# 4. Install dependencies
npm install

# 5. Verify baseline build
npm run build
```

### Checkpoint 1A: Baseline build passes

- **Pass:** 37 pages built, 0 errors, completes in under 2 seconds
- **Fail:** Do not proceed. Check Node.js version, run `npm install` again, check for conflicts

### Record

```bash
# Log the project start
echo '{"timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","event":"project-start","client":"{CLIENT_NAME}","branch":"{BRANCH_NAME}","blueprint":"{BLUEPRINT}"}' >> docs/implementation-log.jsonl
```

---

## Phase 2: Client Intake

**Goal:** Collect all client information and assets before building.

**Automatable:** Questionnaire can be sent automatically; content must be entered manually.

### Step 2.1: Send questionnaire

File to send: `docs/client-questionnaire.md`

Send this document to the client. It collects:

- Business identity (name, tagline, description)
- Contact information (phone, email, address, hours)
- Services (name, description, icon for each)
- Team members (name, role, bio, photo for each)
- Testimonials (client name, business, quote, rating)
- Service areas (cities, regions)
- Visual assets (logo, hero image, team photos, project photos)
- Conversion goals (primary CTA: call, form, booking)
- Social media links
- Existing domain and hosting details
- Policy approvals (privacy, terms, accessibility)

### Step 2.2: Track content requests

File: `docs/content-request-list.md`

Update this tracking list as content arrives. Mark each item as received or outstanding.

### Step 2.3: Fill scope template

File: `docs/scope-template.md`

Define:
- Which pages will be built
- Which components will be used
- What integrations are needed (forms, analytics, booking)
- What content the client is responsible for

### Step 2.4: Collect images

Request images in these formats and sizes:

| Image | Minimum size | Format | Naming |
|---|---|---|---|
| Logo | 200x60px | SVG preferred | `logo.svg` |
| Hero image | 1920x1080px | JPG/WebP | `hero.jpg` |
| About image | 800x600px | JPG | `about.jpg` |
| Team photos | 400x400px | JPG | `team/{firstname-lastname}.jpg` |
| Service images | 600x400px | JPG | `services/{slug}.jpg` |
| Project images | 800x600px | JPG | `projects/{slug}.jpg` |

### Checkpoint 2A: All content received

- **Pass:** All required content from the questionnaire is in hand, all images received at minimum sizes
- **Fail:** Do not proceed to build. Send reminders for outstanding items using `docs/content-request-list.md`

---

## Phase 3: Content Entry

**Goal:** Populate all JSON content files with verified client data.

**Automatable:** AI assistant can populate JSON files from questionnaire responses. Human must verify accuracy.

### Step 3.1: Core business data

**File:** `src/content/site.json`

Replace every field with the client's verified information:

```json
{
  "businessName": "{CLIENT_NAME}",
  "tagline": "Client tagline from questionnaire",
  "description": "One to two sentence business description",
  "phone": "{PHONE}",
  "email": "{EMAIL}",
  "address": {
    "street": "123 Main Street",
    "city": "Springfield",
    "state": "IL",
    "zip": "62701"
  },
  "hours": {
    "monday": "9:00 AM - 5:00 PM",
    "tuesday": "9:00 AM - 5:00 PM",
    "wednesday": "9:00 AM - 5:00 PM",
    "thursday": "9:00 AM - 5:00 PM",
    "friday": "9:00 AM - 5:00 PM",
    "saturday": "Closed",
    "sunday": "Closed"
  },
  "social": {
    "facebook": "https://facebook.com/...",
    "instagram": "https://instagram.com/...",
    "linkedin": "https://linkedin.com/..."
  },
  "logo": "/images/logo.svg",
  "primaryColor": "{PRIMARY_COLOR}",
  "secondaryColor": "{SECONDARY_COLOR}"
}
```

**Rules:**
- Never invent business facts, testimonials, expertise, or image permissions
- Only use information the client has explicitly provided
- Phone must be in `(XXX) XXX-XXXX` format
- Email must be a valid format
- All fields are required unless the questionnaire marks them optional

### Step 3.2: Services

**File:** `src/content/services.json`

```json
[
  {
    "slug": "residential-cleaning",
    "name": "Residential Cleaning",
    "description": "Professional cleaning for homes and apartments.",
    "icon": "house",
    "featured": true
  }
]
```

**Slug rules:**
- Lowercase only
- Words separated by hyphens
- Must be unique within the file
- Must match the service image filename in `public/images/services/`

### Step 3.3: Navigation

**File:** `src/content/navigation.json`

Update main and footer navigation to match the pages this client needs:

```json
{
  "main": [
    { "label": "Home", "href": "/" },
    { "label": "Services", "href": "/services" },
    { "label": "About", "href": "/about" },
    { "label": "Contact", "href": "/contact" }
  ],
  "footer": [
    { "label": "Privacy Policy", "href": "/privacy" },
    { "label": "Terms", "href": "/terms" },
    { "label": "Accessibility", "href": "/accessibility" }
  ]
}
```

### Step 3.4: Optional content files

Populate only the files relevant to this client. Leave irrelevant files empty or with demo content (marked "Demo").

| File | Populate when | Fields per item |
|---|---|---|
| `src/content/team.json` | Client has team members to showcase | name, role, bio, photo, slug |
| `src/content/testimonials.json` | Client has approved reviews | name, business, quote, rating (1-5) |
| `src/content/faq.json` | Client wants FAQ section | question, answer, category |
| `src/content/service-areas.json` | Client serves specific cities | city, state, zip, description |
| `src/content/locations.json` | Client has multiple locations | name, street, city, state, zip, phone |
| `src/content/pricing.json` | Client wants pricing displayed | name, description, price, features, featured |
| `src/content/process.json` | Client wants process timeline | step, title, description, icon |
| `src/content/products.json` | Product-based business | slug, name, description, price, image, featured |
| `src/content/portfolio.json` | Agency/freelancer/contractor | slug, title, category, description, image, client, date |
| `src/content/community.json` | Community organization | slug, title, type, description, date, location, image |

### Step 3.5: Place images

Copy all client images into `public/images/`:

```bash
# Example structure:
# public/images/
# ├── logo.svg
# ├── hero.jpg
# ├── about.jpg
# ├── team/
# │   ├── jane-doe.jpg
# │   └── john-smith.jpg
# ├── services/
# │   ├── residential-cleaning.jpg
# │   └── commercial-cleaning.jpg
# └── projects/
#     ├── project-one.jpg
#     └── project-two.jpg
```

Image filenames must:
- Be lowercase with hyphens
- Match the slug of the related content item
- Be at least the minimum size specified in Phase 2.4

### Checkpoint 3A: Content validation

```bash
npm run validate
```

- **Pass:** "All content validation checks passed." — proceed to Phase 4
- **Fail:** Fix the reported errors (JSON syntax, missing fields, invalid slugs) and re-run

---

## Phase 4: Blueprint Selection

**Goal:** Choose the page structure that matches the client's business type.

**Automatable:** AI assistant can recommend a blueprint based on the client's business type.

### Step 4.1: Select blueprint

| Blueprint ID | File | Business type |
|---|---|---|
| `service-enquiry` | `src/blueprints/service-enquiry.json` | General service business (cleaning, HVAC, plumbing, landscaping, roofing) |
| `appointment-enquiry` | `src/blueprints/appointment-enquiry.json` | Appointment-based business (salon, spa, clinic, dental) |
| `expert-consultation` | `src/blueprints/expert-consultation.json` | Professional services (legal, financial, consulting, accounting) |
| `product-discovery` | `src/blueprints/product-discovery.json` | Product-based business with a catalog |
| `portfolio-enquiry` | `src/blueprints/portfolio-enquiry.json` | Agency, freelancer, creative showcasing work |
| `participation-community` | `src/blueprints/participation-community.json` | Community organization, nonprofit, membership group |

### Step 4.2: Read the blueprint definition

Open the chosen blueprint JSON file. Note:
- **Pages:** Which pages to build and their routes
- **Sections:** The order of sections on each page
- **CTA behavior:** What the primary call-to-action does
- **Content requirements:** What content must be prepared
- **Image roles:** What images are needed

### Step 4.3: View blueprint examples

```bash
npm run dev
# Open http://localhost:4321/blueprints to see all six blueprints rendered
```

### Decision point: Blueprint matches client

- **Yes:** Proceed to Phase 5
- **No:** The existing blueprints may need modification. Modify the blueprint JSON in `src/blueprints/` to match the client's needs, or create a new blueprint following the same schema

---

## Phase 5: Theme Configuration

**Goal:** Apply the client's brand identity to the site.

**Automatable:** AI assistant can update CSS variables from brand guidelines.

### Step 5.1: Set brand colors

**File:** `src/styles/theme.css`

```css
:root {
  --bs-primary: {PRIMARY_COLOR};
  --bs-secondary: {SECONDARY_COLOR};
  --bs-body-bg: #ffffff;
  --bs-body-color: #212529;
}
```

### Step 5.2: Set typography

In the same `theme.css` file:

```css
:root {
  --bs-body-font-family: '{FONT_FAMILY}', system-ui, sans-serif;
  --bs-heading-font-family: '{HEADING_FONT}', var(--bs-body-font-family);
}
```

### Step 5.3: Add Google Fonts

**File:** `src/layouts/BaseLayout.astro`

Add in the `<head>` section:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family={FONT_FAMILY}:wght@400;500;600;700&family={HEADING_FONT}:wght@600;700&display=swap" rel="stylesheet" />
```

### Step 5.4: Configure canonical domain

**File:** `astro.config.mjs`

```javascript
export default defineConfig({
  site: "https://{DOMAIN}",
});
```

### Checkpoint 5A: Theme applied

- Verify colors render correctly in dev server
- Verify fonts load (check browser Network tab)
- Verify contrast ratios meet WCAG AA (minimum 4.5:1 for body text)

---

## Phase 6: Page Assembly

**Goal:** Assemble the page structure defined by the blueprint.

**Automatable:** AI assistant can modify page files based on blueprint section order.

### Step 6.1: Home page

**File:** `src/pages/index.astro`

Arrange sections in the order defined by the blueprint. Typical structure:

```
Hero → TrustBar → ServicesGrid → ImageText → WhyChooseUs → Process → Testimonials → ServiceAreaCTA → FAQ → ContactCTA
```

Import each section component and add it to the template:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Header from "../components/layout/Header.astro";
import Hero from "../components/sections/Hero.astro";
import TrustBar from "../components/sections/TrustBar.astro";
import ServicesGrid from "../components/sections/ServicesGrid.astro";
import WhyChooseUs from "../components/sections/WhyChooseUs.astro";
import Process from "../components/sections/Process.astro";
import Testimonials from "../components/sections/Testimonials.astro";
import ServiceAreaCTA from "../components/sections/ServiceAreaCTA.astro";
import FAQ from "../components/sections/FAQ.astro";
import ContactCTA from "../components/sections/ContactCTA.astro";
import Footer from "../components/layout/Footer.astro";
import site from "../content/site.json";
import services from "../content/services.json";
import testimonials from "../content/testimonials.json";
import faq from "../content/faq.json";
---

<BaseLayout title={`${site.businessName} — ${site.tagline}`} description={site.description}>
  <Header />
  <main>
    <Hero title={site.tagline} subtitle={site.description} />
    <TrustBar />
    <ServicesGrid services={services} />
    <WhyChooseUs />
    <Process />
    <Testimonials testimonials={testimonials} />
    <ServiceAreaCTA areas={site.serviceAreas} />
    <FAQ items={faq} />
    <ContactCTA phone={site.phone} />
  </main>
  <Footer />
</BaseLayout>
```

### Step 6.2: Service pages

**File:** `src/pages/services/[slug].astro`

Dynamic route — generates one page per service automatically. No manual page creation needed if `services.json` is populated.

### Step 6.3: About page

**File:** `src/pages/about.astro`

Include team grid, company story, values. Import `TeamGrid` component if team members exist:

```astro
import TeamGrid from "../components/sections/TeamGrid.astro";
import team from "../content/team.json";

<TeamGrid members={team} />
```

### Step 6.4: Contact page

**File:** `src/pages/contact.astro`

Includes contact form, business hours, address, map. The `ContactForm` component handles form submission:

```astro
import ContactForm from "../components/forms/ContactForm.astro";

<ContactForm services={services} />
```

### Step 6.5: Additional pages based on blueprint

| Page | File | Include when |
|---|---|---|
| Products | `src/pages/products/index.astro` + `[slug].astro` | Blueprint is `product-discovery` |
| Portfolio | `src/pages/portfolio/index.astro` + `[slug].astro` | Blueprint is `portfolio-enquiry` |
| Community | `src/pages/community/index.astro` + `[slug].astro` | Blueprint is `participation-community` |
| Pricing | `src/pages/pricing.astro` | Client wants pricing displayed |
| Thank You | `src/pages/thank-you.astro` | Always (form confirmation) |
| Privacy | `src/pages/privacy.astro` | Always |
| Terms | `src/pages/terms.astro` | Always |
| Accessibility | `src/pages/accessibility.astro` | Always |
| 404 | `src/pages/404.astro` | Always |

### Step 6.6: Remove unused demo content

For client production sites, remove or noindex demo routes that are not relevant:

```bash
# If client does not need products, portfolio, or community routes:
# Option A: Delete the pages (cleaner for client repos)
rm -rf src/pages/products src/pages/portfolio src/pages/community

# Option B: Keep them with noindex (they already have noindex={true})
# No action needed — they won't appear in search results
```

### Checkpoint 6A: Build passes

```bash
npm run build
```

- **Pass:** All pages build successfully
- **Fail:** Check import paths (case-sensitive), JSON syntax, missing content files

---

## Phase 7: Build and Verify

**Goal:** Run the full production workflow and verify the output.

**Automatable:** Yes, fully scriptable.

### Step 7.1: Run full production workflow

```bash
npm run production -- --force
```

This executes:

1. **Validation** — checks all JSON, slugs, references, required fields
2. **Build** — generates static HTML to `dist/`
3. **Review** — checks 638+ links, images, scripts, H1 tags, noindex tags
4. **Summary** — produces build ID, timing, SuiteDash-ready text

Expected output:

```
PRODUCTION SUMMARY
============================================================
  Status:       success
  Validation:   ~30ms
  Generation:   ~1.4s
  Review:       ~40ms
  Total:        ~1.5s
  Output:       dist/
```

### Step 7.2: Check review output

- **0 errors, 0 warnings:** Proceed to Phase 8
- **Warnings:** Read each warning. Fix if it indicates a real problem. Known acceptable warnings are documented in `docs/workflow-guide.md`
- **Errors:** Fix the root cause (first error in the log), rebuild

### Step 7.3: Preview locally

```bash
npm run preview
# Open http://localhost:4321
```

### Step 7.4: Manual visual check

Walk through every page in the browser:
- [ ] Home page loads, hero displays correctly
- [ ] All navigation links work
- [ ] Each service page loads with correct content
- [ ] About page shows team (if applicable)
- [ ] Contact form renders with all fields
- [ ] Footer shows correct business info
- [ ] 404 page works (visit a non-existent URL)
- [ ] Mobile layout looks correct (resize browser or use dev tools)
- [ ] All images load (no broken image icons)
- [ ] Colors and fonts match brand guidelines

### Checkpoint 7A: Automated checks pass

- **Pass:** Production workflow completes with 0 errors, 0 warnings. Manual visual check confirms all pages render correctly.
- **Fail:** Fix issues, re-run `npm run production -- --force`

---

## Phase 8: Client Review and Approval

**Goal:** Get the client to review and approve the site before deployment.

**Automatable:** SuiteDash summary can be generated automatically. Approval requires human sign-off.

### Step 8.1: Generate SuiteDash summary

File: `docs/suitedash-checklist.md`

Copy and fill the build-specific summary template:

```
Client: {CLIENT_NAME}
Build ID: [from production output]
Blueprint: {BLUEPRINT}
Theme: {PRIMARY_COLOR}, {FONT_FAMILY}/{HEADING_FONT}
Findings: [from review output]
Review Status: Automated checks passed. Pending human review.
Preview: [local preview URL or hosted preview URL]
```

### Step 8.2: Submit to SuiteDash

Paste the summary into SuiteDash as a task. Do not mark as approved.

### Step 8.3: Browser and device testing

Perform manual testing that the automated review cannot cover:

**Desktop browsers:**
- [ ] Chrome — all pages, forms, navigation
- [ ] Firefox — all pages, forms, navigation
- [ ] Safari — all pages, forms, navigation

**Mobile devices:**
- [ ] iOS Safari — responsive layout, touch targets, mobile CTA bar
- [ ] Android Chrome — responsive layout, touch targets, mobile CTA bar

**Keyboard accessibility:**
- [ ] Tab through every page — verify visible focus states
- [ ] Form submission via keyboard only
- [ ] No keyboard traps

**Accessibility audit:**
- [ ] Run Lighthouse audit — target 90+ accessibility score
- [ ] Verify color contrast meets WCAG AA (4.5:1 minimum)
- [ ] All images have descriptive alt text
- [ ] Form labels are properly associated
- [ ] ARIA landmarks present (header, nav, main, footer)

### Step 8.4: Client reviews

Send the preview link to the client. Give them the checklist from `docs/suitedash-checklist.md` to guide their review.

### Step 8.5: Incorporate feedback

If the client requests changes:
1. Edit the relevant content JSON or page files
2. Re-run `npm run production -- --force`
3. Re-verify
4. Send updated preview

### Checkpoint 8A: Client approval received

- **Pass:** Client has explicitly approved the site in writing (email, SuiteDash, or signed document)
- **Fail:** Do not proceed to deployment. Address feedback and re-submit

---

## Phase 9: Deployment

**Goal:** Publish the approved site to the client's domain.

**Automatable:** Git push triggers Cloudflare Pages deployment automatically. Domain configuration is manual.

### Prerequisites

- [ ] Client has approved the site (Checkpoint 8A)
- [ ] Domain DNS is configured (A record or CNAME pointing to Cloudflare Pages)
- [ ] All content is final (no placeholder text, no demo data on client-facing pages)
- [ ] `astro.config.mjs` has the correct `site` URL set to `https://{DOMAIN}`

### Step 9.1: Remove demo content from client-facing pages

```bash
# Verify no "Demo" prefixed content appears on client-facing pages
grep -r "Demo" src/content/ --include="*.json"
# If any Demo entries exist in files used by client pages, remove or replace them
```

### Step 9.2: Final build

```bash
npm run production -- --force
```

### Step 9.3: Commit and push

```bash
git add -A
git commit -m "Deploy: {CLIENT_NAME} website v1.0"
git push origin {BRANCH_NAME}
```

Cloudflare Pages detects the push, runs `npm run build`, and deploys `dist/` to the configured domain.

### Step 9.4: Configure custom domain (first deployment only)

In Cloudflare Pages dashboard:
1. Go to project settings
2. Add custom domain: `{DOMAIN}`
3. Cloudflare provides a CNAME target — add it to DNS
4. Wait for SSL certificate (5-15 minutes)

### Step 9.5: Verify deployment

```bash
# Wait for Cloudflare build to complete (check dashboard or CLI)
# Then verify the live site
curl -s https://{DOMAIN} | head -20
```

### Step 9.6: Promote to production (if using Cloudflare preview deployments)

If Cloudflare is configured with preview deployments:
1. Go to Cloudflare Pages dashboard
2. Find the latest deployment
3. Click "Promote to Production"

### Checkpoint 9A: Live site verified

- [ ] Visit `https://{DOMAIN}` — site loads
- [ ] Navigate every page on the live domain
- [ ] Submit a test form — verify it works
- [ ] Check SSL certificate is valid
- [ ] Verify sitemap is accessible at `https://{DOMAIN}/sitemap-index.xml`

---

## Phase 10: Post-Launch

**Goal:** Set up monitoring, analytics, and search engine indexing.

**Automatable:** Most steps can be scripted. Google Search Console requires manual verification.

### Step 10.1: Submit sitemap to Google

1. Add property in Google Search Console: `https://{DOMAIN}`
2. Verify ownership (DNS TXT record or HTML file)
3. Submit sitemap: `https://{DOMAIN}/sitemap-index.xml`

### Step 10.2: Set up analytics

**File:** `src/layouts/BaseLayout.astro`

Add analytics component:

```astro
---
import Analytics from "../components/seo/Analytics.astro";
---

<Analytics provider="plausible" domain="{DOMAIN}" />
```

Or for Google Analytics:

```astro
<Analytics provider="google" measurementId="G-XXXXXXXXXX" />
```

Commit and push:

```bash
git add -A
git commit -m "Add analytics"
git push origin {BRANCH_NAME}
```

### Step 10.3: Verify structured data

Test with Google's Rich Results Test:
- Enter `https://{DOMAIN}`
- Verify LocalBusiness, Organization, Service, and Breadcrumb schemas are detected

### Step 10.4: Performance check

Run PageSpeed Insights:
- Enter `https://{DOMAIN}`
- Target scores: 90+ Performance, 90+ Accessibility, 90+ Best Practices, 90+ SEO

### Step 10.5: Record completion

```bash
echo '{"timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","event":"launch-complete","client":"{CLIENT_NAME}","domain":"https://{DOMAIN}","status":"live"}' >> docs/implementation-log.jsonl

git add -A
git commit -m "Launch complete: {CLIENT_NAME}"
git push origin {BRANCH_NAME}
```

### Step 10.6: Set up maintenance schedule

File: `docs/maintenance-policy.md`

Communicate the maintenance terms to the client:
- What is included (content updates, security patches, performance monitoring)
- What is excluded (new features, design changes, third-party integrations)
- Response times for issues
- Backup and rollback procedures

### Checkpoint 10A: Launch complete

- [ ] Live site verified on `https://{DOMAIN}`
- [ ] Sitemap submitted to Google Search Console
- [ ] Analytics installed and receiving data
- [ ] Structured data validated
- [ ] PageSpeed scores meet targets
- [ ] Implementation log records launch-complete event
- [ ] Client informed of maintenance terms

---

## Quick Reference: Command Sequence

For an AI assistant or terminal automation, here is the complete command sequence from start to finish:

```bash
# Phase 1: Initialize
cd /path/to/Client-site-master-library
git checkout main && git pull origin main
git checkout -b {BRANCH_NAME}
fnm use 22 && npm install

# Phase 3: After content is entered, validate
npm run validate

# Phase 7: Full production workflow
npm run production -- --force

# Phase 7: Preview
npm run preview

# Phase 9: Deploy
git add -A
git commit -m "Deploy: {CLIENT_NAME} website v1.0"
git push origin {BRANCH_NAME}

# Phase 10: Post-launch
echo '{"timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","event":"launch-complete","client":"{CLIENT_NAME}","domain":"https://{DOMAIN}","status":"live"}' >> docs/implementation-log.jsonl
git add -A && git commit -m "Launch complete: {CLIENT_NAME}" && git push origin {BRANCH_NAME}
```

---

## Quick Reference: File Checklist

Files that must be created or modified for every client:

| File | Action | Phase |
|---|---|---|
| `src/content/site.json` | Populate with client business data | 3 |
| `src/content/services.json` | Populate with client services | 3 |
| `src/content/navigation.json` | Update nav to match client pages | 3 |
| `src/content/team.json` | Populate if client has team | 3 |
| `src/content/testimonials.json` | Populate if client has reviews | 3 |
| `src/content/faq.json` | Populate if client has FAQ | 3 |
| `src/content/service-areas.json` | Populate if client has service areas | 3 |
| `src/content/products.json` | Populate if product-based business | 3 |
| `src/content/portfolio.json` | Populate if portfolio business | 3 |
| `src/content/community.json` | Populate if community organization | 3 |
| `src/styles/theme.css` | Set brand colors and fonts | 5 |
| `src/layouts/BaseLayout.astro` | Add Google Fonts, analytics | 5, 10 |
| `astro.config.mjs` | Set canonical domain | 5 |
| `src/pages/index.astro` | Arrange sections per blueprint | 6 |
| `src/pages/about.astro` | Add team, story, values | 6 |
| `src/pages/contact.astro` | Verify form and contact info | 6 |
| `public/images/*` | Place all client images | 3 |
| `docs/implementation-log.jsonl` | Record start and completion | 1, 10 |
| `docs/scope-template.md` | Fill for this client | 2 |

---

## Quick Reference: Decision Tree

```
Client onboarding request
│
├─ Is all content received?
│   ├─ YES → Phase 3: Content Entry
│   └─ NO → Send questionnaire + content request list → Wait
│
├─ Which blueprint matches?
│   ├─ Service business → service-enquiry
│   ├─ Appointment business → appointment-enquiry
│   ├─ Professional services → expert-consultation
│   ├─ Product business → product-discovery
│   ├─ Portfolio/agency → portfolio-enquiry
│   └─ Community org → participation-community
│
├─ Does the client have a domain?
│   ├─ YES → Configure DNS to Cloudflare Pages
│   └─ NO → Register domain, then configure DNS
│
├─ Does the client need a blog?
│   ├─ YES → Not supported in current system (deferred)
│   └─ NO → Continue
│
├─ Does the client need e-commerce?
│   ├─ YES → Not supported in current system (deferred)
│   └─ NO → Continue
│
├─ Does the client need booking integration?
│   ├─ YES → Deferred — use enquiry CTA, not booking
│   └─ NO → Continue
│
└─ Final check: All checkpoints passed?
    ├─ YES → Deploy
    └─ NO → Fix and re-verify
```

---

## Rollback Procedure

If the deployment fails or the client rejects the site after launch:

### Option A: Git rollback

```bash
# Find the last known good commit
git log --oneline -10

# Revert the problematic commit
git revert {commit-hash}
git push origin {BRANCH_NAME}
```

### Option B: Cloudflare Pages rollback

1. Go to Cloudflare Pages dashboard
2. Select the project
3. Go to Deployments
4. Find the last known good deployment
5. Click "Promote to Production"

### Option C: Emergency rollback

```bash
# Reset to a specific commit (destroys uncommitted changes)
git reset --hard {commit-hash}
git push --force origin {BRANCH_NAME}
```

Use Option C only in emergencies. Always create a backup branch first:

```bash
git branch backup/pre-rollback
```

---

## AI Assistant Instructions

If you are an AI assistant executing this SOP, follow these rules:

1. **Never invent business facts.** Only use information the client has explicitly provided in the questionnaire or content files.
2. **Never fabricate testimonials, expertise, image permissions, or policy approval.**
3. **Use visibly labeled fictional fixtures for examples** — prefix with "Demo" and keep them out of client production output.
4. **Do not regenerate or replace existing client sites** without explicit replacement authorization. Use isolated fixtures for testing.
5. **Intake import must preserve existing values.** Show proposed changes and require explicit overwrite choice for conflicts.
6. **Modify source templates and generator logic**, not generated output, as the permanent solution.
7. **Keep blueprints and themes independent.** A blueprint defines pages, section order, component variants, CTA behavior, and content requirements. A theme controls appearance.
8. **Do not create separate visual or functional review-note files.** Use the SuiteDash checklist.
9. **Never mark browser/mobile/accessibility checks as passed** unless they were actually performed.
10. **Mark launch complete only after** the approved version is deployed and the live customer journey passes verification.
11. **The target is prepared content to reviewable draft in five minutes** (generation + verification, excluding human preparation, approval, and deployment).
12. **Do not stop after producing a plan.** Inspect actual source, implement changes, verify, and continue through all work.
