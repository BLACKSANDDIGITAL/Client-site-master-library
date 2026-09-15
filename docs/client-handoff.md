# Client Website Handoff

## Website details

- Live website URL:
- Launch date:
- Primary client contact:
- Team support contact:
- Repository:
- Cloudflare Pages project:
- Form provider:
- Booking provider:
- Analytics account:
- Search Console account:

## Client-owned accounts

The client should retain ownership or appropriate administrator access to:

- Domain registrar and DNS
- Cloudflare Pages or hosting account
- Form, booking, CRM, ecommerce, and payment accounts
- Analytics and Search Console
- Social profiles and Google Business Profile
- Client content, logos, images, and brand assets

## Routine content updates

For standard edits, update these files:

- `src/content/site.json` for business name, phone, email, address, hours, service areas, primary CTA, social links, and analytics ID.
- `src/content/services.json` for service cards and service detail pages.
- `src/content/testimonials.json` for approved reviews.
- `src/content/faq.json` for frequently asked questions.
- `src/styles/theme.css` for colors, fonts, spacing, radius, and shared visual direction.

Run:

```bash
npm run dev
npm run build
```

before publishing changes.

## Important reminders

- Keep business details accurate.
- Replace or remove outdated prices, hours, service areas, photos, offers, and policies promptly.
- Do not add reviews, ratings, awards, licenses, guarantees, or claims unless they are genuine and approved.
- Test form delivery after any form-provider change.
- Keep the domain and third-party account credentials secure.

## Maintenance

For maintenance or change requests, provide:

- Page URL
- Requested change
- Exact replacement copy
- Approved images or assets
- Deadline
- Required approval contact

## Support boundaries

The ongoing maintenance agreement or project scope controls included support. New features, additional pages, new integrations, ecommerce, major design changes, custom applications, and new content strategy work may require a separate scope.
