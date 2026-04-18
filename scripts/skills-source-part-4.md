### Group 6: Infrastructure as Code (IaC) & Configuration Management

#### Concept: IaC Principles (Declarative vs Imperative)
- Idempotency (Multiple executions yield same result)
- Immutable infrastructure vs Mutable configuration drift
- State management and locking for concurrency control
- Dependency graph calculation and parallel execution
- Plan/Preview before Apply workflow
- Code reuse via modules and composition
- Drift detection and reconciliation
- Separation of environment configuration from module definition

#### Tool: Terraform
- HashiCorp Configuration Language (HCL) syntax
- Provider ecosystem and version constraints
- Resource lifecycle meta-arguments (`depends_on`, `count`, `for_each`)
- Data sources for fetching external state
- Provisioners (`local-exec`, `remote-exec`, `file`) as last resort
- `terraform plan`, `apply`, `destroy` workflow
- `terraform state` command for manual state surgery (`mv`, `rm`, `list`)

#### Tool: Pulumi
- General-purpose language usage (TypeScript, Python, Go, C#, Java)
- Resource model and component resource abstraction
- Stack reference for cross-stack outputs
- Automation API for embedding Pulumi in applications
- Policy as Code with CrossGuard
- ESC (Environments, Secrets, Configuration) management
- Pulumi Insights for resource search and compliance

#### Concept: Terraform Core Workflow & State Management
- State file (`terraform.tfstate`) contents and sensitivity
- Remote state backends (S3, Azure Storage, GCS, Terraform Cloud)
- State locking mechanisms (DynamoDB table, Azure Lease blob)
- State versioning and rollback via backend
- `terraform refresh` vs `terraform plan -refresh-only`
- State import of existing resources (`terraform import`)
- Workspace isolation patterns (Separate directories vs Terraform Workspaces)
- State encryption at rest and in transit

#### Tool: Terraform Cloud / HCP Terraform
- Workspace execution modes (Remote, Local, Agent)
- VCS-driven workflow and speculative plans on PR
- Run triggers for workspace dependencies
- Sentinel policy as code (Advisory, Soft-mandatory, Hard-mandatory)
- Private module registry and provider registry mirror
- Cost estimation integration (Infracost)
- Ephemeral workspaces for short-lived environments

#### Tool: S3 Backend (for Terraform State)
- Bucket versioning enablement for state recovery
- DynamoDB table for state lock (Primary key `LockID`)
- Server-side encryption (SSE-S3 or KMS) configuration
- Cross-region replication for disaster recovery
- State file access logging for audit
- Path-based organization (`/env:/project:/terraform.tfstate`)

#### Concept: Terraform Module Development & Reusability
- Module composition (Root module, Child module)
- Input variable type constraints (`string`, `number`, `bool`, `list`, `map`, `object`)
- Output value exposure for dependent modules
- Module versioning and semantic import (`source = "..."?ref=v1.2.3`)
- Local values for internal computation
- Dynamic blocks for conditional nested configuration
- Validation blocks for input precondition checks
- `terraform-docs` for automated documentation

#### Concept: Terraform Workspaces & Environment Segregation
- `default` workspace and named workspace distinction
- State isolation per workspace under single backend
- `terraform.workspace` interpolation variable
- Environment segregation patterns (Workspace vs Directory layout)
- Terraform Cloud workspaces vs CLI workspaces
- Tagging and metadata management per workspace

#### Concept: Configuration Management (Idempotency)
- Desired state declaration vs Procedural scripts
- Inventory management and host grouping
- Facts gathering and variable precedence hierarchy
- Template rendering (Jinja2) for config file generation
- Handlers for service restart on change
- Role structure and dependency management
- Idempotent module execution (`creates`, `removes`, `changed_when`)

#### Tool: Ansible
- Control node and managed node communication (SSH, WinRM)
- Inventory formats (INI, YAML, Dynamic scripts, Plugins)
- Modules (`copy`, `template`, `lineinfile`, `package`, `service`, `user`)
- Playbook structure (Plays, Tasks, Roles)
- Variables (Host vars, Group vars, Play vars, Extra vars, Facts)
- Vault for secrets encryption (`ansible-vault`)
- Collections for content distribution (Ansible Galaxy)
- Execution strategies (Linear, Free, `serial` for rolling updates)

#### Concept: Immutable Infrastructure Concepts
- Golden Image creation pipeline
- Baking vs Frying (Pre-installed dependencies vs runtime install)
- Versioning and tagging of images
- Rolling replacement of instances vs In-place update
- Fast boot requirements for scaling events
- Image provenance and chain of custody

#### Tool: Packer
- Builder types (AWS EC2, Azure ARM, Docker, VMware, QEMU)
- Provisioners (Shell, Ansible, Chef, File, Powershell)
- Post-processors (Manifest, Artifact upload, Vagrant)
- HCL2 template syntax (`packer { required_plugins {...} }`)
- `source` block for builder configuration
- `build` block for combining sources and provisioners
- Communicator (SSH, WinRM) configuration

#### Concept: Secrets Lifecycle Management
- Secret rotation strategies (Automated, Manual with window)
- Dynamic secret generation for short-lived credentials
- Encryption as a Service (Transit engine)
- Leasing and TTL for temporary access
- Audit logging for secret access
- Secret versioning and rollback
- Zero-secret injection (Avoiding env vars)

#### Tool: HashiCorp Vault
- Secrets engines (KV v1/v2, Database, AWS, Azure, PKI, Transit)
- Authentication methods (Token, Userpass, LDAP, OIDC, Kubernetes, AppRole)
- Policies (HCL syntax for path-based capabilities)
- Namespaces for multi-tenancy (Enterprise)
- Dynamic database credentials (Lease management)
- PKI engine for internal CA and certificate issuance
- Vault Agent for auto-auth and template rendering (Sidecar/Init)

#### Concept: IaC Testing & Policy as Code
- Unit testing of Terraform modules (`terraform validate`, `plan` output assertions)
- Integration testing by provisioning and validating live resources
- Compliance checks against naming conventions and tagging
- Security misconfiguration detection (Open S3 buckets, public DBs)
- Cost estimation and budget policy enforcement
- Rego policy language for OPA

#### Tool: Open Policy Agent (OPA)
- Rego policy language (Rules, Functions, Comprehensions)
- Policy decision flow (Input document ? Policy evaluation ? Output)
- Bundle service for policy distribution
- OPA as sidecar or external service (REST API)
- `conftest` for testing structured configs (Terraform, K8s, Dockerfile)
- Gatekeeper for Kubernetes admission control
- Terraform Cloud Sentinel integration

### Group 7: Observability & Monitoring

#### Concept: The Three Pillars of Observability
- Metrics (Aggregated numeric data over time intervals)
- Logs (Immutable timestamped event records)
- Traces (Request flow through distributed system)
- Correlation of pillars via trace/span IDs in logs
- Exemplars linking metrics to specific trace examples
- High cardinality vs high dimensionality trade-offs
- Cardinality explosion prevention

#### Tool: OpenTelemetry (OTel)
- Specification vs Implementation separation
- Signals (Traces, Metrics, Logs, Baggage)
- SDK and API distinction for instrumentation
- Instrumentation libraries (Auto-instrumentation agents)
- Collector components (Receivers, Processors, Exporters, Connectors)
- OTLP protocol for data transmission
- Semantic conventions for attribute naming
- Context propagation (W3C Trace-Context, Baggage)

#### Concept: Metrics Instrumentation & Collection
- Metric types (Counter, Gauge, Histogram, Summary)
- Label/Tag cardinality impact on storage
- Aggregation temporality (Delta vs Cumulative)
- Pull model (Prometheus scraping) vs Push model (StatsD, OTLP)
- Federated collection for global aggregation
- Recording rules for pre-computed queries
- Downsampling and retention policies

#### Tool: Prometheus
- TSDB (Time Series Database) storage engine
- PromQL query language (Instant vectors, Range vectors, Functions)
- Scrape configuration (`scrape_interval`, `scrape_timeout`)
- Relabeling for target filtering and label manipulation
- Service discovery integrations (Kubernetes, EC2, Consul)
- Federation for hierarchical setups
- Remote write for long-term storage (Thanos, Cortex, Mimir)
- Alerting rule evaluation (`rules.yml`)

#### Concept: Metrics Visualization & Dashboard Design
- USE Method (Utilization, Saturation, Errors) for resources
- RED Method (Rate, Errors, Duration) for services
- The Four Golden Signals (Latency, Traffic, Errors, Saturation)
- Dashboard variable interpolation and template variables
- Time range controls and refresh intervals
- Row and panel repeat for dynamic dashboards
- Thresholds and color mapping (Green/Yellow/Red)
- Drill-down linking from aggregate to granular views

#### Tool: Grafana
- Data source plugins (Prometheus, Loki, Elasticsearch, CloudWatch, SQL)
- Panel types (Time series, Stat, Gauge, Table, Heatmap, Logs)
- Transformations for data manipulation (Join, Filter, Reduce, Sort)
- Alerting from dashboards and unified alerting UI
- Provisioning for configuration-as-code (Datasources, Dashboards, Alerts)
- Grafana Loki for log aggregation integration
- Tempo for trace visualization integration

#### Concept: Structured Logging & Aggregation
- Structured vs Unstructured log formats (JSON, Logfmt)
- Log levels (DEBUG, INFO, WARN, ERROR, FATAL)
- Contextual fields vs message string formatting
- Log sampling for high-volume debug logs
- Log aggregation pipeline (Fluentd, Logstash, Vector)
- Indexing strategies for fast search
- Retention and tiered storage (Hot/Warm/Cold/Archive)
- Correlation ID injection across services

#### Tool: Loki (Grafana Loki)
- Index-free design (Labels for indexing, Log content parsed at query)
- LogQL query language (Log queries, Metric queries from logs)
- Promtail agent for log scraping and relabeling
- Ruler component for alerting and recording rules
- Multi-tenancy via `X-Scope-OrgID` header
- S3/GCS/Azure Blob object storage backend
- Log retention based on stream label policies

#### Tool: Elasticsearch (ELK Stack)
- Inverted index and tokenization for full-text search
- Cluster, Node, Index, Shard (Primary/Replica) concepts
- Index lifecycle management (ILM) policies (Hot ? Warm ? Cold ? Delete)
- Beats for data shipping (Filebeat, Metricbeat, Heartbeat)
- Kibana Query Language (KQL) and Lucene syntax
- Kibana Lens for drag-and-drop visualization
- Watcher for alerting and scheduled actions

#### Concept: Distributed Tracing & Context Propagation
- Trace (Root span + Child spans) and Span (Operation name, Duration)
- SpanContext (TraceID, SpanID, TraceFlags, TraceState)
- Sampling strategies (Head-based, Tail-based)
- Propagation formats (W3C Trace-Context, B3, Jaeger)
- Service dependency graph visualization
- Span tags for error marking and type identification
- Span events for point-in-time annotations

#### Tool: Jaeger
- Components (Agent, Collector, Query, Ingester)
- All-in-one vs Production deployment topology
- Storage backends (Cassandra, Elasticsearch, Badger, Memory)
- Adaptive sampling for tail-based decision
- Service Performance Monitoring (SPM) for latency trends
- Compare traces functionality for regression analysis
- Jaeger UI for trace waterfall view

#### Tool: Tempo (Grafana Tempo)
- Trace ID lookup without full-text search indexing
- Object storage backend for cost-effective retention
- TraceQL for searching traces by attributes
- Metrics-generator for RED metrics from spans
- Exemplar support for linking metrics to traces
- Scalable monolithic mode vs Microservices mode
- Integration with OpenTelemetry Collector

#### Concept: Alerting Rules & Notification Routing
- Alert threshold setting (Static vs Dynamic/Anomaly)
- Alert severity levels (P1 Critical, P2 Warning, P3 Info)
- Grouping alerts to reduce noise (Group by cluster/service)
- Inhibition rules (Suppress warnings if critical alert firing)
- Silences for planned maintenance windows
- Notification routing tree based on labels
- Escalation policies and on-call schedules

#### Tool: Alertmanager
- Alert routing tree configuration (`route` with `match`/`match_re`)
- Grouping parameters (`group_by`, `group_wait`, `group_interval`)
- Receivers configuration (Email, Slack, PagerDuty, Webhook, OpsGenie)
- Template system for custom notification messages
- Inhibition rules for dependency-based suppression
- High availability mode with gossip protocol

#### Tool: PagerDuty
- Service and Escalation Policy configuration
- Incident priority levels and urgency rules
- On-call schedules and rotation layers
- Event Orchestration for alert enrichment and routing
- Incident workflow automation (Custom actions, Webhooks)
- Post-incident response automation (PIR)
- Analytics and reporting on MTTA/MTTR metrics

#### Concept: Synthetic Monitoring (Proactive Checks)
- Blackbox testing vs Whitebox monitoring
- Protocol-level checks (HTTP, TCP, DNS, ICMP)
- Browser-based transaction scripts (User journey simulation)
- Multi-region check execution for global perspective
- SLA measurement via uptime/availability calculation
- SSL certificate expiry monitoring
- Response body validation and regex matching

#### Tool: Blackbox Exporter
- Probe modules (HTTP, TCP, DNS, ICMP, gRPC)
- Multi-target probing via `target` parameter
- TLS configuration for certificate expiry checks
- HTTP method support (GET, POST, HEAD)
- Expected response code and body regex validation
- Fail if body matches pattern for negative testing
- Relabeling for dynamic target generation

#### Tool: Uptime Robot
- Monitor types (HTTP(s), Ping, Port, Keyword)
- Check frequency configuration
- Public status page generation
- Maintenance windows scheduling
- Integration with Slack, Teams, Email, Webhook
- SSL expiration monitoring

#### Concept: Application Performance Monitoring (APM)
- Code-level transaction tracing (Hotspot identification)
- Database query performance analysis
- External service call latency measurement
- Error tracking with stack trace context
- Apdex score calculation for user satisfaction
- Real User Monitoring (RUM) vs Synthetic monitoring
- Service map auto-discovery

#### Tool: New Relic
- APM agents for language-specific instrumentation
- NRQL (New Relic Query Language) for data exploration
- Distributed tracing with infinite tracing
- Browser monitoring for frontend performance
- Error inbox for exception grouping and triage
- Alert conditions (NRQL-based, Anomaly detection)
- Workloads for entity grouping

#### Tool: Datadog
- Unified agent for metrics, logs, and traces collection
- Watchdog for automatic anomaly detection
- Service Catalog for ownership and SLO tracking
- Error Tracking for exception grouping
- Continuous Profiler integration
- Notebooks for collaborative investigation
- Incident Management lifecycle integration

#### Concept: Profiling & Continuous Profiling
- CPU profiling (On-CPU vs Off-CPU time)
- Memory allocation profiling (Heap usage, GC analysis)
- Flamegraph visualization (Icicle vs Standard view)
- Comparing profiles across time/releases (Differential profiling)
- Profiling in production (Low overhead sampling)
- eBPF-based profiling for system-wide visibility
- Correlation with metrics and traces (Exemplars)

#### Tool: Pyroscope
- Push and Pull ingestion modes
- Multi-language SDKs (Go, Java, Python, Ruby, .NET, Rust)
- Storage backends (Local disk, S3, GCS, Azure Blob)
- Adhoc profiling for immediate analysis
- Tagging for segmenting profiles (e.g., per version, region)
- Flamegraph diff for regression detection
- Grafana plugin integration

#### Tool: Parca
- eBPF-based agent for system-wide CPU profiling
- pprof protocol compatibility for Go/Rust/Java
- Object storage for long-term profile retention
- Multi-tenancy and data isolation
- Query language for profile analysis
- Continuous profiling and aggregation over time
