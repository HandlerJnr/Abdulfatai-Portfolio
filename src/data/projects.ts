export type Project = {
  slug: string;
  title: string;
  category: string;
  tagline: string;
  year: string;
  status?: string;
  role: string;
  tags: string[];
  featured?: boolean;
  /** Behance cover image. When absent, generated SVG artwork is used instead. */
  cover?: string;
  /** How the cover should be framed in the mockup shell. */
  frame?: "browser" | "phone" | "flat";
  /** Extra imagery shown below the case-study body. */
  gallery?: { src: string; alt: string }[];
  /** Direct link to the full project deck on Behance. */
  externalUrl?: string;
  /**
   * True when a full written case study exists below the cover. False for
   * projects whose deck lives on Behance — those pages link out instead of
   * presenting a narrative that isn't documented here.
   */
  caseStudy: boolean;
  /** Art direction for the generated fallback artwork */
  art: {
    hue: string;
    accent: string;
    kind: "health" | "workflow" | "booking" | "web3" | "fashion" | "banking";
  };
  overview: string;
  challenge?: string;
  process?: string[];
  outcome?: string;
  deliverables: string[];
};

const BEHANCE = "https://www.behance.net/gallery";

export const projects: Project[] = [
  {
    slug: "arete",
    title: "Arete",
    category: "Digital Healthcare & Telemedicine Platform",
    tagline:
      "Connecting consultations, HMO coverage, prescriptions and pharmacy fulfilment in one calm journey.",
    year: "2025",
    status: "Full case study",
    role: "End-to-end product designer",
    tags: ["Research", "UX Strategy", "Product Design", "Usability Testing"],
    featured: true,
    caseStudy: true,
    cover:
      "https://mir-s3-cdn-cf.behance.net/projects/original/8e80fc255070051.Y3JvcCwyOTE3LDIyODIsNDYyLDA.png",
    frame: "browser",
    externalUrl: `${BEHANCE}/255070051/Arete-Telemedicine-UXUI-Case-Study`,
    art: { hue: "#0f2a2a", accent: "#4fd1c5", kind: "health" },
    overview:
      "Arete is a digital healthcare and telemedicine platform. I designed the end-to-end experience across research, information architecture, user flows, UX writing, UI design, design systems and prototyping.",
    challenge:
      "Healthcare journeys are fragmented: a patient books a consultation in one place, checks HMO coverage in another, then chases a prescription and a pharmacy separately. The product needed to make those hand-offs feel like a single, trustworthy path without hiding the detail clinicians and insurers require.",
    process: [
      "Mapped the patient journey from symptom to fulfilled prescription and identified the moments where coverage uncertainty caused drop-off.",
      "Defined the information architecture so consultations, coverage, prescriptions and pharmacy fulfilment share one navigation model.",
      "Wrote the UX copy for eligibility, consent and prescription states so the language stayed plain and non-alarming.",
      "Built a component library and design tokens to keep clinical, patient and admin surfaces visually consistent.",
      "Prototyped the core flows in Figma and ran usability sessions to refine step order and error recovery.",
    ],
    outcome:
      "A connected healthcare experience with a reusable design system, documented flows and prototypes ready for engineering hand-off.",
    deliverables: [
      "Journey maps",
      "Information architecture",
      "User flows",
      "UX writing",
      "Design system",
      "Interactive prototype",
    ],
  },
  {
    slug: "synqit",
    title: "Synqit",
    category: "Web3 Collaboration Platform",
    tagline:
      "Helping teams discover and engage with the right partners, projects and communities across Web3.",
    year: "2025",
    status: "Deck on Behance",
    role: "Product designer",
    tags: ["Product Design", "Interaction Design", "High-Fidelity UI"],
    featured: true,
    caseStudy: false,
    cover: "/projects/synqit-laptop.jpg",
    frame: "flat",
    gallery: [
      {
        src: "/projects/synqit-desk.jpg",
        alt: "Synqit's mobile experience shown on a phone alongside a laptop on a desk",
      },
    ],
    externalUrl: `${BEHANCE}/235692945/Web3-Platform`,
    art: { hue: "#0e1f2e", accent: "#5ac8fa", kind: "web3" },
    overview:
      "Synqit is a Web3 collaboration platform built around discovering and engaging with the right partners, projects and communities. I designed the responsive product and marketing surfaces across desktop and mobile. The full presentation is published on Behance.",
    deliverables: [
      "Responsive web design",
      "Interaction design",
      "High-fidelity UI",
      "Visual system",
    ],
  },
  {
    slug: "project-management-dashboard",
    title: "Project Management Dashboard",
    category: "SaaS Dashboard & Data Design",
    tagline:
      "A dense, role-based dashboard for planning, tracking and reporting on work.",
    year: "2025",
    status: "Deck on Behance",
    role: "Product designer",
    tags: ["Dashboard Design", "Information Architecture", "Data Visualisation"],
    featured: true,
    caseStudy: false,
    cover:
      "https://mir-s3-cdn-cf.behance.net/projects/404/c2126d235694983.Y3JvcCwyOTA3LDIyNzQsMzM4LDA.png",
    frame: "browser",
    externalUrl: `${BEHANCE}/235694983/Project-Management-Dashboard`,
    art: { hue: "#14122b", accent: "#7c68fd", kind: "workflow" },
    overview:
      "A project management dashboard covering planning, tracking and reporting surfaces. The full presentation is published on Behance.",
    deliverables: ["Dashboard design", "Information architecture", "UI system"],
  },
  {
    slug: "ai-architectural-design",
    title: "AI Design Assistant",
    category: "Conversational AI Product for Architecture",
    tagline:
      "A ChatGPT-style product experience applied to architectural design work.",
    year: "2025",
    status: "Deck on Behance",
    role: "Product designer",
    tags: ["AI Product Design", "Conversational UX", "Interface Design"],
    caseStudy: false,
    cover:
      "https://mir-s3-cdn-cf.behance.net/projects/404/5542d4235692645.Y3JvcCwyODY4LDIyNDQsMzQwLDA.png",
    frame: "browser",
    externalUrl: `${BEHANCE}/235692645/Chat-Gpt-like-Product-design-for-Architectural-design`,
    art: { hue: "#14122b", accent: "#7c68fd", kind: "workflow" },
    overview:
      "A conversational AI product experience designed for architectural design work. The full presentation is published on Behance.",
    deliverables: ["Conversational UX", "Interface design", "Product concept"],
  },
  {
    slug: "loan-investment-app",
    title: "Loan & Investment App",
    category: "Fintech Mobile Product",
    tagline:
      "Mobile lending and investing journeys where clarity around money is the whole job.",
    year: "2025",
    status: "Deck on Behance",
    role: "Product designer",
    tags: ["Fintech UX", "Mobile UX", "High-Fidelity UI"],
    caseStudy: false,
    cover:
      "https://mir-s3-cdn-cf.behance.net/projects/404/4d02ad235692477.Y3JvcCwzMzg1LDI2NDgsMjkzLDA.jpeg",
    frame: "phone",
    externalUrl: `${BEHANCE}/235692477/Loan-Investment-Mobile-App`,
    art: { hue: "#0e1f2e", accent: "#5ac8fa", kind: "web3" },
    overview:
      "A mobile app for loans and investments. The full presentation is published on Behance.",
    deliverables: ["Mobile UX", "High-fidelity UI", "Fintech flows"],
  },
  {
    slug: "mobile-banking-app",
    title: "Mobile Banking App",
    category: "Digital Banking Interface",
    tagline:
      "Everyday banking on mobile — balances, transfers and transaction history.",
    year: "2024",
    status: "Deck on Behance",
    role: "UI/UX Designer",
    tags: ["Fintech UX", "Mobile UX", "UI Design"],
    caseStudy: false,
    cover:
      "https://mir-s3-cdn-cf.behance.net/projects/404/3f6097175308707.Y3JvcCw5MTQsNzE1LDYsMA.png",
    frame: "phone",
    externalUrl: `${BEHANCE}/175308707/Mobile-banking-App-UI-design`,
    art: { hue: "#101a2b", accent: "#f4f3ef", kind: "banking" },
    overview:
      "A mobile banking interface covering core everyday banking tasks. The full presentation is published on Behance.",
    deliverables: ["Mobile UX", "UI design", "Banking flows"],
  },

  /* ---- CV-documented work, written case studies, generated artwork ---- */

  {
    slug: "chalant-ai",
    title: "Chalant AI",
    category: "AI Workflow Automation Engine",
    tagline:
      "Simplifying multi-step AI automation so non-technical teams can build workflows with confidence.",
    year: "2025",
    status: "Full case study",
    role: "Lead product designer",
    tags: [
      "Information Architecture",
      "UX Design",
      "Prototyping",
      "Design System",
    ],
    caseStudy: true,
    art: { hue: "#14122b", accent: "#7c68fd", kind: "workflow" },
    overview:
      "Chalant AI is a workflow automation engine. I led end-to-end product design, from research and journey mapping through interaction design, UI and prototyping.",
    challenge:
      "Automation builders tend to expose every node, condition and variable at once. The goal was to let people compose complex, multi-step AI workflows while only ever seeing the decision in front of them.",
    process: [
      "Interviewed early users and mapped how they described workflows in their own words versus how the system modelled them.",
      "Structured the information architecture around tasks (trigger, transform, deliver) rather than technical primitives.",
      "Designed a progressive-disclosure canvas with inline configuration, validation states and clear run history.",
      "Established a design system covering nodes, connectors, status chips and dense data tables.",
      "Prototyped and tested the create-and-run loop until first-time users could complete a workflow unaided.",
    ],
    outcome:
      "A clearer automation experience with a documented design system and high-fidelity prototypes handed to engineering.",
    deliverables: [
      "Research synthesis",
      "Journey maps",
      "Information architecture",
      "Interaction design",
      "Design system",
      "High-fidelity prototype",
    ],
  },
  {
    slug: "shortlet-lagos",
    title: "Shortlet Lagos",
    category: "Property Booking Platform",
    tagline:
      "Property discovery, search, filtering and booking inside a reusable responsive design system.",
    year: "2024",
    status: "Full case study",
    role: "Product designer & researcher",
    tags: ["User Flows", "Mobile UX", "Interaction Design", "High-Fidelity UI"],
    caseStudy: true,
    art: { hue: "#2a1d0f", accent: "#f4b860", kind: "booking" },
    overview:
      "Shortlet Lagos is a short-stay property booking platform. I owned end-to-end UX/UI design and research for discovery, search, filtering and booking journeys.",
    challenge:
      "Guests needed to find a trustworthy short-let quickly on mobile, compare options with confidence, and book without hitting dead ends around availability or payment.",
    process: [
      "Researched how guests shortlist properties and which signals (photos, location, host response) drive trust.",
      "Designed mobile-first search and filtering that keeps results visible while refining criteria.",
      "Mapped the booking flow to reduce steps between listing and confirmation.",
      "Built responsive components in Figma with Auto Layout and variants for listing cards, calendars and forms.",
      "Produced high-fidelity UI and interactive prototypes for both guest and host sides.",
    ],
    outcome:
      "A cohesive, responsive booking experience and a reusable design system that scales across guest and host journeys.",
    deliverables: [
      "User flows",
      "Mobile UX",
      "Responsive design system",
      "High-fidelity UI",
      "Interactive prototype",
    ],
  },
  {
    slug: "kremor-ai",
    title: "Kremor AI",
    category: "AI Product Experience",
    tagline:
      "Role-based experiences for an AI-powered African fashion platform, from artisan workflows to AI-assisted custom outfits.",
    year: "2024 — 2026",
    status: "Full case study",
    role: "UI/UX Designer (part-time)",
    tags: ["Product Strategy", "Workflow Design", "Interface Design"],
    caseStudy: true,
    art: { hue: "#2b0f1d", accent: "#ff3c31", kind: "fashion" },
    overview:
      "At Kremor AI I designed role-based product experiences for an AI-powered African fashion platform, supporting artisan and admin workflows alongside AI-assisted custom outfit journeys.",
    challenge:
      "Three audiences — customers, artisans and admins — share one platform but need very different views of the same order. AI-assisted design also had to feel like a helpful collaborator rather than a black box.",
    process: [
      "Created user flows and interface concepts for AI-driven product features.",
      "Translated stakeholder requirements and usability findings into practical design improvements during product discovery.",
      "Maintained design-system components, documentation and hand-off specifications for front-end implementation.",
      "Evaluated 96+ complex AI interaction tasks to identify usability patterns and improve internal design workflows.",
    ],
    outcome:
      "Role-based experiences with a maintained design system and clearer AI interaction patterns across the platform.",
    deliverables: [
      "User flows",
      "Role-based dashboards",
      "AI interaction patterns",
      "Design system maintenance",
      "Hand-off documentation",
    ],
  },
  {
    slug: "vista-itss",
    title: "Vista / ITSS",
    category: "Digital Banking and USSD Experience",
    tagline:
      "Onboarding, identity verification, dashboards and transactions across four localised market subsidiaries.",
    year: "2020 — 2024",
    status: "Full case study",
    role: "UI/UX Designer & Front-End Developer",
    tags: ["Fintech UX", "Service Design", "Responsive Product Design"],
    caseStudy: true,
    art: { hue: "#101a2b", accent: "#f4f3ef", kind: "banking" },
    overview:
      "With ITSS I supported Vista Fintech and Morabahah Bank on onboarding, identity-verification, dashboard and transaction journeys for digital banking products.",
    challenge:
      "Banking journeys had to work across four localised market subsidiaries with different regulatory requirements, on web, mobile and low-bandwidth USSD channels, without fragmenting the experience.",
    process: [
      "Designed responsive interfaces for onboarding, KYC, dashboards and transactions while considering accessibility and regulatory requirements.",
      "Collaborated with product and engineering to refine requirements into implementation-ready designs.",
      "Reviewed front-end builds using HTML/CSS knowledge to keep interfaces responsive and pixel-accurate.",
      "Adapted patterns for localisation across subsidiaries so core journeys stayed consistent.",
    ],
    outcome:
      "Implementation-ready banking experiences across markets and channels. Received the Best Intern Award for contributions to Vista.",
    deliverables: [
      "Onboarding & KYC flows",
      "Dashboards",
      "Transaction journeys",
      "Responsive UI",
      "Front-end QA",
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);
