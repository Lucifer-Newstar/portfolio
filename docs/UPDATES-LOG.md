# Detailed Updates Log

Last updated: 2026-04-08

This log captures major functional and visual updates currently present in the working project state, plus recent implemented upgrades in this session.

## 1. CI/CD and Deploy Pipeline

- Added/maintained PR CI workflow:
- lint
- prod audit
- build
- Added/maintained production deploy workflow:
- build frontend
- deploy to S3
- invalidate CloudFront
- Node and package compatibility cleanup reflected in commit history (`Github Actions` fix series).

## 2. Auth and Admin Access

- Admin route protected with `ProtectedRoute`.
- Cognito Hosted UI login link generation through `adminAuth`.
- Callback flow writes fallback admin session.
- Admin logout clears session.
- Current model is fallback session-based post-callback (not PKCE token exchange).

## 3. Content Persistence and Cloud Sync

- Added draft/saved content architecture in `SiteContentContext`.
- Added remote site content snapshot mechanism using hidden posts record `__site-content__`.
- Added save operations to sync local + remote.
- Added admin save feedback UX.

## 4. Admin Dashboard UX

- Added tabbed admin console with overview/content/preview/CRUD tabs.
- Added preview manager with:
- saved vs draft mode
- light/dark side-by-side iframe comparison
- Added topbar status chips for save/deploy states.
- Added explicit `Deploy to Website` button.
- Added deploy error visibility (reason shown in admin UI).
- Added deploy trigger helper via `VITE_DEPLOY_WEBHOOK_URL`.

## 5. Visual System Upgrades

- Added advanced visual overlays:
- cinematic fog/beam
- telemetry orbits/nodes
- pointer aura
- device-tier fallbacks
- Added additive visual detail layer:
- section rails
- card sheen
- heading ornaments
- Added route-specific signature layer per page.
- Added typography rhythm layer:
- theme-specific display/body pairings
- heading underline language
- restored animated chromatic heading effect for `Navin Jairam`.
- Added interaction/mobile polish:
- reduced hover flinch
- reduced transform jitter
- mobile spacing and grid hardening
- overflow safeguards.

## 6. Feed and Posts Enhancements

- Added source detection for posts by type/link/title.
- Added source-specific card themes:
- GitHub
- LinkedIn
- LeetCode
- Notion
- Manual
- Other fallback
- Added source-specific labels and CTA copy (`View on GitHub`, etc.).
- Extended admin post type options to include new sources.

## 7. Contact Form Delivery

- Added real contact form submit flow from frontend (`submitContactForm`).
- Added backend Lambda `send-contact-email` with SES integration.
- Added setup doc for SES verification and route deployment.
- Contact form now surfaces success/failure messages in UI.

## 8. SEO/Metadata

- Added `RouteMeta` component.
- Dynamic per-route:
- document title
- description meta
- Open Graph tags
- Twitter card tags

## 9. Project Case Study Experience

- Enhanced `ProjectCaseStudyModal` with structured sections:
- Problem
- Approach
- Result
- Keeps existing workstream and stats blocks.

## 10. Security and Reliability Improvements

- `.env` ignore hardening present.
- Error messaging improved around deploy/contact submission paths.
- Backend contact payload validation added (name/email/message constraints).
- CORS-friendly Lambda responses standardized in new contact function.

## 11. Commit Lineage Snapshot (Recent)

Recent commit history includes:
- multiple UI upgrade waves
- GitHub Actions fixes
- dependency/runtime compatibility fixes
- Cognito authentication baseline commit

Use:

```bash
git log --oneline
```

for exact sequencing and SHA-level traceability.
