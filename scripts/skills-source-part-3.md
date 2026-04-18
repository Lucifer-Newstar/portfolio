### Group 4: Containerization & Orchestration

#### Concept: Containerization & Isolation
- Linux namespaces (PID, NET, MNT, UTS, IPC, USER, Cgroup)
- Control groups (cgroups) v1 vs v2 resource limits
- Union filesystem (OverlayFS, AUFS) copy-on-write layering
- Container runtime interface (CRI) and OCI specifications
- Seccomp profiles for syscall filtering
- Capabilities dropping (`CAP_NET_ADMIN`, `CAP_SYS_ADMIN`)
- Rootless container execution
- Pivot_root vs chroot isolation differences
- Container lifecycle states (Created, Running, Paused, Stopped)

#### Tool: Docker
- Docker daemon (`dockerd`) and CLI (`docker`) communication
- Build context and `.dockerignore` optimization
- Multi-stage builds for image size reduction
- BuildKit features (`--mount=type=cache`, `--secret`)
- Volume mounts (Bind mount vs Named volume vs tmpfs)
- Network drivers (Bridge, Host, Overlay, Macvlan, None)
- Docker Compose project structure (`docker-compose.yml`)
- Docker Scout for vulnerability scanning
- `docker system prune` for resource cleanup

#### Tool: Podman
- Daemonless architecture (Fork-exec model)
- Rootless containers by default
- Pod concept for Kubernetes-like grouping
- Systemd integration for container lifecycle (`podman generate systemd`)
- Docker CLI compatibility via alias
- `podman machine` for non-Linux OS support
- Quadlet for declarative container definition

#### Concept: Image Layering & Supply Chain Security
- Layer caching and invalidation rules
- Instruction order optimization (Frequently changing last)
- Minimizing layer count and size with shell chaining
- Base image selection (Distroless, Alpine, Slim, Scratch)
- Software Bill of Materials (SBOM) generation
- Vulnerability scanning in CI pipeline
- Image signing and verification (Cosign, Notary)
- Provenance attestation (SLSA framework)
- Trusted content and official image verification

#### Tool: Dockerfile
- Instructions (`FROM`, `RUN`, `COPY`, `ADD`, `CMD`, `ENTRYPOINT`)
- Shell form vs Exec form for `CMD`/`ENTRYPOINT`
- `ARG` vs `ENV` variable scoping
- `HEALTHCHECK` instruction for container readiness
- `USER` switching for non-root execution
- `WORKDIR` for context setting
- Heredoc syntax for multi-line scripts (`<<EOF`)

#### Tool: Buildpacks / Cloud Native Buildpacks
- Auto-detection of language and framework
- Builder image and stack selection
- Build plan and layer reuse optimization
- Lifecycle phases (Detect, Analyze, Restore, Build, Export)
- `pack` CLI for local builds
- `kpack` for Kubernetes-native builds
- Rebasing for OS layer updates without full rebuild

#### Concept: Container Registry Management
- Repository naming conventions and tagging strategies
- Immutable tags vs Mutable tags (`latest` anti-pattern)
- Lifecycle policies for untagged and old image cleanup
- Cross-region and cross-account replication
- Vulnerability scanning on push
- Pull-through cache for public registry rate limit mitigation
- Image manifest list for multi-architecture support
- Registry authentication and credential helpers

#### Tool: AWS ECR
- Repository policies for cross-account access
- Lifecycle policy rule syntax (SinceImagePushed, CountMoreThan)
- Enhanced scanning (Inspector integration)
- Pull-through cache rules for Docker Hub / ECR Public
- VPC Endpoint for private registry access
- `ecr-login` credential helper
- Image replication for cross-region deployment

#### Tool: Docker Hub
- Official images and verified publisher badges
- Automated builds from GitHub/Bitbucket
- Webhook notifications for push events
- Rate limiting and authenticated pull quotas
- Teams and organizations for collaboration
- Vulnerability scanning (Docker Scout integration)

#### Concept: Orchestration Control Loops
- Declarative desired state vs Imperative commands
- Reconciliation loop and level-triggered logic
- Control plane components (API Server, etcd, Controller Manager, Scheduler)
- Watch mechanism and informer pattern
- Admission controllers (Mutating, Validating)
- Operator pattern and custom resource definitions (CRD)
- Finalizers for pre-deletion cleanup
- Garbage collection and owner references

#### Tool: Kubernetes (k8s)
- API Groups and resource versioning (`v1`, `apps/v1`, `networking.k8s.io/v1`)
- `kubectl` context and kubeconfig file structure
- Namespace isolation and resource quota scoping
- Labels for identification, Annotations for metadata
- Selector matching (Equality-based, Set-based)
- Taints and tolerations for node affinity
- Node affinity and anti-affinity scheduling rules
- Topology spread constraints for pod distribution

#### Concept: Kubernetes Workloads
- Pod as smallest deployable unit (Shared network/IPC namespace)
- Init containers for pre-start setup
- Sidecar vs Ambassador vs Adapter container patterns
- Deployment rolling update strategies (`maxSurge`, `maxUnavailable`)
- StatefulSet ordinal indexing and stable network identity
- DaemonSet for per-node agents
- Job and CronJob for batch workloads
- PodDisruptionBudget for voluntary disruption limits
- Horizontal Pod Autoscaler (HPA) metrics sources

#### Concept: Service Discovery & Ingress Traffic Flow
- ClusterIP, NodePort, LoadBalancer service types
- Headless service (`clusterIP: None`) for direct pod DNS
- EndpointSlices for scalable endpoint tracking
- ExternalName service for DNS CNAME aliasing
- Ingress vs Gateway API resource models
- Path-based and host-based routing rules
- TLS termination (Edge, Passthrough, Re-encryption)
- Session affinity (Sticky sessions) via cookie or source IP

#### Tool: Nginx Ingress Controller
- Annotation-based configuration (`nginx.ingress.kubernetes.io/*`)
- SSL passthrough for non-HTTP traffic
- Canary deployments by header/cookie/weight
- Custom snippet configuration for advanced directives
- Rate limiting and connection limiting annotations
- ModSecurity WAF module integration
- TCP/UDP service exposure via ConfigMap

#### Tool: Traefik
- Dynamic configuration via Ingress and CRD providers
- Middleware chain (Auth, Rate limit, Circuit breaker, Headers)
- Let's Encrypt ACME integration for auto-TLS
- Dashboard and API for configuration inspection
- TCP and UDP routers for non-HTTP workloads
- Service mesh interface (Traefik Mesh)

#### Concept: Persistent Storage for Stateful Workloads
- PersistentVolume (PV) and PersistentVolumeClaim (PVC) binding
- StorageClass provisioner and reclaim policies (Retain, Delete, Recycle)
- Access modes (ReadWriteOnce, ReadOnlyMany, ReadWriteMany)
- Volume expansion online resize support
- Snapshots and clone operations via VolumeSnapshot API
- CSI (Container Storage Interface) driver architecture
- Raw block volumes for database performance
- Local persistent volumes vs Network-attached trade-offs

#### Tool: Rook
- Ceph cluster orchestration (MON, OSD, MDS, RGW)
- Ceph block storage (RBD) provisioning for RWO volumes
- CephFS shared filesystem for RWX volumes
- Object store (S3-compatible) via RGW
- Ceph dashboard for cluster monitoring
- Node affinity for OSD placement
- Data-at-rest encryption integration

#### Tool: Longhorn
- Microservice-based storage controller and replica model
- Snapshots and backup to S3/NFS secondary storage
- Disaster recovery volume from backup
- Recurring job scheduling (Snapshot, Backup)
- ReadWriteMany (RWX) support via NFS gateway
- Volume live migration between nodes
- Node maintenance and draining procedures

#### Concept: Package Management & Templating
- Chart structure (`Chart.yaml`, `values.yaml`, `templates/`)
- Go templating language functions (`include`, `template`, `tpl`)
- Built-in objects (`.Values`, `.Release`, `.Chart`, `.Files`)
- Pipelines and control structures (`if`, `range`, `with`)
- Named templates and `_helpers.tpl` for reuse
- Dependency management (`requirements.yaml` / Chart dependencies)
- Hooks for lifecycle intervention (`pre-install`, `post-upgrade`)
- Library charts for shared logic

#### Tool: Helm
- `helm install`, `upgrade`, `rollback`, `uninstall` commands
- Release storage backends (Secrets v3, ConfigMaps v2)
- Repository management (`helm repo add`, `update`, `search`)
- OCI registry support for chart storage
- Post-renderer hooks for Kustomize integration
- Schema validation via `values.schema.json`
- `helm lint` and `helm template` for debugging

#### Concept: Resource Management (Limits/Requests)
- CPU request and limit units (Millicores vs Cores)
- Memory request and limit units (Mi, Gi)
- Quality of Service (QoS) class assignment (Guaranteed, Burstable, BestEffort)
- OOM (Out of Memory) kill scoring and eviction behavior
- CPU throttling and CFS quota impact
- LimitRange for default values per namespace
- ResourceQuota for namespace capacity planning
- Vertical Pod Autoscaler (VPA) recommend and update modes

#### Concept: Service Mesh & Sidecar Proxy Pattern
- Data plane (Sidecar proxy) vs Control plane split
- mTLS (Mutual TLS) automatic encryption between services
- Traffic routing (Weighted, Header-based, Path-based)
- Circuit breaking and outlier detection
- Fault injection (Delay, Abort) for resilience testing
- Observability (Metrics, Tracing, Access logs) without code changes
- Authorization policies (Service-to-service RBAC)

#### Tool: Istio
- Envoy proxy as sidecar container
- Istiod control plane consolidation
- VirtualService for routing rules
- DestinationRule for subset and load balancing policy
- Gateway for ingress/egress traffic control
- PeerAuthentication for mTLS strict/permissive mode
- AuthorizationPolicy for allow/deny rules
- Telemetry API for metrics customization

#### Tool: Linkerd
- Ultralight Rust-based micro-proxy (linkerd2-proxy)
- Zero-config mTLS with automatic certificate rotation
- `linkerd viz` extension for dashboard and metrics
- Service profile for per-route metrics and retries
- Tap command for live traffic inspection
- `linkerd jaeger` extension for distributed tracing
- Ingress integration (`nginx`, `traefik`, `emissary`)

#### Concept: Local Kubernetes Simulation
- Multi-node cluster simulation on single machine
- Node image and version selection
- Volume mount from host to cluster nodes
- Registry mirror and image pre-loading
- CNI (Container Network Interface) plugin selection
- Feature gate enablement for testing alpha features

#### Tool: Kind (Kubernetes in Docker)
- Cluster definition via YAML config file
- Node-to-container mapping (Control-plane and worker containers)
- Extra port mappings for LoadBalancer services
- `kind load docker-image` for local image loading
- MetalLB integration for LoadBalancer type services
- `kind export logs` for debugging cluster failures

#### Tool: Minikube
- Driver selection (Docker, Hyperkit, VirtualBox, KVM2, None)
- Addon system (`ingress`, `dashboard`, `metrics-server`, `registry`)
- `minikube mount` for host filesystem sharing
- Profile management for multiple clusters
- `minikube tunnel` for LoadBalancer service IP assignment
- Built-in image builder (`minikube image build`)

#### Tool: K3s
- Single binary distribution with embedded containerd and sqlite
- Lightweight datastore option (etcd vs SQLite)
- Built-in Traefik ingress controller
- ServiceLB for basic LoadBalancer functionality
- `k3s server` and `k3s agent` role separation
- Auto-deploying manifests from `/var/lib/rancher/k3s/server/manifests`
- Air-gap installation methods

### Group 5: DevOps Practices & CI/CD

#### Concept: CI/CD Pipeline Design
- Continuous Integration (Build, Test, Validate) definition
- Continuous Delivery (Manual deployment approval) vs Deployment (Automatic)
- Pipeline triggers (Push, PR, Schedule, Manual)
- Build matrix for multi-platform/language-version testing
- Artifact promotion across environments (Dev ? Staging ? Prod)
- Pipeline dependencies and sequential/concurrent stages
- Failure handling and conditional execution (`if: failure()`)
- Deployment protection rules and environment approvals
- Pipeline caching for dependency speedup

#### Tool: GitHub Actions
- Workflow file syntax (`.github/workflows/*.yml`)
- Event triggers (`push`, `pull_request`, `schedule`, `workflow_dispatch`)
- Runners (GitHub-hosted vs Self-hosted)
- Actions marketplace for reusable steps
- Composite actions vs JavaScript actions vs Docker container actions
- Secrets and variables management at repo/org level
- Artifact upload and download across jobs
- Reusable workflows for pipeline templating

#### Tool: Jenkins
- Master/Controller and Agent/Worker architecture
- Pipeline as Code (`Jenkinsfile` Declarative vs Scripted syntax)
- Shared libraries for common pipeline logic
- Credentials binding plugin (`withCredentials`)
- Blue Ocean UI for pipeline visualization
- Agent labels and node selection
- Multibranch pipeline for automatic PR discovery
- Build triggers (Poll SCM, Webhook, Upstream/Downstream)

#### Concept: Pipeline as Code (Declarative Syntax)
- YAML structure (Mappings, Sequences, Scalars)
- Anchors (`&anchor`) and aliases (`*anchor`) for reuse
- Multi-document files (`---` separator)
- Environment variable substitution syntax
- Conditional execution based on branch/tag patterns
- Matrix strategy for parallel execution
- Context availability per job step

#### Tool: YAML
- Indentation sensitivity and tab prohibition
- Quoting rules for strings with special characters
- Flow style (inline) vs Block style (indented)
- Multi-line strings (Folded `>` vs Literal `|`)
- Custom tags and schema validation
- YAML merge keys (`<<`)
- YAML linting tools (`yamllint`)

#### Concept: Build Automation & Dependency Management
- Dependency resolution and transitive dependency management
- Dependency scopes (Compile, Runtime, Test, Provided)
- Version locking and lock file generation
- Dependency graph analysis and conflict resolution
- Private repository authentication
- Build profiles for environment-specific configurations
- Incremental compilation and build caching
- Plugin and extension ecosystem integration

#### Tool: Maven
- Project Object Model (POM) structure and inheritance
- Build lifecycle phases (Validate, Compile, Test, Package, Verify, Install, Deploy)
- Dependency scopes (Compile, Provided, Runtime, Test, System, Import)
- Plugin goals and executions binding
- Multi-module project aggregation and parent POM
- Repository management (Central, Mirror, `settings.xml`)
- Archetype for project scaffolding

#### Tool: Gradle
- Groovy vs Kotlin DSL (`build.gradle` vs `build.gradle.kts`)
- Task dependency DAG (Directed Acyclic Graph)
- Configuration phases (Initialization, Configuration, Execution)
- Incremental build and build cache (`--build-cache`)
- Dependency configurations (`implementation`, `api`, `compileOnly`, `testImplementation`)
- Composite builds for local dependency substitution
- Gradle wrapper (`gradlew`) for version consistency

#### Tool: NPM / Yarn / PNPM
- `package.json` manifest structure (Scripts, Dependencies, Engines)
- Semantic versioning (Semver) and version constraint operators (`^`, `~`)
- `package-lock.json` / `yarn.lock` / `pnpm-lock.yaml` deterministic installs
- Workspaces / Monorepo support
- `npm ci` vs `npm install` behavior
- `npx` for package binary execution
- PNPM's content-addressable store and symlink strategy

#### Concept: Artifact Repository Management
- Binary repository vs Source repository distinction
- Snapshot vs Release repository policies
- Metadata indexing and search (GAV coordinates)
- Cleanup policies for old/unused artifacts
- High availability and replication across regions
- Repository layout for raw binaries vs package formats
- REST API for artifact lifecycle automation
- Promotion workflows (Staging repo ? Release repo)

#### Tool: JFrog Artifactory
- Repository types (Local, Remote, Virtual)
- Smart remote repository caching behavior
- Build integration for build-info publication
- User plugins for custom behavior (Groovy)
- AQL (Artifactory Query Language) for advanced search
- Release bundle creation and distribution
- JFrog CLI for scripted interactions

#### Tool: Nexus Repository
- Repository formats (Maven, npm, Docker, PyPI, Helm, Raw)
- Routing rules for Maven proxy behavior
- Blob store configuration and storage management
- Cleanup policies based on age/count/regex
- Staging profiles and release promotion
- Content selectors for fine-grained security
- Repository health check capabilities

#### Concept: Deployment Strategies
- Rolling update (Progressive instance replacement)
- Blue/Green (Two identical environments, traffic switch)
- Canary (Incremental traffic shift to new version)
- A/B Testing (User segmentation by headers/cookies)
- Shadow/Traffic mirroring (Duplicate requests to test version)
- Feature toggles for runtime deployment decoupling
- Rollback vs Roll-forward decision criteria
- Database schema migration compatibility (Expand, Migrate, Contract)

#### Tool: Argo Rollouts
- Rollout CRD extending standard Deployment
- BlueGreen strategy with preview service and active service
- Canary strategy with step-based weight increments
- AnalysisTemplate for metrics validation (Prometheus, Datadog, NewRelic)
- Experiment CRD for A/B and multi-version testing
- Rollback and abort via `kubectl argo rollouts`
- Dashboard UI for rollout visualization

#### Concept: Environment Management & Promotion
- Development, Staging, Pre-production, Production parity
- Environment-specific configuration injection
- Service discovery across environments
- Data seeding and sanitization for lower environments
- Promotion gate approvals (Manual, Automated based on tests)
- Environment locking to prevent concurrent deployments
- Ephemeral environments for pull request previews
- Drift detection between environment configurations

#### Concept: GitOps Principles (Source of Truth)
- Git repository as single source of truth for desired state
- Declarative infrastructure and application definitions
- Pull-based reconciliation vs Push-based CI
- Immutable revisions tracked via Git commit SHA
- Automated drift detection and correction
- Observability of state reconciliation status
- Access control via Git permissions (RBAC via CODEOWNERS)
- Rollback by Git revert operation

#### Tool: ArgoCD
- Application CRD for defining target cluster and repo
- Sync policies (Automatic, Manual)
- Prune propagation for resource cleanup
- Health assessment for custom resources (Lua scripts)
- Sync waves and hooks for ordering (PreSync, PostSync)
- Projects for logical application grouping and RBAC
- Declarative management via App of Apps pattern
- Notifications for sync/failure events

#### Tool: Flux
- Source Controller (GitRepository, Bucket, HelmRepository)
- Kustomize Controller for YAML rendering
- Helm Controller for chart releases
- Image Update Automation for container image patching
- Notification Controller for alerting (Slack, Teams, Discord)
- Multi-tenancy and cross-namespace references
- Drift detection and remediation with `kustomize-controller`

#### Concept: Branching Strategies
- Trunk-Based Development (Short-lived feature branches, daily merges)
- GitHub Flow (Feature branch ? PR ? Main ? Deploy)
- GitFlow (Main, Develop, Feature, Release, Hotfix branches)
- Environment branches vs Configuration branching
- Release tagging vs Release branches
- Cherry-picking for hotfix promotion
- Branch protection rules (Required reviews, Status checks)

#### Concept: Automated Testing Gates in CI
- Unit test execution and coverage threshold enforcement
- Integration test with service virtualization/containers (Testcontainers)
- Static Application Security Testing (SAST) for code flaws
- Software Composition Analysis (SCA) for dependency vulnerabilities
- Container image vulnerability scanning
- Linting and code style enforcement
- Performance regression testing via benchmarks
- Contract testing for API compatibility (Pact)

#### Tool: SonarQube
- Quality Gates with conditions on coverage/duplication/issues
- Rulesets for language-specific coding standards
- Code smells, Bugs, Vulnerabilities categorization
- Security Hotspots for manual review
- New Code period definition for leak detection
- Pull request decoration and analysis summary
- Clean as You Code methodology

#### Tool: Snyk
- Vulnerability database (Snyk Intel) and exploit maturity
- Dependency tree analysis for transitive vulnerabilities
- Container image scanning (OS packages and app dependencies)
- Infrastructure as Code scanning (Terraform, CloudFormation, Kubernetes)
- Fix pull requests with upgrade guidance
- License compliance management for dependencies
- Snyk Code (SAST) for proprietary code analysis

#### Concept: Feature Flag Management
- Boolean toggle vs Multivariate flag vs Operational config
- Kill switch pattern for emergency disable
- Percentage rollout and targeted user segmentation
- Flag evaluation at edge vs client-side vs server-side
- Sticky bucketing for consistent user experience
- Flag lifecycle (Draft, Active, Stale, Archived)
- Technical debt from permanent flags and cleanup process
- Flag dependencies and prerequisite rules

#### Tool: LaunchDarkly
- SDKs for multiple languages (Server-side, Client-side, Mobile)
- Targeting rules with custom user attributes
- Experimentation with A/B/n test and metrics analysis
- Flag change approval workflow
- Audit log for compliance and debugging
- Relay Proxy for on-premises/low-latency evaluation
- Code references for flag removal identification

#### Tool: Flagsmith
- Open-source and cloud-hosted options
- Environment management per flag
- Identity and traits for user segmentation
- Local evaluation mode for reduced latency
- Scheduled flag changes
- Webhook integrations for flag state changes
- Terraform provider for GitOps flag management

#### Concept: Release Orchestration
- Release calendar and coordination across services
- Deployment freeze periods and change moratorium
- Dependency tracking between microservice releases
- Rollback procedure and communication plan
- Dark launching of code paths behind flags
- Phased rollout across regions/cells
- Release notes automation from commit history
- Post-deployment verification (Smoke tests, Monitoring checks)
