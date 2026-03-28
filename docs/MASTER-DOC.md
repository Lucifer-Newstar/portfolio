# Portfolio Project — Master Documentation

---

## Document Information

| Field | Value |
|-------|-------|
| **Project Name** | Portfolio Project |
| **Owner** | Navin |
| **Purpose** | Personal portfolio with hidden admin dashboard |
| **Created** | March 28, 2026 |
| **Last Updated** | March 28, 2026 |
| **Repository** | Private — GitHub |
| **Repo Name** | `portfolio` |
| **Local Path** | `D:/navin/Resume and Portfolio/portfolio/` |

---

## 1. Project Overview

### 1.1 What Is This Project?

A single website with two interfaces:

| Interface | Purpose |
|-----------|---------|
| **Public Website** | Portfolio showcasing skills, projects, achievements, and LinkedIn posts |
| **Admin Dashboard** | Private control panel with DevOps tools, content management, and personal tracking |

### 1.2 Why Build This?

- Demonstrate cloud, DevOps, and SRE skills
- Create a living portfolio that grows with your learning
- Build something practical that you actually use daily
- Learn by building a real-world, production-ready project

### 1.3 Key Challenge Solved

**How to log in without the public knowing?**

| Solution | Description |
|----------|-------------|
| Hidden Route | Admin accessible only at `https://domain.com/lucifer-newstar_dashboard` |
| No Login Button | No visible login button anywhere on public site |
| 404 on Unauthorized | Unauthenticated requests to admin route return 404 (not 401) |
| Only You Know | Only you know the path exists |

---

## 2. Feature List

### 2.1 Public Website Pages

| Page | Content | Status |
|------|---------|--------|
| Home | Hero section, typing animation, intro, featured highlights | Planned |
| Skills | Visual tech stack representation (radar chart, icons, skill levels) | Planned |
| Projects | Project cards with descriptions, tech stack, GitHub links, live demos | Planned |
| Achievements | Hackathons, certifications, awards, events timeline | Planned |
| Posts | LinkedIn feed integration (auto-pull from LinkedIn API) | Planned |
| Contact | GitHub, LinkedIn, email, contact form | Planned |

### 2.2 Admin Dashboard Features

#### DevOps / SRE Tools

| Feature | Purpose |
|---------|---------|
| Deploy History | View GitHub Actions workflow runs (success/fail) with timestamps |
| Manual Deploy Button | Trigger redeploy directly from dashboard |
| CloudWatch Metrics | Monitor Lambda invocations, API latency, error rates, uptime |
| Site Analytics | Page views, visitor stats, referral sources |
| Log Viewer | View CloudWatch logs in terminal-style interface |
| Infrastructure Status | Health checks for S3, CloudFront, API Gateway, Lambda |

#### Content Management

| Feature | Purpose |
|---------|---------|
| Project Visibility | Show/hide projects on public site |
| Skill Progress Tracker | Track learning progress (percentages, completion dates, notes) |
| Projects Manager | Add/edit/delete projects (title, description, tech stack, links) |
| Achievements Log | Add/edit/delete hackathons, certifications, events, awards |

#### Personal

| Feature | Purpose |
|---------|---------|
| LinkedIn Feed | Pull and display recent LinkedIn posts on public site |
| Resume Manager | Upload/update downloadable resume PDF |

---

## 3. Architecture & Stack

### 3.1 Frontend

| Component | Technology | Purpose |
|-----------|------------|---------|
| Framework | React + Vite | Fast development, modern tooling, hot reload |
| Routing | React Router | Navigation between pages + hidden admin route |
| Styling | Tailwind CSS | Utility-first CSS (added at final phase) |
| Animations | Framer Motion | Page transitions, hover effects, scroll animations |
| Charts | Recharts | Metrics visualization in admin dashboard |
| HTTP Client | Axios | API calls to backend endpoints |
| Icons | Lucide React | Clean, consistent, customizable icons |

### 3.2 Backend & Infrastructure

| Component | Technology | Purpose |
|-----------|------------|---------|
| Hosting | AWS S3 + CloudFront | Static site hosting + CDN + HTTPS + edge caching |
| Compute | AWS Lambda (Node.js) | Serverless functions for all backend logic |
| API | Amazon API Gateway | REST endpoints for admin dashboard CRUD operations |
| Database | Amazon DynamoDB | NoSQL database for skills, projects, achievements |
| Authentication | Amazon Cognito + IAM | User pool, MFA (Google Authenticator), role-based access |
| DNS | AWS Route 53 | Custom domain management and routing |
| SSL | AWS ACM | Free HTTPS certificate |
| Infrastructure as Code | Terraform | Provision all AWS resources programmatically |
| CI/CD | GitHub Actions | Build, test, deploy automation on push |
| Monitoring | Amazon CloudWatch + SNS | Metrics, logs, and email alerts |

### 3.3 Development Environment

| Component | Technology | Purpose |
|-----------|------------|---------|
| Containerization | Docker + Docker Compose | Consistent local development environment |
| Version Control | Git + GitHub (private) | Source code management and backup |
| Package Manager | npm | Dependency management |
| Code Editor | VS Code | Development environment with extensions |

### 3.4 Third-Party Integrations

| Service | API | Purpose |
|---------|-----|---------|
| GitHub | GitHub REST API | Fetch deploy history, trigger workflow dispatches |
| LinkedIn | LinkedIn API v2 | Pull recent posts to public page |

---

## 4. Infrastructure Diagram

┌─────────────────────────────────────────────────────────────────┐
│ GITHUB │
│ ┌─────────────┐ ┌─────────────────────┐ │
│ │ Source Code │ ─── push ────────→ │ GitHub Actions │ │
│ │ (Private) │ │ (CI/CD Pipeline) │ │
│ └─────────────┘ └──────────┬──────────┘ │
└─────────────────────────────────────────────────┼───────────────┘
│ deploy
↓
┌─────────────────────────────────────────────────────────────────┐
│ AWS │
│ │
│ ┌─────────┐ ┌──────────────┐ ┌──────────────────┐ │
│ │ S3 │ ←── │ CloudFront │ ←── │ Public Users │ │
│ │(Static │ │ (CDN) │ │ │ │
│ │ Files) │ └──────┬───────┘ └──────────────────┘ │
│ └─────────┘ │ │
│ │ /lucifer-newstar_dashboard │
│ ↓ │
│ ┌─────────────────────┐ │
│ │ Lambda@Edge │ ← Auth Check │
│ │ (Viewer Request) │ │
│ └──────────┬──────────┘ │
│ │ │
│ ┌──────────┴──────────┐ │
│ │ │ │
│ ↓ ↓ │
│ ┌────────────────┐ ┌────────────────────┐ │
│ │ Unauthorized │ │ Authorized │ │
│ │ Return 404 │ │ Serve Admin │ │
│ └────────────────┘ │ Dashboard │ │
│ └─────────┬──────────┘ │
│ │ │
│ ↓ │
│ ┌─────────────────────┐ │
│ │ Cognito │ │
│ │ (Login + MFA) │ │
│ └─────────────────────┘ │
│ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Backend Services │ │
│ │ │ │
│ │ ┌──────────┐ ┌──────────┐ ┌──────────────┐ │ │
│ │ │ API │ → │ Lambda │ → │ DynamoDB │ │ │
│ │ │ Gateway │ │ Functions│ │ (Skills, │ │ │
│ │ └──────────┘ └──────────┘ │ Projects, │ │ │
│ │ │ Achievements)│ │ │
│ │ └──────────────┘ │ │
│ │ │ │
│ │ ┌──────────────────────────────────────────────────┐ │ │
│ │ │ CloudWatch │ │ │
│ │ │ (Metrics, Logs, Alerts, Dashboard) │ │ │
│ │ └──────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘


---

## 5. Development Phases

| Phase | Focus | Deliverable | Estimated Time |
|-------|-------|-------------|----------------|
| **1** | Project Setup | React + Vite, folder structure, Git repo | Done |
| **2** | Public Pages Structure | All pages with placeholder content, React Router | 1-2 hours |
| **3** | Authentication | Cognito, IAM, MFA, hidden route protection | 3-4 hours |
| **4** | Admin Dashboard UI | Layout with all feature placeholders | 2-3 hours |
| **5** | Backend + Database | APIs, DynamoDB, Lambda functions | 4-5 hours |
| **6** | DevOps Features | Deploy history, manual deploy, CloudWatch metrics | 3-4 hours |
| **7** | Content Management | Skill tracker, projects manager, achievements log | 3-4 hours |
| **8** | LinkedIn Integration | Pull and display posts via LinkedIn API | 2-3 hours |
| **9** | Visual Polish | Tailwind CSS, animations, responsive design | 4-5 hours |
| **10** | Deployment | Terraform, GitHub Actions, go live | 3-4 hours |
| **11** | Documentation | Final docs, thread continuation prompts | 1-2 hours |

---

## 6. Security Considerations

| Concern | Mitigation |
|---------|------------|
| Admin route exposure | Hidden path `/lucifer-newstar_dashboard`, Lambda@Edge returns 404 for unauthenticated |
| Unauthorized access | Cognito MFA with Google Authenticator (TOTP) |
| IAM permissions | Least privilege principle — roles scoped to minimum required actions |
| Secrets exposure | GitHub Secrets for CI/CD, AWS Secrets Manager for runtime secrets |
| Source code visibility | Private GitHub repository |
| Credential leaks | `.gitignore` includes `.env`, `*.pem`, `secrets/` — no hardcoded credentials |
| API security | API Gateway with IAM authorization, Cognito authorizers |
| DDoS protection | CloudFront with AWS WAF (optional, can add later) |

---

## 7. Cost Management

| Service | Free Tier Limit | Expected Usage | Cost |
|---------|-----------------|----------------|------|
| S3 | 5GB storage, 20,000 GET requests | Well within | Free |
| CloudFront | 1TB data transfer | Well within | Free |
| Lambda | 1M requests/month | Far within | Free |
| API Gateway | 1M requests/month | Far within | Free |
| DynamoDB | 25GB storage | Far within | Free |
| Cognito | 50,000 MAU | Just you | Free |
| CloudWatch | 10 custom metrics, 5GB logs | Within | Free |
| Route 53 | $0.50/month per hosted zone | 1 zone | ~$6/year |
| ACM | SSL certificate | 1 certificate | Free |

**Estimated Monthly Cost:** < $0.50 (just Route 53)

---

## 8. Project Goals

### Technical Goals

- ✅ Build production-ready AWS serverless application
- ✅ Implement secure authentication with MFA (Google Authenticator)
- ✅ Use Infrastructure as Code (Terraform) for all AWS resources
- ✅ Set up CI/CD pipeline with GitHub Actions
- ✅ Integrate third-party APIs (GitHub, LinkedIn)
- ✅ Implement monitoring and observability with CloudWatch
- ✅ Create hidden admin route that returns 404 for unauthorized users

### Learning Goals

- Deepen AWS knowledge (Cognito, Lambda@Edge, CloudFront, IAM)
- Master Terraform for infrastructure provisioning
- Understand authentication flows and IAM best practices
- Build full-stack application with React + serverless architecture
- Practice SRE principles (monitoring, alerting, automation, SLIs)

### Portfolio Goals

- Demonstrate cloud architecture and DevOps skills
- Showcase automation and CI/CD expertise
- Prove SRE capabilities (metrics, monitoring, deployment tools)
- Provide live, working example with hidden admin interface

---

## 9. Key Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| March 28, 2026 | Private GitHub repository | Security — admin route code must not be public |
| March 28, 2026 | Admin route: `/lucifer-newstar_dashboard` | Personal, memorable, obscure enough |
| March 28, 2026 | Authentication: Cognito + IAM + MFA | Learn AWS auth services, secure, industry standard |
| March 28, 2026 | Stack: React + AWS serverless | Cost-effective, scalable, demonstrates cloud skills |
| March 28, 2026 | Docker for local development only | Keep production serverless, still show container skills |
| March 28, 2026 | No Kubernetes / Prometheus | Overkill for this project, add as separate project |
| March 28, 2026 | Terraform for IaC | Industry standard, declarative, reusable |
| March 28, 2026 | Tailwind CSS for styling | Utility-first, fast development, CSS added last |

---

## 10. Current Status

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1 — Project Setup | 🔄 In Progress | Repo created, React initialized, folder structure ready, code not yet pasted |
| Phase 2 — Public Pages | ⏳ Pending | |
| Phase 3 — Authentication | ⏳ Pending | |
| Phase 4 — Admin UI | ⏳ Pending | |
| Phase 5 — Backend | ⏳ Pending | |
| Phase 6 — DevOps Features | ⏳ Pending | |
| Phase 7 — Content Management | ⏳ Pending | |
| Phase 8 — LinkedIn Integration | ⏳ Pending | |
| Phase 9 — Visual Polish | ⏳ Pending | |
| Phase 10 — Deployment | ⏳ Pending | |
| Phase 11 — Documentation | 🔄 In Progress | Master documentation being created |

---

## 11. File Structure (Current)

portfolio/
├── frontend/
│ ├── public/
│ │ └── vite.svg
│ ├── src/
│ │ ├── assets/
│ │ │ └── react.svg
│ │ ├── components/
│ │ │ ├── Navbar.jsx (empty — needs code)
│ │ │ └── Footer.jsx (empty — needs code)
│ │ ├── pages/
│ │ │ ├── public/
│ │ │ │ ├── Home.jsx (empty — needs code)
│ │ │ │ ├── Skills.jsx (empty — needs code)
│ │ │ │ ├── Projects.jsx (empty — needs code)
│ │ │ │ ├── Achievements.jsx(empty — needs code)
│ │ │ │ ├── Posts.jsx (empty — needs code)
│ │ │ │ └── Contact.jsx (empty — needs code)
│ │ │ └── admin/
│ │ │ └── AdminDashboard.jsx (empty — needs code)
│ │ ├── App.jsx (default Vite code)
│ │ ├── main.jsx (default Vite code)
│ │ └── index.css (default Vite code)
│ ├── index.html
│ ├── package.json
│ ├── vite.config.js
│ └── .gitignore
├── docs/
│ └── MASTER-DOC.md (this file)
└── .git


---

## 12. Next Steps

1. ✅ Create master documentation (this file)
2. ⏳ Save this file to `/docs/MASTER-DOC.md`
3. ⏳ Commit and push to GitHub
4. ⏳ Begin Phase 2: Paste code into all component files
5. ⏳ Test locally with `npm run dev`
6. ⏳ Verify all routes work
7. ⏳ Commit and push

---

## 13. Document Maintenance

| Field | Value |
|-------|-------|
| Master Doc Created | March 28, 2026 |
| Last Updated | March 28, 2026 |
| Maintainer | Navin |
| Location | `/docs/MASTER-DOC.md` |
| Update Frequency | After each phase completion |
| Format | Markdown |

---

## 14. Edits Made
    1. Day-1 : 28-03-2026
    
*End of Master Documentation*