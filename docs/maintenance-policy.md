# Maintenance Policy

This document defines how ongoing maintenance and update requests are handled for client websites built from the master library.

## What is included in standard maintenance

Standard maintenance covers routine content updates that do not change the site structure, add new pages, or require new integrations:

- Updating business name, phone, email, address, or hours in `src/content/site.json`
- Adding, removing, or updating services in `src/content/services.json`
- Adding, removing, or updating testimonials in `src/content/testimonials.json`
- Adding, removing, or updating FAQ entries in `src/content/faq.json`
- Updating service area information in `src/content/service-areas.json`
- Updating brand colors, fonts, or spacing in `src/styles/theme.css`
- Replacing images with approved alternatives
- Updating policy pages with approved legal text

## What requires a separate scope

The following changes may require a separate project scope and quote:

- Adding new pages or routes
- Adding new integrations (booking, payment, CRM, ecommerce)
- Major design changes or redesigns
- Custom applications or interactive features
- Content strategy or copywriting services
- SEO campaigns or content marketing
- Migration from another platform
- Adding new reusable components to the master library

## Update process

1. Request received in SuiteDash with page URL, requested change, and exact replacement content
2. Classify the request (content update vs. structural change)
3. Confirm scope and approval if needed
4. Edit the appropriate file (JSON first, theme.css second, components third, pages last)
5. Run `npm run production` to validate, build, and review
6. Commit and push to GitHub
7. Verify Cloudflare deployment succeeds
8. Check the live site
9. Notify the client of completion in SuiteDash

## Response times

- Standard content updates: within 2 business days
- Urgent corrections (factual errors, broken links): within 1 business day
- Structural changes: scoped and quoted within 5 business days

## Backup and rollback

- Git history provides full version control
- Each deployment creates a new Cloudflare Pages deployment with rollback capability
- Never make changes directly on the production domain without testing locally first

## Client responsibilities

- Provide accurate, approved content for updates
- Respond to review requests within 5 business days
- Notify the team of any business changes that affect website accuracy
- Maintain ownership of domain, hosting, and third-party accounts
