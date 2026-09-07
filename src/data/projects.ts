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
  frame?: "browser" | "phone" | "flat" | "portrait";
  /** Extra imagery shown below the case-study body. */
  gallery?: { src: string; alt: string; portrait?: boolean }[];
  /** Direct link to the project elsewhere — a Behance deck, or a live product. */
  externalUrl?: string;
  /** Where `externalUrl` points, named for link text. Defaults to "Behance". */
  externalLabel?: string;
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
    slug: "bizinc",
    title: "Bizinc",
    category: "Marketplace & Booking Platform",
    tagline:
      "One platform where a business is found, booked and run — discovery on one side, operations on the other.",
    year: "2024 — 2026",
    status: "Full case study · Live product",
    role: "UI/UX Intern → Designer → Manager, BIZINC",
    tags: [
      "Marketplace UX",
      "Booking Flows",
      "SaaS Dashboards",
      "Design Systems",
      "Responsive Design",
    ],
    featured: true,
    caseStudy: true,
    cover: "/projects/bizinc-home.jpg",
    frame: "flat",
    gallery: [
      {
        src: "/projects/bizinc-flows.jpg",
        alt: "The structural work behind the product: sign-up, business-owner and client user flows mapped side by side, the MVP 2.0 support notes, the full site map, and the mobile screens grouped by journey — account creation, business and client profiles, lists and deals, services and products",
      },
      {
        src: "/projects/bizinc-wireframes.jpg",
        alt: "Seven desktop wireframes resolving layout before visual design — profile, search results, performance dashboard, business profile, marketing tools with spotlight recommendations and promotion opportunities, listings, and the community forum",
      },
      {
        src: "/projects/bizinc-requirements.jpg",
        alt: "Business Profile 2.0 specified as requirements in top-down order, business view beside client view — so the two audiences could be compared field by field and the difference between them decided deliberately rather than by omission",
      },
      {
        src: "/projects/bizinc-figma.jpg",
        alt: "The working Figma file: v1.2 and v2.0 desktop and mobile pages, a components page and a development-ready page, with the AI integration revamp and the Bizzy assistant conversation open on the canvas",
      },
    ],
    externalUrl: "https://www.bizinc.io",
    externalLabel: "bizinc.io",
    art: { hue: "#0d1c2e", accent: "#3f8cff", kind: "booking" },
    overview:
      "Bizinc is an all-in-one marketplace platform: customers discover local businesses and book services, and those businesses manage their operations and grow their brand from the same account. I joined BIZINC — remote, from Atlanta, Georgia — in April 2024 and moved from intern to designer to UI/UX Manager, leading the other designers and interns. My first project was rebuilding the platform's interface from scratch; from there I owned the UI across its booking, e-commerce and SaaS surfaces, along with the user journeys, sitemaps, wireframes and the component library the team designed against.",
    challenge:
      "A marketplace has to satisfy two people whose interests only partly overlap. Someone looking for a service wants to find a business, judge whether to trust it and book it in a few minutes, on a phone, without learning a system first. The business on the other side needs the opposite kind of product — somewhere to run those bookings, manage its listing and see whether any of it is actually bringing customers in. Building both into one platform, across service categories that book quite differently, risks two failures: a customer experience buried under operator tooling, or an operator experience reduced to a profile page no business would actually run on. The problem was to make one platform legible from both directions without maintaining two disconnected products.",
    process: [
      "Mapped the two audiences as separate flows before drawing a single screen — sign-up, business-owner and client journeys side by side — then reconciled them into one site map, so where the paths diverge and where they share a screen was a decision rather than an accident.",
      "Specified Business Profile 2.0 as requirements in top-down order, business view beside client view. Laying the two lists against each other made every difference deliberate: what an owner can edit, what a visitor sees instead, and which fields belong to neither.",
      "Wireframed at desktop scale before any visual design — profile, search, dashboard, marketing tools, listings and the community forum — so layout and hierarchy were settled while they were still cheap to change.",
      "Designed discovery for people who are comparing, not browsing. Business cards lead with the signals that decide an enquiry — what the business does, where it is, how far away, whether it is open right now — so a shortlist forms without opening five tabs.",
      "Treated the business dashboard as the product operators run on, not a settings screen: listing management, deals, services and products, and performance sit together, so being discoverable and being operational are not two separate tools.",
      "Kept the marketing and lead-generation surfaces inside that dashboard rather than bolting them on, so the line from a listing to the enquiries it produces to what the owner does next stays visible in one place.",
      "Designed the AI assistant as a way into the marketplace rather than a support widget — it asks what you need, then returns real business profiles with availability you can act on, so the conversation ends in a booking instead of a link.",
      "Built the interface as reusable components with Auto Layout, variants and design tokens, and versioned the file from v1.2 through v2.0 to a development-ready page — so consistency survived the redesign and engineering had one place to build from.",
      "Worked directly with stakeholders to turn business requirements into interface decisions, and kept every journey responsive from the first wireframe, since the customer side is used mostly on a phone and the operator side mostly at a desk.",
    ],
    outcome:
      "A platform that works from both ends — customers discover and book services, businesses run those bookings and see where their customers came from — held together by one component library across booking, e-commerce and SaaS surfaces. The dashboard and lead-generation experiences I contributed to were associated with a 45% improvement in user activation. I finished the engagement as UI/UX Manager, leading the designers and interns working in the same file. The product is live at bizinc.io.",
    deliverables: [
      "User flows & site map",
      "Requirements specification",
      "Desktop & mobile wireframes",
      "Business dashboard",
      "Marketplace & deals",
      "Lead-generation experience",
      "AI assistant interface",
      "Component library & design tokens",
      "Development-ready handoff",
    ],
  },
  {
    slug: "vista-itss",
    title: "Vista Digital Banking",
    category: "Multi-Country Corporate Banking",
    tagline:
      "One banking app for businesses operating across four markets — entities, currencies and approval mandates included.",
    year: "2023 — 2024",
    status: "Full case study",
    role: "UI/UX Designer & Front-End Developer, ITSS",
    tags: [
      "Fintech UX",
      "Enterprise UX",
      "Service Design",
      "Design Systems",
      "Front-End",
    ],
    featured: true,
    caseStudy: true,
    cover: "/projects/vista-devices.jpg",
    frame: "flat",
    gallery: [
      {
        src: "/projects/vista-menu.jpg",
        alt: "The menu screen, where the entity switcher sits directly under the user's name and last sign-in — one person moving between the legal entities and countries they hold mandates for, above transfer activities, recipient management and approvals",
        portrait: true,
      },
      {
        src: "/projects/vista-banner.jpg",
        alt: "My Accounts: pending approvals surfaced above the fold, then accounts grouped by type with balances shown in local currency",
      },
      {
        src: "/projects/vista-screens.jpg",
        alt: "Marketing and product screens together — the campaign framing of the app alongside account filtering, custom views, pending bulk and single payment requests, and net worth summaries",
      },
    ],
    externalUrl: "https://vistabankgroup.com/group/about/",
    externalLabel: "vistabankgroup.com",
    art: { hue: "#2b0f14", accent: "#c8102e", kind: "banking" },
    overview:
      "Vista is a banking group operating across several West African markets. ITSS took on the Vista programme in 2023, and I worked on its digital banking product — corporate and retail — through to 2024, covering onboarding and identity verification, account dashboards, transfer and approval journeys. I joined as an intern on the programme and moved onto staff during it, receiving the Best Intern Award for my contribution to Vista. The role spanned UI design, digital and graphic design for campaigns, and front-end work, delivered across four localised market subsidiaries — Gambia, Guinea, Sierra Leone and Burkina Faso.",
    challenge:
      "Business banking in a multi-market group breaks the assumption every consumer banking app is built on: that one person means one account in one currency in one country. A Vista customer might be a finance manager holding mandates over several legal entities across Gambia, Guinea, Sierra Leone and Burkina Faso, each with its own currency, its own regulator and its own local rules — and payments they initiate may need someone else's approval before money moves. Designing for that means holding real institutional complexity on a phone screen without either flattening it into something unsafe or exposing all of it at once. The subsidiaries added a second problem on top: four markets — anglophone and francophone, each with its own currency and regulator — needed to feel like one bank without ignoring what made each of them local.",
    process: [
      "Made entity the top-level context rather than a setting. The switcher sits directly beneath the user's name and last sign-in on the menu screen, so which legal entity and market you are acting in is answered before any transaction begins — the question that determines what every subsequent number and permission means.",
      "Designed approvals as a first-class destination, not a notification. Pending requests — bulk payment, single payment, other — are surfaced above the fold on the accounts screen with their own counts, because in corporate banking the blocking task is usually someone else's payment waiting on you.",
      "Built filtering for people who hold many accounts. Default and custom views, sorting by name or balance, and account-type selection let a user with dozens of accounts across entities save the shape they actually work in, rather than scrolling a flat list every session.",
      "Kept balances in local currency and led with available balance rather than ledger balance, since the practical question before a transfer is what can actually be moved today.",
      "Anchored navigation on the four things corporate users return to — accounts, transfers, messages and menu — and kept secure messaging and support inside the app, because for business banking the alternative is a branch visit.",
      "Treated last sign-in, session state and language selection as trust signals rather than clutter, surfacing them where an account holder checks for anything unexpected.",
      "Built one design system across the four subsidiaries so shared journeys stayed consistent while local requirements, languages and regulatory copy could vary. With Gambia and Sierra Leone operating in English and Guinea and Burkina Faso in French, language selection had to be a first-class part of the sign-in experience rather than a setting found later.",
      "Carried the same visual system into campaign and graphic design for the product, and used HTML/CSS to review front-end builds against the designs, keeping interfaces responsive and pixel-accurate through implementation.",
    ],
    outcome:
      "A digital banking product that treats multi-entity, multi-currency, multi-market operation as the normal case rather than an edge case — with approvals designed as core workflow, account views that scale to real portfolios, and one design system serving four localised subsidiaries across Gambia, Guinea, Sierra Leone and Burkina Faso. The work was recognised with the Best Intern Award for contributions to Vista.",
    deliverables: [
      "Onboarding & identity verification",
      "Account dashboards & filtering",
      "Transfer & approval workflows",
      "Multi-entity architecture",
      "Design system across four markets",
      "English & French localisation",
      "Campaign & graphic design",
      "Front-end review (HTML/CSS)",
    ],
  },
  {
    slug: "pay4me",
    title: "Pay4Me App",
    category: "Cross-Border Payments Platform",
    tagline:
      "Paying tuition, SEVIS and visa fees across borders — for students whose admission depends on the transfer clearing.",
    year: "2025",
    status: "Full case study",
    role: "Product designer",
    tags: ["Fintech UX", "Cross-Border Payments", "Trust & Credibility", "Mobile UX"],
    featured: true,
    caseStudy: true,
    cover: "/projects/pay4me-hero.jpg",
    frame: "flat",
    gallery: [
      {
        src: "/projects/pay4me-features.jpg",
        alt: "The product named in the vocabulary of the journey: tuition and school fees paid to named institutions, and a separate block for SEVIS, WES, visa and credential-evaluation payments",
      },
      {
        src: "/projects/pay4me-map.jpg",
        alt: "Trust built through evidence — a world map of the countries served, with video testimonials from students rather than written quotes",
      },
      {
        src: "/projects/pay4me-qr.jpg",
        alt: "The FAQ handoff: a QR code that carries the visitor from desktop research to the app on their phone, where the payment actually happens",
      },
      {
        src: "/projects/pay4me-download.jpg",
        alt: "Download section pairing the app-store routes with the in-app home screen, so the product is visible before installation",
      },
    ],
    art: { hue: "#0f2418", accent: "#3ddc84", kind: "banking" },
    overview:
      "Pay4Me is a cross-border payments platform for international students and immigrants — paying tuition, SEVIS, I-20, visa and credential-evaluation fees to institutions and government agencies abroad. I designed the mobile product and the marketing site that has to earn a stranger's trust before they will download it.",
    challenge:
      "For an international student, a payment is not a transaction — it is a deadline. Miss a SEVIS fee and the visa appointment goes with it; miss a tuition instalment and the admission can lapse. Yet the money usually has to travel the hardest possible route: from a family in one currency, through a banking system with limited access to dollars, to a university that only recognises payments arriving in a particular form. Traditional wires are slow, expensive and opaque, and the person waiting has no way to see where their money is. Two design problems follow from that. The sums are often a family's savings, sent by someone who has never heard of the company — so credibility has to be established before the app is even installed. And the person paying is frequently not the person benefiting, which breaks the assumption almost every payment app is built on.",
    process: [
      "Designed for the sponsor, not just the account holder. Parents and relatives fund most of these payments, so the product treats sponsored payment as a first-class type alongside seamless and cross-border — rather than bending a personal wallet into a use case it was never shaped for.",
      "Made recipients people instead of account numbers. Recent transfers appear as faces and first names, and the search field asks you to find a friend or family member to send money to — matching how these transfers are actually described out loud, and removing a common source of costly typos.",
      "Put currency where the money is. The balance carries its own currency switcher rather than burying conversion in a settings screen, because holding and thinking in more than one currency is the normal state for this user, not an edge case.",
      "Surfaced verification status as identity. The account tier sits beside the user's name and verified badge, because in this category tier determines transfer limits — so what would otherwise be buried compliance state becomes information the user needs before starting a large payment.",
      "Named the real jobs rather than generic ones. The site speaks in SEVIS, WES, I-20, visa applications and credential evaluations, not payments and services — using the exact vocabulary of the immigration journey, which both signals competence and lets people recognise their situation instantly.",
      "Built the marketing site as trust architecture, layered by kind of doubt: payment processors and named universities answer is this real, a world map answers do you work where I am, video testimonials from students answer has this worked for someone like me, and an FAQ given two full columns answers the rest.",
      "Bridged desktop research to mobile action with a QR code. People investigate a payments company on a laptop but pay on a phone, so the site closes that gap directly rather than asking them to search an app store later.",
      "Kept everyday utility in the app between the big moments. Airtime top-up and bill payment give people a reason to open it in the months between tuition instalments, so the product is already familiar when the payment that matters arrives.",
      "Made support a destination, not a dead end. It sits in the bottom navigation as one of four primary tabs — appropriate for high-value, high-anxiety transfers where being unable to reach a human is itself the failure.",
    ],
    outcome:
      "A payments product shaped around the real unit of work — a family funding someone else's education across a border, against a deadline. Sponsored payments are designed for rather than tolerated, verification and currency are treated as everyday context instead of settings, the interface speaks the immigration journey's own vocabulary, and the site does the credibility work before the download rather than after it.",
    deliverables: [
      "Mobile app design",
      "Sponsored & cross-border payment flows",
      "Multi-currency balance & transfers",
      "Marketing site design",
      "Trust & credibility system",
      "FAQ and support experience",
    ],
  },
  {
    slug: "chalant-ai",
    title: "Chalant AI",
    category: "AI Learning Platform & Agent Workspace",
    tagline:
      "Teaching people to manage AI by giving them a team to manage — with the judgement built in, not lectured about.",
    year: "2025",
    status: "Full case study",
    role: "Lead product designer",
    tags: [
      "AI Product Design",
      "Information Architecture",
      "Dashboard Design",
      "Design System",
      "Gamification",
    ],
    featured: true,
    caseStudy: true,
    cover: "/projects/chalant-tasks.jpg",
    frame: "flat",
    gallery: [
      {
        src: "/projects/chalant-workspace.jpg",
        alt: "The AI Agent Workspace: five agents with role, live status, current task and progress, alongside accuracy and volume figures — the learner reads their team the way a manager reads a standup",
      },
      {
        src: "/projects/chalant-review.jpg",
        alt: "The Review Queue states each output's confidence score, an estimated review time and whether it passed SOP compliance — Quick Approve sits beside a full Review rather than replacing it",
      },
      {
        src: "/projects/chalant-sop.jpg",
        alt: "The SOP Library: versioned standard operating procedures with compliance rings, a critical alert surfaced at the top, and each SOP linkable directly to a task",
      },
      {
        src: "/projects/chalant-export.jpg",
        alt: "The Export Center turns practice into artefacts — agent reports, analytics, decks and task data leaving in PDF, Excel, PowerPoint and JSON",
      },
      {
        src: "/projects/chalant-analytics.jpg",
        alt: "Admin analytics where each AI insight names the course and module, quantifies the drop-off, recommends an action and states its own confidence",
      },
    ],
    externalUrl: "https://chalantwork.com/",
    externalLabel: "chalantwork.com",
    art: { hue: "#101a2e", accent: "#2b6cff", kind: "workflow" },
    overview:
      "Chalant AI is a learning platform for people who need to work with AI rather than merely read about it. Alongside courses, live sessions and voice learning sits the AI Manager Path — a simulated workspace where learners run a team of AI agents, assign real tasks, review the output and answer for the quality. I led end-to-end product design across the learner and admin experiences.",
    challenge:
      "The skill people actually need around AI is not prompting — it is management: deciding what to delegate, judging whether the result is good enough, and knowing when a confident-sounding output should be rejected. That judgement cannot be transferred by watching a video, because the failure mode being trained against is precisely the one a passive learner exhibits: accepting plausible work without checking it. So the platform had to teach through practice with consequences, while remaining a product an administrator could run as a business — which meant one system serving a learner who wants to progress and an operator who needs to see engagement, revenue and where courses are failing.",
    process: [
      "Made the lesson a workspace. The AI Manager Path drops the learner into a team of five agents with roles, live status and current tasks — so the unit of learning is a decision made under realistic conditions rather than a module completed.",
      "Exposed the numbers a manager would actually use. Every agent card carries accuracy, task volume, average turnaround and progress, so judging performance means reading evidence instead of trusting a vibe.",
      "Designed the Review Queue as the heart of the product. Each submission states a confidence score, an estimated review time and whether it passed SOP compliance — three signals that together teach calibrated trust rather than blanket acceptance or blanket suspicion.",
      "Kept Quick Approve next to full Review, deliberately. The shortcut has to exist for the trade-off to be real; a tool that forbids it teaches compliance, not judgement.",
      "Anchored quality in written standards. The SOP Library holds versioned procedures with ownership, compliance scoring and critical alerts, and any SOP can be linked to a task — so good output means measured against something, not merely looks right.",
      "Made the human checkpoint structural. Needs Review is its own column on the task board rather than a flag, so work cannot reach Done without passing through a person.",
      "Gave practice an artefact. The Export Center sends reports, analytics, decks and task data out as PDF, Excel, PowerPoint and JSON, so a training exercise ends in something the learner can actually use at work.",
      "Tuned progression for a long path. XP, levels, streaks, badges and rank sustain momentum across weeks of practice, and sit in the sidebar as ambient context rather than interrupting the work.",
      "Built one product for two roles. A role switch reveals the operator's surfaces — course builder, path analytics, plan and revenue — so learner and admin share a single design system instead of splitting into two disconnected apps.",
      "Made analytics end in a decision. Each AI insight names the course and module, quantifies the problem, proposes a specific action and states its own confidence — modelling, in the admin product, exactly the calibrated-trust behaviour the learner product is teaching.",
    ],
    outcome:
      "A learning product where the curriculum is the work itself: agents to delegate to, confidence scores and SOPs to judge against, a review step that cannot be skipped structurally, and exports that turn practice into deliverables. Learner and operator share one design system, and the same principle runs through both — surface the evidence, name the confidence, and leave the judgement with the person.",
    deliverables: [
      "AI agent workspace",
      "Review queue & confidence system",
      "SOP library",
      "Task management (Kanban, timeline, checklist)",
      "Export centre",
      "Admin analytics & insights",
      "Gamification system",
      "Design system",
    ],
  },
  {
    slug: "kremor-ai",
    title: "Kremor AI",
    category: "AI Fashion Platform & Artisan Operations",
    tagline:
      "African textiles as a design language, not a print — a generator, a storefront, and the workshop floor that turns a prompt into a garment.",
    year: "2024 — 2026",
    status: "Full case study",
    role: "UI/UX Designer, Kremor AI (contract)",
    tags: [
      "AI Product Design",
      "Conversational UI",
      "E-commerce UX",
      "Role-Based Admin",
      "Design Systems",
    ],
    featured: true,
    caseStudy: true,
    cover: "/projects/kremor-hero.jpg",
    frame: "flat",
    gallery: [
      {
        src: "/projects/kremor-mobile.jpg",
        alt: "The mobile system end to end — the design assistant with its quick actions, the generative home page, shop filtered by Ankara womenswear, menswear and bags, the product detail with size, colour, fabric and how the piece was made, About, contact, login and account creation",
      },
      {
        src: "/projects/kremor-workspace.jpg",
        alt: "Kremor.AI Workspace: one prompt field reading ask anything, create anything, with attachment and voice input, a generate action, and Marketplace and History in the top bar — so a session of creative work can be returned to rather than restarted",
      },
      {
        src: "/projects/kremor-phone.jpg",
        alt: "The storefront on a phone — the hero states the proposition in one line: African fashion designed by AI, sustainable, and rooted in heritage rather than borrowing from it",
        portrait: true,
      },
      {
        src: "/projects/kremor-admin.jpg",
        alt: "The accountability layer: an immutable audit log where every action is attributed to the role that took it, and a permissions matrix across Super Admin, Design Manager, Production Manager, Support Agent and Inventory Manager — with dangerous actions marked and locked permissions shown as locked",
      },
      {
        src: "/projects/kremor-staffing.jpg",
        alt: "Reassigning work when a support agent is suspended: the modal raises their twelve open conversations first, then offers auto-distribution by workload or manual selection, with each agent's active conversation count and workload level visible before you choose",
      },
      {
        src: "/projects/kremor-figma.jpg",
        alt: "The admin dashboard laid out in the working Figma file — orders, measurements, artisans, design approvals, production board, messages and exports as one continuous pipeline, alongside the Ready for Dev and component pages",
      },
    ],
    art: { hue: "#2b0f1d", accent: "#e0a955", kind: "fashion" },
    overview:
      "Kremor AI is a fashion-technology platform that generates custom African clothing from a prompt and then has it made. It runs as three connected surfaces: a storefront selling AI-generated Ankara womenswear, menswear and bags; a creative workspace where a design is explored and iterated; and an admin platform where measurements, artisans, design approvals and production are managed by role. I designed all three end to end on contract from June 2024 to July 2026 — flows, interface design, AI interaction patterns and the design system — and evaluated 96+ complex AI interaction tasks to find the patterns worth keeping.",
    challenge:
      "African fashion is usually flattened twice over. Globally it is reduced to a single decorative idea — African print — when Ankara, Aso-Oke, Adire and Kente are distinct traditions with their own rules. And in most AI tools it would be flattened again, into a style filter applied to a Western silhouette. The brief was the opposite of that: use AI to widen what someone can imagine wearing, while treating the textiles as a language rather than a texture. That created two problems. Most people cannot describe a garment they have not seen, so a blank prompt box would fail exactly the person the product exists for. And a generated image is not a dress — someone still has to take measurements, approve a design, cut fabric and sew it, which meant the creative surface was worthless unless the workshop behind it was designed with the same care.",
    process: [
      "Named the textiles rather than the continent. The product speaks in Ankara, Aso-Oke, Adire, Kente and Afro-fusion instead of African print, because specificity is both the respect the subject is owed and the vocabulary the generator needs to work with.",
      "Refused the blank prompt box. The assistant opens with quick actions — generate design concepts, show style options, explore trends, create layout variations for Ankara patterns — and the home page offers openers phrased how people actually talk: I want an African vibe wear for an event. Someone with a feeling but no vocabulary still gets a first move.",
      "Sequenced the promise the way creative confidence is built: personalised designs takes what you already know about yourself, AI-powered creativity opens options you had not considered, and unique and exclusive returns ownership of the result to you. Input, exploration, authorship — in that order.",
      "Kept the assistant present across the whole storefront rather than parking it in a separate tool, so browsing and creating stay one activity and inspiration can be acted on where it strikes.",
      "Designed the Workspace around iteration rather than one-shot generation. A single field — ask anything, create anything — accepts reference material and voice, and History and Marketplace sit in the top bar, so a train of thought can be resumed instead of restarted. Creative process only compounds if it persists.",
      "Anchored the generated in the physical. Product pages state fabric, care, delivery and how this was made, so the sustainability claim is carried by facts about the garment instead of a banner over the top of it.",
      "Designed the pipeline from prompt to finished piece as one path — orders, measurements, artisans, design approval, production board, messages, exports — so a generated design has a documented route to a tailor's hands, and craftsmanship stays in the loop rather than being replaced by the model.",
      "Made the operating model explicit in a permissions matrix. Super Admin, Design Manager, Production Manager, Support Agent and Inventory Manager are laid against every action, with dangerous ones — suspend an artisan, cancel an order, refund a payment, override a status — marked and confirmation-gated, and always-allowed permissions shown as locked rather than quietly missing.",
      "Made accountability legible with an immutable, read-only audit log where every entry is timestamped and attributed to the role that acted, human or system — necessary in a product where a model, an agent and a manager all touch the same order.",
      "Designed staff changes around the customer, not the employee record. Suspending a support agent surfaces their twelve open conversations before anything else and offers reassignment — automatically by workload and availability, or by hand with each agent's active count and workload visible, and a preview of the conversation being moved.",
      "Maintained the design system across all three surfaces — shared text and colour styles, a component page, and a Ready for Dev page — so the storefront, the workspace and the admin platform read as one product and engineering had a single source to build from.",
    ],
    outcome:
      "One product across three surfaces that each answer a different question: can I imagine it, can I buy it, can it actually be made. The generative side is scaffolded so that people who cannot yet describe what they want still get somewhere, the commerce side grounds AI output in fabric, care and provenance, and the operations side carries a role model, a permissions matrix and an immutable audit trail sturdy enough for real orders passing between managers, support agents and artisans. All three share one design system and a documented development handoff.",
    deliverables: [
      "AI design assistant & prompt scaffolding",
      "Generative workspace",
      "Storefront & product experience",
      "Order, measurement & production pipeline",
      "Artisan & design approval workflows",
      "Role-based permissions matrix",
      "Audit log & accountability model",
      "Staff & conversation management",
      "Design system & dev handoff",
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
    tags: [
      "Marketplace UX",
      "PropTech",
      "Booking Flows",
      "Mobile UX",
      "Investment UX",
    ],
    featured: true,
    caseStudy: true,
    cover: "/projects/shortlet-laptop.jpg",
    frame: "flat",
    gallery: [
      {
        src: "/projects/shortlet-invest.jpg",
        alt: "The investment side: shares in high-yield rental properties from ₦50,000, with the property gallery, valuation and share count shown together — the same apartment a guest would book, presented as an asset",
      },
      {
        src: "/projects/shortlet-phone.jpg",
        alt: "The guest side on mobile: where, check-in, check-out and who, held in a single search card above the listings — the four questions a stay actually turns on",
        portrait: false,
      },
    ],
    externalUrl: "https://www.shortlet-lagos.com",
    externalLabel: "shortlet-lagos.com",
    art: { hue: "#101c33", accent: "#f4823c", kind: "booking" },
    overview:
      "Shortlet Lagos runs two products against one portfolio of apartments: guests book short stays, and investors buy shares in the same rental properties from ₦50,000 upward. I owned end-to-end UX/UI design and research across both — discovery, search, filtering and booking on the guest side, and the property marketplace on the investment side.",
    challenge:
      "The same apartment has to read two completely different ways depending on who is looking at it. To a guest it is somewhere to sleep next weekend, judged on photos, location and whether the dates are free — a decision made in minutes, usually on a phone. To an investor it is an asset, judged on yield, entry price and what happens to the money afterwards — a decision made slowly, at a desk, and one that carries real risk. Fractional property investment also has a credibility problem before it has a usability one: asking someone to put money into a share of a building they will never hold the keys to means the interface has to make the mechanics obvious rather than exciting. Designing both without letting the marketing energy of the booking side leak into the investment side was the core problem.",
    process: [
      "Split the product into two entry points rather than one blended homepage, so a guest and an investor are answering different questions from the first screen instead of being sold the wrong one.",
      "Reduced the guest search to the four things a stay actually turns on — where, check-in, check-out, who — and kept them in a single card above the listings, so the whole query is visible and editable in one place on a phone.",
      "Led the investment side with the mechanic rather than the promise: buy shares in rental properties, share by share, from a stated minimum, so the model is understood before any return is discussed.",
      "Put the entry price on the surface. Naming the ₦50,000 minimum up front lets someone rule themselves in or out immediately, instead of discovering the threshold after signing up.",
      "Kept the property itself central on the investment side — gallery, valuation and share count together — so an investment decision is still anchored in a real building rather than an abstract instrument.",
      "Wrote the value proposition against the objection rather than around it: building wealth through real estate without huge capital or the hassle of tenant management names the two reasons people rule property out.",
      "Built responsive components in Figma with Auto Layout and variants for listing cards, calendars, forms and property tiles, so the guest and investor surfaces stayed recognisably one company.",
    ],
    outcome:
      "One platform serving two audiences with genuinely different decisions to make — a mobile booking journey reduced to the four questions a stay depends on, and a fractional investment marketplace that leads with its mechanics and its entry price rather than with projected returns. Both sit on a shared responsive component set. The product is live at shortlet-lagos.com.",
    deliverables: [
      "User flows & research",
      "Guest booking journey",
      "Fractional investment marketplace",
      "Property listing & detail design",
      "Responsive design system",
      "High-fidelity UI & prototype",
    ],
  },
  {
    slug: "arete",
    title: "Arete",
    category: "Digital Healthcare & Telemedicine Platform",
    tagline:
      "Connecting consultations, HMO coverage, prescriptions and pharmacy fulfilment in one calm journey.",
    year: "2026",
    status: "Full case study",
    role: "End-to-end product designer",
    tags: ["Research", "UX Strategy", "Product Design", "Usability Testing"],
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
    slug: "synqit",
    title: "Synqit",
    category: "Web3 Collaboration Platform",
    tagline:
      "Helping teams discover and engage with the right partners, projects and communities across Web3.",
    year: "2026",
    status: "Deck on Behance",
    role: "Product designer",
    tags: ["Product Design", "Interaction Design", "High-Fidelity UI"],
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
];

export const featuredProjects = projects.filter((p) => p.featured);
/**
 * Everything not in the featured gallery. The two lists are deliberately
 * disjoint — repeating a featured project further down the page adds length
 * without adding information.
 */
export const otherProjects = projects.filter((p) => !p.featured);
export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);
