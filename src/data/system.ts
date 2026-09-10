export type SystemItem = {
  slug: string;
  title: string;
  /** One line on what the sheet documents — specific, not decorative. */
  note: string;
  /** Bento span. "wide" takes two columns, "tall" two rows, "hero" both. */
  span?: "wide" | "tall" | "hero";
  /** Marks a Figma UI capture rather than an exported frame. */
  source?: "figma";
};

export type SystemGroup = {
  id: string;
  title: string;
  blurb: string;
  items: SystemItem[];
};

/** Every sheet is exported to /public/system/<slug>.jpg. */
export const systemSrc = (slug: string) => `/system/${slug}.jpg`;

export const systemGroups: SystemGroup[] = [
  {
    id: "foundations",
    title: "Foundations",
    blurb:
      "The decisions everything else inherits. Colour is a ramp with semantic roles rather than a set of favourites; type, elevation and iconography are documented so two designers reach the same answer without asking each other.",
    items: [
      {
        slug: "colors",
        title: "Colour",
        note: "Ten-step ramps from 50 to 900 across primary, grey, success, danger, warning and info, plus black and white alpha scales for overlays and dividers.",
        span: "tall",
      },
      {
        slug: "figma-semantic",
        title: "Semantic styles, in the file",
        note: "The published styles as they exist in Figma: Brand Primary, Neutral, Error, Warning and Success as groups, a Body → Header text scale, and Shadow Sm through XL.",
        span: "wide",
        source: "figma",
      },
      {
        slug: "font",
        title: "Typeface",
        note: "Inter, with the reasoning recorded — variable weights, tall x-height, tabular numerals and a slashed zero for interfaces that display figures. Credited to its maker in the sheet.",
        span: "wide",
      },
      {
        slug: "shadow",
        title: "Elevation",
        note: "A shadow scale used as depth hierarchy, so a dropdown, a card and a modal never sit at the same visual altitude.",
        span: "wide",
      },
      {
        slug: "figma-tokens",
        title: "Token naming",
        note: "The colour and effect styles as named tokens — accent, dark and opacity tones on a numeric scale, with elevation as its own set.",
        source: "figma",
      },
      {
        slug: "icons",
        title: "Iconography",
        note: "The icon set organised into semantic categories — navigation, actions, media, design tools — so an icon is chosen by meaning rather than by scrolling.",
        span: "tall",
      },
      {
        slug: "icons-set",
        title: "Icon grid",
        note: "Stroke weight, bounding box and optical sizing held constant across the set.",
        span: "wide",
      },
    ],
  },
  {
    id: "components",
    title: "Components",
    blurb:
      "Each component is documented as a matrix, not a picture: every state crossed with every size. A developer should be able to build from these without asking what the disabled state looks like at the medium size.",
    items: [
      {
        slug: "button-group",
        title: "Button group",
        note: "Default, hover, focus, press, selected and disabled — crossed with giant, large and medium — plus segmented groups from five items down to two, and icon-only variants.",
        span: "hero",
      },
      {
        slug: "input",
        title: "Input",
        note: "Empty, placeholder, focused, filled, success and error, each with label and helper text, so validation is designed rather than bolted on.",
        span: "wide",
      },
      { slug: "dropdown", title: "Dropdown", note: "Closed, open, selected and multi-select states with overflow behaviour.", span: "tall" },
      { slug: "alert", title: "Alert", note: "Success, warning, error and information, with and without actions.", span: "wide" },
      { slug: "card", title: "Card", note: "Content, media and action layouts at each density.", span: "tall" },
      { slug: "list", title: "List", note: "Row anatomy — leading media, text block, trailing action, dividers and states.", span: "tall" },
      { slug: "tab", title: "Tabs", note: "Underline and pill variants, with active, hover and disabled states.", span: "tall" },
      { slug: "navbar-top", title: "Top navigation", note: "Desktop and compact arrangements with search, actions and account.", span: "tall" },
      { slug: "navbar-bottom", title: "Bottom navigation", note: "Mobile bar at three, four and five items, with active and badged states.", span: "wide" },
      { slug: "context-menu", title: "Context menu", note: "Grouped items, dividers, icons, shortcuts, submenus and destructive actions.", span: "tall" },
      { slug: "action-sheet", title: "Action sheet", note: "Mobile sheet with grouped and destructive actions and a cancel affordance.", span: "tall" },
      { slug: "popup", title: "Dialog", note: "Confirmation, form and message dialogs with header, body and action rows.", span: "wide" },
      { slug: "pagination", title: "Pagination", note: "Numbered, truncated and compact variants with first, last and disabled edges.", span: "wide" },
      { slug: "page-control", title: "Page control", note: "Dot indicators at each count, with active and overflow handling.", span: "wide" },
      { slug: "breadcrumbs", title: "Breadcrumbs", note: "Depth, truncation and the current-page state.", span: "wide" },
      { slug: "stepper", title: "Stepper", note: "Incrementer with minimum, maximum and disabled bounds." },
      { slug: "progress-bar", title: "Progress", note: "Determinate and indeterminate, with and without a value label.", span: "wide" },
      { slug: "loader", title: "Loader", note: "Spinner sizes and placement rules for inline and blocking waits.", span: "wide" },
      { slug: "toggle", title: "Toggle", note: "On, off, focused and disabled at each size.", span: "wide" },
      { slug: "radio", title: "Radio", note: "Selected, unselected, focused, disabled and error.", span: "wide" },
      { slug: "avatar", title: "Avatar", note: "Image, initial and fallback at each size, with status and grouped stacks.", span: "wide" },
      { slug: "tooltip", title: "Tooltip", note: "Placement on all four sides with arrow alignment and overflow." },
    ],
  },
  {
    id: "in-product",
    title: "Systems in production",
    blurb:
      "A library only earns its keep once a real product is built on it. These are the systems I set up inside client work — where the constraints were someone else's brand, someone else's engineers and someone else's deadline.",
    items: [
      {
        slug: "bizinc-local-deals",
        title: "Bizinc — Local Deals, documented for front-end development",
        note: "Handoff documentation rather than a component sheet: an overview, the components in play, numbered interaction specs, empty and error states, responsive behaviour across mobile and desktop, and a prototype link. Written so the build matches the design without a meeting.",
        span: "hero",
      },
      {
        slug: "bizinc-sidebar",
        title: "Bizinc — Sidebar documentation",
        note: "V2 sub-components: vertical menu item and sidebar button across default, hover, active and focused, the menu at six through two items, and the collapsed and expanded states of the whole shell.",
        span: "tall",
      },
      {
        slug: "bizinc-style-guide",
        title: "Bizinc — Style guide",
        note: "The product's own foundation: brand colour with hex values, a Poppins scale from H1 to small, and button variants annotated with border weights and fill rules for the developers building them.",
        span: "tall",
      },
      {
        slug: "chalant-components",
        title: "Chalant AI — Navigation components",
        note: "Badge, nav item, logo, button, avatar and sidebar, each with expanded and collapsed variants — and the sidebar resolved three times for the learner, trainer and admin roles from one component.",
        span: "wide",
      },
      {
        slug: "figma-grid",
        title: "Bizinc — Layout grid, applied",
        note: "The same page checked against the published web grid at three widths. Columns are a rule the layout is measured against, not a decoration.",
        span: "wide",
        source: "figma",
      },
      {
        slug: "figma-foundation",
        title: "Shortlet Lagos — Foundation and input states",
        note: "Input documented through placeholder, typing, filled, success and error, alongside the iconography foundation — heroicons, specified at 2px stroke and a 24×24 box with usage rules.",
        span: "wide",
        source: "figma",
      },
    ],
  },
];

export const systemCount = systemGroups.reduce((n, g) => n + g.items.length, 0);
