# AWS Backup Manifest

Date: `2026-04-08`
Project: `portfolio`
Account: `969849535462`
Region: `us-east-1`

This backup snapshot includes:

- `inventory/`: top-level service inventories
- `lambdas/`: live Lambda configs plus downloaded deployment ZIPs for every portfolio Lambda
- `apigateway/`: REST API config, resources, stages, deployments, and Swagger export with integrations
- `dynamodb/`: table descriptions and full table scans for `skills`, `projects`, `experience`, `certifications`, `posts`, and `site_content`
- `cognito/`: user pool, app client, domain, users, groups, and client listings
- `cloudfront/`: distribution config and invalidations
- `s3/`: bucket settings, object listings, and a synced copy of the current bucket contents
- `route53/`: hosted zone and record sets
- `acm/`: certificate description
- `ses/`: SES identity and quota state
- `iam/`: Lambda role plus inline and attached policy data
- `waf/`: CloudFront Web ACL configuration
- `ssm/`: SSM parameter inventory and metadata for `/portfolio/*`

Notes:

- `s3/bucket-cors.json` is empty because the bucket has no CORS configuration.
- `s3/bucket-versioning.json` is empty because bucket versioning is not enabled.
- Cognito domain state is covered by `cognito/describe-user-pool-domain.json`.
- `ssm/github-token-metadata.json` stores SSM parameter metadata and the encrypted SecureString value returned without decryption.
