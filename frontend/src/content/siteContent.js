export const defaultSiteContent = {
  global: {
    nav: {
      brandMark: 'NJ',
      brandName: 'Navin Jairam',
      brandSubtitle: 'Cloud systems portfolio',
      statusText: 'Building resilient platforms',
      ctaLabel: 'Book a conversation',
      links: [
        { to: '/about', label: 'About' },
        { to: '/experience', label: 'Experience' },
        { to: '/skills', label: 'Skills' },
        { to: '/projects', label: 'Projects' },
        { to: '/devops-lab', label: 'DevOps Lab' },
        { to: '/certifications', label: 'Certs' },
        { to: '/posts', label: 'Feed' },
        { to: '/contact', label: 'Contact' }
      ]
    },
    footer: {
      eyebrow: 'Portfolio',
      title: 'Systems, delivery, and platform design with personality.',
      description:
        'Built to feel editorial in light mode and cinematic in dark mode, while staying easy to scan for recruiters, founders, and engineering teams.',
      linksTitle: 'Explore',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Experience', href: '/experience' },
        { label: 'Skills', href: '/skills' },
        { label: 'Projects', href: '/projects' },
        { label: 'DevOps Lab', href: '/devops-lab' }
      ],
      signalTitle: 'Signal',
      signalHeading: 'Cloud • DevOps • SRE',
      signalText: 'Shipping resilient systems across delivery, observability, and automation.',
      copyrightText: 'Built with React + AWS.',
      metaText: 'Designed for motion, contrast, and storytelling.'
    }
  },
  home: {
    eyebrow: 'Portfolio / Systems / Motion',
    title: 'Navin Jairam',
    titleEcho: 'Navin Jairam',
    introPrefix: 'Designing calm in complex systems as a',
    roles: ['DevOps Engineer', 'Cloud Architect', 'SRE', 'Problem Solver'],
    description:
      'This portfolio is built like a control room: visible status, crisp transitions, layered depth, and enough personality to feel memorable the second you land.',
    primaryCta: { label: 'Explore projects', href: '/projects' },
    secondaryCta: { label: 'Start a conversation', href: '/contact' },
    heroImage:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    heroImageLight:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    heroImageDark:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    portraitImage:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
    portraitImageLight:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
    portraitImageDark:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
    portraitAlt: 'Navin Jairam portrait placeholder',
    signalModes: [
      {
        name: 'Platform',
        headline: 'Reliability-first architecture for teams that need calm under pressure.',
        detail: 'Scaling delivery, observability, and automation without turning the platform into a maze.'
      },
      {
        name: 'Delivery',
        headline: 'Pipelines that feel smooth for engineers and predictable for releases.',
        detail: 'CI/CD, change safety, deployment ergonomics, and environments that teams trust.'
      },
      {
        name: 'Operations',
        headline: 'Incident-aware systems with stronger feedback loops and fewer blind spots.',
        detail: 'Monitoring, response paths, and platform signals tuned for action, not noise.'
      }
    ],
    stats: [
      { value: 'Cloud Native', label: 'Design language' },
      { value: 'Infra + UX', label: 'Blend of systems and visuals' },
      { value: 'Always shipping', label: 'Current mindset' }
    ],
    focusCards: [
      'Observability stacks that shorten feedback loops',
      'AWS and cloud workflows with practical guardrails',
      'Developer platforms that reduce friction',
      'Automation patterns that remove repetitive work'
    ],
    commandLinks: [
      { label: 'See timeline', href: '/experience' },
      { label: 'Browse stack', href: '/skills' },
      { label: 'View credentials', href: '/certifications' },
      { label: 'Open feed', href: '/posts' }
    ],
    marquee: [
      'Cloud Architecture',
      'DevOps Systems',
      'Platform Reliability',
      'Observability',
      'Automation Design',
      'Incident Calm',
      'Delivery Ergonomics',
      'Editorial UX',
      'Retrofuturist Motion',
      'Neobrutalist Light Mode'
    ],
    lightShowcase: {
      eyebrow: 'Royal mode',
      title: 'Editorial layers, embossed cards, and tactile system notes.',
      description:
        'Light mode leans into royal warmth, offset shadows, framed typography, ribbons, and modular cards that feel crafted instead of generic.',
      notes: [
        'Offset-shadow cards give the page a gallery-board rhythm.',
        'Kinetic type and ribbons create stronger storytelling above the fold.',
        'Warm gradients and structured widgets keep the experience premium.'
      ]
    },
    darkShowcase: {
      eyebrow: 'Night mode',
      title: 'A futuristic signal deck with glow, glass, and motion.',
      description:
        'Dark mode becomes a holographic console with floating diagnostics, neon depth, ambient scans, and stronger spatial layering.',
      panels: [
        { label: 'Signal', value: 'Nominal' },
        { label: 'Latency', value: 'Low' },
        { label: 'Observability', value: 'Live' }
      ]
    },
    featureSection: {
      eyebrow: 'Featured layout',
      title: 'Modular, immersive, and intentionally overdesigned in the right places.',
      description:
        'The homepage uses a bento composition because it lets recruiters scan fast while still giving the portfolio room to feel expressive.',
      cards: [
        {
          title: 'Editorial light mode',
          text: 'Warm paper tones, ink-like typography, and soft ribbons that feel tactile instead of flat.'
        },
        {
          title: 'Cinematic dark mode',
          text: 'Neon network lines, radial pulses, and control-room widgets tuned for contrast and depth.'
        },
        {
          title: 'Scroll storytelling',
          text: 'Reveal choreography, moving layers, and horizontal rails that keep the portfolio feeling alive.'
        }
      ]
    },
    storySection: {
      eyebrow: 'Scroll story',
      title: 'The homepage now tells the portfolio story in motion.',
      description:
        'Each panel moves from signal to craft to delivery so visitors pick up both technical credibility and visual personality.',
      steps: [
        {
          title: 'Sense',
          text: 'Status surfaces, signal cards, and animated text establish a systems-first point of view.'
        },
        {
          title: 'Shape',
          text: 'Feature blocks and visual rails turn the portfolio into a designed narrative rather than a plain list of sections.'
        },
        {
          title: 'Ship',
          text: 'The ending focuses on outcomes, credibility, and next actions so the site feels useful as well as stylish.'
        }
      ]
    },
    textVisuals: [
      { label: 'RELIABILITY', caption: 'Engineered for calm under load.' },
      { label: 'AUTOMATION', caption: 'Less repetition, more leverage.' },
      { label: 'OBSERVABILITY', caption: 'Signals that guide real action.' }
    ],
    orbitMetrics: [
      { label: 'Platform', value: '77' },
      { label: 'Delivery', value: '91' },
      { label: 'Ops', value: '84' }
    ],
    ctaBand: {
      eyebrow: 'Next layer',
      title: 'Want the full story?',
      description: 'Continue through projects, skills, and experience for the deeper technical view.',
      primary: { label: 'Open projects', href: '/projects' },
      secondary: { label: 'View experience', href: '/experience' }
    }
  },
  about: {
    eyebrow: 'About',
    title: 'Systems thinking with a visual-first portfolio voice.',
    lead:
      'I care about reliability, cloud architecture, delivery ergonomics, and the craft of making hard technical work feel usable.',
    profileEyebrow: 'Profile',
    profileTitle: 'DevOps, cloud, and SRE instincts with an eye for interface quality.',
    profileText:
      'The strongest systems feel intentional at every layer: infrastructure, monitoring, delivery flow, and the actual user experience of engineers interacting with them.',
    northStarEyebrow: 'North star',
    northStarText: 'Make complex environments easier to understand, safer to change, and faster to improve.',
    themesEyebrow: 'Current themes',
    themes: ['Automation', 'Observability', 'Resilience', 'Cloud', 'Delivery'],
    visualImage:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    journey: {
      eyebrow: 'Journey',
      title: 'Three steps that shape how I approach engineering work.',
      steps: [
        'Started by getting close to how systems break, recover, and reveal weak signals.',
        'Moved into cloud and delivery workflows where speed matters only if reliability survives the change.',
        'Now focused on platform thinking, operational clarity, and making complex work easier to navigate.'
      ]
    },
    approach: {
      eyebrow: 'Approach',
      title: 'Accordion notes on how I like to work.',
      items: [
        {
          title: 'Build for clarity before cleverness',
          body: 'Dashboards, pipelines, and platforms should tell engineers what matters right now without requiring archaeology.'
        },
        {
          title: 'Automate the boring, not the thinking',
          body: 'The best automation removes repetition and preserves judgment for the moments that need human context.'
        },
        {
          title: 'Great systems have good interface design',
          body: 'Whether the interface is a UI, a runbook, or a deployment flow, the experience of using it shapes team velocity.'
        }
      ]
    },
    actions: [
      { label: 'See experience', href: '/experience' },
      { label: 'Open skills map', href: '/skills' },
      { label: 'View projects', href: '/projects', primary: true }
    ]
  },
  experiencePage: {
    eyebrow: 'Experience',
    title: 'Timeline cards with expandable detail, skill links, and a cleaner narrative.',
    lead: 'Click any skill chip to open related work and credentials.',
    stats: [
      { value: 'Roles captured', label: 'Count' },
      { value: 'Ops + Cloud', label: 'Primary lane' },
      { value: 'Incident aware', label: 'Working style' }
    ],
    actions: [
      { label: 'View skills', href: '/skills' },
      { label: 'See projects', href: '/projects' },
      { label: 'Open certifications', href: '/certifications', primary: true }
    ]
  },
  skillsPage: {
    eyebrow: 'Skills',
    title: 'A bento skill map with filters, meters, and clickable relationship chips.',
    lead: 'Click a skill tile to jump into the related project and certification network.',
    actions: [
      { label: 'Browse projects', href: '/projects' },
      { label: 'See experience', href: '/experience' },
      { label: 'View certifications', href: '/certifications', primary: true }
    ]
  },
  projectsPage: {
    eyebrow: 'Projects',
    title: 'Scrollable project cards with tech filters, status widgets, and stronger visual hierarchy.',
    lead: 'Tap a tech badge to open the linked skills map.',
    heroImage:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    actions: [
      { label: 'View skills', href: '/skills' },
      { label: 'See experience', href: '/experience' },
      { label: 'Open DevOps lab', href: '/devops-lab' },
      { label: 'Start a project chat', href: '/contact', primary: true }
    ]
  },
  devopsLabPage: {
    eyebrow: 'DevOps / SRE / Cloud',
    title: 'A cloud operations lab for AWS delivery, observability, reliability, and platform tooling.',
    lead: 'A dedicated page for DevOps applications, SRE thinking, AWS architecture, Prometheus, Grafana, and the operational systems behind the portfolio voice.',
    heroStats: [
      { label: 'AWS', value: 'Compute + network + automation' },
      { label: 'Prometheus', value: 'Metrics and alert pipelines' },
      { label: 'Grafana', value: 'Dashboards and signal clarity' }
    ],
    pillars: [
      {
        title: 'Cloud architecture',
        text: 'AWS-driven workloads, IAM-aware design, delivery guardrails, and environments that support secure iteration.'
      },
      {
        title: 'Observability stack',
        text: 'Prometheus for metrics, Grafana for layered dashboards, and alerting paths shaped around actionable signals.'
      },
      {
        title: 'SRE operations',
        text: 'Runbooks, service health models, incident awareness, and platform feedback loops built for calmer engineering.'
      }
    ],
    tools: [
      { name: 'AWS', completion: 88, detail: 'Cloud infrastructure, automation, and delivery flows.' },
      { name: 'Prometheus', completion: 79, detail: 'Metrics collection, exporters, and alert-ready telemetry.' },
      { name: 'Grafana', completion: 82, detail: 'Dashboard storytelling, panel design, and signal layering.' },
      { name: 'CI/CD', completion: 90, detail: 'Release automation, quality gates, and deployment ergonomics.' }
    ],
    services: [
      'Infrastructure automation',
      'Cloud migration readiness',
      'Monitoring and dashboards',
      'Reliability review',
      'Platform engineering support',
      'Deployment pipeline design'
    ],
    actions: [
      { label: 'View projects', href: '/projects' },
      { label: 'Open skills map', href: '/skills' },
      { label: 'Start a conversation', href: '/contact', primary: true }
    ]
  },
  certificationsPage: {
    eyebrow: 'Certifications',
    title: 'Credential cards, issuer callouts, and direct links into the related skills network.',
    lead: 'These certificates support the practical work shown across projects and experience.',
    actions: [
      { label: 'Related skills', href: '/skills' },
      { label: 'See projects', href: '/projects' },
      { label: 'Read updates', href: '/posts', primary: true }
    ]
  },
  postsPage: {
    eyebrow: 'Feed',
    title: 'Updates, GitHub activity, and a more magazine-like content rhythm.',
    lead: 'Switch between manual notes, GitHub activity, or the full stream.',
    emptyText: 'No posts yet. Add posts from the admin dashboard or sync GitHub activity.',
    featuredLabel: 'Featured update',
    actions: [
      { label: 'View skills', href: '/skills' },
      { label: 'See projects', href: '/projects' },
      { label: 'Reach out', href: '/contact', primary: true }
    ]
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Use the picker, choose the path, and let’s make the first message easier to send.',
    lead: 'Best for cloud roles, platform conversations, reliability work, and technical collaboration.',
    reasons: ['Platform consulting', 'Cloud role', 'DevOps collaboration', 'Architecture review'],
    selectedReasonLabel: 'Selected reason',
    selectedReasonText: 'Send context up front and I can respond with the most useful next step.',
    contacts: [
      { icon: '📧', title: 'Email', value: 'navin.jairam@gmail.com', href: 'mailto:navin.jairam@gmail.com' },
      { icon: '💼', title: 'LinkedIn', value: 'linkedin.com/in/navin-jairam', href: 'https://www.linkedin.com/in/navin-jairam' },
      { icon: '📱', title: 'Phone', value: '+91 99413 60835', href: 'tel:+919941360835' },
      { icon: '🐙', title: 'GitHub', value: 'github.com/Lucifer-Newstar', href: 'https://github.com/Lucifer-Newstar' }
    ],
    form: {
      nameLabel: 'Name',
      namePlaceholder: 'Your name',
      emailLabel: 'Email',
      emailPlaceholder: 'your.email@example.com',
      reasonLabel: 'Reason',
      messageLabel: 'Message',
      messagePlaceholder: 'Tell me about the role, team, or problem you want to solve.',
      submitLabel: 'Send message'
    },
    steps: [
      'Share the context and what kind of help you need.',
      'I’ll map that to architecture, delivery, or platform conversation paths.',
      'We decide whether it’s a fit for a role, project, or technical collaboration.'
    ],
    actions: [
      { label: 'Back home', href: '/' },
      { label: 'View work', href: '/projects', primary: true }
    ]
  },
  admin: {
    eyebrow: 'Admin console',
    title: 'Portfolio control center',
    lead: 'A more comfortable dashboard for content updates, quick previews, and faster navigation between sections.',
    openSiteLabel: 'Open public site',
    saveLabel: 'Save changes',
    discardLabel: 'Discard draft',
    logoutLabel: 'Logout',
    workspaceLabel: 'Workspace',
    searchPlaceholder: 'Search fields, labels, image URLs, or section names',
    previewTitle: 'Preview rhythm',
    previewText: 'Update copy, then jump into the public site to sanity-check light and dark mode.',
    comfortTitle: 'Comfort tools',
    comfortTips: [
      'Use the search field to narrow huge content trees instantly.',
      'Image URLs show previews so you do not have to guess.',
      'Each section stays grouped so public-page content is easier to manage.',
      'Export and import JSON snapshots before large editorial changes.'
    ],
    tabs: [
      { id: 'overview', name: 'Overview', description: 'Quick actions, preview links, and workspace guidance.' },
      { id: 'content', name: 'Content', description: 'Edit all hardcoded page text, labels, links, and image URLs.' },
      { id: 'preview', name: 'Preview', description: 'Check saved pages and draft pages inside the admin workspace.' },
      { id: 'skills', name: 'Skills', description: 'Curate taxonomy, levels, and order.' },
      { id: 'projects', name: 'Projects', description: 'Shape featured work and portfolio visibility.' },
      { id: 'experience', name: 'Experience', description: 'Keep the timeline and achievements current.' },
      { id: 'certifications', name: 'Certifications', description: 'Maintain credentials, issuers, and linked skills.' },
      { id: 'posts', name: 'Posts', description: 'Manage updates and sync GitHub activity.' }
    ],
    contentManager: {
      eyebrow: 'Editable copy + images',
      title: 'Content manager',
      description: 'Edit page text, labels, links, arrays, and image URLs in one place.',
      saveLabel: 'Save content',
      discardLabel: 'Discard draft',
      resetLabel: 'Reset content defaults',
      sectionLabel: 'Content sections'
    },
    stats: [
      { value: '7', label: 'Workspace tabs' },
      { value: 'Live', label: 'Portfolio mode' },
      { value: 'Theme aware', label: 'Public experience' }
    ],
    overview: {
      title: 'Overview',
      description: 'Quick actions, preview links, and workspace guidance.',
      cards: [
        { title: 'Preview first', text: 'Use the public site to sanity-check visual changes after content edits.' },
        { title: 'Order matters', text: 'Most sections expose order, so you can shape the narrative flow without code changes.' },
        { title: 'Fast workflow', text: 'Update content, then verify both light and dark mode before publishing decisions.' }
      ],
      actions: [
        { label: 'Go to content', tab: 'content' },
        { label: 'Open preview', tab: 'preview' },
        { label: 'Go to projects', tab: 'projects' },
        { label: 'Go to posts', tab: 'posts' }
      ]
    }
  }
}

function mergeValue(defaultValue, savedValue) {
  if (Array.isArray(defaultValue)) {
    return Array.isArray(savedValue) ? savedValue : defaultValue
  }

  if (defaultValue && typeof defaultValue === 'object') {
    const result = { ...defaultValue }
    if (!savedValue || typeof savedValue !== 'object' || Array.isArray(savedValue)) {
      return result
    }

    Object.keys(savedValue).forEach((key) => {
      if (!(key in defaultValue)) {
        result[key] = savedValue[key]
      } else {
        result[key] = mergeValue(defaultValue[key], savedValue[key])
      }
    })

    return result
  }

  return savedValue ?? defaultValue
}

export const deepCloneContent = () => JSON.parse(JSON.stringify(defaultSiteContent))
export const mergeWithDefaultContent = (savedContent) => mergeValue(defaultSiteContent, savedContent)
