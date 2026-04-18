### Group 1: Programming Languages & Computer Science Fundamentals

#### Concept: Python Scripting & Development
- Virtual environment management (`venv`, `conda`, `poetry`)
- Type hinting and static analysis (`mypy`, `pyright`)
- Decorator pattern and higher-order functions
- Generator functions and `yield` keyword usage
- Context manager implementation (`__enter__`, `__exit__`)
- Async programming with `asyncio` and event loop understanding
- Exception handling hierarchy and custom exception design
- Unit testing frameworks (`unittest`, `pytest`, mocking)

#### Tool: Python
- Interpreter selection (CPython vs PyPy vs Jython)
- Package management via `pip` and `conda`
- Debugging with `pdb` and `ipdb`
- Profiling tools (`cProfile`, `py-spy`, `memory-profiler`)
- Code formatting (`black`, `ruff`, `isort`)
- Dependency locking (`pip freeze`, `poetry.lock`)
- REPL usage (`python -i`, `IPython`, `Jupyter`)

#### Concept: Java Development (or Go/Rust)
- Object-oriented programming principles (Encapsulation, Inheritance, Polymorphism)
- Interface-based design and abstraction
- Concurrency models (Threads, Executor framework)
- Exception handling (Checked vs Unchecked)
- Generics and type erasure understanding
- Functional programming constructs (Lambdas, Streams)
- Build lifecycle and artifact management
- Dependency injection patterns

#### Tool: Java
- JDK distribution selection (Oracle vs OpenJDK vs GraalVM)
- Build tools (`Maven`, `Gradle`, `Ant`)
- JVM tuning flags (`-Xmx`, `-Xms`, `-XX:+UseG1GC`)
- Debugging with `jstack`, `jmap`, `jconsole`
- Bytecode inspection (`javap`)
- JAR packaging and executable JAR creation
- Module system (JPMS) usage

#### Tool: Go
- Workspace and module management (`go mod`, `go work`)
- Cross-compilation (`GOOS`, `GOARCH` environment variables)
- Race detection (`go test -race`)
- Profiling with `pprof`
- Embedding static files (`embed` package)
- CGO and foreign function interface
- Build tags for conditional compilation

#### Concept: Data Structures Fundamentals
- Array vs Linked List memory layout and access patterns
- Stack (LIFO) and Queue (FIFO) operations
- Hash table collision resolution strategies (Chaining, Open Addressing)
- Binary Search Tree properties and balancing (AVL, Red-Black)
- Heap invariants and heapify operation
- Graph representations (Adjacency matrix vs list)
- Trie structure for prefix-based searching
- Bloom filter probabilistic membership testing
- Skip list logarithmic search mechanism

#### Concept: Algorithm Design & Analysis
- Divide and conquer paradigm
- Dynamic programming (Memoization vs Tabulation)
- Greedy algorithm decision criteria
- Backtracking and pruning techniques
- Sliding window pattern for subarray problems
- Two-pointer technique for sorted arrays
- Binary search variants (Lower bound, Upper bound)
- Graph traversal (BFS shortest path, DFS connectivity)
- Shortest path algorithms (Dijkstra, Bellman-Ford, Floyd-Warshall)
- Minimum spanning tree (Kruskal, Prim)

#### Concept: Problem Solving Patterns
- Frequency counting for anagram/deduplication problems
- Multiple pointer pattern for pair sum problems
- Fast and slow pointer for cycle detection
- Sliding window for substring search
- Divide and conquer for sorting/searching
- Recursive backtracking for combination/permutation generation
- Topological sort for dependency resolution
- Union-find (Disjoint Set) for connectivity problems
- Prefix sum for range query optimization
- Monotonic stack for next greater/smaller element problems

#### Concept: Time & Space Complexity (Big O Analysis)
- Constant time O(1) identification
- Logarithmic time O(log n) (Binary search, Balanced tree ops)
- Linear time O(n) (Single loop traversal)
- Linearithmic time O(n log n) (Efficient sorting)
- Quadratic time O(n^2) (Nested loops)
- Exponential time O(2^n) (Subset generation)
- Factorial time O(n!) (Permutation generation)
- Amortized analysis (Dynamic array resizing)
- Space complexity and auxiliary space distinction
- Recursive call stack space accounting

#### Concept: Bash / Shell Scripting
- Shebang line and interpreter specification
- Variable assignment and quoting rules (Single vs Double)
- Command substitution (`$(...)` vs backticks)
- Exit codes and status checking (`$?`)
- Conditional execution (`&&`, `||`, `if-then-else`)
- Loop constructs (`for`, `while`, `until`)
- Function definition and parameter passing (`$1`, `$@`)
- Redirection operators (`>`, `>>`, `2>&1`)
- Piping and subshell behavior
- Error handling (`set -e`, `set -u`, `set -o pipefail`)

#### Tool: Bash
- Shell options (`set -x` for debugging, `shopt`)
- History expansion (`!!`, `!$`, `!string`)
- Brace expansion for sequence generation (`{1..10}`)
- Process substitution (`<(cmd)`, `>(cmd)`)
- Here documents and here strings (`<<EOF`, `<<<`)
- Array variables and associative arrays
- Arithmetic expansion (`$((expression))`)
- Signal trapping (`trap` command)
- ShellCheck linting integration

#### Concept: Version Control Fundamentals
- Repository initialization and cloning
- Staging area (Index) purpose and management
- Commit object structure (Tree, Parent, Author, Message)
- Branching as lightweight pointer movement
- Merging strategies (Fast-forward, Three-way, Recursive)
- Merge conflict resolution workflow
- Remote tracking branches and upstream configuration
- Tagging (Lightweight vs Annotated)
- Stashing for temporary work preservation
- Cherry-picking individual commits

#### Tool: Git
- Configuration scopes (`--local`, `--global`, `--system`)
- Interactive rebase (`-i`) for history rewriting
- Reflog for lost commit recovery
- Bisect for regression hunting
- Hooks for automation (Pre-commit, Post-receive)
- Worktree for parallel branch work
- Submodules and subtrees for dependency management
- Partial clones and sparse checkout
- Blame and log searching (`-S`, `-G`)
- Git LFS for large file handling

### Group 2: Fullstack & Application Development

#### Concept: Frontend Markup & Styling
- Semantic HTML element selection for accessibility
- Box model manipulation (Content, Padding, Border, Margin)
- Positioning schemes (Static, Relative, Absolute, Fixed, Sticky)
- Flexbox layout (Main axis vs Cross axis alignment)
- Grid layout (Explicit vs Implicit grid)
- Responsive design with media queries
- CSS cascade, specificity, and inheritance rules
- CSS custom properties (Variables) scoping
- Animation (Transitions vs Keyframes)
- Pseudo-classes and pseudo-elements usage

#### Tool: HTML
- Document type declaration (`<!DOCTYPE>`)
- Meta tag configuration (Viewport, Charset, SEO)
- Form input types and validation attributes
- Data attributes (`data-*`) for JavaScript interaction
- Template and slot elements for Web Components
- Picture element and `srcset` for responsive images
- ARIA roles and accessibility attributes
- SVG inline embedding and sprite usage

#### Tool: CSS
- Preprocessors (`Sass/SCSS`, `Less`) compilation
- PostCSS processing and Autoprefixer
- CSS Modules for scoped styling
- CSS-in-JS libraries (`styled-components`, `Emotion`)
- Utility-first frameworks (`Tailwind CSS`)
- CSS Framework component libraries (`Bootstrap`, `Bulma`)
- CSS minification and optimization
- Browser DevTools for style debugging

#### Concept: Frontend Logic & Interactivity
- DOM manipulation and traversal methods
- Event propagation (Bubbling, Capturing, Delegation)
- Event loop and microtask vs macrotask queue
- Promise chaining and async/await patterns
- Closure and lexical scoping rules
- Prototypal inheritance chain
- Module systems (IIFE, CommonJS, AMD, ES Modules)
- `this` binding rules and arrow function behavior
- Debouncing and throttling for performance
- Web APIs (`localStorage`, `sessionStorage`, `fetch`)

#### Tool: JavaScript
- Runtime environments (Browser vs Node.js vs Deno)
- Transpilation via Babel
- Polyfilling for browser compatibility
- Bundlers (`Webpack`, `Vite`, `esbuild`, `Rollup`)
- Package managers (`npm`, `yarn`, `pnpm`)
- Linting (`ESLint`) and formatting (`Prettier`)
- Source maps for debugging
- Console API beyond `log` (`table`, `group`, `time`)

#### Tool: TypeScript
- Type annotation and type inference rules
- Interface vs Type alias distinction
- Union and intersection types
- Generics and constraints
- Type narrowing with type guards
- Mapped types and conditional types
- Declaration files (`.d.ts`) and DefinitelyTyped
- `tsconfig.json` compiler options
- Decorators (Experimental) for metadata

#### Concept: Frontend Frameworks
- Component lifecycle and hooks
- Virtual DOM diffing and reconciliation
- State management patterns (Local vs Global)
- Reactive data binding mechanisms
- Routing and navigation guards
- Code splitting and lazy loading
- Server-side rendering vs Static generation
- Form handling and validation patterns
- Component composition vs Inheritance
- Performance optimization (Memoization, `shouldComponentUpdate`)

#### Tool: React
- Hooks (`useState`, `useEffect`, `useContext`, `useReducer`)
- Custom hook creation patterns
- Context API for dependency injection
- Portal for modal rendering
- Error boundaries for fault isolation
- Suspense and concurrent rendering features
- React Server Components (RSC)
- Testing (`React Testing Library`, `Jest`)
- Developer Tools extension

#### Tool: Vue
- Composition API vs Options API
- Reactivity system (`ref`, `reactive`, `computed`)
- Template directives (`v-if`, `v-for`, `v-model`)
- Slots and scoped slots for content distribution
- Composables for logic reuse
- Pinia for state management
- Vue Router navigation guards
- Single-file component structure

#### Tool: Angular
- Modules and standalone components
- Dependency injection hierarchy
- RxJS observables and operators
- Template-driven vs Reactive forms
- Directives (Attribute vs Structural)
- Pipes for data transformation
- Change detection strategies (Default vs OnPush)
- Guards and resolvers for routing
- Angular CLI schematic generation

#### Concept: Backend Frameworks
- Middleware pipeline execution order
- Request/Response lifecycle
- Routing with path parameters and query parsing
- Template engine integration
- ORM/ODM patterns (Active Record vs Data Mapper)
- Authentication middleware integration
- Error handling and centralized error middleware
- Background job queuing
- WebSocket connection management
- Rate limiting and throttling

#### Tool: Node.js
- Event loop phases (Timers, I/O, Idle, Poll, Check, Close)
- Module resolution algorithm
- Streams API (Readable, Writable, Transform, Duplex)
- Buffer and binary data handling
- Child process management (`spawn`, `exec`, `fork`)
- Cluster module for multi-core utilization
- Native addon compilation (`node-gyp`)
- Environment variable management (`dotenv`)

#### Tool: Django
- MVT (Model-View-Template) architecture
- ORM queryset lazy evaluation and optimization
- Middleware hooks (`process_request`, `process_response`)
- Class-based views vs Function-based views
- Django REST Framework serializers and viewsets
- Admin interface customization
- Migration generation and squash
- Signal dispatch system
- Caching framework backends (Memcached, Redis)

#### Tool: Spring Boot
- Auto-configuration and conditional beans
- Dependency injection (`@Autowired`, `@Component`, `@Service`)
- Spring Data JPA repositories and query methods
- Transaction management (`@Transactional` propagation)
- Aspect-oriented programming (`@Aspect`, Advice types)
- Spring Security filter chain
- Actuator endpoints for monitoring
- Externalized configuration profiles
- Scheduled tasks (`@Scheduled`)

#### Concept: API Design & Development (REST/gRPC)
- Resource naming conventions (Plural nouns, No verbs)
- HTTP method idempotency (GET, PUT, DELETE vs POST, PATCH)
- Status code semantics (2xx, 3xx, 4xx, 5xx)
- Pagination patterns (Offset, Cursor, Page-based)
- Filtering, sorting, and field selection query params
- Versioning strategies (URL path, Header, Query param)
- HATEOAS hypermedia controls
- gRPC service definition (`.proto` files)
- Protocol Buffers serialization and schema evolution
- Streaming modes (Unary, Server-side, Client-side, Bidirectional)

#### Tool: Postman
- Environment and variable scoping (Global, Collection, Environment)
- Pre-request scripts and test scripts (JavaScript)
- Collection runner for automation
- Mock server creation from examples
- API monitoring with scheduled runs
- Newman CLI for CI integration
- Request chaining with data extraction
- Workspace collaboration and versioning

#### Tool: Swagger / OpenAPI
- OpenAPI specification version differences (2.0 vs 3.0 vs 3.1)
- Path, parameter, and schema definition
- Request/Response examples and media types
- Security scheme definition (Basic, Bearer, OAuth2)
- Code generation tools (`swagger-codegen`, `openapi-generator`)
- UI customization (`swagger-ui`)
- Validation against specification
- Documentation hosting and rendering

#### Concept: Relational Database Management
- Normalization forms (1NF, 2NF, 3NF, BCNF)
- Denormalization trade-offs and use cases
- Index types (B-Tree, Hash, GiST, GIN, BRIN)
- Composite index column order significance
- Query execution plan analysis (`EXPLAIN`)
- Transaction isolation levels (Read Uncommitted to Serializable)
- ACID compliance (Atomicity, Consistency, Isolation, Durability)
- Foreign key constraints and cascading actions
- View creation (Simple vs Materialized)
- Partitioning strategies (Range, List, Hash)

#### Tool: PostgreSQL
- MVCC (Multi-Version Concurrency Control) mechanism
- VACUUM and autovacuum operations
- JSONB data type and indexing
- Full-text search (`tsvector`, `tsquery`)
- Extensions (`pg_stat_statements`, `PostGIS`, `uuid-ossp`)
- Role and privilege management
- Logical and physical replication
- Connection pooling with `PgBouncer`
- `pg_dump` and `pg_restore` for backup

#### Tool: MySQL
- Storage engine differences (InnoDB vs MyISAM)
- InnoDB buffer pool tuning
- Binary log formats (Statement, Row, Mixed)
- Replication topologies (Master-Slave, Group Replication)
- `pt-query-digest` for slow query analysis
- MySQL Shell and AdminAPI for InnoDB Cluster
- Foreign key constraint enforcement per storage engine
- `mysqldump` vs `mysqlpump` vs Percona XtraBackup

#### Concept: NoSQL Database Management
- CAP theorem trade-offs (Consistency, Availability, Partition Tolerance)
- Data modeling (Denormalization, Aggregation, Application-side joins)
- Sharding and horizontal scaling patterns
- Eventual consistency and conflict resolution
- Write concern and read preference tuning
- Time-to-live (TTL) expiration
- Aggregation pipeline operations
- Change streams for real-time notifications

#### Tool: MongoDB
- BSON data type handling
- CRUD operations and query operators
- Index types (Single, Compound, Multikey, Text, Geospatial, Hashed)
- Aggregation pipeline stages (`$match`, `$group`, `$lookup`, `$unwind`)
- Replica set elections and failover
- Sharded cluster components (Config servers, Mongos routers)
- Transactions on replica sets and sharded clusters
- `mongodump`, `mongorestore`, `mongoexport`

#### Tool: DynamoDB
- Primary key design (Partition key, Sort key)
- Secondary indexes (Global vs Local)
- Capacity modes (Provisioned vs On-demand)
- DynamoDB Streams and Lambda triggers
- Conditional writes and atomic counters
- Transactions and idempotency tokens
- TTL attribute for auto-deletion
- DAX (DynamoDB Accelerator) caching layer
- Single-table design pattern

#### Concept: Authentication & Authorization Flows
- Authentication vs Authorization distinction
- Stateful (Session cookie) vs Stateless (Token) trade-offs
- OAuth 2.0 grant types (Authorization Code, Client Credentials, PKCE)
- OpenID Connect ID token claims
- Role-Based Access Control (RBAC) model
- Attribute-Based Access Control (ABAC) policies
- Multi-Factor Authentication (MFA) enrollment flow
- Single Sign-On (SSO) federation trust
- Password hashing algorithms (bcrypt, Argon2, PBKDF2)
- Session fixation and hijacking prevention

#### Tool: OAuth 2.0
- Authorization endpoint and token endpoint usage
- Redirect URI validation and security
- Scope definition and incremental consent
- Refresh token rotation and reuse detection
- Client authentication methods (`client_secret_basic`, `private_key_jwt`)
- Token introspection endpoint
- Revocation endpoint usage
- JWT Profile for OAuth 2.0 Client Authentication

#### Tool: JWT (JSON Web Token)
- JWT structure (Header, Payload, Signature)
- Signing algorithms (HS256, RS256, ES256, EdDSA)
- Claim types (Registered, Public, Private)
- Expiration handling (`exp` claim and clock skew)
- Token validation steps (Signature, Issuer, Audience, Expiry)
- JWE for payload encryption
- JWK (JSON Web Key) and JWKS endpoint
- Common vulnerabilities (None algorithm, Weak secret)
