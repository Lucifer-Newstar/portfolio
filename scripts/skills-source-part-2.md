### Group 3: Cloud Architecture & Services (Platform Agnostic)

#### Concept: Compute Virtualization & Autoscaling
- Hypervisor types (Type 1 bare-metal vs Type 2 hosted)
- Virtual CPU and memory overcommitment
- Instance families (General purpose, Compute optimized, Memory optimized)
- Bootstrapping with user-data scripts
- Launch templates and launch configurations
- Scaling policies (Target tracking, Step scaling, Scheduled)
- Cooldown period and instance warm-up time
- Lifecycle hooks for graceful termination
- Placement groups for low-latency workloads
- Spot instance interruption handling

#### Tool: AWS EC2
- AMI (Amazon Machine Image) selection and creation
- Instance metadata service (IMDSv1 vs IMDSv2)
- Elastic IP allocation and remapping
- Elastic Network Interface (ENI) attachment
- Instance store vs EBS root volume persistence
- EC2 Image Builder for AMI pipeline
- EC2 Serial Console for troubleshooting
- Hibernate and stop/start behaviors

#### Tool: Azure VMSS (Virtual Machine Scale Sets)
- Scale-in policy configuration (Default, NewestVM, OldestVM)
- Overprovisioning to reduce deployment time
- Upgrade policies (Automatic, Rolling, Manual)
- Flexible orchestration mode vs Uniform
- Application Health Extension integration
- Custom script extension for post-deployment config
- Proximity placement groups for low latency

#### Concept: Object, Block & Archive Storage
- Storage durability and availability SLOs
- Data consistency models (Read-after-write, Eventual)
- Storage tiering and lifecycle transition policies
- Object versioning and delete markers
- Multipart upload for large objects
- Server-side vs Client-side encryption
- Pre-signed URLs for temporary access
- Replication (Cross-region, Same-region)
- Block volume snapshot and restore procedures
- IOPS provisioning and throughput limits

#### Tool: AWS S3
- Bucket naming and global uniqueness
- Storage classes (Standard, IA, Glacier Instant, Deep Archive)
- Lifecycle rules for tier transition and expiration
- S3 Object Lock for WORM compliance (Governance, Compliance)
- Access points and multi-region access points
- S3 Select for SQL query on objects
- Event notifications to Lambda, SQS, SNS
- Transfer Acceleration for fast uploads

#### Tool: AWS EBS
- Volume types (gp3, io2, st1, sc1)
- Multi-attach for clustered applications
- Fast snapshot restore (FSR) for instant volume creation
- Data lifecycle manager for automated snapshots
- RAID configuration across volumes for performance
- EBS direct APIs for snapshot block-level access

#### Concept: Managed Database Services
- Automated backup windows and retention periods
- Point-in-time recovery (PITR) capabilities
- Multi-AZ deployment for high availability
- Read replica creation and promotion
- Automatic minor version upgrades
- Parameter group and option group configuration
- Performance Insights and query analysis
- Encryption at rest (KMS integration) and in transit (SSL/TLS)
- Maintenance window scheduling

#### Tool: AWS RDS
- Database engines (Aurora, PostgreSQL, MySQL, Oracle, SQL Server)
- Aurora Serverless v1 vs v2 scaling
- RDS Proxy for connection pooling and IAM auth
- Enhanced monitoring for OS metrics
- Custom endpoint creation for read/write split
- Blue/Green deployment feature
- Exporting snapshots to S3 Parquet format

#### Tool: Azure SQL Database
- DTU-based vs vCore-based purchasing models
- Elastic pools for resource sharing across databases
- Geo-replication for disaster recovery
- Auto-failover groups configuration
- Hyperscale service tier architecture
- Azure AD authentication integration
- Vulnerability assessment and advanced threat protection
- Long-term retention (LTR) backup policy

#### Concept: Virtual Private Cloud (VPC) Networking
- CIDR block planning and non-overlapping ranges
- Subnet design (Public vs Private)
- Route table association and propagation
- Internet Gateway (IGW) and NAT Gateway placement
- Network ACLs (Stateless) vs Security Groups (Stateful)
- VPC peering and transitive routing limitations
- VPC Endpoints (Gateway vs Interface) for private service access
- DNS resolution and hostname settings
- Flow logs for network traffic analysis

#### Tool: AWS VPC
- Default VPC vs Custom VPC characteristics
- NAT Gateway vs NAT Instance trade-offs
- Egress-only Internet Gateway for IPv6
- VPC Reachability Analyzer
- Traffic Mirroring for packet inspection
- DHCP option sets for custom DNS/NTP
- Bring Your Own IP (BYOIP) for public addresses
- VPC sharing within AWS Organizations

#### Tool: Azure VNet
- System routes and user-defined routes (UDR)
- Service endpoints vs Private Link
- Network Security Group (NSG) and Application Security Group (ASG)
- VNet peering and gateway transit
- Azure Bastion for secure VM access
- Virtual Network NAT (NAT Gateway)
- Network Watcher tools (Connection troubleshoot, IP flow verify)

#### Concept: Identity & Access Management (IAM/RBAC)
- Principle of least privilege application
- Authentication (Identity) vs Authorization (Access) split
- User, Group, Role entity distinctions
- Policy evaluation logic and permission boundaries
- Resource-based vs Identity-based policies
- Cross-account access patterns (Trust policies)
- Temporary credentials via STS (Security Token Service)
- Access keys vs Console password vs MFA
- Privileged access management (PAM) concepts

#### Tool: AWS IAM
- Policy types (Managed, Inline, SCP)
- IAM policy evaluation flowchart (Deny overrides)
- Roles for EC2, Lambda, ECS tasks
- IAM Access Analyzer for external access review
- Credential report for user audit
- Service control policies (SCPs) at organization level
- Session tags for ABAC implementation
- IAM Identity Center (formerly SSO)

#### Tool: Azure Entra ID (formerly Azure AD)
- Tenant and directory structure
- App registrations and service principals
- Conditional access policies (Location, Device compliance, Risk)
- Privileged Identity Management (PIM) for JIT elevation
- Managed identities (System-assigned vs User-assigned)
- B2B guest user invitation flow
- B2C custom policies for CIAM scenarios
- Identity Protection risk detection

#### Concept: Serverless & Event-Driven Architecture
- Stateless function design principles
- Cold start latency and mitigation (Provisioned concurrency)
- Event source mapping and invocation types (Synchronous, Asynchronous)
- Choreography vs Orchestration patterns
- Dead letter queues (DLQ) for failed events
- Idempotency handling for duplicate events
- Saga pattern for distributed transactions
- Fan-out pattern using SNS or EventBridge
- Event schema evolution and versioning
- Function timeout and memory configuration trade-offs

#### Tool: AWS Lambda
- Runtime support (Managed runtimes, Custom runtime, Container images)
- Lambda layers for shared code/dependencies
- Environment variables and KMS encryption
- Lambda Destinations for async invocation result routing
- Provisioned concurrency and reserved concurrency
- Lambda Power Tuning for cost/performance optimization
- Extensions API for observability integration
- Lambda SnapStart for Java cold start reduction

#### Tool: AWS EventBridge
- Event buses (Default, Custom, Partner, Cross-account)
- Event pattern matching syntax (Prefix, Suffix, Numeric, IP)
- Input transformation with JSONPath
- Archive and replay for event recovery
- Schema registry and code binding generation
- Pipes for point-to-point integration
- Scheduler for cron-based triggers

#### Concept: Messaging & Queuing (Pub/Sub)
- Queue semantics (FIFO order, At-least-once delivery)
- Topic semantics (Fan-out, Filtering)
- Message visibility timeout and receipt handle
- Poison message handling and DLQ redrive
- Message deduplication strategies
- Batch processing for throughput optimization
- Push vs Poll consumer models
- Durability and persistence guarantees
- Exactly-once processing challenges and idempotency

#### Tool: AWS SQS / SNS
- SQS Standard vs FIFO queue distinctions
- Long polling (`WaitTimeSeconds`) vs Short polling
- SNS raw message delivery configuration
- SNS message filtering policies (Attribute-based)
- SQS delay queues and message timers
- Server-side encryption (SSE) key management
- SNS mobile push notifications (APNS, FCM)
- SQS extended client library for large payloads (via S3)

#### Tool: RabbitMQ
- Exchange types (Direct, Topic, Fanout, Headers)
- Queue binding patterns and routing keys
- Message acknowledgments (Auto vs Manual)
- Publisher confirms for reliable publishing
- Prefetch count for consumer load balancing
- Quorum queues for high availability
- Stream queues for large fan-out and replay
- Federation and shovel for cross-cluster connectivity
- Virtual hosts (vhosts) for multi-tenancy

#### Concept: Cloud Monitoring & Logging (Native)
- Metric resolution (Standard vs High resolution)
- Metric math and composite alarms
- Log group and log stream organization
- Log insights query language and aggregation
- Contributor insights for top-N analysis
- Anomaly detection bands for dynamic thresholds
- Canary monitoring for synthetic checks
- Dashboard variable templating and cross-account views
- Event-driven alerting and auto-remediation

#### Tool: AWS CloudWatch
- Namespace customization for custom metrics
- Embedded metric format (EMF) for high-cardinality logs
- Logs Insights query syntax (`filter`, `stats`, `parse`)
- CloudWatch Agent vs SSM Agent for EC2 metrics
- Synthetics canary blueprints (Heartbeat, UI monitor)
- Composite alarms with AND/OR logic
- ServiceLens for X-Ray trace integration
- Cross-account observability setup

#### Tool: Azure Monitor
- Data collection rules (DCR) and data collection endpoints
- Log Analytics workspace query (KQL language)
- Application Insights SDK auto-instrumentation
- Metric alerts (Static, Dynamic, Multi-resource)
- Workbooks for interactive reporting
- Action groups for notification routing
- Smart detection for anomaly identification
- Change analysis for troubleshooting configuration drift

#### Concept: FinOps & Cost Optimization
- Unit economics (Cost per transaction, Cost per user)
- Chargeback vs Showback models
- Tagging strategy for cost allocation
- Commitment-based discounts (Reserved Instances, Savings Plans)
- Right-sizing recommendations and automated action
- Idle resource identification and cleanup
- Anomaly detection for spend spikes
- Budget threshold alerting and forecast notifications

#### Tool: AWS Cost Explorer
- Cost and Usage Report (CUR) detailed line items
- Cost categories for custom grouping
- Savings Plans recommendations (Compute, EC2 Instance)
- Reserved Instance utilization and coverage reports
- Rightsizing recommendations across instance families
- Hourly and resource-level granularity filters
- Forecast creation based on historical spend

#### Concept: CLI & SDK Interaction
- Credential provider chain and resolution order
- Output formatting (JSON, Table, Text, YAML)
- Pagination handling for list operations
- Waiters for resource state polling
- Error retry and backoff configuration
- Dry-run operations for validation
- Query and filter expressions (`--query`, `--filter`)
- Configuration file vs Environment variable precedence

#### Tool: AWS CLI
- Named profiles for multi-account management
- SSO session login and token refresh
- `--generate-cli-skeleton` for input template
- Service-specific paginator configuration
- JMESPath query syntax for output filtering
- CloudShell integrated environment
- AWS CLI v2 auto-prompt feature

#### Tool: Boto3 (AWS SDK for Python)
- Client (low-level) vs Resource (high-level) API styles
- Session object and credential management
- Paginator interface for automatic token handling
- Waiter configuration and custom waiter creation
- Error handling (`ClientError`, `botocore.exceptions`)
- Streaming body handling (`read()`, `iter_lines()`)
- Presigned URL generation

#### Tool: Azure CLI
- `az configure` defaults for resource group/location
- `--query` JMESPath for output filtering
- Interactive mode (`az interactive`)
- Resource ID construction and parsing
- Extension management (`az extension add`)
- Deployment with ARM/Bicep template references
- `az rest` for calling Graph API endpoints

#### Concept: Well-Architected Framework Principles
- Operational Excellence pillar (Runbooks, IaC, Observability)
- Security pillar (IAM, Encryption, Detective controls)
- Reliability pillar (Fault isolation, Recovery procedures)
- Performance Efficiency pillar (Right-sizing, Caching, Scaling)
- Cost Optimization pillar (Spend awareness, Matching supply/demand)
- Sustainability pillar (Energy efficiency, Utilization improvement)
- Trade-off evaluation and risk-based decisions
- Lens-specific considerations (SaaS, Financial Services, HPC)
- Review process and continuous improvement lifecycle
