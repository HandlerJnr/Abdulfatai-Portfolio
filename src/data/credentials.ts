export type Credential = {
  slug: string;
  title: string;
  issuer: string;
  /** Short, human date as it appears on the document. */
  date: string;
  /** The full document, opened in a new tab. */
  file: string;
  /** Rendered first page / image, shown on the card and in the viewer. */
  preview: string;
  /** One line on what the document actually says or covers. */
  note?: string;
  /** Public verification link, where the issuer provides one. */
  verifyUrl?: string;
  /** Certificate or reference number printed on the document. */
  ref?: string;
  /** What this document proves — one short line for a scanning recruiter. */
  proves?: string;
  /** Rough shape of the preview, so cards reserve the right space. */
  shape?: "portrait" | "landscape";
};

export type CredentialGroup = {
  id: string;
  title: string;
  blurb: string;
  items: Credential[];
};

const F = "/credentials/files";
const P = "/credentials/previews";

export const credentialGroups: CredentialGroup[] = [
  {
    id: "references",
    title: "References",
    blurb: "Written by the people I reported to, and readable in full.",
    items: [
      {
        slug: "bizinc-ceo-reference",
        proves: "Evidence of progression into increased responsibility",
        title: "Letter of recommendation",
        issuer: "Michael Fulton II — Chief Executive Officer, Bizinc",
        date: "9 December 2025",
        file: `${F}/bizinc-ceo-reference.pdf`,
        preview: `${P}/bizinc-ceo-reference.jpg`,
        shape: "portrait",
        note: "Covers the progression from UI/UX intern to designer to UI/UX Manager leading other designers and interns, and the rebuild of the Bizinc platform interface from scratch.",
      },
      {
        slug: "kremor-founder-reference",
        proves: "Client confirmation of the design and AI-evaluation scope",
        title: "Letter of recommendation",
        issuer: "Saheed Alabi — Founder, Kremor AI",
        date: "27 July 2026",
        file: `${F}/kremor-founder-reference.pdf`,
        preview: `${P}/kremor-founder-reference.jpg`,
        shape: "portrait",
        note: "Covers the dual role — UI/UX design alongside AI model evaluation: forensic benchmarking, dataset annotation and qualitative evaluation of LLM and generative image output.",
      },
      {
        slug: "academic-reference",
        proves: "Independent assessment of analytical ability and character",
        title: "Academic reference",
        issuer:
          "Adamu Muhammad Aminu, MNIP — Department of Physics, Federal University Dutsin-Ma",
        date: "30 April 2026",
        file: `${F}/academic-reference.pdf`,
        preview: `${P}/academic-reference.jpg`,
        shape: "portrait",
        note: "Seven years as academic mentor, covering the solar-powered drone final-year project and the move from physics into design and AI.",
      },
    ],
  },
  {
    id: "awards",
    title: "Awards & recognition",
    blurb: "Recognition from the organisations the work was done for.",
    items: [
      {
        slug: "itss-most-outstanding-intern",
        proves: "Client recognition naming the Vista project shown in this portfolio",
        title: "Most Outstanding Intern of the Year",
        issuer: "ITSS — Information Technology Solution Services, Geneva",
        date: "6 November 2023",
        file: `${F}/itss-most-outstanding-intern.pdf`,
        preview: `${P}/itss-most-outstanding-intern.jpg`,
        shape: "portrait",
        note: "Names the Vista Bank project UI/UX work and the Jasper Report design template as the contributions it was awarded for.",
      },
      {
        slug: "synergy-africa-design-quest",
        proves: "Independent design recognition, judged competition",
        title: "Finalist — Synergy Africa Design Quest 2023",
        issuer: "Synergyy",
        date: "25 October 2023",
        file: `${F}/synergy-africa-design-quest.pdf`,
        preview: `${P}/synergy-africa-design-quest.jpg`,
        shape: "landscape",
      },
      {
        slug: "hult-prize-runner-up",
        proves: "Team placement in an international entrepreneurship competition",
        title: "1st runner-up team — Hult Prize",
        issuer: "Hult Prize Foundation, Federal University Dutsin-Ma",
        date: "11 January 2021",
        file: `${F}/hult-prize-runner-up.jpg`,
        preview: `${P}/hult-prize-runner-up.jpg`,
        shape: "landscape",
      },
    ],
  },
  {
    id: "design",
    title: "Design certifications",
    blurb: "Formal training in the craft itself.",
    items: [
      {
        slug: "zidio-uiux-internship",
        proves: "Completed structured UI/UX design programme",
        title: "UI/UX Design internship programme",
        issuer: "Zidio Development",
        date: "15 Feb – 15 Mar 2024",
        ref: "zidio/00206",
        file: `${F}/zidio-uiux-internship.jpg`,
        preview: `${P}/zidio-uiux-internship.jpg`,
        shape: "portrait",
      },
      {
        slug: "alison-ui-design-figma",
        proves: "Assessed competence in the primary design tool",
        title: "User Interface Design with Figma",
        issuer: "Alison — CPD certified",
        date: "24 March 2024",
        ref: "4304-25073532",
        file: `${F}/alison-ui-design-figma.jpg`,
        preview: `${P}/alison-ui-design-figma.jpg`,
        shape: "landscape",
      },
      {
        slug: "alison-uiux-adobe-xd",
        proves: "Assessed competence in UI/UX tooling",
        title: "UI/UX Design using Adobe XD",
        issuer: "Alison — CPD certified",
        date: "24 March 2024",
        ref: "4485-25073532",
        file: `${F}/alison-uiux-adobe-xd.jpg`,
        preview: `${P}/alison-uiux-adobe-xd.jpg`,
        shape: "landscape",
      },
      {
        slug: "great-learning-css",
        proves: "Front-end fluency behind the HTML/CSS handoff work",
        title: "Front-End Development — CSS",
        issuer: "Great Learning Academy",
        date: "March 2024",
        file: `${F}/great-learning-css.jpg`,
        preview: `${P}/great-learning-css.jpg`,
        shape: "landscape",
      },
    ],
  },
  {
    id: "ai-product",
    title: "AI & product practice",
    blurb:
      "Short applied courses behind the AI-assisted workflow and the AI product work. Length is stated as the certificate states it.",
    items: [
      {
        slug: "udemy-ai-voice-agents",
        proves: "Applied grounding for the AI product work",
        title: "AI Voice Agents: Automation with Vapi, ElevenLabs, n8n & MCP",
        issuer: "Udemy — 12.5 hours",
        date: "19 October 2025",
        file: `${F}/udemy-ai-voice-agents.jpg`,
        preview: `${P}/udemy-ai-voice-agents.jpg`,
        shape: "landscape",
        verifyUrl: "https://ude.my/UC-b80d563a-c1d1-4e47-8dd0-0d37800a4ec9",
      },
      {
        slug: "udemy-langflow",
        proves: "Applied grounding for the AI product work",
        title: "Build AI Apps Fast: Master Langflow Step by Step",
        issuer: "Udemy — 3.5 hours",
        date: "3 October 2025",
        file: `${F}/udemy-langflow.jpg`,
        preview: `${P}/udemy-langflow.jpg`,
        shape: "landscape",
        verifyUrl: "https://ude.my/UC-0ba83af4-e18b-44a5-a405-fd65f551bb30",
      },
      {
        slug: "udemy-vibe-coding",
        proves: "Applied grounding for AI-assisted build workflows",
        title: "Vibe Coding Bootcamp: Build Any App, Game or Website with AI",
        issuer: "Udemy — 4 hours",
        date: "3 October 2025",
        file: `${F}/udemy-vibe-coding.jpg`,
        preview: `${P}/udemy-vibe-coding.jpg`,
        shape: "landscape",
        verifyUrl: "https://ude.my/UC-c6f10d39-a5bd-42b6-a204-e8000bea1ae4",
      },
      {
        slug: "project-management-foundations",
        proves: "Delivery and stakeholder practice behind the manager role",
        title: "Project Management Foundations",
        issuer: "LinkedIn Learning — 3h 32m",
        date: "4 June 2024",
        file: `${F}/project-management-foundations.pdf`,
        preview: `${P}/project-management-foundations.jpg`,
        shape: "landscape",
      },
    ],
  },
  {
    id: "language",
    title: "Language",
    blurb: "",
    items: [
      {
        slug: "efset-english-c1",
        proves: "Independently assessed English at C1 Advanced",
        title: "English — C1 Advanced (63/100)",
        issuer: "EF SET",
        date: "29 March 2026",
        file: `${F}/efset-english-c1.pdf`,
        preview: `${P}/efset-english-c1.jpg`,
        shape: "portrait",
        note: "Reading C2, Writing C1, Listening and Speaking B2.",
        verifyUrl: "https://cert.efset.org/5JQS8h",
      },
    ],
  },
];

export const credentialCount = credentialGroups.reduce(
  (n, g) => n + g.items.length,
  0,
);
