# Portfolio Documentation Index

Last updated: 2026-04-08

This folder is the source-of-truth documentation set for understanding, rebuilding, operating, verifying, and restoring the portfolio platform. Together with `backend/aws-backups/2026-04-08/`, it should be enough to recreate the project from scratch.

## Start Here

1. `docs/MASTER-DOC.md`
- live system summary
- active resource inventory
- operational rules
- final review status

2. `docs/INFRASTRUCTURE-REBUILD-PLAYBOOK.md`
- rebuild-from-zero blueprint
- AWS provisioning order
- frontend/backend wiring order
- validation and recovery steps

3. `docs/TECH-STACK-AND-ARCHITECTURE.md`
- runtime architecture
- frontend/backend/auth/data/deployment design

4. `README.md`
- repo overview
- local setup
- verification commands
- AWS backup summary

## Repository and Structure

5. `docs/PROJECT-HIERARCHY.md`
- top-level boundaries
- active vs legacy folders
- runtime ownership map

6. `docs/FOLDER-HIERARCHY-TEXT.md`
- practical tree view
- important files and generated artifacts

## Operations, Risk, and History

7. `docs/UPDATES-LOG.md`
- recent changes grouped from code and git history

8. `docs/PROJECT-PROGRESS-LOG-2026-03-28_to_2026-04-08.md`
- chronological build and stabilization history

9. `docs/CRITICAL-ISSUES-WARNINGS-AND-PRECAUTIONS.md`
- failures we hit
- fixes we applied
- rebuild warnings
- security and backup precautions
- current review findings

10. `docs/VISUAL-EFFECTS-CATALOG.md`
- visual, motion, pointer, depth, and theme effects
- files where each effect lives

## Focused Setup Guides

11. `docs/admin-content-and-deploy-api-setup.md`
- admin content save
- deploy trigger
- ops APIs
- image upload setup

12. `docs/contact-email-setup.md`
- SES contact form flow
- API/Lambda contract
- validation and recovery notes

## AWS Backup Reference

13. `backend/aws-backups/2026-04-08/`
- exported live AWS inventory and service state
- Lambda ZIPs, API exports, table scans, infra metadata
- repo copy includes redaction where needed for safety

Use this order when onboarding or rebuilding:

1. `README.md`
2. `docs/MASTER-DOC.md`
3. `docs/INFRASTRUCTURE-REBUILD-PLAYBOOK.md`
4. `docs/CRITICAL-ISSUES-WARNINGS-AND-PRECAUTIONS.md`
