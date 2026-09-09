export type BrandDoc = {
  slug: string;
  title: string;
  client: string;
  /** "guideline" — an identity system. "deck" — branded collateral built on one. */
  kind: "guideline" | "deck";
  /** Only stated where the document itself carries a date. */
  year?: string;
  pages: number;
  /** 1-based page used as the card thumbnail. */
  cover: number;
  /** The full document, for download. */
  file: string;
  /** What the document contains — one or two lines, drawn from its pages. */
  note: string;
  /** What a scanning recruiter should take from it. */
  proves?: string;
};

const F = "/brand/files";

/** Page images live at /brand/pages/<slug>/pNN.jpg — see `pageSrc`. */
export const pageSrc = (slug: string, n: number) =>
  `/brand/pages/${slug}/p${String(n).padStart(2, "0")}.jpg`;

export const brandGroups: {
  id: string;
  title: string;
  blurb: string;
  items: BrandDoc[];
}[] = [
  {
    id: "guidelines",
    title: "Brand guidelines",
    blurb:
      "Complete identity systems — purpose and voice through logo construction, colour, type, stationery and imagery — written so a client's team can apply the brand without the designer in the room.",
    items: [
      {
        slug: "shortlet-lagos-brand-guide",
        title: "Shortlet Lagos — Brand Guideline",
        client: "Shortlet Lagos",
        kind: "guideline",
        year: "2025",
        pages: 23,
        cover: 1,
        file: `${F}/shortlet-lagos-brand-guide.pdf`,
        note: "Purpose, vision, values and audience; icon-only and full logo variants with background, one-colour, clearspace and misuse rules; a partnership lock-up; primary and secondary palettes; the Lato type scale; business card and letterhead; and rules for placing the logo on photography.",
        proves: "Identity system for a product I also designed the platform for",
      },
      {
        slug: "female-rise-brand-guide",
        title: "Female Rise — Brand Guideline",
        client: "Female Rise",
        kind: "guideline",
        pages: 33,
        cover: 1,
        file: `${F}/female-rise-brand-guide.pdf`,
        note: "Brand definition — values, voice and a Magician/Explorer archetype; a logo built from the female symbol and a sunrise, with variants, responsiveness and misuse; colour, gradients and Helvetica Now Display typography; business card, letterhead and ID card; a pattern and visual-element language with use cases; imagery direction; and brand giveaways.",
        proves: "A full identity system with applications, not just a logo",
      },
    ],
  },
  {
    id: "collateral",
    title: "Pitch decks & collateral",
    blurb:
      "Investor and partner-facing documents designed on top of those identities — where the brand has to carry a business argument, not just look consistent.",
    items: [
      {
        slug: "female-rise-pitch-deck",
        title: "Female Rise Capital — Investor deck",
        client: "Female Rise Capital",
        kind: "deck",
        year: "2023",
        pages: 11,
        cover: 1,
        file: `${F}/female-rise-pitch-deck.pdf`,
        note: "Problem, solution, market opportunity, business model, competitive advantage, roadmap, projections, the ask and the founder — for a microfinance platform serving women-led SMEs in Africa.",
        proves: "The Female Rise identity applied to a live fundraising document",
      },
      {
        slug: "coworthy-capital-pitch-deck",
        title: "Coworthy Capital — Investor deck",
        client: "Coworthy Capital",
        kind: "deck",
        year: "2025",
        pages: 12,
        cover: 1,
        file: `${F}/coworthy-capital-pitch-deck.pdf`,
        note: "Problem, opportunity, solution, how it works, investment model, member benefits, property criteria, business model, roadmap and team — for a real-estate investment cooperative built around Lagos shortlets.",
        proves: "Presentation design carrying a financial product's full argument",
      },
      {
        slug: "synqit-pitch-deck",
        title: "Synqit — Pitch deck",
        client: "Synqit",
        kind: "deck",
        pages: 9,
        cover: 1,
        file: `${F}/synqit-pitch-deck.pdf`,
        note: "Problem and solution side by side, the MVP release, future features, roadmap, customer-acquisition strategy, revenue outlook and the team — for the Web3 partnership platform whose product design is a case study on this site.",
        proves: "Collateral for a product I also designed end to end",
      },
    ],
  },
];

export const brandDocCount = brandGroups.reduce((n, g) => n + g.items.length, 0);
export const brandPageCount = brandGroups.reduce(
  (n, g) => n + g.items.reduce((m, d) => m + d.pages, 0),
  0,
);
