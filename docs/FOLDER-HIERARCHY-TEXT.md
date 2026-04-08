# Folder Hierarchy (Text Format)

Last updated: 2026-04-08

Note: this hierarchy is the project source/infrastructure tree and intentionally excludes generated/vendor directories such as `.git`, `node_modules`, and `frontend/dist`.

```text
portfolio/
|- .github/
|  \- workflows/
|     |- ci.yml
|     \- deploy.yml
|- backend/
|  |- api-gateway/
|  |  \- portfolio-rest-api-prod-oas30.json
|  |- dynamodb/
|  |  \- schemas/
|  |     |- certifications.json
|  |     |- experience.json
|  |     |- posts.json
|  |     |- projects.json
|  |     \- skills.json
|  \- lambdas/
|     |- create-certification/
|     |  |- template.yaml
|     |  \- src/
|     |     \- index.mjs
|     |- create-experience/
|     |  |- template.yaml
|     |  \- src/
|     |     \- index.mjs
|     |- create-post/
|     |  |- template.yaml
|     |  \- src/
|     |     \- index.mjs
|     |- create-project/
|     |  |- template.yaml
|     |  \- src/
|     |     \- index.mjs
|     |- create-skill/
|     |  |- template.yaml
|     |  \- src/
|     |     \- index.mjs
|     |- delete-certification/
|     |  |- template.yaml
|     |  \- src/
|     |     \- index.mjs
|     |- delete-experience/
|     |  |- template.yaml
|     |  \- src/
|     |     \- index.mjs
|     |- delete-post/
|     |  |- template.yaml
|     |  \- src/
|     |     \- index.mjs
|     |- delete-project/
|     |  |- template.yaml
|     |  \- src/
|     |     \- index.mjs
|     |- delete-skill/
|     |  |- template.yaml
|     |  \- src/
|     |     |- index.mjs
|     |     \- .vscode/
|     |        \- launch.json
|     |- fetch-github-activity/
|     |  |- template.yaml
|     |  \- src/
|     |     \- index.mjs
|     |- get-certifications/
|     |  |- template.yaml
|     |  \- src/
|     |     \- index.mjs
|     |- get-experience/
|     |  |- template.yaml
|     |  \- src/
|     |     \- index.mjs
|     |- get-post/
|     |  |- template.yaml
|     |  \- src/
|     |     \- index.mjs
|     |- get-projects/
|     |  |- template.yaml
|     |  \- src/
|     |     \- index.mjs
|     |- get-skills/
|     |  |- template.yaml
|     |  \- src/
|     |     \- index.mjs
|     |- send-contact-email/
|     |  |- template.yaml
|     |  \- src/
|     |     \- index.mjs
|     |- update-certification/
|     |  |- template.yaml
|     |  \- src/
|     |     \- index.mjs
|     |- update-experience/
|     |  |- template.yaml
|     |  \- src/
|     |     \- index.mjs
|     |- update-post/
|     |  |- template.yaml
|     |  \- src/
|     |     \- index.mjs
|     |- update-project/
|     |  |- template.yaml
|     |  \- src/
|     |     \- index.mjs
|     \- update-skill/
|        |- template.yaml
|        \- src/
|           \- index.mjs
|- docs/
|  |- contact-email-setup.md
|  |- DOCS-INDEX.md
|  |- FOLDER-HIERARCHY-TEXT.md
|  |- INFRASTRUCTURE-REBUILD-PLAYBOOK.md
|  |- MASTER-DOC.md
|  |- PROJECT-HIERARCHY.md
|  |- TECH-STACK-AND-ARCHITECTURE.md
|  \- UPDATES-LOG.md
|- frontend/
|  |- .gitignore
|  |- .nvmrc
|  |- eslint.config.js
|  |- index.html
|  |- package-lock.json
|  |- package.json
|  |- README.md
|  |- vite.config.js
|  \- src/
|     |- App.css
|     |- App.jsx
|     |- index.css
|     |- main.jsx
|     |- assets/
|     |  |- hero.png
|     |  |- react.svg
|     |  \- vite.svg
|     |- components/
|     |  |- AdvancedVisualOverlays.jsx
|     |  |- Breadcrumbs.jsx
|     |  |- DepthPrism.jsx
|     |  |- Footer.jsx
|     |  |- InsightCharts.jsx
|     |  |- InteractionEffects.jsx
|     |  |- LinkedDataModal.jsx
|     |  |- LoginButton.jsx
|     |  |- Navbar.jsx
|     |  |- PageThemeHandler.jsx
|     |  |- ParticleBackground.jsx
|     |  |- ProjectCaseStudyModal.jsx
|     |  |- ProtectedRoute.jsx
|     |  |- RouteMeta.jsx
|     |  |- SceneOrb.jsx
|     |  |- ScrollAnimations.jsx
|     |  |- ScrollProgress.jsx
|     |  |- ThemeAtmosphere.jsx
|     |  |- ThemeToggle.jsx
|     |  \- admin/
|     |     |- CertificationsManager.jsx
|     |     |- ContentManager.jsx
|     |     |- ExperienceManager.jsx
|     |     |- PostsManager.jsx
|     |     |- PreviewManager.jsx
|     |     |- ProjectsManager.jsx
|     |     \- SkillsManager.jsx
|     |- content/
|     |  \- siteContent.js
|     |- context/
|     |  |- site-content-context.js
|     |  |- SiteContentContext.jsx
|     |  |- theme-context.js
|     |  |- ThemeContext.jsx
|     |  |- useSiteContent.js
|     |  \- useTheme.js
|     |- data/
|     |  \- relationships.js
|     |- effects/
|     |  |- DarkParticleSphere.js
|     |  \- LightGoldRings.js
|     |- pages/
|     |  |- admin/
|     |  |  \- AdminDashboard.jsx
|     |  \- public/
|     |     |- About.jsx
|     |     |- Callback.jsx
|     |     |- Certifications.jsx
|     |     |- Contact.jsx
|     |     |- DevOpsLab.jsx
|     |     |- Experience.jsx
|     |     |- Home.jsx
|     |     |- Login.jsx
|     |     |- Posts.jsx
|     |     |- Projects.jsx
|     |     \- Skills.jsx
|     |- styles/
|     |  |- global.css
|     |  |- main.css
|     |  |- theme.css
|     |  |- components/
|     |  |  |- buttons.css
|     |  |  |- cards.css
|     |  |  |- FloatingIcons.jsx
|     |  |  \- ScrollProgress.jsx
|     |  |- pages/
|     |  |  |- certifications.css
|     |  |  |- contact.css
|     |  |  |- experience.css
|     |  |  |- posts.css
|     |  |  |- projects.css
|     |  |  \- skills.css
|     |  \- overrides/
|     |     |- admin-content.css
|     |     |- advanced-visuals.css
|     |     |- home-hero.css
|     |     |- interaction-mobile-polish.css
|     |     |- interaction.css
|     |     |- layout.css
|     |     |- navbar-explore.css
|     |     |- page-experiences.css
|     |     |- posts-source-cards.css
|     |     |- scroll-story.css
|     |     |- theme-signatures.css
|     |     |- typography-rhythm.css
|     |     \- visual-additions.css
|     \- utils/
|        |- adminAuth.js
|        |- api.js
|        \- portfolioInsights.js
|- public/
|  |- favicon.svg
|  \- icons.svg
|- src/
|  |- App.css
|  |- App.jsx
|  |- index.css
|  |- main.jsx
|  |- assets/
|  |  |- hero.png
|  |  |- react.svg
|  |  \- vite.svg
|  |- components/
|  |  |- Footer.jsx
|  |  \- Navbar.jsx
|  \- pages/
|     |- admin/
|     |  \- AdminDashboard.jsx
|     \- public/
|        |- Achievements.jsx
|        |- Contact.jsx
|        |- Home.jsx
|        |- Posts.jsx
|        |- Projects.jsx
|        \- Skills.jsx
|- .gitignore
|- eslint.config.js
|- index.html
|- package-lock.json
|- package.json
|- README.md
\- vite.config.js
```
