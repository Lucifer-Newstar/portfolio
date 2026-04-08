# Portfolio Project - Complete Progress Log

Last updated: 2026-04-08

Project: Portfolio Website with Hidden Admin Dashboard
Owner: Navin Jairam
Timeline: March 28, 2026 - April 8, 2026
Repository: Private - GitHub
Live URL: https://lucifernewstar-2006.xyz

This document preserves the end-to-end work log of the project journey from initial setup through live delivery. It is intended as a historical build record alongside the architecture and operational docs.

---

## Phase 1: Project Setup and Planning (March 28)

### Initial Decisions

| Decision | Choice |
|----------|--------|
| Admin path | `/lucifer-newstar_dashboard` |
| Authentication | Cognito + IAM + MFA |
| Stack | React + Vite, AWS Serverless |
| Repository | Private (security) |
| Docker | Local dev only |

### Completed

- Created private GitHub repo `portfolio`
- Initialized React + Vite project
- Created folder structure
- Set up React Router with all routes
- Created placeholder pages:
- Home
- Skills
- Projects
- Experience
- Certifications
- Posts
- Contact
- About
- Created master documentation

---

## Phase 2: Authentication (March 28-29)

### AWS Cognito Setup

| Task | Status |
|------|--------|
| User Pool created | `us-east-1_IWnaPdbK8` |
| App Client created | `2kqig6fjtjb5rot22ccttr398n` |
| Domain created | `us-east-1iwnapdbk8.auth.us-east-1.amazoncognito.com` |
| MFA enabled | Google Authenticator |
| User created | `navin.jairam@gmail.com` |

### Frontend Auth

- Login page with MFA
- `ProtectedRoute` component
- Callback handler
- Session management with 8-hour expiration

---

## Phase 3: Backend Infrastructure (March 29 - April 1)

### DynamoDB Tables Created

| Table | Purpose |
|-------|---------|
| `skills` | Skills taxonomy |
| `projects` | Portfolio projects |
| `experience` | Work experience |
| `certifications` | Credentials |
| `posts` | Feed posts + GitHub sync |
| `site_content` | Editable site content |

### Lambda Functions Created (21 total)

| Category | Functions |
|----------|-----------|
| Skills | create, get, update, delete |
| Projects | create, get, update, delete |
| Experience | create, get, update, delete |
| Certifications | create, get, update, delete |
| Posts | create, get, update, delete, sync-github |
| Content | get-site-content, save-site-content |
| Contact | send-contact-email |
| Deploy | deploy-website |

### API Gateway Routes (30+)

- Full CRUD for all resources
- CORS enabled on all methods
- Path parameters for `PUT` and `DELETE` via `/{id}`

---

## Phase 4: Frontend Development (April 1-4)

### Public Pages (11)

| Page | Features |
|------|----------|
| Home | Hero, typewriter, bento grid, signal deck, 3D orb |
| About | Bento layout, stepper, accordion, principle cards |
| Skills | Category filters, skill tiles, subskills, completion meters |
| Projects | Tech filters, case study modal, workstreams |
| Experience | Timeline cards, expandable details |
| Certifications | Card grid, skill tags, credential links |
| Posts | Source detection (GitHub, LinkedIn, LeetCode, Notion) |
| Contact | Form, reason picker, contact cards |
| DevOps Lab | Charts, tools, capability cards |
| Login | Cognito MFA |
| Callback | Auth redirect |

### Admin Dashboard (8 tabs)

| Tab | Features |
|-----|----------|
| Overview | Stats, quick actions, comfort tools |
| Content | Editable JSON, image upload, import/export |
| Preview | Draft vs saved, light/dark side-by-side |
| Skills | CRUD manager |
| Projects | CRUD manager |
| Experience | CRUD manager |
| Certifications | CRUD manager |
| Posts | CRUD manager + GitHub sync |

### Cross-Linking Modal System

- Click skill -> shows related projects, certs, experience
- Click tech badge -> shows related skills
- Click cert skill -> shows related projects
- Reusable modal component

---

## Phase 5: Styling and Visual Effects (April 5-7)

### CSS Architecture (33+ files)

| Category | Files |
|----------|-------|
| Base | `global.css`, `theme.css`, `main.css` |
| Components | `buttons.css`, `cards.css` |
| Pages | 6 page-specific CSS files |
| Overrides | 14 advanced visual effects |

### Theme System

- Dark mode:
- Futuristic/Cyberpunk palette with cyan and purple
- Light mode:
- Royal/Luxury palette with gold and burgundy
- Page-specific theme variations
- Theme toggle with animated SVG

### Advanced Visual Effects

- Three.js particle background (theme-aware)
- GSAP scroll animations (fade, stagger, parallax)
- Custom cursor with trail
- Magnetic buttons
- Cinematic fog and beams
- Telemetry orbits and nodes
- Scroll progress ring
- Floating icons

---

## Phase 6: CI/CD and Deployment (April 5-7)

### GitHub Actions Workflows

| Workflow | Trigger | Actions |
|----------|---------|---------|
| `ci.yml` | Pull Request | Lint, audit, build |
| `deploy.yml` | Push to main | Build, S3 sync, CloudFront invalidate |

### AWS Resources Deployed

- S3 bucket: `navin-portfolio`
- CloudFront distribution
- Route 53 hosted zone: `lucifernewstar-2006.xyz`
- ACM SSL certificate

### Environment Variables

```env
VITE_API_BASE_URL=https://6e2n1oy6k9.execute-api.us-east-1.amazonaws.com/prod
VITE_COGNITO_DOMAIN=https://us-east-1iwnapdbk8.auth.us-east-1.amazoncognito.com
VITE_COGNITO_CLIENT_ID=2kqig6fjtjb5rot22ccttr398n
VITE_COGNITO_REDIRECT_URI=https://lucifernewstar-2006.xyz/callback
VITE_DEPLOY_WEBHOOK_URL=https://6e2n1oy6k9.execute-api.us-east-1.amazonaws.com/prod/admin/deploy
```

---

## Phase 7: Final Integrations (April 8)

### Contact Email (SES)

- Lambda `send-contact-email` created
- API route `POST /contact`
- SES email verified: `navin.jairam@gmail.com`
- Contact form sends emails to inbox

### Site Content Sync

- Lambda `get-site-content` created
- Lambda `save-site-content` created
- DynamoDB `site_content` table
- API routes `GET /admin/content` and `POST /admin/content`
- Admin "Save content" syncs to DynamoDB

### Deploy Webhook

- Lambda `deploy-website` created
- GitHub token created with repo + workflow scopes
- API route `POST /admin/deploy`
- Admin "Deploy to Website" triggers GitHub Actions

### CORS Fixes

- `OPTIONS` method configured for all routes
- Lambda-level CORS headers
- API Gateway CORS enabled

---

## Issues Encountered and Resolved

| Issue | Solution |
|-------|----------|
| Node.js version in CI/CD | Docker container with Node 22 |
| Path parameters not passing | Lambda proxy integration |
| Reserved keywords in DynamoDB | `ExpressionAttributeNames` |
| CORS preflight failures | `OPTIONS` method + proper headers |
| SES email not verified | Verified identity in SES |
| GitHub token missing | Created token with workflow scope |
| Lambda not finding `node_modules` | Added AWS SDK layer |
| ES module vs CommonJS | Used `import` syntax with `.mjs` |

---

## Repository Structure Snapshot

```text
portfolio/
|- .github/workflows/      (ci.yml, deploy.yml)
|- backend/
|  |- api-gateway/         (OpenAPI spec)
|  |- dynamodb/schemas/    (5 table schemas)
|  \- lambdas/             (21 Lambda functions)
|- docs/                   (documentation files)
|- frontend/
|  |- src/
|  |  |- components/       (35+ components)
|  |  |- pages/            (11 public + admin)
|  |  |- styles/           (33+ CSS files)
|  |  |- utils/            (`api.js`, `adminAuth.js`, `portfolioInsights.js`)
|  |  |- context/          (Theme, SiteContent)
|  |  |- content/          (`siteContent.js`)
|  |  \- data/             (`relationships.js`)
|  \- package.json
\- README.md
```

---

## Final Statistics

| Metric | Count |
|--------|-------|
| Total files | ~250 |
| Lines of code | ~15,000 |
| Lambda functions | 21 |
| DynamoDB tables | 6 |
| API Gateway routes | 30+ |
| React components | 35+ |
| CSS files | 33+ |
| Documentation pages | 7 |
| GitHub Actions workflows | 2 |
| Days to complete | 12 |

---

## Project Status

| Feature | Status |
|---------|--------|
| Public portfolio pages | Live |
| Hidden admin dashboard | Working |
| Cognito MFA authentication | Working |
| Full CRUD on all content | Working |
| Dark/Light theme system | Working |
| 3D particle background | Working |
| GSAP scroll animations | Working |
| Contact form with SES | Working |
| Content sync to DynamoDB | Working |
| Deploy button to GitHub Actions | Working |
| CI/CD pipeline | Working |
| Custom domain with HTTPS | Working |

---

## Note

This work log captures the major development path and delivery milestones as recorded during the build. For the current operational state, architecture details, and post-launch fixes, continue to use:

- `docs/DOCS-INDEX.md`
- `docs/MASTER-DOC.md`
- `docs/TECH-STACK-AND-ARCHITECTURE.md`
- `docs/UPDATES-LOG.md`
