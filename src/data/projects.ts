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
  /**
   * What kind of thing this is. Stated on every case study so a concept is
   * never mistaken for a shipped product, or a prototype for a live one.
   */
  productStatus?:
    | "Live product"
    | "Shipped product"
    | "Live website"
    | "Internal product"
    | "Prototype"
    | "Concept exploration";
  overview: string;
  /**
   * Scannable facts for the "At a glance" panel. Every field is optional and
   * omitted rather than guessed — a missing timeline means it is not verified,
   * not that the project was short.
   */
  context?: {
    product?: string;
    ownership?: string;
    team?: string;
    timeline?: string;
    platform?: string;
    primaryUsers?: string;
    focus?: string;
    scope?: string;
    constraints?: string;
  };
  /** First-person statement of what I owned on this project. */
  contribution?: string;
  /**
   * Numbers, each labelled by what kind of number it is. `impact` is tied to
   * the design work; `scope` describes the complexity handled; `traction` is a
   * public figure belonging to the company, never presented as my result.
   */
  metrics?: {
    value: string;
    label: string;
    kind: "impact" | "scope" | "traction";
    note?: string;
  }[];
  /** Shown above any traction metrics, attributing them to the company. */
  tractionNote?: string;
  /** Research and discovery, stated at the level it actually happened. */
  research?: {
    status: string;
    considered?: string;
    investigated?: string;
    learned?: string;
    changed?: string;
    uncertain?: string;
    nextTest: string;
  };
  /** The problem — user, business or operational. */
  challenge?: string;
  /** What made it hard: the real constraint or tension that shaped the work. */
  difficulty?: string;
  /** Key decisions and why they were made. */
  process?: string[];
  /**
   * Alternatives, early directions or rejected options — only where the
   * project files actually show them. Absent means no documented evidence,
   * not that nothing was explored.
   */
  explored?: string;
  /** What changed as a result of the work. */
  outcome?: string;
  /**
   * Observable or measured result. Where a number appears it must state what
   * it measures and whether it was measured, reported or estimated.
   */
  evidence?: string;
  /** Anchor on the design-systems page, where this project's system lives. */
  systemAnchor?: string;
  /** What I would test or measure next. */
  improveNext?: string;
  /** What I would change in the product itself, given more time. */
  improveWithTime?: string;
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
    productStatus: "Live product",
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
      "Bizinc is an all-in-one marketplace platform: customers discover local businesses and book services, and those businesses manage their operations and grow their brand from the same account. Two products, two audiences and one account between them. I joined remotely in April 2024, two years before the engagement ended, and moved from intern to designer to UI/UX Manager over that time.",
    metrics: [
      {
        "value": "+45%",
        "label": "User activation on the dashboard",
        "kind": "impact"
      },
      {
        "value": "+23%",
        "label": "Customer growth across the redesign period",
        "kind": "traction",
        "note": "Bizinc's own figure, measured over the redesign period"
      },
      {
        "value": "+12%",
        "label": "Customer-to-customer service activity",
        "kind": "impact"
      }
    ],
    contribution:
      "I designed Bizinc from scratch. I framed the problem with the founding team, mapped the sign-up, business-owner and client journeys, reconciled them into one site map, wrote the Business Profile 2.0 requirements, wireframed at desktop scale, and designed the marketplace, booking, deals, services, products and dashboard surfaces in high fidelity. I built the component library the rest of the team designed against — Auto Layout, variants and design tokens — and versioned the file from v1.2 to v2.0 to a development-ready page.",
    context: {
      ownership:
        "End-to-end ownership",
      primaryUsers:
        "Customers booking services; business owners running them",
      focus:
        "Two-sided marketplace UX, booking flows, operator dashboards, design system",
      product:
        "Bizinc — an all-in-one marketplace platform, live at bizinc.io",
      team:
        "BIZINC design team; joined as an intern and progressed to UI/UX Manager, leading the junior design team of UI, UX and graphic designers alongside interns",
      timeline:
        "April 2024 – May 2026",
      scope:
        "User flows, site map, requirements, wireframes and UI across the booking, e-commerce and SaaS surfaces; component library; development handoff",
      platform:
        "Responsive web — the customer side used mostly on a phone, the operator side at a desk",
      constraints:
        "Two audiences in one platform, service categories that book differently, and a live product redesigned in place from v1.2 to v2.0",
    },
    challenge:
      "A marketplace has to satisfy two people whose interests only partly overlap. Someone looking for a service wants to find a business, judge whether to trust it and book it in a few minutes, on a phone, without learning a system first. The business on the other side needs the opposite kind of product — somewhere to run those bookings, manage its listing and see whether any of it is actually bringing customers in. Building both into one platform, across service categories that book quite differently, risks two failures: a customer experience buried under operator tooling, or an operator experience reduced to a profile page no business would actually run on. The problem was to make one platform legible from both directions without maintaining two disconnected products.",
    research: {
      "status": "Product-design-led, with stakeholder discovery",
      "considered": "Two audiences whose interests only partly overlap — people looking for a service, and the businesses selling it.",
      "investigated": "Where one profile has to serve an owner who edits it and a visitor who judges it, and which signals actually decide an enquiry.",
      "learned": "The two views diverge field by field, and leaving that implicit was quietly producing two disconnected products.",
      "changed": "Business Profile 2.0 was specified as a written requirements list, business view beside client view, before any screen was drawn.",
      "uncertain": "Which parts of the redesign drove the activation and growth figures — the numbers are aggregate, not attributed.",
      "nextTest": "Test whether business owners understand the difference between profile editing and customer-facing profile content, and instrument the discovery path to see whether the open-now, distance and category signals shorten the route to an enquiry."
    },
    difficulty:
      "The hardest part was Business Profile 2.0 — one profile serving an owner who edits it and a visitor who judges it. Deciding field by field what an owner controls, what a visitor sees instead, and what belongs to neither is the kind of thing that quietly becomes two disconnected products if it is never settled explicitly. Working it out as a written requirements list, business view beside client view, was slower than designing screens directly and it was the only way to make each difference deliberate rather than accidental. Redesigning in place added a second constraint: the platform was already live with businesses on it, so v2.0 had to be a version people could be moved to, not a fresh start.",
    process: [
      "Mapped the two audiences as separate flows before drawing a single screen — sign-up, business-owner and client journeys side by side — then reconciled them into one site map, so where the paths diverge and where they share a screen was a decision rather than an accident.",
      "Specified Business Profile 2.0 as requirements in top-down order, business view beside client view. Laying the two lists against each other made every difference deliberate: what an owner can edit, what a visitor sees instead, and which fields belong to neither.",
      "Wireframed at desktop scale before any visual design — profile, search, dashboard, marketing tools, listings and the community forum — so layout and hierarchy were settled while they were still cheap to change.",
      "Designed discovery for people who are comparing, not browsing. Business cards lead with the signals that decide an enquiry — what the business does, where it is, how far away, whether it is open right now — so a shortlist forms without opening five tabs.",
      "Treated the business dashboard as the product operators run on, not a settings screen: listing management, deals, services and products, and performance sit together, so being discoverable and being operational are not two separate tools.",
      "Kept the marketing and lead-generation surfaces inside that dashboard rather than bolting them on, so the line from a listing to the enquiries it produces to what the owner does next stays visible in one place.",
      "Designed the AI assistant as a way into the marketplace rather than a support widget, and tied it to the map: it asks what you need, reads where you are, and returns real businesses nearby with availability you can act on — so the conversation ends in a booking instead of a link, and a small local business becomes findable to someone who did not know its name.",
      "Built the interface as reusable components with Auto Layout, variants and design tokens, and versioned the file from v1.2 through v2.0 to a development-ready page — so consistency survived the redesign and engineering had one place to build from.",
      "Worked directly with stakeholders to turn business requirements into interface decisions, and kept every journey responsive from the first wireframe, since the customer side is used mostly on a phone and the operator side mostly at a desk.",
    ],
    explored:
      "The working file carries the exploration rather than describing it. The v1.2 desktop and mobile pages sit alongside v2.0 instead of being overwritten, separate landing-page and marketplace directions from the designers on the team are kept as parallel frames, and an AI-integration direction was explored as its own branch before the assistant took the form it shipped in. The redesign was chosen against the version it replaced rather than in a vacuum.",
    outcome:
      "A platform that works from both ends — customers discover and book services, businesses run those bookings and see where their customers came from — held together by one component library across booking, e-commerce and SaaS surfaces. Onboarding was smoothed so fewer people fall out before they have an account, discovery became proximity-aware rather than a flat directory, and the operator dashboard gave owners a reason to return between bookings. The product is live at bizinc.io.",
    systemAnchor: "in-product",
    evidence:
      "The redesign moved the numbers the business tracks: a 23% increase in customers across the redesign period, a 12%+ increase in customer-to-customer service activity, and a 45% improvement in user activation on the dashboard and lead-generation experiences, alongside growth in profile creation and stronger retention. The product is live at bizinc.io, and Bizinc's CEO has written a reference describing the platform rebuild and the progression to UI/UX Manager, published in full on the credentials page.",
    improveNext:
      "The headline numbers tell me the redesign worked; they do not yet tell me which parts did the work. I would instrument the discovery path specifically — whether the open-now, distance and category signals on a business card actually shorten the route to an enquiry — and test the AI assistant with people who have never used the platform, since its value depends entirely on a stranger trusting it enough to start the conversation. On the operator side, I would want to know whether owners find the marketing surfaces inside the dashboard or work around them.",
    deliverables: [
      "User flows & site map",
      "Requirements specification",
      "Desktop & mobile wireframes",
      "Business dashboard",
      "Marketplace, deals & proximity discovery",
      "Lead-generation experience",
      "AI assistant interface",
      "Component library & design tokens",
      "Development-ready handoff",
    ],
    improveWithTime:
      "I would take the operator dashboard further into daily use — a genuine at-a-glance view of the day's bookings and enquiries rather than a set of management surfaces — and give the AI assistant a proper first-run state, since its usefulness depends entirely on a stranger starting a conversation with it.",
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
    productStatus: "Shipped product",
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
    metrics: [
      {
        "value": "4",
        "label": "West African markets — Gambia, Sierra Leone, Guinea, Burkina Faso",
        "kind": "scope"
      },
      {
        "value": "4",
        "label": "Localised subsidiaries on one design system",
        "kind": "scope"
      },
      {
        "value": "2",
        "label": "Languages — English and French, selected at sign-in",
        "kind": "scope"
      },
      {
        "value": "Multi-entity",
        "label": "Mandates held across separate legal entities and currencies",
        "kind": "scope"
      }
    ],
    contribution:
      "I designed the digital banking product across corporate and retail journeys — onboarding and identity verification, account dashboards, transfers, approval mandates, secure messaging and payments — for four localised market subsidiaries. I built one design system that held across all four while allowing local differences in language, currency and regulatory copy, produced the campaign and graphic design that sat on top of it, and reviewed front-end builds in HTML/CSS to keep implementation faithful to the designs.",
    context: {
      ownership:
        "Product design across corporate and retail journeys, plus front-end review",
      primaryUsers:
        "Corporate mandate holders and retail customers across four markets",
      focus:
        "Multi-entity, multi-currency banking; approval workflows; a design system spanning four subsidiaries",
      product:
        "Vista digital banking — corporate and retail, across four West African subsidiaries",
      team:
        "ITSS (Geneva) delivering for the Vista banking group; joined as an intern on the programme and moved onto staff during it",
      timeline:
        "May 2023 – April 2024",
      scope:
        "Onboarding and identity verification, account dashboards, transfer and approval journeys, campaign and graphic design, front-end review in HTML/CSS",
      platform:
        "Mobile banking app, with campaign and marketing surfaces",
      constraints:
        "Four regulated markets, two languages, separate currencies, and corporate approval mandates",
    },
    challenge:
      "Business banking in a multi-market group breaks the assumption every consumer banking app is built on: that one person means one account in one currency in one country. A Vista customer might be a finance manager holding mandates over several legal entities across Gambia, Guinea, Sierra Leone and Burkina Faso, each with its own currency, its own regulator and its own local rules — and payments they initiate may need someone else's approval before money moves. Designing for that means holding real institutional complexity on a phone screen without either flattening it into something unsafe or exposing all of it at once. The subsidiaries added a second problem on top: four markets — anglophone and francophone, each with its own currency and regulator — needed to feel like one bank without ignoring what made each of them local.",
    research: {
      "status": "Requirements-led discovery with product and engineering teams",
      "considered": "Corporate mandate holders operating across several legal entities, alongside retail customers.",
      "investigated": "Whether the retail patterns could carry corporate banking, where one person may act for several entities in different currencies and regulators.",
      "learned": "They could not. Corporate banking breaks the one-person-one-account assumption the retail flows were built on, and approvals are other people's work waiting on you rather than notifications.",
      "changed": "Entity became top-level context beneath the user's name rather than a setting, and pending approvals moved above the fold on the accounts screen with their own counts.",
      "uncertain": "Post-launch adoption and task-completion behaviour, which I did not have access to.",
      "nextTest": "Test whether mandate holders can tell at a glance which entity they are operating in before initiating a transfer, with real corporate customers rather than internal reviewers."
    },
    difficulty:
      "Four subsidiaries — Gambia, Sierra Leone, Guinea and Burkina Faso — each with its own currency, regulator and language meant every shared screen had to survive four sets of local requirements without fragmenting into four products. Anglophone and francophone markets pushed language selection up into sign-in rather than leaving it in settings: a small decision with a large consequence, because it sits in front of the most sensitive screen in the app. Corporate banking then broke the assumption the retail patterns were built on — one person, one account, one currency, one country — so patterns that worked for retail customers had to be rethought rather than reused for a finance manager holding mandates across several legal entities.",
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
    evidence:
      "The work was recognised with ITSS's Most Outstanding Intern of the Year award, and the letter names the Vista Bank project UI/UX design specifically as what it was awarded for — client-side recognition tied to this project rather than a general commendation, readable in full on the credentials page. The design shipped across four localised subsidiaries on a single system, with entity, currency and language handled as first-class context rather than as settings.",
    improveNext:
      "The entity switcher carries the most risk in the product, because acting in the wrong entity means moving the wrong company's money. I would test whether mandate holders can tell at a glance which entity they are operating in before they initiate a transfer, and whether the approval counts read as work assigned to them rather than as notifications they can dismiss. That needs real corporate customers rather than internal reviewers.",
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
    improveWithTime:
      "I would design the approval queue as a working surface rather than a list — batch review, delegation when someone is away, and a clear audit trail of who approved what — since that is where a corporate finance team actually spends its time.",
  },
  {
    slug: "pay4me",
    title: "Radius",
    category: "Cross-Border Payments — formerly Pay4Me App",
    tagline:
      "Paying tuition, SEVIS and visa fees across borders — for students whose admission depends on the transfer clearing.",
    year: "2025",
    status: "Full case study · Live product",
    role: "Product designer",
    tags: ["Fintech UX", "Cross-Border Payments", "Trust & Credibility", "Mobile UX"],
    featured: true,
    caseStudy: true,
    productStatus: "Live product",
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
    externalUrl: "https://withradius.com/",
    externalLabel: "Radius",
    art: { hue: "#0f2418", accent: "#3ddc84", kind: "banking" },
    overview:
      "Radius — the product I designed as Pay4Me App, since rebranded — is a cross-border payments platform for international students and immigrants, covering tuition, SEVIS, I-20, visa and credential-evaluation fees paid to institutions and government agencies abroad. I designed the mobile product and the marketing site that has to earn a stranger's trust before they will download it.",
    metrics: [
      {
        "value": "100K+",
        "label": "International students using Radius",
        "kind": "traction"
      },
      {
        "value": "1,500+",
        "label": "Five-star reviews for speed and reliability",
        "kind": "traction"
      },
      {
        "value": "6h",
        "label": "Average payment processing time",
        "kind": "traction"
      },
      {
        "value": "96+",
        "label": "Countries served for tuition and fee payments",
        "kind": "traction"
      }
    ],
    tractionNote:
      "These figures are public product and company metrics reported by Radius on withradius.com. They are included to show the scale and context of the product I designed for, not as outcomes of my design work.",
    contribution:
      "I designed the mobile experience for international students and families making high-stakes cross-border payments — payment journeys, sponsored payments where the payer and the beneficiary are different people, verification and tier status, transaction tracking, currency visibility and support. I designed the marketing site that has to earn a stranger's trust before the app is installed, and worked on making payment language plainer and more credible at the moment someone commits a family's savings.",
    context: {
      ownership:
        "Mobile product design and marketing site",
      primaryUsers:
        "International students and the families who fund them",
      focus:
        "High-stakes cross-border payments, sponsored payments, trust before install",
      product:
        "Pay4Me — cross-border payments for international students and immigrants",
      scope:
        "Mobile app design, sponsored and cross-border payment flows, multi-currency balance, marketing site, trust and credibility system",
      platform:
        "Mobile app and responsive marketing site",
      constraints:
        "High-value payments against hard deadlines, where the person paying is frequently not the person benefiting",
    },
    challenge:
      "For an international student, a payment is not a transaction — it is a deadline. Miss a SEVIS fee and the visa appointment goes with it; miss a tuition instalment and the admission can lapse. Yet the money usually has to travel the hardest possible route: from a family in one currency, through a banking system with limited access to dollars, to a university that only recognises payments arriving in a particular form. Traditional wires are slow, expensive and opaque, and the person waiting has no way to see where their money is. Two design problems follow from that. The sums are often a family's savings, sent by someone who has never heard of the company — so credibility has to be established before the app is even installed. And the person paying is frequently not the person benefiting, which breaks the assumption almost every payment app is built on.",
    research: {
      "status": "Product-design-led, grounded in the category's real deadlines",
      "considered": "Students paying tuition, SEVIS, visa and credential-evaluation fees, and the parents and relatives who actually send the money.",
      "investigated": "Why a payment in this category is a deadline rather than a transaction, and where credibility has to be established relative to where the payment happens.",
      "learned": "The person paying is frequently not the person benefiting, and judgement about the company happens on a desktop before the app is ever installed.",
      "changed": "Sponsored payment became a first-class payment type rather than a personal wallet bent into shape, and the credibility work moved into the marketing site with a QR handoff to the phone.",
      "uncertain": "Completion behaviour for first-time sponsors, which needs instrumentation rather than inference.",
      "nextTest": "Test payment completion with first-time sponsored payers — a parent sending for a student — and measure drop-off between the marketing site and app install."
    },
    difficulty:
      "The product has to earn trust in the wrong order. Someone judges a payments company on a laptop, at the point where they know least and have most at stake, then pays on a phone — which forced the credibility work into the marketing site, where reassurance can arrive before the decision, rather than into the app, where it would arrive too late to matter. The second difficulty is structural rather than emotional: the account holder is often a parent or relative and the beneficiary is the student, which breaks the assumption almost every payment app is built on. Sponsored payment had to become a first-class transfer type rather than a personal wallet bent into a shape it was never designed for.",
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
    evidence:
      "Payment types are modelled around a sponsor rather than a single account holder, so the person paying and the person benefiting are both first-class rather than one being bent into the other's shape. Verification tier and currency sit in the interface as everyday context instead of buried settings. The marketing site is layered by kind of doubt — payment processors and named institutions, a coverage map, video testimonials from students, then a two-column FAQ — and a QR code closes the desktop-to-mobile gap at the exact point the decision is made.",
    improveNext:
      "Two numbers would tell me whether this works: the completion rate of a first sponsored payment by someone who has never used the app, and the drop-off between the marketing site and the app install. I would also usability-test the fee and timing disclosure with families sending money abroad for the first time, since that is the moment trust is either earned or lost.",
    deliverables: [
      "Mobile app design",
      "Sponsored & cross-border payment flows",
      "Multi-currency balance & transfers",
      "Marketing site design",
      "Trust & credibility system",
      "FAQ and support experience",
    ],
    improveWithTime:
      "I would design the waiting period properly. Between submitting a payment and the institution confirming receipt, the user has nothing to do and everything to worry about; that window deserves status, expected timing and a route to a human more than any other screen in the product.",
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
    productStatus: "Prototype",
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
    metrics: [
      {
        "value": "5",
        "label": "AI agents a learner manages, each with role, status and workload",
        "kind": "scope"
      },
      {
        "value": "2",
        "label": "Roles in one system — learner and administrator",
        "kind": "scope"
      },
      {
        "value": "4",
        "label": "Export formats — PDF, Excel, PowerPoint and JSON",
        "kind": "scope"
      },
      {
        "value": "SOP-anchored",
        "label": "Versioned procedures every output is reviewed against",
        "kind": "scope"
      }
    ],
    contribution:
      "I led the end-to-end product design for both sides of the platform: the learner's AI Manager Path with its team of five agents, the review queue and confidence system, the SOP library, task management and export centre, and the administrator's course builder, analytics and revenue surfaces. I designed the progression system and the single design system that keeps learner and operator inside one product rather than two.",
    context: {
      ownership:
        "End-to-end ownership across learner and administrator experiences",
      primaryUsers:
        "Learners building AI judgement; administrators running the platform",
      focus:
        "Calibrated trust, human review checkpoints, dual-role product design",
      product:
        "Chalant AI — an AI learning platform built around a simulated agent workspace",
      scope:
        "End-to-end product design across the learner and administrator experiences",
      platform:
        "Responsive web application",
      constraints:
        "One system serving a learner who wants to progress and an operator who runs it as a business",
    },
    challenge:
      "The skill people actually need around AI is not prompting — it is management: deciding what to delegate, judging whether the result is good enough, and knowing when a confident-sounding output should be rejected. That judgement cannot be transferred by watching a video, because the failure mode being trained against is precisely the one a passive learner exhibits: accepting plausible work without checking it. So the platform had to teach through practice with consequences, while remaining a product an administrator could run as a business — which meant one system serving a learner who wants to progress and an operator who needs to see engagement, revenue and where courses are failing.",
    research: {
      "status": "Exploratory, product-design-led",
      "considered": "Learners who need to work with AI rather than read about it, and the operator running the platform as a business.",
      "investigated": "What skill actually needs teaching — the finding was that it is management and judgement, not prompt writing.",
      "learned": "The failure mode being trained against is accepting plausible output without checking it, which is exactly what a passive learner does.",
      "changed": "The lesson became a workspace with consequences rather than a module, and Quick Approve was deliberately kept so the trade-off stays real.",
      "uncertain": "Whether the platform actually improves calibrated trust — the central claim, and the one that most needs measuring.",
      "nextTest": "Measure whether a learner's approval accuracy improves across sessions, and whether Quick Approve use falls as judgement develops."
    },
    difficulty:
      "Quick Approve is the whole tension in a single control. The product exists to teach people not to accept plausible AI output without checking it, so a shortcut that lets them do exactly that is the obvious thing to delete. Deleting it makes the exercise dishonest: in real work the shortcut always exists, and a tool that forbids it trains compliance rather than judgement. Keeping it meant accepting that learners can take the easy path, and designing the surrounding signals — confidence score, estimated review time, SOP compliance — so that taking it is a decision they can watch themselves make. The same tension runs through the progression system: XP and streaks sustain a path measured in weeks, but rewarding throughput inside a product about careful review would teach precisely the wrong habit, which is why progression sits in the sidebar as ambient context instead of driving the work.",
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
    systemAnchor: "in-product",
    evidence:
      "The human checkpoint is structural rather than advisory: Needs Review is its own column, so work cannot reach Done without passing through a person. Quality is anchored to versioned SOPs rather than to taste, learner and operator share one design system instead of splitting into two disconnected apps, and the Export Centre turns a training exercise into artefacts a learner can actually use at work.",
    improveNext:
      "The obvious study is whether a learner's approval accuracy improves across sessions — comparing what they approve early against what they approve after working through the SOP library — and whether Quick Approve use falls as judgement develops. That would turn the product's central claim into something measured rather than argued.",
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
    improveWithTime:
      "I would give the agents memory of their own past corrections, so a learner can see an agent improve because of their reviews. That closes the loop the product argues for and turns reviewing from a chore into visible cause and effect.",
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
    productStatus: "Live product",
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
    externalUrl: "https://kremor-ai-clone.vercel.app/",
    externalLabel: "the live site",
    art: { hue: "#2b0f1d", accent: "#e0a955", kind: "fashion" },
    overview:
      "Kremor AI is a fashion-technology platform that generates custom African clothing from a prompt and then has it made. It runs as three connected surfaces: a storefront selling AI-generated Ankara womenswear, menswear and bags; a creative workspace where a design is explored and iterated; and an admin platform where measurements, artisans, design approvals and production are managed by role. I designed all three end to end on contract from June 2024 to July 2026 — flows, interface design, AI interaction patterns and the design system — and evaluated 96+ complex AI interaction tasks to find the patterns worth keeping.",
    metrics: [
      {
        "value": "3",
        "label": "Connected surfaces — storefront, AI workspace, operations platform",
        "kind": "scope"
      },
      {
        "value": "5",
        "label": "Operational roles in the permissions matrix",
        "kind": "scope",
        "note": "Super Admin, Design Manager, Production Manager, Support Agent, Inventory Manager"
      },
      {
        "value": "96+",
        "label": "Complex AI interaction tasks evaluated",
        "kind": "scope",
        "note": "AI evaluation work, distinct from the product design"
      },
      {
        "value": "Immutable",
        "label": "Audit log attributing every action to the role that took it",
        "kind": "scope"
      }
    ],
    contribution:
      "I led the product design and the research on Kremor AI. I designed all three surfaces end to end: the storefront selling AI-generated Ankara womenswear, menswear and bags; the generative workspace where a design is explored and iterated; and the role-based admin platform covering orders, measurements, artisans, design approvals, production, messages, inventory, permissions and audit history. Separately from the product design, I worked on AI model evaluation for the platform — forensic benchmarking, dataset annotation and qualitative evaluation of LLM and generative-image output, including 96+ complex AI interaction tasks.",
    context: {
      ownership:
        "Design and research lead — end-to-end across three surfaces, plus AI model evaluation",
      primaryUsers:
        "Customers generating and buying garments; artisans and five operational roles",
      focus:
        "Generative product UX, role-based operations, prompt-to-garment workflow",
      product:
        "Kremor AI — AI-generated African fashion, and the operations that turn a design into a garment",
      team:
        "Contract engagement reporting to the founder, leading the design team",
      timeline:
        "June 2024 – July 2026",
      scope:
        "Storefront, generative workspace, role-based admin platform, and the design system across all three",
      platform:
        "Responsive web",
      constraints:
        "Generated designs have to be manufacturable by real tailors, and the workshop runs on five roles with different permissions",
    },
    challenge:
      "African fashion is usually flattened twice over. Globally it is reduced to a single decorative idea — African print — when Ankara, Aso-Oke, Adire and Kente are distinct traditions with their own rules. And in most AI tools it would be flattened again, into a style filter applied to a Western silhouette. The brief was the opposite of that: use AI to widen what someone can imagine wearing, while treating the textiles as a language rather than a texture. That created two problems. Most people cannot describe a garment they have not seen, so a blank prompt box would fail exactly the person the product exists for. And a generated image is not a dress — someone still has to take measurements, approve a design, cut fabric and sew it, which meant the creative surface was worthless unless the workshop behind it was designed with the same care.",
    research: {
      "status": "Exploratory, product-design-led, with model-evaluation work alongside",
      "considered": "People who want African clothing but have no vocabulary to describe it, and the artisans and managers who have to make what gets generated.",
      "investigated": "Whether a blank prompt field could serve an audience that has an occasion and a feeling but no design language — and what has to exist operationally for a generated image to become a garment.",
      "learned": "The honest interface for a generator is the wrong interface for this audience; and the creative surface is worthless without the workshop behind it.",
      "changed": "Quick actions and phrased openers replaced the bare prompt box, and the operations platform was designed with equal care to the storefront, with dangerous actions gated and an immutable audit trail.",
      "uncertain": "Whether the five designed roles match the roles the workshop actually runs on.",
      "nextTest": "Test the prompt scaffolding with people who have no design vocabulary and no familiarity with the textiles, and validate the permissions matrix against how the workshop really operates."
    },
    difficulty:
      "Two forces pulled against each other. A generative tool is only useful to someone who can describe what they want, and the people this product exists for often cannot — they have an occasion, a feeling, a fabric they have seen somewhere, and no vocabulary for any of it. The blank prompt box is the honest interface for a generator and the wrong interface for this audience, so scaffolding had to be added without narrowing what someone is allowed to ask for. The harder constraint is physical: a generated image is not a dress. Somebody still takes measurements, approves the design, cuts fabric and sews it, which made the creative surface worthless unless the workshop behind it was designed with equal care — and that workshop involves five roles, genuinely dangerous actions like suspending an artisan or refunding a payment, and a need to reconstruct afterwards who did what.",
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
    explored:
      "The working file keeps its versions rather than overwriting them: Design V1.0 and V1.1 sit alongside the admin dashboard and component pages, and an AI-proposed direction was explored as its own branch before the assistant settled into the form it shipped in. A Ready for Dev page marks what was actually handed over, which keeps the explored directions separable from the delivered ones.",
    outcome:
      "One product across three surfaces that each answer a different question: can I imagine it, can I buy it, can it actually be made. The generative side is scaffolded so that people who cannot yet describe what they want still get somewhere, the commerce side grounds AI output in fabric, care and provenance, and the operations side carries a role model, a permissions matrix and an immutable audit trail sturdy enough for real orders passing between managers, support agents and artisans. All three share one design system and a documented development handoff.",
    evidence:
      "Kremor AI's founder has written a reference describing the dual role — UI/UX design alongside AI model evaluation covering forensic benchmarking, dataset annotation and qualitative evaluation of LLM and generative image output — readable in full on the credentials page. 96+ complex AI interaction tasks were assessed to identify usability patterns, and the build is live. Three surfaces ship on one design system, with a Ready for Dev page marking exactly what engineering was handed.",
    improveNext:
      "I would test the prompt scaffolding with people who have no design vocabulary and no familiarity with the textiles, because that is the audience the product is built for and the one most likely to stall at the first screen. On the operations side, I would want to know whether the permissions matrix matches how the workshop actually runs — whether the roles as designed correspond to the roles people really hold — before treating that model as settled.",
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
    improveWithTime:
      "I would connect the generated design to the measurement and production data properly, so a customer can see their own garment moving through the workshop rather than disappearing after checkout. The operations side already holds that state; the customer side does not surface it.",
  },
  {
    slug: "arete",
    title: "Arete",
    category: "Digital Healthcare & Telemedicine Platform",
    tagline:
      "Care that stays connected — from needing a doctor to actually holding the medicine.",
    year: "2026",
    status: "Full case study",
    role: "End-to-end product designer",
    tags: [
      "Healthcare UX",
      "Service Design",
      "UX Writing",
      "Design Systems",
      "Accessibility",
    ],
    featured: true,
    caseStudy: true,
    productStatus: "Concept exploration",
    // Local asset. The Behance CDN URL that used to sit here hotlink-blocked
    // and failed intermittently in production.
    cover: "/projects/arete-cover.jpg",
    frame: "flat",
    gallery: [
      {
        src: "/projects/arete-overview.jpg",
        alt:
          "The project framing: an end-to-end product design role across the patient, provider, HMO and pharmacy surfaces, focused on access, trust and continuity",
      },
      {
        src: "/projects/arete-challenge.jpg",
        alt:
          "The problem stated as four jobs rather than one: reaching trusted care, understanding what coverage pays for, connecting a consultation to medication fulfilment, and continuing treatment afterwards",
      },
      {
        src: "/projects/arete-ecosystem.jpg",
        alt:
          "The actors the requirements had to serve — patient, doctor and nurse, community health worker, HMO, pharmacy and administrator — mapped around the product, because the design problem was how information and actions move between roles rather than how any single screen looks",
      },
      {
        src: "/projects/arete-principles.jpg",
        alt:
          "The four principles the requirements resolved into: simple first in high-stakes tasks, accessible through explicit rather than icon-only actions, localised for language and cultural context, and transparent about eligibility, status and next steps",
      },
      {
        src: "/projects/arete-onboarding.jpg",
        alt:
          "Onboarding as a structured entry into a sensitive product — account creation, OTP verification and profile setup broken into steps with progress shown, explicit verification language and recovery paths, rather than one long form",
      },
      {
        src: "/projects/arete-journey.jpg",
        alt:
          "The flagship journey end to end: need care, find provider, consult, check coverage, get prescription, find pharmacy, continue care \u2014 with the screens that carry it, including symptom capture, family-member selection and a profile review before a practitioner sees it",
      },
      {
        src: "/projects/arete-hmo.jpg",
        alt:
          "The HMO module: membership verification with its own loading state, what the plan covers and its limits, eligible providers, and the plan card showing balance and validity — with Skip for Now kept available so an uninsured patient is never blocked",
      },
      {
        src: "/projects/arete-pharmacy.jpg",
        alt:
          "Pharmacy fulfilment as a chain rather than a hand-off: prescription, nearby stock on a map, reserve or deliver with pickup and rider options, then medication reminders per drug with dosage, timing and days remaining",
      },
      {
        src: "/projects/arete-states.jpg",
        alt:
          "The non-happy paths designed as first-class: OTP errors, incorrect password, verification loading, plan removal with reason capture and an explicit warning that it cannot be undone, plus the full status vocabulary — error, loading, pending approval, success, unavailable, confirmation",
      },
      {
        src: "/projects/arete-design-system.jpg",
        alt:
          "The system underneath: a calm healthcare green with high-contrast neutrals, Noto Sans set at four defined sizes, and reusable patterns for fields, cards, alerts, buttons and status feedback so high-stakes interactions stay familiar across patient, insurance and pharmacy journeys",
      },
      {
        src: "/projects/arete-reflection.jpg",
        alt:
          "The closing reflection from the case study deck — owning UX strategy, IA, user flows, UX writing, UI, the design system and interactive prototyping, and bringing them into one consistent product experience",
      },
      {
        src: "/projects/arete-hero.jpg",
        alt:
          "The project's positioning line — care should feel connected — over the disciplines the work covered",
      },
    ],
    externalUrl: `${BEHANCE}/255070051/Arete-Telemedicine-UXUI-Case-Study`,
    art: { hue: "#0f2a1e", accent: "#16A34A", kind: "health" },
    overview:
      "Arete is a connected healthcare ecosystem rather than a doctor-booking app. It brings care discovery, consultations, medical records, insurance coverage, prescriptions and pharmacy fulfilment into one experience, designed for accessibility, localisation and low-connectivity environments. I was the end-to-end product designer, covering UX, UX writing, UI and prototyping across the patient, provider, HMO and pharmacy surfaces.",
    metrics: [
      {
        "value": "7",
        "label": "Steps designed, from needing care to continuing it",
        "kind": "scope"
      },
      {
        "value": "6",
        "label": "Actors the requirements covered",
        "kind": "scope",
        "note": "Patients, doctors, nurses, community health workers, HMO teams, pharmacies and administrators"
      },
      {
        "value": "4",
        "label": "Surfaces — patient, provider, HMO and pharmacy",
        "kind": "scope"
      },
      {
        "value": "Offline-aware",
        "label": "Designed for low connectivity, localisation and accessibility",
        "kind": "scope"
      }
    ],
    contribution:
      "I designed the connected healthcare ecosystem end to end — UX strategy, information architecture, user flows, UX writing, UI design, the design system and interactive prototyping. I designed the seven-step care journey, the onboarding and identity flows, the HMO coverage module, prescription and pharmacy fulfilment, and the status and edge-case system that holds the whole thing together.",
    context: {
      ownership:
        "End-to-end ownership",
      primaryUsers:
        "Patients, doctors and nurses, community health workers, HMO teams, pharmacies",
      focus:
        "Connected care journeys, coverage clarity, accessibility and low connectivity",
      product:
        "Arete — a connected healthcare and telemedicine ecosystem",
      team:
        "End-to-end product designer across the whole experience",
      scope:
        "UX strategy, information architecture, user flows, UX writing, UI design, design system and interactive prototyping",
      platform:
        "Mobile-first, across four surfaces — patient, provider, HMO and pharmacy",
      constraints:
        "Consultation, coverage and medication are separately operated services; multilingual users; low-connectivity environments",
    },
    challenge:
      "Getting medical advice is only one part of a patient's journey. Someone also has to understand whether care is covered, find a provider their plan will accept, receive a prescription, locate the medication and keep taking it afterwards — and each of those steps usually lives in a different place, run by a different organisation. The product had to bring those disconnected steps into one understandable experience without hiding the detail that clinicians and insurers require, and it had to do it for patients, doctors and nurses, community health workers, HMO teams, pharmacies and administrators at once.",
    research: {
      "status": "Exploratory, product-design-led",
      "considered": "Patients moving between four separately operated services, and the clinical, insurance and pharmacy staff on the other side of each hand-off.",
      "investigated": "Where a telemedicine product stops helping — the finding was that most stop at the booking, while the patient's problem continues into coverage, prescription and fulfilment.",
      "learned": "Coverage is the point of highest risk: language has to be plain enough to act on and precise enough not to promise what an insurer will later refuse.",
      "changed": "The journey was designed past the consultation, and Skip for Now was kept throughout so an uninsured patient is never blocked from reaching a doctor.",
      "uncertain": "Whether patients read a coverage state as actionable — untested, and the most consequential unknown in the product.",
      "nextTest": "Test whether patients understand insurance eligibility states and can act on them, with real patients rather than colleagues, and validate the hand-off points with an insurer and a pharmacy."
    },
    difficulty:
      "The four things a patient needs are run by different organisations with different systems and different obligations, so presenting them as one journey is a claim the underlying services do not make on their own — and the risk is a product that feels seamless right up to the moment it hands you off and stops helping. Coverage is where that hurts most: eligibility language has to be plain enough to act on and precise enough not to promise something an insurer will later refuse, and getting it wrong in either direction costs the patient. The context tightened it further. Multilingual users, low-connectivity environments and high-stakes tasks ruled out clever interactions and icon-only affordances, and writing for people who are unwell ruled out most of the reassuring tone a product designer reaches for by default — reassurance that overstates is worse than silence.",
    process: [
      "Framed the design around how information and actions move between roles rather than how individual screens look, because the requirements covered patients, doctors and nurses, community health workers, HMO teams, pharmacies and administrators sharing one product.",
      "Resolved the requirements into four principles that could settle arguments later — simple first, accessible, localised, transparent — and held decisions against them rather than against taste.",
      "Designed the journey past the booking, which is where most telemedicine products stop: need care, find provider, consult, check coverage, get prescription, find pharmacy, continue care. Each step is a place the journey can fail, so each got designed rather than assumed.",
      "Broke registration into progressive steps with visible progress, explicit verification language and real recovery paths, because the first interaction with a health product is where trust is either established or lost.",
      "Put coverage before commitment. The HMO module verifies membership, states what the plan covers and its limits, and surfaces eligible providers before a patient chooses care — and Skip for Now stays available throughout, so an uninsured patient is never blocked from reaching a doctor.",
      "Treated a prescription as unfinished until the medicine is in hand: nearby stock, pickup or delivery, fulfilment confirmation, reminders, and explicit out-of-stock and alternative-medication paths.",
      "Designed the non-happy paths as core UX rather than edge cases — OTP errors, verification loading, HMO approval states, plan removal with reason capture, availability signals and confirmations — and gave status its own vocabulary so error, pending, unavailable and success are never ambiguous.",
      "Paired every action with legible text instead of icon-only interactions, and kept language and cultural context in the copy, so the interface holds up for multilingual users on poor connections.",
      "Built the system underneath — a calm healthcare green with high-contrast neutrals, Noto Sans at defined sizes, and reusable field, card, alert, button and status patterns — so a high-stakes interaction feels the same whether it sits in the patient, insurance or pharmacy journey.",
    ],
    outcome:
      "A healthcare product designed as a chain rather than a set of features: the patient journey continues past the consultation into coverage, prescription and fulfilment, and the moments where it could break — an unverified plan, an out-of-stock medicine, a failed OTP, a removed HMO — are designed states rather than dead ends. One system of colour, type and components holds the patient, provider, HMO and pharmacy surfaces together, and the whole experience is built for legibility, localisation and low connectivity rather than assuming ideal conditions.",
    evidence:
      "The seven-step journey is designed end to end rather than stopping at the booking, where most telemedicine products stop. The status vocabulary and edge cases are specified alongside the happy paths, the HMO module keeps Skip for Now available so coverage never blocks access to care, and the design system defines a palette, four type sizes and reusable field, card, alert, button and status patterns across all four surfaces. The full case study is published on Behance.",
    improveNext:
      "Eligibility comprehension is the thing to test first — whether a patient reads a coverage state as something they can act on rather than a status they have to interpret — and it needs real patients rather than colleagues. I would then validate the hand-off points with an actual insurer and pharmacy, since the journey's credibility rests on partners the design cannot control, and test the low-connectivity assumptions on real networks rather than on a design file.",
    deliverables: [
      "Journey mapping across seven steps",
      "Information architecture",
      "Onboarding & identity flows",
      "HMO coverage experience",
      "Prescription & pharmacy fulfilment",
      "States, errors & edge cases",
      "UX writing",
      "Design system",
      "Interactive prototype",
    ],
    improveWithTime:
      "I would design the care record as the spine of the product rather than a section of it. Continuity is the thing the ecosystem promises, and it only becomes real when a consultation, a prescription and a refill visibly belong to the same ongoing story.",
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
    productStatus: "Live product",
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
    metrics: [
      {
        "value": "2",
        "label": "Audiences served by one portfolio — guests and investors",
        "kind": "scope"
      },
      {
        "value": "4",
        "label": "Inputs the guest search reduces to — where, check-in, check-out, who",
        "kind": "scope"
      },
      {
        "value": "₦50,000",
        "label": "Entry point for a fractional property share",
        "kind": "scope"
      },
      {
        "value": "23-page",
        "label": "Brand guideline designed alongside the product",
        "kind": "scope"
      }
    ],
    contribution:
      "I owned the end-to-end UX and UI across both sides of the product: guest discovery, search, filtering and booking on mobile, and the fractional investment marketplace on desktop — property listings, share mechanics and entry pricing. I built the responsive component set both sides share, and designed the brand identity the platform sits inside.",
    context: {
      ownership:
        "End-to-end ownership across both audiences",
      primaryUsers:
        "Guests booking short stays; investors buying fractional property shares",
      focus:
        "Two audiences, two decision speeds, one portfolio of apartments",
      product:
        "Shortlet Lagos — short-stay booking and fractional property investment against one portfolio, live at shortlet-lagos.com",
      scope:
        "Research and user flows, guest discovery, search, filtering and booking, the investment marketplace, and a responsive design system",
      platform:
        "Mobile-first guest experience, desktop-first investment experience",
      constraints:
        "Two audiences making opposite kinds of decision about the same apartments",
    },
    challenge:
      "The same apartment has to read two completely different ways depending on who is looking at it. To a guest it is somewhere to sleep next weekend, judged on photos, location and whether the dates are free — a decision made in minutes, usually on a phone. To an investor it is an asset, judged on yield, entry price and what happens to the money afterwards — a decision made slowly, at a desk, and one that carries real risk. Fractional property investment also has a credibility problem before it has a usability one: asking someone to put money into a share of a building they will never hold the keys to means the interface has to make the mechanics obvious rather than exciting. Designing both without letting the marketing energy of the booking side leak into the investment side was the core problem.",
    research: {
      "status": "Product-design-led, with research into how guests shortlist",
      "considered": "Guests deciding in minutes on a phone, and investors deciding slowly at a desk with real money at risk.",
      "investigated": "Which signals drive trust in a short-let listing, and what an investor needs before a fractional share is comprehensible.",
      "learned": "The two decisions have opposite tolerances — the energy that converts a booking is the energy that undermines an investment decision.",
      "changed": "The two entry points were kept deliberately separate, and the investment side leads with the buying mechanic and the ₦50,000 minimum before it discusses return.",
      "uncertain": "Whether people actually understand what a fractional share is — comprehension, not conversion, is the right measure here.",
      "nextTest": "Run a comprehension test with first-time investors on what a share entitles them to, and check whether guests arriving to book ever discover the investment side at all."
    },
    difficulty:
      "The same apartment has to read two ways. A guest decides in minutes, on a phone, on photos, location and whether the dates are free. An investor decides slowly, at a desk, on yield and entry price and what happens to the money afterwards, with real risk attached. The pull throughout was to let the booking side's marketing energy carry across into the investment side, because that energy converts — and that is exactly where it would do damage, since making an investment decision feel effortless is not the same as making it clear. Holding the two apart while keeping them recognisably one company was the constant tension, and it is why the investment side leads with the buying mechanic and the entry price rather than with projected returns.",
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
    systemAnchor: "in-product",
    evidence:
      "The product is live at shortlet-lagos.com. The guest search is reduced to the four inputs a stay actually depends on, and the investment side leads with the buying mechanic and the minimum entry price before it discusses return — so someone can rule themselves in or out before they sign up rather than after. Both sides ship on one responsive component set, and the brand they sit inside is mine too: the 23-page Shortlet Lagos brand guideline is readable in full on the brand page.",
    improveNext:
      "The question I most want answered is whether people understand what they are buying. A share in a rental property is not an intuitive instrument, and comprehension rather than conversion is the right measure of whether that page works — a short comprehension test with first-time investors would settle it. I would also check whether guests who arrive to book ever discover the investment side at all, since the two entry points are deliberately separate.",
    deliverables: [
      "User flows & research",
      "Guest booking journey",
      "Fractional investment marketplace",
      "Property listing & detail design",
      "Responsive design system",
      "High-fidelity UI & prototype",
    ],
    improveWithTime:
      "I would show investors the operating reality behind a share — occupancy, maintenance, the actual months a property earned — because a fractional stake in a building people sleep in is only trustworthy if the performance behind it is visible.",
  },
  {
    slug: "synqit",
    title: "Synqit",
    category: "Web3 Partnership & Collaboration Platform",
    tagline:
      "Business partnerships that work like friend requests — sent, reviewed, accepted or declined, with the conversation unlocked only once both sides say yes.",
    year: "2026",
    status: "Full case study",
    role: "Lead product designer, end to end",
    tags: [
      "Product Design",
      "Matchmaking UX",
      "Trust & Verification",
      "Information Architecture",
      "Responsive Design",
    ],
    caseStudy: true,
    productStatus: "Shipped product",
    cover: "/projects/synqit-laptop.jpg",
    frame: "flat",
    gallery: [
      {
        src: "/projects/synqit-user-journey.jpg",
        alt:
          "The user journey and information architecture: from homepage into sign-up or login, then four destinations — the dashboard as the main hub with recent partnerships, explore search, match-make and send requests, approve requests and messages; first-time profile setup; account functionality; and partnership search for matchmaking",
      },
      {
        src: "/projects/synqit-deck-problem.jpg",
        alt:
          "The problem and the solution side by side, as the company framed them: scattered outreach across Twitter, Discord, Telegram and LinkedIn, no verification, high entry barriers and missed partnerships — answered by smart matchmaking, verified requests, open ecosystem access, AI-powered discovery and one-click outreach",
      },
      {
        src: "/projects/synqit-deck-mvp.jpg",
        alt:
          "The MVP release — AI-powered matching, verified requests, premium visibility and direct messaging — with the dashboard as shipped",
      },
      {
        src: "/projects/synqit-desk.jpg",
        alt:
          "Synqit's mobile experience shown on a phone alongside a laptop on a desk",
      },
    ],
    externalUrl: `${BEHANCE}/235692945/Web3-Platform`,
    art: { hue: "#0e1f2e", accent: "#5ac8fa", kind: "web3" },
    overview:
      "Synqit is a business-driven partnership platform for startups, investment platforms, Web3 projects and crypto companies — a structured way to find, vet and form strategic partnerships instead of cold-messaging across Twitter, Discord, Telegram and LinkedIn. I led the entire design process across three user roles: businesses and startups looking for partners, investors and project owners looking for opportunities, and the teams and executives who manage the resulting collaborations. The pitch deck the product was raised on is on the brand page.",
    metrics: [
      {
        "value": "3x",
        "label": "Improvement in partnership discovery and onboarding",
        "kind": "impact",
        "note": "Against the previous scattered, manual process of finding partners across Twitter, Discord, Telegram and LinkedIn"
      },
      {
        "value": "3",
        "label": "Role groups in one product — businesses, investors, project teams",
        "kind": "scope"
      },
      {
        "value": "Gated",
        "label": "Messaging unlocks only once a partnership request is accepted",
        "kind": "scope"
      }
    ],
    contribution:
      "I led the entire design process. I interviewed founders, Web3 teams and investors, built personas for the three roles, defined the partnership request as the core object of the product, and designed the matchmaking, business profile, request-approval and messaging systems around it. I mapped the information architecture, designed the dashboard and mobile-first interface, and ran usability testing with real businesses to refine the trust signals that shipped.",
    context: {
      ownership:
        "End-to-end ownership as lead product designer",
      primaryUsers:
        "Businesses seeking partners, investors, and Web3 project teams",
      focus:
        "Trust-gated matchmaking, partnership requests, controlled access",
      product:
        "Synqit — a partnership and collaboration platform for the Web3 ecosystem",
      team:
        "Lead product designer, working with the founding team",
      scope:
        "User research and journey mapping, personas, information architecture, wireframes, high-fidelity UI, prototyping and usability testing",
      platform:
        "Responsive web, mobile-first — business owners manage deals on the go",
      constraints:
        "Three user roles with different intents in one product; a category where fake projects and rug pulls make trust the first problem, not the last",
    },
    challenge:
      "Startups, Web3 projects and investment platforms struggle to find and connect with the right partners for three reasons that compound each other: there is no basis for trust in a partnership with an unknown company, communication is scattered across multiple channels, and negotiations drag because nothing is structured. Existing networking products treat a connection as a one-sided act — anyone can message anyone — which is precisely why they fill with noise and why credible teams stop answering. The product had to give businesses control over who they partner with, make credibility visible before a request is accepted, and move the conversation somewhere structured once it is.",
    research: {
      "status": "Primary research — interviews, personas and usability testing",
      "considered": "Startup founders, Web3 teams and investors, developed into personas for the three roles the product serves.",
      "investigated": "Why business networking fails in this space: no basis for trust, communication scattered across channels, and negotiations that drag because nothing is structured.",
      "learned": "An open inbox makes the credible party do the filtering, which is why credible teams stop answering. Control over who you partner with is the product.",
      "changed": "The partnership request became the core object — reviewed against a real profile — and chat was made a consequence of acceptance rather than a starting point.",
      "uncertain": "How the accept rate moves as profiles get richer, which is the real test of whether visible credibility works.",
      "nextTest": "Track the accept rate on partnership requests against profile completeness, and test whether the three roles genuinely want one shared dashboard or three tailored ones."
    },
    difficulty:
      "The hard part was deciding what a partnership is, mechanically, before anything could be designed. A follow is too weak — it commits nobody. An open inbox is too weak in the other direction — it makes the credible party do the filtering. The model that held was the friend request: a partnership is proposed, the other side reviews the proposer's profile and history, and only an acceptance unlocks messaging. That one decision shaped the whole architecture, and it came with a cost: it adds a step and a wait to every connection, in a space where founders are used to firing off a DM. The tension was to keep that deliberate friction — because it is the product's entire answer to the trust problem — while making everything around it fast. The three roles pulled against each other too: a startup wants to be found, an investor wants to filter, and an executive wants to see the state of every partnership at once, and they all share one dashboard.",
    process: [
      "Interviewed startup founders, Web3 teams and investors to understand where business networking actually breaks, then built personas for the three roles the product had to serve — businesses seeking partners, investors scouting startups, and teams managing partnerships.",
      "Defined the partner request as the core object. Users send, review, accept or reject partnership requests, and the dashboard is organised around that state — pending, accepted and declined — so the status of every relationship is legible at a glance.",
      "Made messaging a consequence of acceptance rather than a starting point. The built-in chat activates only once a partnership request is approved, which keeps inboxes free of cold outreach and makes every conversation one both sides chose.",
      "Designed the business profile as the thing a request is judged against: industry, expertise, past collaborations and key details, visible before anyone sends or accepts — so the review step has something real to review.",
      "Designed the matchmaking layer to suggest partners on industry, interests and investment focus, so discovery is a recommendation rather than a search box, and the platform does the first pass of relevance.",
      "Mapped the full user journey and information architecture — homepage into sign-up or login, then dashboard, profile setup, account functionality and partnership search — so every role lands somewhere useful on first login rather than in an empty state.",
      "Built the interface mobile-first, because the people managing these deals are rarely at a desk when a request arrives.",
      "Tested the request and messaging features with real businesses and iterated on what they needed to trust it — verified business profiles, transparent partnership histories, and notifications that keep both sides informed on requests, messages and milestones.",
    ],
    explored:
      "The central alternative was an open model — anyone can message anyone, with filtering left to the recipient — which is how most networking products work and which the research pointed away from: it is the reason credible teams stop responding. The request-approval model was chosen over it deliberately, accepting the extra step in exchange for control. The pitch deck also records where the product was headed beyond the MVP — on-chain logging of partnerships, event sync, a job board — which shaped what the architecture had to leave room for.",
    outcome:
      "A partnership-driven platform rather than another networking feed: requests are reviewed against a real profile before anything is accepted, chat exists only between partners who both said yes, matchmaking does the first pass of relevance, and a structured dashboard keeps every active partnership visible. Trust signals — verified profiles and transparent partnership histories — became part of the product rather than something users had to establish for themselves on other channels.",
    evidence:
      "Testing the request and messaging flows with real businesses shaped the trust signals that shipped. Partnership discovery and onboarding improved threefold against the scattered, manual process the platform replaced. The MVP shipped with AI-powered matching, verified requests, premium visibility and direct messaging, and the full presentation is on Behance; the pitch deck it was raised on is readable on the brand page.",
    improveNext:
      "The request-approval model is the product's bet, so the number I would watch is the accept rate on requests and how it moves as profiles get richer — if credibility is visible, acceptance should rise. I would also test whether the three roles actually want one dashboard or three, since the shared layout was a decision made for coherence and it deserves to be checked against how an investor and a founder really use it.",
    deliverables: [
      "User research & personas",
      "User journey & information architecture",
      "Partnership request system",
      "Business profile system",
      "Matchmaking recommendations",
      "Post-acceptance messaging",
      "Partnership dashboard",
      "Responsive mobile-first UI",
      "Usability testing & iteration",
    ],
    improveWithTime:
      "I would design the partnership after the handshake — milestones, shared documents, a record of what was agreed — because acceptance is where the platform currently stops and where the actual collaboration begins.",
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
    productStatus: "Concept exploration",
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
    metrics: [
      {
        "value": "3",
        "label": "Fidelity modes — Concept Sketch, Schematic Plan, Detailed Model",
        "kind": "scope"
      },
      {
        "value": "4",
        "label": "Export formats designed — DWG, OBJ, SKP, PDF",
        "kind": "scope"
      },
      {
        "value": "Coming soon",
        "label": "The in-product 3D editor, staged honestly rather than implied",
        "kind": "scope"
      }
    ],
    contribution:
      "I designed the end-to-end product: the prompt experience and its starting points, the design-type system that makes fidelity an explicit choice, the results gallery, the preview and export flow, and the 3D editor interface. I set the principle the product rests on — that the output has to leave as a working CAD file rather than an image.",
    context: {
      ownership:
        "End-to-end ownership",
      primaryUsers:
        "Architects and designers working on early-stage massing and client concepts",
      focus:
        "Conversational AI for professional output, fidelity as a user decision",
      product:
        "Archi-Tek — a text-to-design tool for architecture",
      scope:
        "Prompt experience, design-type system, results gallery, preview and export flow, and the 3D editor interface",
      platform:
        "Desktop web application",
      constraints:
        "The output has to be a working CAD file rather than an image, and the in-product editor did not exist at the time of design",
    },
    challenge:
      "Generative AI is good at producing a convincing picture of a building. That is precisely what an architect cannot use. A render is a dead end: it cannot be dimensioned, measured, revised or handed to an engineer. Meanwhile the tools that do produce workable geometry — CAD and 3D modelling suites — carry a learning curve measured in months, which puts early-stage massing and client-facing concepts out of reach for the people who most need them quickly. The design problem was to sit a conversational interface on top of real architectural output, without either half undermining the other: the chat could not feel like a toy, and the output could not be a JPEG.",
    research: {
      "status": "Exploratory, product-design-led",
      "considered": "Architects who need early-stage massing and client-facing concepts quickly, without a months-long CAD learning curve.",
      "investigated": "What makes generative output unusable in architecture — the finding was that a render cannot be dimensioned, revised or handed to an engineer.",
      "learned": "Fidelity is a decision the user should make, not one the model should guess: a quick massing study and a dimensioned model have different tolerances for error.",
      "changed": "The interface asks for design type up front in plain language, and export formats sit beside the generated design so the nature of the output is unambiguous.",
      "uncertain": "Whether an exported DWG is genuinely workable — the claim the whole product rests on, and untested.",
      "nextTest": "Test whether architects can export a generated DWG and edit it successfully in AutoCAD. If the geometry is not workable, the clarity of the interface counts for nothing."
    },
    difficulty:
      "Generative models are good at producing a convincing picture of a building, which is the one thing an architect cannot use — a render cannot be dimensioned, revised or handed to an engineer. Putting a conversational front end onto real geometry meant neither half could undermine the other: the chat could not feel like a toy, and the output could not be a JPEG. The sharper constraint was capability. The in-product 3D editor did not exist yet, so the interface had to communicate the workflow it belongs to without implying it was available — which is why it is staged in the UI as coming soon rather than presented as working. Overstating it would have been the easier design and the wrong one.",
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
    evidence:
      "Fidelity is a decision the user makes rather than one the model guesses. Results are presented as comparable named options instead of a single answer, and the export formats — DWG, OBJ, SKP and PDF — sit beside the generated design, so the nature of the output is unambiguous before anyone invests time in it. The full presentation is published on Behance.",
    improveNext:
      "This needs practising architects and a real file. The test that matters is whether an exported DWG opens in AutoCAD and survives being edited — if the geometry is not workable, the clarity of the interface counts for nothing. I would also check whether the three fidelity levels match how architects actually think about early-stage work, or whether they are a designer's categories rather than a practitioner's.",
    deliverables: [
      "Conversational UX",
      "Design-type system",
      "Prompt & sample gallery",
      "Preview and export flow",
      "3D editor interface",
      "Interface design",
    ],
    improveWithTime:
      "I would design the revision loop. Architecture is iterative, and right now the product generates and exports but has no good answer for coming back with 'the same building, but two storeys taller'.",
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
    productStatus: "Prototype",
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
    metrics: [
      {
        "value": "5",
        "label": "Financial products in one app",
        "kind": "scope",
        "note": "Lending, investing, banking, insurance and bill payments"
      },
      {
        "value": "₦100,000",
        "label": "Minimum investment, surfaced before commitment rather than after",
        "kind": "scope"
      },
      {
        "value": "1",
        "label": "Balance anchoring the home screen, not five",
        "kind": "scope"
      }
    ],
    contribution:
      "I designed the mobile experience across five financial products — the home dashboard and single balance, the loan request flow and its empty states, the investment and equity purchase journey, transaction and payment design, and the mobile design system that holds them together as one institution rather than four bolted-together apps.",
    context: {
      ownership:
        "End-to-end mobile product design",
      primaryUsers:
        "Retail customers borrowing, saving, investing and paying bills in one app",
      focus:
        "Responsible simplification — clarity without hiding risk",
      product:
        "A Nigerian fintech super-app spanning lending, investing, everyday banking, property insurance and bill payments",
      scope:
        "Home dashboard, loan request flow, investment and equity purchase, transaction and payment design, empty and error states, mobile design system",
      platform:
        "Mobile app",
      constraints:
        "Five financial products with different risk profiles and different regulatory language, in one interface",
    },
    challenge:
      "Most people end up running their financial life across four or five apps: one to borrow, one to save, one to invest, another for bills and insurance. Consolidating them is easy to propose and difficult to design well. Each product carries its own risk profile, its own regulatory language and its own vocabulary, and stacking them tends to produce one of two failures — a dashboard so dense that nothing is findable, or an interface so friendly that it quietly obscures what a decision actually costs. Investing raises the stakes further: a product that makes buying equities feel as frictionless as ordering food has not removed complexity, it has hidden risk. The problem was to hold five financial products in one app while keeping each one legible enough to be trusted with real money.",
    research: {
      "status": "Exploratory, product-design-led",
      "considered": "People running their financial life across four or five separate apps, using a phone in public rather than at a desk.",
      "investigated": "Where consolidation helps and where it harms — specifically whether simplifying an investment decision makes it clearer or merely calmer.",
      "learned": "Friction removed from a risk decision does not remove the risk, it hides it. Borrowing and investing are not the same kind of decision and should not feel identical.",
      "changed": "Projections are labelled indicative value at maturity and stated gross of withholding tax at the point of commitment, and constraints like the ₦100,000 minimum appear before the button rather than as an error after it.",
      "uncertain": "Whether people read those labels as estimates rather than promises.",
      "nextTest": "Test whether users distinguish projected returns from guaranteed returns, and measure comprehension, error rate and successful completion on the equity purchase flow."
    },
    difficulty:
      "Making investing feel as easy as ordering food is the obvious way to grow the product and the fastest way to do harm — friction removed from a risk decision does not remove the risk, it hides it. Every simplification had to be checked against whether it made the money clearer or merely made the screen calmer. That is why a projected return is labelled indicative value at maturity and stated gross of withholding tax at the moment of commitment rather than in a footnote, and why the minimum investment and the wallet balance appear before the button instead of arriving as an error after it. The competing pull was consolidation itself: five products in one app tends to produce either a dashboard too dense to navigate or a friendliness that flattens the difference between borrowing and investing, which are not the same kind of decision at all.",
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
    evidence:
      "One balance anchors the home screen rather than five. Constraints are surfaced before commitment rather than reported as failures afterwards, projections are labelled as estimates with tax status stated at the point of decision, and empty states explain the product rather than reporting zero. The full presentation is published on Behance.",
    improveNext:
      "I would test whether people actually read indicative value at maturity as an estimate rather than a promise — that phrase is carrying a lot of weight, and its comprehension is testable in minutes. I would also check whether masking the balance by default helps or irritates in daily use, since it trades a small constant cost against a privacy benefit that only matters occasionally.",
    deliverables: [
      "Home dashboard",
      "Loan request flow",
      "Investment & equity purchase flow",
      "Transaction and payment design",
      "Empty & error states",
      "Mobile design system",
    ],
    improveWithTime:
      "I would design the portfolio view properly. The app is good at the moment of purchase and thin afterwards, and holding an investment is where confidence is either built or lost.",
  },
  {
    slug: "project-management-dashboard",
    title: "Reporting Portal",
    category: "Project Management Dashboard",
    tagline:
      "A KPI-first reporting dashboard where the numbers that imply an action come before the ones that merely reassure.",
    year: "2025",
    status: "Selected project · Deck on Behance",
    role: "Product designer",
    tags: ["Dashboard Design", "Information Architecture", "Data Visualisation"],
    caseStudy: true,
    productStatus: "Shipped product",
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
      "Reporting Portal is a project management dashboard built around a KPI-first overview: a key-metrics row for total projects, tasks due, at-risk and critical items; a filter bar across project, team, date range and status; and a task board moving work through To Do, In Progress, Review and Done alongside upcoming milestones. It ships in light and dark themes and adapts down to mobile. This is a selected project rather than a full case study — the complete presentation is published on Behance.",
    contribution:
      "I designed the reporting portal's dashboard and information architecture: the key-metrics row, the filter model, the four-state task board, the milestone view and the responsive layout, in both light and dark themes.",
    context: {
      ownership:
        "Dashboard design and information architecture",
      primaryUsers:
        "Project managers and delivery teams tracking work across projects",
      focus:
        "KPI-first reporting, risk visibility, light and dark themes",
    },
    metrics: [
      {
        "value": "4",
        "label": "Task states — To Do, In Progress, Review, Done",
        "kind": "scope"
      },
      {
        "value": "4",
        "label": "Filter dimensions — project, team, date range, status",
        "kind": "scope"
      },
      {
        "value": "2",
        "label": "Themes — light and dark, designed as equals",
        "kind": "scope"
      }
    ],
    challenge:
      "A reporting dashboard is opened to answer one question — what needs attention today — but it is usually built to answer a different one: how much work exists. Totals are easy to produce and reassuring to look at, and they tell a manager nothing they can act on. The design problem was to decide what earns the top of the screen when the person reading it is scanning, not studying, and often doing it on a phone between meetings.",
    difficulty:
      "Prioritising risk means accepting an uncomfortable default: the dashboard opens by showing what is going wrong. That is the honest view and it is not the one a stakeholder demoing the tool tends to want, so the metrics row had to earn its order — total projects stays, because context matters, but tasks due, at-risk and critical sit alongside it rather than beneath it. The second constraint was breadth: four filter dimensions, four task states, milestones and two themes all had to survive being compressed onto a phone without becoming a stack of disconnected cards.",
    research: {
      "status": "Exploratory, product-design-led",
      "considered": "Managers who open a reporting tool to answer one question: what needs attention today.",
      "investigated": "What belongs above the fold on a dashboard whose users are scanning rather than reading.",
      "learned": "Totals are reassuring and useless; the useful figures are the ones that imply an action — what is due, what is at risk, what is critical.",
      "changed": "The key-metrics row leads with tasks due, at-risk and critical items rather than a project count, and milestones sit beside the board rather than in a separate view.",
      "uncertain": "Whether the four task states match how teams really move work, or whether they need a blocked state.",
      "nextTest": "Test whether managers can identify the day's at-risk items within a few seconds of opening the dashboard, and whether the four states are sufficient in practice."
    },
    process: [
      "Led the metrics row with figures that imply an action — tasks due, at-risk and critical items — rather than with a project count, so the first thing read is the first thing to do.",
      "Put the task board and upcoming milestones on the same screen, because the question 'is this on track' is answered by the two of them together and not by either alone.",
      "Designed four task states — To Do, In Progress, Review and Done — with Review as its own column rather than a flag, so work waiting on someone is visible rather than buried inside In Progress.",
      "Built filtering across the four dimensions a manager actually slices by — project, team, date range and status — and kept the filter bar in view, so refining never means losing the results.",
      "Designed light and dark themes as equals rather than treating dark as an afterthought, with status colour tested for legibility in both.",
      "Reduced the layout for mobile around the metrics row and a single board column, so the at-a-glance answer survives the smallest screen the tool is opened on.",
    ],
    outcome:
      "A dashboard that opens on the work needing attention rather than on a summary of everything: risk and due-date pressure at the top, a four-state board that surfaces work waiting on a person, milestones in the same view, and a filter model that answers a manager's real questions. It holds up in light and dark and down to a phone.",
    evidence:
      "The metrics row leads with tasks due, at-risk and critical items rather than totals; Review exists as its own column so blocked work is visible; and the layout survives both themes and a mobile breakpoint. The full presentation is published on Behance.",
    improveNext:
      "Test whether managers can identify the day's at-risk items within a few seconds of opening the dashboard, and whether four task states are sufficient in practice or whether teams need a blocked state distinct from Review.",
    deliverables: [
      "KPI dashboard design",
      "Information architecture",
      "Task board & milestone views",
      "Filter model",
      "Light and dark themes",
      "Responsive layout",
    ],
    improveWithTime:
      "I would connect at-risk items to a reason. A red count tells a manager something is wrong but not what to do about it, and the useful version of this dashboard explains why an item slipped.",
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
