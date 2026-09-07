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
    title: "Reporting Portal",
    category: "Project Management Dashboard",
    tagline:
      "A KPI-first reporting dashboard where task boards, milestones and risk all read at a glance.",
    year: "2025",
    status: "Deck on Behance",
    role: "Product designer",
    tags: ["Dashboard Design", "Information Architecture", "Data Visualisation"],
    featured: true,
    caseStudy: false,
    cover: "/projects/pm-dashboard-laptop.jpg",
    frame: "flat",
    gallery: [
      {
        src: "/projects/pm-dashboard-light.jpg",
        alt: "Reporting Portal in light mode: key metrics row, filter bar, and a four-column task board beside upcoming milestones",
      },
      {
        src: "/projects/pm-dashboard-dark.jpg",
        alt: "The same dashboard in dark mode, with the metric cards and task board colour-coded by status",
      },
      {
        src: "/projects/pm-dashboard-phone.jpg",
        alt: "Reporting Portal's mobile layout shown on a phone",
      },
    ],
    externalUrl: `${BEHANCE}/235694983/Project-Management-Dashboard`,
    art: { hue: "#14122b", accent: "#7c68fd", kind: "workflow" },
    overview:
      "Reporting Portal is a project management dashboard built around a KPI-first overview: a key-metrics row for total projects, tasks due, at-risk and critical items, a filter bar across project, team, date range and status, and a task board that moves work through To Do, In Progress, Review and Done alongside upcoming milestones. It ships in both light and dark themes, and adapts down to mobile. The full presentation is published on Behance.",
    deliverables: [
      "Dashboard design",
      "Information architecture",
      "Task board & milestone views",
      "Light and dark themes",
      "Responsive layout",
    ],
  },
  {
    slug: "archi-tek",
    title: "Archi-Tek",
    category: "AI Architectural Design Tool",
    tagline:
      "Turning a sentence into an editable architectural model — not just a picture of a building.",
    year: "2025",
    status: "Full case study",
    role: "Product designer",
    tags: [
      "AI Product Design",
      "Conversational UX",
      "Information Architecture",
      "Interface Design",
    ],
    featured: true,
    caseStudy: true,
    cover: "/projects/architek-prompt.jpg",
    frame: "flat",
    gallery: [
      {
        src: "/projects/architek-design-type.jpg",
        alt: "Design type modal offering Concept Sketch, Schematic Plan and Detailed Model, each with a plain-language description of what it is for",
      },
      {
        src: "/projects/architek-preview.jpg",
        alt: "Preview modal showing a generated design with download format options — DWG, OBJ, SKP and PDF — and an entry point into the Archi-Tek editor",
      },
      {
        src: "/projects/architek-editor.jpg",
        alt: "The Archi-Tek 3D editor: a viewport with orientation gizmo, object-mode toolbar and an Export Design action",
      },
    ],
    externalUrl: `${BEHANCE}/235692645/Chat-Gpt-like-Product-design-for-Architectural-design`,
    art: { hue: "#14122b", accent: "#7c68fd", kind: "workflow" },
    overview:
      "Archi-Tek is a text-to-design tool for architecture. Describe a building in plain language and it generates concept sketches, schematic plans or detailed models — then hands you the result as a real CAD file you can keep working in. I designed the end-to-end product: the prompt experience, the design-type system, the preview and export flow, and the 3D editor.",
    challenge:
      "Generative AI is good at producing a convincing picture of a building. That is precisely what an architect cannot use. A render is a dead end: it cannot be dimensioned, measured, revised or handed to an engineer. Meanwhile the tools that do produce workable geometry — CAD and 3D modelling suites — carry a learning curve measured in months, which puts early-stage massing and client-facing concepts out of reach for the people who most need them quickly. The design problem was to sit a conversational interface on top of real architectural output, without either half undermining the other: the chat could not feel like a toy, and the output could not be a JPEG.",
    process: [
      "Framed the core insight that fidelity is a decision the user makes, not one the model should guess. A quick massing study and a dimensioned model are different jobs with different tolerances for error, so the interface asks up front — Concept Sketch, Schematic Plan or Detailed Model — and describes each in plain language rather than jargon.",
      "Designed the prompt screen around the blank-page problem. A bare text field asks the user to already know what to say, so the entry point pairs a single open field with typed starting points — 3-Bedroom Bungalow, Duplex Sample, 3-Story Building, Filling Station — and a wall of generated samples underneath, so the first move is recognition rather than recall.",
      "Structured the results as a browsable gallery of named, comparable options (Modern Villa, Neo-Classical Duplex, Urban Courtyard Duplex) rather than a single answer. Architectural ideation is comparative; showing one output invites acceptance instead of judgement.",
      "Made export the moment of trust. The preview modal puts format selection — DWG, OBJ, SKP, PDF — directly beside the generated design, so it is unambiguous from first use that the output is a working file destined for AutoCAD, Blender or SketchUp, not an image to screenshot.",
      "Designed the in-product 3D editor as the continuation of that promise: a familiar viewport with orientation gizmo, object-mode toolbar and its own Export Design action, so refinement does not require leaving the tool — and staged it honestly in the UI as coming soon rather than implying capability that is not there yet.",
      "Kept the chat conversational and the workspace professional, using a restrained neutral interface so the generated architecture is the only thing on screen carrying colour and detail.",
    ],
    outcome:
      "An AI design assistant that behaves like a drafting collaborator rather than an image generator: fidelity chosen deliberately, options compared side by side, and every result leaving the product as an editable CAD file. The flow moves from a sentence, through a design-type decision and a compared set of options, to a downloadable model — with an editor waiting for the work that follows.",
    deliverables: [
      "Conversational UX",
      "Design-type system",
      "Prompt & sample gallery",
      "Preview and export flow",
      "3D editor interface",
      "Interface design",
    ],
  },
  {
    slug: "loan-investment-app",
    title: "Loan & Investment App",
    category: "Fintech Super-App",
    tagline:
      "Borrowing, investing, banking, insurance and bills in one app — without any of them losing their meaning.",
    year: "2025",
    status: "Full case study",
    role: "Product designer",
    tags: [
      "Fintech UX",
      "Transaction Design",
      "Mobile UX",
      "Trust and Clarity",
    ],
    featured: true,
    caseStudy: true,
    cover: "/projects/loan-home.jpg",
    frame: "flat",
    gallery: [
      {
        src: "/projects/loan-myloan.jpg",
        alt: "The loan screen with no active loan: rather than an empty balance, it explains what a loan can be used for — daily expenses, personal goals, business growth — above a single Request Loan action",
      },
      {
        src: "/projects/loan-equities.jpg",
        alt: "Buying equities: indicative value at maturity stated gross of withholding tax, the minimum investment shown beneath the amount field, and wallet balance surfaced beside the payment method before Buy Now",
      },
    ],
    externalUrl: `${BEHANCE}/235692477/Loan-Investment-Mobile-App`,
    art: { hue: "#2a1d0f", accent: "#f4b860", kind: "web3" },
    overview:
      "A Nigerian fintech super-app that combines lending, investing, everyday banking, property insurance and bill payments in a single product. I designed the mobile experience across those journeys — the home dashboard, the loan flow, and the investment and transaction surfaces — with an emphasis on stating plainly what money is doing at every step.",
    challenge:
      "Most people end up running their financial life across four or five apps: one to borrow, one to save, one to invest, another for bills and insurance. Consolidating them is easy to propose and difficult to design well. Each product carries its own risk profile, its own regulatory language and its own vocabulary, and stacking them tends to produce one of two failures — a dashboard so dense that nothing is findable, or an interface so friendly that it quietly obscures what a decision actually costs. Investing raises the stakes further: a product that makes buying equities feel as frictionless as ordering food has not removed complexity, it has hidden risk. The problem was to hold five financial products in one app while keeping each one legible enough to be trusted with real money.",
    process: [
      "Anchored the home screen on one balance rather than five. Everything else — quick actions, savings prompts, pending tasks — arranges itself around that single number, so the first question the app answers is always the one people actually open it to ask.",
      "Designed for use in public. The balance masks by default behind a reveal control, because the realistic context for this app is a phone held on a street or in a queue, not a desk.",
      "Turned empty states into the teaching moment. With no active loan, the screen does not simply report ₦0.00 — it explains what borrowing here is for (daily expenses, personal goals, business growth) before offering a single Request Loan action, so a first-time user learns the product at the point they are considering it.",
      "Surfaced every constraint before commitment, not after it. The ₦100,000 minimum sits under the amount field as you type, and the wallet balance appears beside the payment method, so the two most common causes of a failed transaction are visible before the button is pressed rather than reported as an error afterwards.",
      "Wrote the investment language to be honest rather than flattering. A projected return is labelled indicative value at maturity and stated gross of withholding tax — the interface tells you the number is an estimate and that tax has not yet been taken out, at the exact moment you are deciding how much to commit.",
      "Kept transactions in context using bottom sheets over the instrument's own price chart, so committing money never fully hides the performance data the decision rests on.",
      "Unified five products under one restrained visual system — a warm gold accent on near-black and white — so moving from a loan to an equity purchase to a bill payment feels like one institution rather than four bolted-together apps.",
    ],
    outcome:
      "A super-app that earns the breadth it claims: five financial products sharing one balance, one visual language and one standard of disclosure. Constraints appear before commitment, projections are labelled as projections, and empty states teach rather than stall — so consolidation makes the user's financial picture clearer instead of merely shorter.",
    deliverables: [
      "Home dashboard",
      "Loan request flow",
      "Investment & equity purchase flow",
      "Transaction and payment design",
      "Empty & error states",
      "Mobile design system",
    ],
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
