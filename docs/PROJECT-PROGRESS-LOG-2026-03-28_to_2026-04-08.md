# Portfolio Project Progress Log

Project: Portfolio Website with Hidden Admin Dashboard  
Owner: Navin Jairam  
Primary timeline: March 28, 2026 - April 8, 2026  
Live URL: `https://lucifernewstar-2006.xyz`

## Phase 1: Foundation

- created repository and Vite/React base
- established public portfolio direction
- reserved hidden admin path strategy
- selected AWS serverless architecture

## Phase 2: Authentication

- created Cognito user pool and hosted UI domain
- configured OAuth code flow with PKCE
- added login, callback, and protected route flow
- stabilized callback scope/client configuration

Key commits:

- `951bd3d`
- `b818b6b`

## Phase 3: Backend Foundation

- created DynamoDB tables for portfolio entities
- created CRUD Lambda fleet
- wired API Gateway REST API
- added GitHub activity sync support

## Phase 4: Frontend Buildout

- built public pages
- built hidden admin dashboard
- added CRUD managers
- added content manager and preview manager
- added cross-linking modal and case-study experiences

## Phase 5: Visual System Expansion

- added theme system and theme persistence
- added cinematic canvas particle background
- added atmosphere, overlay, cursor, spotlight, and scroll effects
- built page-specific layout polish and story motion
- tuned light and dark theme signatures

Key commits:

- `48933b8`
- `26495e6`
- `35c59bb`
- `2fa4cfe`

## Phase 6: Hosting and CI/CD

- added GitHub Actions CI and deploy workflows
- deployed frontend to S3 + CloudFront
- attached custom domain and certificate

Key commits:

- `2b8a1f6`
- `670072e`
- `8726bb3`
- `da2a931`

## Phase 7: Integrations

- added SES-backed contact flow
- added editable site content sync
- added admin deploy trigger path
- added DevOps/operations experience

Key commit:

- `72e20de`

## Phase 8: Stabilization and Hardening

Issues addressed:

- admin deep-link `404` behavior
- deploy `502` and dispatch configuration issues
- admin save `413` / `500` failures
- image handling and content-payload bloat
- bearer validation and least-privilege IAM hardening
- admin image upload safety

Key commits:

- `73d69c1`
- `b818b6b`
- `951bd3d`
- `b2feb00`
- `3e0f8f6`
- `e449531`
- `e755d85`

## Phase 9: Backup and Documentation

- exported live AWS state into `backend/aws-backups/2026-04-08/`
- added `backend/export-aws-backup.cmd`
- expanded docs into a rebuild blueprint
- added dedicated visual-effects and critical-issues references
- replaced placeholder root README with actual project documentation

## Final Outcome

The project now includes:

- live public portfolio
- hidden admin dashboard
- Cognito-protected admin APIs
- chunked cloud-backed content system
- safe image upload path
- deploy history and operations visibility
- AWS backup snapshot for recovery/reference
- rebuild-oriented docs set

Current validation state:

- lint passed locally
- production build passed locally
- no automated end-to-end browser suite exists yet, so full UI interaction validation remains partly manual
