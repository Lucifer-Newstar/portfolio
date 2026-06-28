# Ship Readiness Checklist

Last updated: 2026-05-15

This checklist is the repo-level finish line for calling the portfolio `resume-ready`. It is intentionally lighter than a near-production checklist and focuses on credibility, stability, and interview-safe claims.

## Verified In Repo

- Active frontend lives in `frontend/`; root `src/` is legacy only.
- Frontend CI path is green locally:
  - `npm run lint`
  - `npm run build`
  - `npm audit --omit=dev`
- SonarQube is wired as an optional GitHub Actions step, not an enforced gate by default.
- Deploy workflow preserves `images/uploads/*` during S3 sync.
- Content-save flow strips embedded image data and stores large payloads as chunked `site_content` records.
- Browser-facing admin/contact/content handlers use allowlisted CORS where the live browser flows depend on it.

## Still Requires Manual Live Verification

- Public routes in both themes
- Desktop and mobile navigation
- `/callback`
- `/lucifer-newstar_dashboard`
- Admin save flow
- Admin image upload flow
- Admin deploy trigger
- Contact form submit
- Public ops summary and admin ops insights

## Public Positioning Rules

- Emphasize: `React`, `Vite`, `AWS Lambda`, `API Gateway`, `DynamoDB`, `Cognito`, `S3`, `CloudFront`, `SES`, `GitHub Actions`, `observability`, `admin CMS`, `code quality`
- Phrase SonarQube as: `CI prepared for SonarQube` unless the GitHub secrets and variables are actually configured
- Do not claim: `Kubernetes`, `microservices`, or `Docker-based deployment`

## Local QA Notes

- A passing build is not enough for signoff because the repo still has no automated browser smoke suite.
- Contact submit, deploy trigger, content save, and image upload are intentionally live-integrated flows and should be tested carefully against real AWS resources.
- The remaining documented build-quality watch item is bundle size around the visual stack.
