@echo off
setlocal

set "ROOT=backend\aws-backups\2026-04-08"
set "REST_API_ID=6e2n1oy6k9"
set "USER_POOL_ID=us-east-1_IWnaPdbK8"
set "USER_POOL_CLIENT_ID=2kqig6fjtjb5rot22ccttr398n"
set "CLOUDFRONT_ID=ECVS4UV0ZKGHO"
set "BUCKET_NAME=navin-portfolio"
set "HOSTED_ZONE_ID=/hostedzone/Z02261853G6PLRJZNCNRP"
set "CERT_ARN=arn:aws:acm:us-east-1:969849535462:certificate/9ec7d419-495c-4160-86eb-c8cb57a60c45"
set "ROLE_NAME=lambda-dynamodb-role"
set "WAF_ACL_NAME=CreatedByCloudFront-6187136a"
set "WAF_ACL_ID=ce93e6ab-a586-4811-8047-a8af4556e879"

set "LAMBDAS=create-certification create-experience create-post create-project create-skill delete-certification delete-experience delete-post delete-project delete-skill deploy-website fetch-github-activity get-certifications get-experience get-post get-projects get-site-content get-skills ops-insights save-site-content send-contact-email update-certification update-experience update-post update-project update-skill upload-admin-image"
set "TABLES=certifications experience posts projects site_content skills"
set "POLICIES=lambda-ops-read-inline lambda-ssm-github-token-read lambda-upload-admin-image-s3"

mkdir "%ROOT%" 2>nul
mkdir "%ROOT%\inventory" 2>nul
mkdir "%ROOT%\lambdas" 2>nul
mkdir "%ROOT%\apigateway" 2>nul
mkdir "%ROOT%\dynamodb" 2>nul
mkdir "%ROOT%\cognito" 2>nul
mkdir "%ROOT%\cloudfront" 2>nul
mkdir "%ROOT%\s3" 2>nul
mkdir "%ROOT%\route53" 2>nul
mkdir "%ROOT%\acm" 2>nul
mkdir "%ROOT%\ses" 2>nul
mkdir "%ROOT%\iam" 2>nul
mkdir "%ROOT%\waf" 2>nul
mkdir "%ROOT%\ssm" 2>nul

aws lambda list-functions > "%ROOT%\inventory\lambda-list.json"
aws dynamodb list-tables > "%ROOT%\inventory\dynamodb-tables.json"
aws apigateway get-rest-apis > "%ROOT%\inventory\rest-apis.json"
aws cognito-idp list-user-pools --max-results 20 > "%ROOT%\inventory\user-pools.json"
aws cloudfront list-distributions > "%ROOT%\inventory\cloudfront-distributions.json"
aws s3api list-buckets > "%ROOT%\inventory\s3-buckets.json"
aws route53 list-hosted-zones > "%ROOT%\inventory\hosted-zones.json"
aws acm list-certificates --region us-east-1 > "%ROOT%\inventory\certificates.json"
aws ses list-identities --region us-east-1 > "%ROOT%\inventory\ses-identities.json"
aws iam get-role --role-name %ROLE_NAME% > "%ROOT%\inventory\iam-role.json"

for %%L in (%LAMBDAS%) do (
  mkdir "%ROOT%\lambdas\%%L" 2>nul
  aws lambda get-function --function-name %%L > "%ROOT%\lambdas\%%L\get-function.json"
  aws lambda get-function-configuration --function-name %%L > "%ROOT%\lambdas\%%L\configuration.json"
  for /f "usebackq delims=" %%U in (`aws lambda get-function --function-name %%L --query Code.Location --output text`) do (
    curl -L "%%U" -o "%ROOT%\lambdas\%%L\function.zip"
  )
)

aws apigateway get-rest-api --rest-api-id %REST_API_ID% > "%ROOT%\apigateway\rest-api.json"
aws apigateway get-resources --rest-api-id %REST_API_ID% > "%ROOT%\apigateway\resources.json"
aws apigateway get-stages --rest-api-id %REST_API_ID% > "%ROOT%\apigateway\stages.json"
aws apigateway get-deployments --rest-api-id %REST_API_ID% > "%ROOT%\apigateway\deployments.json"
aws apigateway get-stage --rest-api-id %REST_API_ID% --stage-name prod > "%ROOT%\apigateway\stage-prod.json"

for %%T in (%TABLES%) do (
  mkdir "%ROOT%\dynamodb\%%T" 2>nul
  aws dynamodb describe-table --table-name %%T > "%ROOT%\dynamodb\%%T\describe-table.json"
  aws dynamodb scan --table-name %%T > "%ROOT%\dynamodb\%%T\scan.json"
)

aws cognito-idp describe-user-pool --user-pool-id %USER_POOL_ID% > "%ROOT%\cognito\describe-user-pool.json"
aws cognito-idp describe-user-pool-client --user-pool-id %USER_POOL_ID% --client-id %USER_POOL_CLIENT_ID% > "%ROOT%\cognito\describe-user-pool-client.json"
aws cognito-idp describe-user-pool-domain --domain us-east-1iwnapdbk8 > "%ROOT%\cognito\describe-user-pool-domain.json"
aws cognito-idp list-users --user-pool-id %USER_POOL_ID% > "%ROOT%\cognito\list-users.json"
aws cognito-idp list-user-pool-clients --user-pool-id %USER_POOL_ID% --max-results 60 > "%ROOT%\cognito\list-user-pool-clients.json"
aws cognito-idp list-groups --user-pool-id %USER_POOL_ID% > "%ROOT%\cognito\list-groups.json"

aws cloudfront get-distribution --id %CLOUDFRONT_ID% > "%ROOT%\cloudfront\distribution.json"
aws cloudfront get-distribution-config --id %CLOUDFRONT_ID% > "%ROOT%\cloudfront\distribution-config.json"
aws cloudfront list-invalidations --distribution-id %CLOUDFRONT_ID% > "%ROOT%\cloudfront\invalidations.json"

aws s3api get-bucket-location --bucket %BUCKET_NAME% > "%ROOT%\s3\bucket-location.json"
aws s3api get-bucket-policy-status --bucket %BUCKET_NAME% > "%ROOT%\s3\bucket-policy-status.json"
aws s3api get-public-access-block --bucket %BUCKET_NAME% > "%ROOT%\s3\public-access-block.json"
aws s3api get-bucket-website --bucket %BUCKET_NAME% > "%ROOT%\s3\bucket-website.json"
aws s3api get-bucket-cors --bucket %BUCKET_NAME% > "%ROOT%\s3\bucket-cors.json"
aws s3api get-bucket-versioning --bucket %BUCKET_NAME% > "%ROOT%\s3\bucket-versioning.json"
aws s3api get-bucket-encryption --bucket %BUCKET_NAME% > "%ROOT%\s3\bucket-encryption.json"
aws s3api list-objects-v2 --bucket %BUCKET_NAME% > "%ROOT%\s3\list-objects-v2.json"
aws s3 sync "s3://%BUCKET_NAME%" "%ROOT%\s3\bucket-sync"

aws route53 get-hosted-zone --id %HOSTED_ZONE_ID% > "%ROOT%\route53\hosted-zone.json"
aws route53 list-resource-record-sets --hosted-zone-id %HOSTED_ZONE_ID% > "%ROOT%\route53\record-sets.json"

aws acm describe-certificate --certificate-arn %CERT_ARN% --region us-east-1 > "%ROOT%\acm\certificate.json"

aws ses get-identity-verification-attributes --identities navin.jairam@gmail.com --region us-east-1 > "%ROOT%\ses\verification-attributes.json"
aws ses get-identity-dkim-attributes --identities navin.jairam@gmail.com --region us-east-1 > "%ROOT%\ses\identity-dkim-attributes.json"
aws ses get-send-quota --region us-east-1 > "%ROOT%\ses\send-quota.json"

aws iam get-role --role-name %ROLE_NAME% > "%ROOT%\iam\role.json"
aws iam list-attached-role-policies --role-name %ROLE_NAME% > "%ROOT%\iam\attached-role-policies.json"
aws iam list-role-policies --role-name %ROLE_NAME% > "%ROOT%\iam\inline-role-policies.json"
for %%P in (%POLICIES%) do (
  aws iam get-role-policy --role-name %ROLE_NAME% --policy-name %%P > "%ROOT%\iam\%%P.json"
)

aws wafv2 get-web-acl --scope CLOUDFRONT --id %WAF_ACL_ID% --name %WAF_ACL_NAME% --region us-east-1 > "%ROOT%\waf\web-acl.json"

aws ssm describe-parameters --parameter-filters "Key=Name,Option=BeginsWith,Values=/portfolio/" > "%ROOT%\ssm\parameters-by-path.json"
aws ssm get-parameter --name /portfolio/github/token > "%ROOT%\ssm\github-token-metadata.json"

> "%ROOT%\README.txt" echo Portfolio AWS backup created on 2026-04-08. This snapshot includes Lambda code/config, API Gateway, DynamoDB schemas and data, Cognito, CloudFront, S3, Route 53, ACM, SES, IAM, WAF, and SSM metadata.
