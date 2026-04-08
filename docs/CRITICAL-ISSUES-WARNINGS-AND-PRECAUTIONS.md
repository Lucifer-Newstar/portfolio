# Critical Issues, Warnings, and Precautions

Last updated: 2026-04-08

This file documents the major problems encountered during the project, how they were addressed, what warnings still matter, and what precautions are required when rebuilding or operating the platform.

## 1. Critical Issues We Faced

### Admin deep-link and route-access problems

Symptoms:

- hidden admin route did not always behave correctly on direct navigation or refresh
- callback/protected-route flow drift caused admin access failures

Fixes applied:

- stabilized protected-route/session logic
- fixed Cognito Hosted UI callback flow
- corrected SPA route handling and callback targets

Precautions:

- always validate `/callback` and `/lucifer-newstar_dashboard` on localhost and production
- keep Cognito callback/logout URLs aligned with the actual domain

### Admin content save failures

Symptoms:

- `413 Payload Too Large`
- `500` save failures
- ordering/UX issues around save success state

Root causes:

- oversized full-content payloads
- embedded image data inside content JSON
- DynamoDB item-size pressure

Fixes applied:

- save only content overrides
- strip embedded `data:image/...` payloads
- chunk `site_content` into multiple DynamoDB items
- tighten frontend save-state sequencing

Precautions:

- never store image binaries in `site_content`
- treat `createContentOverrides()` as required behavior, not optional optimization

### Deploy trigger failures

Symptoms:

- admin deploy requests failing
- `502`-style deploy issues
- misconfiguration around workflow dispatch and token access

Fixes applied:

- deployed GitHub workflow dispatch path through Lambda
- moved GitHub PAT lookup to SSM
- increased/deconflicted deploy timeout
- validated workflow inputs and API wiring

Precautions:

- never reintroduce plaintext GitHub PATs into Lambda env vars
- confirm `/portfolio/github/token` exists and can be decrypted by the Lambda role

### Image handling failures

Symptoms:

- content payload bloat
- unsafe content persistence when images were embedded directly
- risk of uploaded images being deleted by deploy sync

Fixes applied:

- created `upload-admin-image` Lambda
- upload to S3 first, then store URL only
- updated deploy workflow to exclude `images/uploads/*`

Precautions:

- deploy command must continue to exclude `images/uploads/*`
- uploaded images are operational content, not build artifacts

### Contact and browser integration gaps

Symptoms:

- browser-facing APIs needed consistent CORS behavior

Fixes applied:

- allowlisted CORS handling now used in contact and site-content read/write paths

Precautions:

- keep `ALLOWED_ORIGINS` synced across browser-facing Lambdas
- do not rely on wildcard CORS for operational endpoints

## 2. Current Warnings From Final Check

### Security warning: backup artifacts can contain secrets

What was found:

- the checked-in Cognito backup snapshot originally contained `ClientSecret`

Action taken:

- repo copy was redacted to `REDACTED_IN_REPO_BACKUP`

Precautions:

- keep full unredacted backups outside the repo if needed
- review backup exports before committing them

### Bundle-size warning

What was found:

- frontend production build warns about a very large `three-stack` chunk

Risk:

- slower first-load performance

Precautions:

- keep watching large visual dependencies
- split heavy modules further if performance regresses

### Dynamic import warning

What was found:

- `LinkedDataModal.jsx` is both statically and dynamically imported

Risk:

- intended code-splitting for that module is not fully effective

Precautions:

- use either lazy loading or static loading consistently for that module

### Validation coverage warning

What was found:

- lint and build pass
- no automated end-to-end browser suite exists

Risk:

- buttons, cards, effects, and theme-specific interactions still depend on manual validation

Precautions:

- manual QA is still required for:
- every page
- every primary button
- both themes
- desktop and mobile
- admin login/save/deploy/upload flows

## 3. Setup Precautions

### Cognito

- ensure callback URLs include production and localhost callback routes
- ensure logout URLs include production and localhost base URLs
- keep frontend client ID/domain envs aligned with the real app client

### API Gateway

- add `OPTIONS` for browser-facing endpoints
- verify stage deployment after route changes

### DynamoDB

- preserve the `site_content` chunking model
- do not collapse the chunked model without checking size limits

### S3 + CloudFront

- preserve uploaded-image exclusion during deploy
- invalidate CloudFront after production syncs

### SES

- verify sender and recipient if SES is sandboxed
- keep Lambda region aligned with verified SES identity region

### Backups

- `backend/export-aws-backup.cmd` is the current export recipe
- verify the snapshot includes inventory, Lambda ZIPs, API export, table scans, and infra metadata
- sanitize secrets before committing repo copies

## 4. Suggested Final Manual Checklist

- check all public pages in light theme
- check all public pages in dark theme
- check admin login callback in production
- check content save
- check image upload
- check deploy trigger
- check contact form submit
- check ops pages and cards
- check mobile navigation and reduced-motion behavior
