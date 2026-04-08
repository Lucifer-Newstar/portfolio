# Updates Log

Last updated: 2026-04-08

This file groups the latest implementation milestones using the current codebase plus recent commit history.

## 1. Final Verification Pass

Current pass updates:

- rewrote `README.md` from template placeholder into a project guide
- expanded docs to cover AWS backup contents and rebuild flow
- added dedicated critical-issues document
- aligned frontend fallback Cognito client ID with the live backup snapshot
- tightened CORS handling for contact and site-content read handlers to use allowlisted origins
- redacted Cognito `ClientSecret` from the repo copy of the backup snapshot

## 2. Deploy and Admin Stabilization

Related commits:

- `e755d85` Deploy Card fix
- `e449531` Image Upload Fix
- `3e0f8f6` enable-admin-image-uploads-safely
- `b2feb00` fix-admin-save-order
- `951bd3d` fix-cognito-spa-client-and-scope-for-hosted-ui
- `b818b6b` security-hardening-admin-auth-api-validation-and-iam-least-privilege
- `73d69c1` fix-admin-api-wiring-deploy-cors-content-editability

Outcomes:

- deploy trigger wired through GitHub workflow dispatch
- admin save status sequencing corrected
- Cognito Hosted UI callback and scope handling improved
- admin image upload route and Lambda added
- admin-sensitive routes hardened with bearer validation

## 3. Content Save Reliability

Related commits:

- `2fa4cfe` Devops Tools
- `b2feb00` fix-admin-save-order
- `8368fb9` Probably Final API update

Outcomes:

- override-based save model adopted
- embedded image payloads stripped before save
- `site_content` moved to chunked DynamoDB storage
- frontend save state synced more cleanly with successful remote writes

## 4. Observability and Ops

Related commits:

- `2fa4cfe` Devops Tools
- `e755d85` Deploy Card fix

Outcomes:

- added `ops-insights` Lambda and operations UI
- added public `GET /ops/summary`
- added admin `GET /admin/ops-insights`
- deploy history, health chips, metrics, and logs surfaced in the UI

## 5. Image and Asset Handling

Related commits:

- `3e0f8f6` enable-admin-image-uploads-safely
- `e449531` Image Upload Fix

Outcomes:

- `upload-admin-image` Lambda added
- `/admin/upload-image` route added
- uploaded images stored in S3 and saved as URLs
- deploy workflow preserves `images/uploads/*`

## 6. Visual System Work

Related commits:

- `35c59bb` UI Upgrade 6
- `26495e6` UI Upgrade 5
- `48933b8` UI Upgrade 4
- `72e20de` Add contact form email via SES
- `2fa4cfe` Devops Tools

Outcomes:

- stronger home hero and editorial layout polish
- deeper overlay and atmosphere system
- improved theme toggle presentation
- DevOps page and admin ops styling upgrades
- mobile interaction polish layer added

## 7. Contact and Communication

Related commit:

- `72e20de` Add contact form email via SES

Outcomes:

- SES-backed `POST /contact`
- frontend contact page wiring
- server-side validation and delivery path

## 8. Backup and Recovery

New repo artifacts:

- `backend/aws-backups/2026-04-08/`
- `backend/export-aws-backup.cmd`

Coverage:

- Lambda configs and ZIPs
- API Gateway exports
- table scans and schema metadata
- Cognito, CloudFront, Route 53, ACM, SES, IAM, WAF, SSM metadata

## 9. Known Remaining Non-Blocking Items

- no automated end-to-end browser test coverage exists
- large frontend bundle chunks remain
- some SAM templates describe key handlers but the AWS backup remains the more complete restore reference
