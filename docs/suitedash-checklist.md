# SuiteDash Review Checklist

Use this checklist for every client build review in SuiteDash. Copy the build-specific summary below into the SuiteDash task.

## Build-specific summary template

```
Client ID: [client-name]
Build ID: [from npm run production output]
Blueprint: [service-enquiry | appointment-enquiry | expert-consultation | product-discovery | portfolio-enquiry | participation-community]
Theme: [theme name or token reference]
Findings: [list any review warnings or notes]
Review Status: Automated checks passed. Pending human review.
Preview: [preview URL or "Run 'npm run preview' locally"]
```

## Review checklist

### Content accuracy
- [ ] Business name, phone, email, address, hours, and service areas are correct
- [ ] All services, products, prices, and descriptions are accurate and approved
- [ ] All reviews and testimonials are genuine and approved for publication
- [ ] No demo text, placeholder images, or fake values remain
- [ ] Client has approved final copy and media

### Navigation and links
- [ ] Header navigation works
- [ ] Footer navigation works
- [ ] All internal links resolve correctly
- [ ] External links open the correct destination
- [ ] Phone, email, map, social, and booking links work
- [ ] 404 page works

### Forms and conversion
- [ ] Correct form type is used for the client goal
- [ ] Every field has a visible label
- [ ] Required fields are clear
- [ ] Success message or thank-you path works
- [ ] Form delivery tested (pending real endpoint)

### Responsive presentation
- [ ] Homepage works on phone, tablet, and desktop
- [ ] Navigation works on small screens
- [ ] No horizontal scrolling
- [ ] Images crop appropriately

### Accessibility baseline
- [ ] One clear H1 on each page
- [ ] Heading order is logical
- [ ] Keyboard focus is visible
- [ ] Interactive controls work with keyboard
- [ ] Informative images have useful alt text

### Technical checks
- [ ] npm run build succeeds
- [ ] Favicon loads
- [ ] robots.txt is correct
- [ ] Page titles and descriptions are unique and accurate
- [ ] Open Graph preview image exists

### Blueprint compliance
- [ ] All required sections are present for each page
- [ ] Optional sections hide cleanly when empty
- [ ] CTA labels match the blueprint definition
- [ ] CTA destinations are valid routes
- [ ] Image roles match the blueprint specification

### Library exclusion
- [ ] /library is not included in client output
- [ ] /guide is not included in client output
- [ ] /blueprints is not included in client output
- [ ] /examples are not included in client output

## Important notes

- A rebuild requires review of the new version
- Local manual approval is pending until verified evidence is connected
- Screenshots and automated checks do not equal client approval
- Conversion performance stays unmeasured until real results exist
- Do not mark approval complete until SuiteDash contains verified client sign-off
