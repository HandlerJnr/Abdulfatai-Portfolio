/*
 * Portfolio content. Everything the desktop shows comes from here.
 * Copy and figures mirror the published portfolio; company-reported figures keep their notes.
 */
window.PORTFOLIO = {
 "about": {
  "name": "Jamiu Abdulfatai",
  "title": "Product Designer",
  "portrait": "/assets/portraits/suit.webp",
  "headline": "I design clear interfaces for payments, banking and complex workflows.",
  "facts": [
   [
    "Based in",
    "Brighton, UK"
   ],
   [
    "Studying",
    "MSc User Experience Design, University of Brighton"
   ],
   [
    "Focus",
    "Payments, banking and complex workflows across web and mobile"
   ],
   [
    "Teams",
    "Bizinc, ITSS · Vista, Kremor AI, Radius / Pay4Me"
   ]
  ],
  "bio": [
   "I like untangling the things that make digital products difficult to use. Sometimes that means questioning a business rule; sometimes it means finding a simpler way to explain what’s happening.",
   "I enjoy the design process, but I also like understanding how things are built. It helps me make decisions that work beyond the Figma file, and gives me more useful conversations with engineers.",
   "At Brighton, I’m developing my research practice and spending more time questioning the decisions behind interfaces, especially how research and AI can help us design more responsibly.",
   "When I’m not thinking about interfaces, there’s a good chance I’m somewhere playing football."
  ],
  "email": "aabdulfataijamiu@gmail.com",
  "linkedin": "https://www.linkedin.com/in/jamiudesign/"
 },
 "projects": [
  {
   "id": "vista-digital-banking",
   "name": "Vista Digital Banking",
   "line": "One shared UI language, adapted for four Vista subsidiaries.",
   "year": "2022–2024",
   "stage": "Shipped",
   "sector": "Banking · Localisation",
   "shipped": true,
   "domain": "banking",
   "role": "UI/UX Designer & Front-End Developer · ITSS · May 2022–April 2024",
   "cover": "/assets/vista/main.webp",
   "images": [
    {
     "src": "/assets/vista/main.webp",
     "alt": "Vista Bank splash screen"
    },
    {
     "src": "/assets/vista/dashboard.webp",
     "alt": "Vista Bank mobile dashboard"
    },
    {
     "src": "/assets/vista/signin.webp",
     "alt": "Vista Bank sign-in screen"
    }
   ],
   "skills": [
    "UX design",
    "UI design",
    "Design systems",
    "HTML/CSS"
   ],
   "problem": "Vista needed a recognisable banking experience across The Gambia, Guinea, Sierra Leone and Burkina Faso. The UI had to work in English and French while accommodating each subsidiary’s currency, regulatory copy and banking requirements.",
   "decisions": [
    {
     "title": "Keep the design language consistent across subsidiaries.",
     "text": "I used shared components and interaction patterns so each local experience remained recognisably Vista, while allowing language, currency and regulatory copy to vary."
    },
    {
     "title": "Make language available at sign-in.",
     "text": "English and French selection sits at the start of the journey, rather than being left inside settings after a customer has already had to log in."
    },
    {
     "title": "Keep local and company context visible.",
     "text": "Currency stays with account balances, and the active legal entity appears beneath the user’s name so corporate users can see which company they are acting for."
    },
    {
     "title": "Adapt the shared system to corporate banking.",
     "text": "Pending approvals have their own counts and prominent placement. Account sorting, filters and custom views support people managing multiple accounts."
    }
   ],
   "result": "The banking design shipped across four localised subsidiaries using one shared system. The work brought a consistent Vista interface to English- and French-speaking markets while preserving the local information customers need.",
   "metrics": [
    {
     "value": "4",
     "label": "West African markets"
    },
    {
     "value": "4",
     "label": "Localised subsidiaries"
    },
    {
     "value": "2",
     "label": "Languages"
    }
   ],
   "metricNote": "Delivery scope: four subsidiaries, English and French, with local currency and regulatory copy. Supported by the project record and ITSS recognition.",
   "links": [
    {
     "href": "https://vistabankgroup.com/",
     "label": "Live website"
    },
    {
     "href": "https://play.google.com/store/apps/details?id=com.temenos.OnlineBanking",
     "label": "Google Play"
    },
    {
     "href": "https://apps.apple.com/app/vistabankgroup-vistaonline/id6720755333",
     "label": "App Store"
    }
   ]
  },
  {
   "id": "radius-pay4me",
   "name": "Radius / Pay4Me",
   "line": "Designing cross-border payments for the student and the person paying.",
   "year": "2025",
   "stage": "Live product",
   "sector": "Cross-border payments",
   "shipped": true,
   "domain": "banking",
   "role": "Product designer · mobile payment experience and marketing site · 2025",
   "cover": "/assets/pay4me/main.webp",
   "images": [
    {
     "src": "/assets/pay4me/main.webp",
     "alt": "Pay4Me mobile website with two ladies"
    },
    {
     "src": "/assets/pay4me/desktop.webp",
     "alt": "Pay4Me desktop landing page"
    },
    {
     "src": "/assets/pay4me/laptop.webp",
     "alt": "Pay4Me laptop interface"
    },
    {
     "src": "/assets/pay4me/mobile.webp",
     "alt": "Pay4Me mobile payment experience"
    }
   ],
   "skills": [
    "UX design",
    "UI design",
    "Payment journeys"
   ],
   "problem": "Education and immigration payments have deadlines. A parent or relative may be paying for a student in another country, using another currency.",
   "decisions": [
    {
     "title": "Give the sponsor a clear payment route.",
     "text": "I treated the payer and student as different people in the journey, rather than forcing sponsored payments into a personal transfer."
    },
    {
     "title": "Put payment constraints before commitment.",
     "text": "Currency appears with the balance, and verification status appears with identity, so both are visible before a payment starts."
    },
    {
     "title": "Build trust before the download.",
     "text": "The site uses named institutions, coverage, student testimonials and FAQs, followed by a QR-code handoff to the app."
    },
    {
     "title": "Use the language of the task.",
     "text": "Tuition, SEVIS, WES and visa payments are named directly, with tracking and support easy to reach."
    }
   ],
   "result": "The design connects the website’s trust-building role to the mobile payment journey. Sponsored payments, verification and transaction status are treated as core parts of that experience.",
   "metrics": [
    {
     "value": "120,000",
     "label": "Registered users, company-reported"
    },
    {
     "value": "1,500",
     "label": "Five-star reviews"
    },
    {
     "value": "6 hours",
     "label": "Average delivery on business days"
    }
   ],
   "metricNote": "Radius publishes these as minimum counts (120K+ users and 1,500+ reviews) and an average delivery time. They describe the company, not a measured uplift from my design work. ",
   "links": [
    {
     "href": "https://withradius.com/",
     "label": "Live website"
    },
    {
     "href": "https://play.google.com/store/apps/details?id=app.pay4me.app",
     "label": "Google Play"
    },
    {
     "href": "https://apps.apple.com/app/radius-tuition-fee-payments/id1627285676",
     "label": "App Store"
    }
   ]
  },
  {
   "id": "horal",
   "name": "Horal",
   "line": "Making marketplace safety visible from checkout to payout.",
   "year": "2026",
   "stage": "Live",
   "sector": "Web, iOS & Android",
   "shipped": true,
   "domain": "marketplaces",
   "role": "End-to-end product designer · mobile app and website · 2026",
   "cover": "/assets/horal/main.webp",
   "images": [
    {
     "src": "/assets/horal/main.webp",
     "alt": "Mobile marketplace beside X"
    },
    {
     "src": "/assets/horal/mobile.webp",
     "alt": "Mobile product browsing"
    },
    {
     "src": "/assets/horal/desktop.webp",
     "alt": "Desktop marketplace"
    }
   ],
   "skills": [
    "UX design",
    "UI design",
    "Seller operations",
    "Design systems"
   ],
   "problem": "Buyers need to trust independent sellers they may never meet. Sellers need the tools to fulfil those orders reliably.",
   "decisions": [
    {
     "title": "Show who the buyer is dealing with.",
     "text": "I placed verification at store level, where buyers assess the seller before paying."
    },
    {
     "title": "Explain what happens to the payment.",
     "text": "I designed escrow around visible stages, from protected payment through delivery confirmation to release of funds."
    },
    {
     "title": "Connect shopping to fulfilment.",
     "text": "Seller stock, orders and wallet tools follow the same transaction lifecycle as the buyer journey."
    }
   ],
   "result": "Horal is live on the web, iOS and Android. The released product includes verified stores, escrow, chat, seller inventory, order management and payouts.",
   "metrics": [
    {
     "value": "3",
     "label": "Live platforms"
    },
    {
     "value": "2-sided",
     "label": "Marketplace"
    },
    {
     "value": "100",
     "label": "Google Play download threshold"
    }
   ],
   "metricNote": "Google Play lists Horal in the 100+ download band. This is an app-store threshold, not an exact total or a measured design uplift. ",
   "links": [
    {
     "href": "https://www.horal.ng/",
     "label": "Live website"
    },
    {
     "href": "https://play.google.com/store/apps/details?id=ng.horal.app",
     "label": "Google Play"
    },
    {
     "href": "https://apps.apple.com/app/horal/id6759718557",
     "label": "App Store"
    }
   ]
  },
  {
   "id": "bizinc",
   "name": "Bizinc",
   "line": "One business profile, with clear control for owners and customers.",
   "year": "2024–2026",
   "stage": "Live product",
   "sector": "Marketplace",
   "shipped": true,
   "domain": "marketplaces",
   "role": "UI/UX Intern → Product Designer → UI/UX Manager · April 2024–May 2026",
   "cover": "/assets/bizinc/main.webp",
   "images": [
    {
     "src": "/assets/bizinc/main.webp",
     "alt": "Bizinc login and sign-up entry"
    },
    {
     "src": "/assets/bizinc/discover.webp",
     "alt": "Bizinc business discovery"
    },
    {
     "src": "/assets/bizinc/nearby.webp",
     "alt": "Bizinc nearby businesses and map"
    },
    {
     "src": "/assets/bizinc/profile.webp",
     "alt": "Bizinc business profile and services"
    },
    {
     "src": "/assets/bizinc/manage.webp",
     "alt": "Bizinc business profile management"
    }
   ],
   "skills": [
    "Journey mapping",
    "UI design",
    "Design systems",
    "Design leadership",
    "Handoff"
   ],
   "problem": "A business owner needs to manage their identity, services and offers. A customer needs to decide whether that business is right for them. Both journeys meet at the same profile.",
   "decisions": [
    {
     "title": "Separate management from the public profile.",
     "text": "I mapped Business View and Client View separately, then brought them into one shared structure so owner controls stayed out of customer navigation."
    },
    {
     "title": "Help customers compare before opening a profile.",
     "text": "Discovery cards include service information, location, distance and open-now status alongside the route to the business profile."
    },
    {
     "title": "Connect proposed AI discovery to a real next step.",
     "text": "The Bizzy proposal moves from a service request to nearby businesses, availability and booking. It remains proposed work; a prototype confirmation is not a live booking integration."
    }
   ],
   "result": "Bizinc is live. The CEO reference documents my role in rebuilding the platform interface and my progression to UI/UX Manager. Profile requirements, journey maps, wireframes and components show the design work behind it.",
   "metrics": [
    {
     "value": "+38%",
     "label": "Retention"
    },
    {
     "value": "+45%",
     "label": "Dashboard activation"
    },
    {
     "value": "+23%",
     "label": "Customer growth"
    }
   ],
   "metricNote": "Reported during the redesign period; also +12% service activity. Baselines, dates and measurement methods are unpublished, and individual design causality was not isolated.",
   "links": [
    {
     "href": "https://www.bizinc.io",
     "label": "Live website"
    }
   ]
  },
  {
   "id": "kremor-ai",
   "name": "Kremor AI",
   "line": "Helping people turn a clothing idea into a design that can move toward production.",
   "year": "2024–2026",
   "stage": "Design & evaluation",
   "sector": "AI commerce",
   "shipped": false,
   "domain": "ai",
   "role": "UI/UX Designer - Design & Research Lead · Kremor AI · June 2024–July 2026",
   "cover": "/assets/kremor/dashboard.webp",
   "images": [
    {
     "src": "/assets/kremor/dashboard.webp",
     "alt": "Kremor AI operations dashboard"
    },
    {
     "src": "/assets/kremor/workspace.webp",
     "alt": "Kremor AI workspace"
    },
    {
     "src": "/assets/kremor/analytics.webp",
     "alt": "Kremor AI analytics and reports"
    },
    {
     "src": "/assets/kremor/main.webp",
     "alt": "Kremor AI mobile landing page"
    }
   ],
   "skills": [
    "UX research",
    "UI design",
    "AI evaluation",
    "Design systems"
   ],
   "problem": "Someone may know the occasion, textile or feeling they want without knowing how to prompt an AI tool. The generated idea also needs a route into the storefront and garment-production workflow.",
   "decisions": [
    {
     "title": "Offer a starting point before asking for a prompt.",
     "text": "Quick actions and conversational examples help people describe an idea without specialist design vocabulary."
    },
    {
     "title": "Name the textiles people are working with.",
     "text": "The interface uses Ankara, Aso-Oke, Adire, Kente and Afro-fusion instead of a broad label that loses useful detail."
    },
    {
     "title": "Connect creative work to operational roles.",
     "text": "The design covers the handoff from an approved idea toward production. The five-role workshop permissions model is marked for validation with operating teams."
    }
   ],
   "result": "Three connected product surfaces share one design system. The founder’s reference confirms my combined UI/UX design and AI-evaluation work.",
   "metrics": [
    {
     "value": "3",
     "label": "Connected surfaces"
    },
    {
     "value": "5",
     "label": "Operational roles"
    },
    {
     "value": "AI evaluation",
     "label": "Benchmarking and output review"
    }
   ],
   "metricNote": "Three designed surfaces and five operational roles. The founder’s reference supports my design and AI-evaluation responsibilities. Workshop permissions remain to be validated. ",
   "links": [
    {
     "href": "https://kremor-ai-clone.vercel.app/",
     "label": "Working demo"
    }
   ]
  },
  {
   "id": "chalant-ai",
   "name": "Chalant AI",
   "line": "Chalantwork: a live platform for sustainability data, evidence and review.",
   "year": "2025",
   "stage": "Live platform",
   "sector": "Sustainability",
   "shipped": true,
   "domain": "saas",
   "role": "Lead product designer · UX, interface design and design systems",
   "cover": "/assets/chalant/hero.webp",
   "images": [
    {
     "src": "/assets/chalant/hero.webp",
     "alt": "Chalantwork desktop monitor mockup"
    },
    {
     "src": "/assets/chalant/main.webp",
     "alt": "Chalantwork desktop landing page"
    },
    {
     "src": "/assets/chalant/login.webp",
     "alt": "Chalantwork login"
    },
    {
     "src": "/assets/chalant/signup.webp",
     "alt": "Chalantwork account registration"
    },
    {
     "src": "/assets/chalant/industries.webp",
     "alt": "Chalantwork industry solutions"
    }
   ],
   "skills": [
    "UX design",
    "UI design",
    "Product design",
    "Design systems"
   ],
   "problem": "Sustainability reporting depends on more than entering figures. Teams need to connect the data to evidence, review it and use it across reporting and operational workflows.",
   "decisions": [
    {
     "title": "Connect data to evidence and review.",
     "text": "The live platform links entered data with supporting evidence and maker-checker approval before it is used for reporting and action."
    },
    {
     "title": "Organise related sustainability work together.",
     "text": "ESG reporting, emissions tracking, verification, finance and HSE operations are presented as connected workflows, with industry-specific routes."
    },
    {
     "title": "Give teams a clear access route.",
     "text": "The website supports enterprise access requests, with email and Microsoft sign-in for existing accounts."
    }
   ],
   "result": "Chalantwork is live, with email and Microsoft sign-in and enterprise access requests. Its published offering covers ESG reporting, emissions, verification, capital access and HSE operations.",
   "metrics": [
    {
     "value": "5",
     "label": "Sustainability pillars"
    },
    {
     "value": "9",
     "label": "Abatement levers"
    },
    {
     "value": "4",
     "label": "Industry groups"
    }
   ],
   "metricNote": "These counts describe published product coverage, not measured design outcomes. ",
   "links": [
    {
     "href": "https://www.chalantwork.com/",
     "label": "Live website"
    },
    {
     "href": "https://www.chalantwork.com/auth",
     "label": "Platform login"
    }
   ]
  },
  {
   "id": "shortlet-lagos",
   "name": "Shortlet Lagos",
   "line": "Giving guests and property investors different routes into the same business.",
   "year": "2024",
   "stage": "Live product",
   "sector": "Property",
   "shipped": true,
   "domain": "marketplaces",
   "role": "Product designer & researcher · 2024",
   "cover": "/assets/shortlet/shortlet-laptop.webp",
   "images": [
    {
     "src": "/assets/shortlet/shortlet-laptop.webp",
     "alt": "Shortlet Lagos - Desktop booking experience"
    },
    {
     "src": "/assets/shortlet/shortlet-phone.webp",
     "alt": "Shortlet Lagos - Mobile property browsing"
    },
    {
     "src": "/assets/shortlet/shortlet-invest-repaired.webp",
     "alt": "Shortlet Lagos - Property investment"
    }
   ],
   "skills": [
    "UX research",
    "UI design"
   ],
   "problem": "A guest is choosing a place to stay. An investor is deciding what a property share means and what it costs. Combining those decisions would give each audience the wrong information.",
   "decisions": [
    {
     "title": "Separate the entry points.",
     "text": "Guests begin with stays; investors begin with property investment. Each route introduces the information needed for that decision."
    },
    {
     "title": "Keep the whole booking query together.",
     "text": "Location, check-in, check-out and guest count sit in one search card so the query is visible and editable on mobile."
    },
    {
     "title": "Explain the investment mechanic first.",
     "text": "The investment experience introduces buying shares and the ₦50,000 entry threshold before discussing potential returns."
    }
   ],
   "result": "Shortlet Lagos is live. The design provides distinct booking and investment routes within one responsive product.",
   "metrics": [
    {
     "value": "2",
     "label": "Distinct audiences"
    },
    {
     "value": "4",
     "label": "Booking search inputs"
    },
    {
     "value": "₦50K",
     "label": "Designed entry threshold"
    }
   ],
   "metricNote": "Product and design scope. ₦50,000 is the designed entry threshold, not a return or adoption metric.",
   "links": [
    {
     "href": "https://www.shortlet-lagos.com",
     "label": "Live website"
    }
   ]
  },
  {
   "id": "synqit",
   "name": "Synqit",
   "line": "Making a partnership request the starting point for business conversations.",
   "year": "2026",
   "stage": "Product design",
   "sector": "Business partnerships",
   "shipped": false,
   "domain": "saas",
   "role": "Lead product designer · end to end · 2026",
   "cover": "/assets/synqit/synqit-laptop.webp",
   "images": [
    {
     "src": "/assets/synqit/synqit-laptop.webp",
     "alt": "Synqit - Desktop platform"
    },
    {
     "src": "/assets/synqit/synqit-desk.webp",
     "alt": "Synqit - Mobile platform"
    },
    {
     "src": "/assets/synqit/synqit-user-journey.webp",
     "alt": "Synqit - Partnership journey"
    },
    {
     "src": "/assets/synqit/synqit-deck-problem.webp",
     "alt": "Synqit - Problem and solution"
    },
    {
     "src": "/assets/synqit/synqit-deck-mvp.webp",
     "alt": "Synqit - MVP scope"
    }
   ],
   "skills": [
    "UX research",
    "UI design"
   ],
   "problem": "Businesses and Web3 teams were finding potential partners across scattered social channels. Open messaging made it difficult to distinguish a credible partnership from unsolicited outreach.",
   "decisions": [
    {
     "title": "Let people review a request before a conversation.",
     "text": "Messaging unlocks after a partnership request is accepted, giving both sides control over who reaches their inbox."
    },
    {
     "title": "Make relationship status visible.",
     "text": "The dashboard organises requests by pending, accepted and declined so teams can see where each introduction stands."
    },
    {
     "title": "Design for the three roles in the network.",
     "text": "Profiles and journeys account for businesses seeking partners, investors assessing startups and teams managing partnerships."
    }
   ],
   "result": "The designed workflow connects discovery, profile review, request acceptance and messaging. The flow replaces a scattered manual process with explicit steps for each user role.",
   "metrics": [
    {
     "value": "Role-based",
     "label": "Discovery & onboarding"
    },
    {
     "value": "3",
     "label": "Role groups"
    },
    {
     "value": "Request-first",
     "label": "Messaging access"
    }
   ],
   "metricNote": "The design separates three user roles and uses request-first messaging. No quantified improvement is claimed without a published benchmark.",
   "links": []
  },
  {
   "id": "arete",
   "name": "Arete",
   "line": "Connecting the steps after a patient finds a doctor.",
   "year": "2026",
   "stage": "Design exploration",
   "sector": "Healthcare",
   "shipped": false,
   "domain": "health",
   "role": "End-to-end product designer · 2026",
   "cover": "/assets/arete/arete-cover.webp",
   "images": [
    {
     "src": "/assets/arete/arete-cover.webp",
     "alt": "Arete - Healthcare app overview"
    },
    {
     "src": "/assets/arete/arete-onboarding.webp",
     "alt": "Arete - Account onboarding"
    },
    {
     "src": "/assets/arete/arete-journey.webp",
     "alt": "Arete - Care journey"
    },
    {
     "src": "/assets/arete/arete-pharmacy.webp",
     "alt": "Arete - Pharmacy and prescriptions"
    },
    {
     "src": "/assets/arete/arete-hmo.webp",
     "alt": "Arete - Health coverage"
    },
    {
     "src": "/assets/arete/arete-states.webp",
     "alt": "Arete - Interface states"
    },
    {
     "src": "/assets/arete/arete-design-system.webp",
     "alt": "Arete - Design system"
    }
   ],
   "skills": [
    "UX strategy",
    "UI design",
    "UX writing",
    "Prototyping",
    "Design systems"
   ],
   "problem": "A patient’s journey continues through coverage, prescriptions, finding medication and follow-up. Those steps involve different organisations and can leave the patient without a clear next action.",
   "decisions": [
    {
     "title": "Keep access possible without insurance details.",
     "text": "A Skip for Now route lets the patient continue instead of treating missing coverage information as a dead end."
    },
    {
     "title": "Design beyond the consultation.",
     "text": "The seven-step journey continues into prescriptions, pharmacy access and follow-up rather than stopping at a booking."
    },
    {
     "title": "Make coverage wording a design priority.",
     "text": "Simple, accessible, localised and transparent are the four principles behind the interface. Coverage states must remain understandable without promising an insurer’s approval."
    }
   ],
   "result": "The designs connect seven care steps across four product surfaces, supported by documented requirements, interface states and a shared visual system.",
   "metrics": [
    {
     "value": "7",
     "label": "Care journey steps"
    },
    {
     "value": "4",
     "label": "Connected care surfaces"
    },
    {
     "value": "4",
     "label": "Design principles"
    }
   ],
   "metricNote": "Design scope across patients, providers, HMO teams and pharmacies. Patient testing is still needed for coverage wording and accessibility.",
   "links": []
  },
  {
   "id": "architek",
   "name": "Archi-Tek",
   "line": "Designing a route from an architectural brief to a reviewable output.",
   "year": "2025",
   "stage": "Design exploration",
   "sector": "Architecture AI",
   "shipped": false,
   "domain": "ai",
   "role": "Product designer · 2025",
   "cover": "/assets/architek/prompt-hands.webp",
   "images": [
    {
     "src": "/assets/architek/prompt-hands.webp",
     "alt": "Archi-Tek prompt workspace - laptop held in hands"
    },
    {
     "src": "/assets/architek/preview-stone.webp",
     "alt": "Archi-Tek design preview and export - laptop on stone"
    },
    {
     "src": "/assets/architek/editor-sculpture.webp",
     "alt": "Archi-Tek 3D editor - sculptural laptop presentation"
    }
   ],
   "skills": [
    "UX design",
    "UI design",
    "Prototyping"
   ],
   "problem": "A convincing building image is not the same as a file an architect can revise or hand to an engineer. The interface needs to make the intended output and its limits clear.",
   "decisions": [
    {
     "title": "Help people start with a recognisable building brief.",
     "text": "Examples such as a three-bedroom bungalow or duplex sit beside the prompt field, with sample designs to show what can be requested."
    },
    {
     "title": "Let the user choose the output level.",
     "text": "Concept Sketch, Schematic Plan and Detailed Model make fidelity an explicit choice rather than leaving the generator to guess."
    },
    {
     "title": "Keep alternatives and export choices visible.",
     "text": "Named design options can be compared before choosing DWG, OBJ, SketchUp or PDF. The proposed editor is labelled Coming soon."
    }
   ],
   "result": "The interface design covers the path from a written brief through comparison, preview and proposed export. The mockups show these interaction decisions.",
   "metrics": [
    {
     "value": "3",
     "label": "Fidelity modes"
    },
    {
     "value": "4",
     "label": "Designed export formats"
    },
    {
     "value": "Coming soon",
     "label": "3D editor"
    }
   ],
   "metricNote": "Designed interaction scope: three fidelity modes and four proposed export formats. The editor is Coming soon; CAD capability remains unverified.",
   "links": []
  },
  {
   "id": "loan-investment-app",
   "name": "Loan & Investment App",
   "line": "Bringing borrowing and investing together without hiding their differences.",
   "year": "2025",
   "stage": "Design exploration",
   "sector": "Financial services",
   "shipped": false,
   "domain": "banking",
   "role": "Product designer · 2025",
   "cover": "/assets/loan/loan-home.webp",
   "images": [
    {
     "src": "/assets/loan/loan-home.webp",
     "alt": "Loan &amp; Investment App - Mobile financial dashboard"
    },
    {
     "src": "/assets/loan/loan-myloan.webp",
     "alt": "Loan &amp; Investment App - Loan management"
    },
    {
     "src": "/assets/loan/loan-equities.webp",
     "alt": "Loan &amp; Investment App - Equities portfolio"
    }
   ],
   "skills": [
    "UX design",
    "UI design",
    "Design systems",
    "Prototyping"
   ],
   "problem": "Five financial products need to fit into one app, but borrowing and investing have different consequences. A simpler dashboard must still explain what a financial decision involves.",
   "decisions": [
    {
     "title": "Use one balance as the starting point.",
     "text": "The dashboard places quick actions and pending tasks around a shared balance, with a reveal control for privacy."
    },
    {
     "title": "Explain a loan before asking someone to request it.",
     "text": "The empty state describes what borrowing is for and gives a clear Request Loan action instead of showing only a zero balance."
    },
    {
     "title": "Show investment constraints before commitment.",
     "text": "The minimum investment and wallet balance appear before the action. Projected values are labelled indicative and gross of withholding tax."
    }
   ],
   "result": "The design brings five financial products into a shared mobile system while keeping loan and investment decisions distinct.",
   "metrics": [
    {
     "value": "5",
     "label": "Financial products"
    },
    {
     "value": "₦100K",
     "label": "Designed investment minimum"
    },
    {
     "value": "1",
     "label": "Shared balance"
    }
   ],
   "metricNote": "Design scope: five financial products and a designed ₦100,000 investment minimum. Adoption and financial outcomes have not been measured.",
   "links": []
  },
  {
   "id": "reporting-portal",
   "name": "Reporting Portal",
   "line": "Helping a project manager see what needs attention today.",
   "year": "2025",
   "stage": "Design exploration",
   "sector": "SaaS",
   "shipped": false,
   "domain": "saas",
   "role": "Product designer · 2025",
   "cover": "/assets/reporting/pm-dashboard-laptop.webp",
   "images": [
    {
     "src": "/assets/reporting/pm-dashboard-laptop.webp",
     "alt": "Reporting Portal - Desktop reporting dashboard"
    },
    {
     "src": "/assets/reporting/pm-dashboard-light.webp",
     "alt": "Reporting Portal - Light theme dashboard"
    },
    {
     "src": "/assets/reporting/pm-dashboard-dark.webp",
     "alt": "Reporting Portal - Dark theme dashboard"
    },
    {
     "src": "/assets/reporting/pm-dashboard-phone.webp",
     "alt": "Reporting Portal - Mobile reporting dashboard"
    }
   ],
   "skills": [
    "UX design",
    "UI design"
   ],
   "problem": "A project count gives context, but it does not show what is due, at risk or waiting for review. Managers need an actionable view when they are scanning between meetings.",
   "decisions": [
    {
     "title": "Put urgent work beside the totals.",
     "text": "Tasks due, at-risk and critical work sit in the metrics row so the overview points toward an action."
    },
    {
     "title": "Show tasks and milestones together.",
     "text": "The board and upcoming milestones share a view, connecting day-to-day work to delivery dates."
    },
    {
     "title": "Make review a visible state.",
     "text": "To Do, In Progress, Review and Done are separate columns. Project, team, date and status filters help narrow the work without leaving the view."
    }
   ],
   "result": "The dashboard design combines four task states, four filter dimensions and two themes. The mobile layout preserves the key metrics and a focused board view.",
   "metrics": [
    {
     "value": "4",
     "label": "Task states"
    },
    {
     "value": "4",
     "label": "Filter dimensions"
    },
    {
     "value": "2",
     "label": "Interface themes"
    }
   ],
   "metricNote": "Designed dashboard coverage: four task states, four filter dimensions and two themes. Productivity outcomes are not yet measured.",
   "links": []
  }
 ],
 "sections": [
  {
   "id": "all",
   "label": "All projects"
  },
  {
   "id": "shipped",
   "label": "Shipped"
  },
  {
   "id": "explorations",
   "label": "Explorations"
  }
 ],
 "domains": [
  {
   "id": "banking",
   "label": "Banking & payments"
  },
  {
   "id": "marketplaces",
   "label": "Marketplaces"
  },
  {
   "id": "ai",
   "label": "AI products"
  },
  {
   "id": "saas",
   "label": "SaaS & platforms"
  },
  {
   "id": "health",
   "label": "Health"
  }
 ],
 "gallery": []
};
