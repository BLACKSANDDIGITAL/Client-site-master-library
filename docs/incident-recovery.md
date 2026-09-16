# Incident Recovery

This document covers common incidents, their impact, and recovery procedures for client websites built from the master library.

## Deployment failures

### Symptom: Cloudflare Pages build fails

1. Check the Cloudflare Pages build log for the first error message
2. Run `npm run build` locally to reproduce
3. Fix the first error (ignore later stack-trace lines until the first is resolved)
4. Commit and push the fix
5. Verify Cloudflare rebuilds successfully
6. Check the affected page on the live site

### Symptom: Build succeeds but pages are blank or broken

1. Check browser console for JavaScript errors
2. Check that all imports resolve correctly (case-sensitive paths)
3. Verify JSON files are valid (run `npm run validate`)
4. Check for missing content files referenced by components
5. Rebuild and verify

## Content errors

### Symptom: Wrong business information displayed

1. Check `src/content/site.json` for the incorrect value
2. Update with the verified, approved information
3. Run `npm run production`
4. Push and verify

### Symptom: Missing services or pages

1. Check `src/content/services.json` for valid entries
2. Verify `src/pages/` contains the expected page files
3. Check for JSON syntax errors (missing commas, trailing commas)
4. Run `npm run validate`

## Rollback procedure

### Using Git

```bash
# View recent commits
git log --oneline -10

# Roll back to a known good commit
git revert <commit-hash>

# Or reset to a specific commit (use with caution)
git reset --hard <commit-hash>
```

### Using Cloudflare Pages

1. Go to the Cloudflare Pages dashboard
2. Select the project
3. Go to Deployments
4. Find the last known good deployment
5. Click "Promote to Production"

## Prevention

- Always run `npm run production` before pushing
- Test changes locally before deploying
- Make one change at a time when debugging
- Keep the implementation log updated
- Never force-push without creating a backup branch first
