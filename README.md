# Client Website Master Library

Reusable Astro website system for small-business marketing sites.

## What this project is

This repository is the internal master template used to create client-specific
marketing websites. It contains reusable components, example page patterns,
structured content files, visual library documentation, and delivery checklists.

Do not give the master repository to a client. Create a private client-specific
copy or repository when a project is approved.

## Start locally

```bash
npm install
npm run dev
```

Open the local address shown in Terminal.

## Important routes

- `/` — Demo homepage
- `/services` — Demo services page
- `/contact` — Demo contact page
- `/library` — Internal visual component and industry example library
- `/examples/home-service` — Full home-services example
- `/examples/professional-service` — Full professional-services example

## New client process

1. Duplicate this repository into a private client repository.
2. Replace verified data in `src/content/site.json`.
3. Replace service, FAQ, testimonial, process, and image data.
4. Update brand values in `src/styles/theme.css`.
5. Choose components and page recipes from `/library`.
6. Connect the approved form, booking, analytics, or CRM tool.
7. Test mobile layout, all links, contact routes, and form delivery.
8. Run `npm run build`.
9. Deploy a preview for review and get written launch approval.

## Key rules

- Use JSON data files for normal content updates.
- Do not hard-code business name, phone, email, or address repeatedly.
- Do not publish demo images, fake testimonials, invented ratings, unsupported claims, or unapproved logos.
- Client owns their domain and paid third-party service accounts.
- Add a component to the master library only if it is generic, useful for future projects, and tested.

## Production command

```bash
npm run build
```

Cloudflare Pages settings:

```text
Build command: npm run build
Build output directory: dist
```
