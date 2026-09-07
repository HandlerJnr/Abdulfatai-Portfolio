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
  /** Art direction for the generated cover artwork */
  art: {
    hue: string;
    accent: string;
    kind: "health" | "workflow" | "booking" | "web3" | "fashion" | "banking";
  };
  overview: string;
  challenge: string;
  process: string[];
  outcome: string;
  deliverables: string[];
  externalUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "arete",
    title: "Arete",
    category: "Digital Healthcare & Telemedicine Platform",
    tagline:
      "Connecting consultations, HMO coverage, prescriptions and pharmacy fulfilment in one calm journey.",
    year: "2025",
    status: "Case study",
    role: "End-to-end product designer",
    tags: ["Research", "UX Strategy", "Product Design", "Usability Testing"],
    featured: true,
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
    slug: "chalant-ai",
    title: "Chalant AI",
    category: "AI Workflow Automation Engine",
    tagline:
      "Simplifying multi-step AI automation so non-technical teams can build workflows with confidence.",
    year: "2025",
    status: "Case study",
    role: "Lead product designer",
    tags: [
      "Information Architecture",
      "UX Design",
      "Prototyping",
      "Design System",
    ],
    featured: true,
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
    status: "Case study",
    role: "Product designer & researcher",
    tags: ["User Flows", "Mobile UX", "Interaction Design", "High-Fidelity UI"],
    featured: true,
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
    slug: "mintrise",
    title: "Mintrise",
    category: "Web3 Investment Flow",
    tagline:
      "Clear onboarding and transaction flows for an investment product where trust is the feature.",
    year: "2024",
    status: "Case study",
    role: "Product designer",
    tags: ["Fintech UX", "Transaction Design", "Trust and Clarity"],
    art: { hue: "#0e1f2e", accent: "#5ac8fa", kind: "web3" },
    overview:
      "Mintrise is a Web3 investment product. I owned and created end-to-end high-fidelity prototypes with clear onboarding and transaction flows.",
    challenge:
      "Web3 products often assume fluency in wallets, gas and confirmations. Investors needed plain-language onboarding and transaction states that explain what is happening and what it costs before they commit.",
    process: [
      "Audited comparable investment and wallet flows to benchmark clarity and friction.",
      "Designed onboarding that introduces one concept at a time and surfaces risk information where decisions are made.",
      "Structured transaction screens around review, confirm and status with explicit fees and timing.",
      "Prototyped end-to-end journeys in Figma for stakeholder review and iteration.",
    ],
    outcome:
      "High-fidelity prototypes and transaction patterns that prioritise trust, legibility and predictable outcomes.",
    deliverables: [
      "Onboarding flow",
      "Transaction design",
      "High-fidelity prototype",
      "UI patterns",
    ],
  },
  {
    slug: "kremor-ai",
    title: "Kremor AI",
    category: "AI Product Experience",
    tagline:
      "Role-based experiences for an AI-powered African fashion platform, from artisan workflows to AI-assisted custom outfits.",
    year: "2024 — 2026",
    status: "Case study",
    role: "UI/UX Designer (part-time)",
    tags: ["Product Strategy", "Workflow Design", "Interface Design"],
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
    status: "Case study",
    role: "UI/UX Designer & Front-End Developer",
    tags: ["Fintech UX", "Service Design", "Responsive Product Design"],
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
