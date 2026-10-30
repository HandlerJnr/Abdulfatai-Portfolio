# Jamiu Abdulfatai — Product Designer

Personal portfolio: https://jamiudesigns.vercel.app/.

This checkout serves the approved static portfolio from its root.
The separate `academic-proofreader/` information pages are maintained independently.

## Traffic analytics

`portfolio-analytics.js` loads Vercel Web Analytics on Vercel-hosted deployments.
The official tracker records initial page loads, `history.pushState` section
changes and Back/Forward navigation automatically. Do not add a second manual
page-view listener: it would double-count visits. Local and ChatGPT previews
are excluded. The analytics dashboard must remain enabled in the Vercel project.
No custom identity, form values or project-modal events are collected.

The previous portfolio is preserved in the Git archive branch.

## Portfolio runtime

`portfolio-runtime.js` owns theme persistence, the Brighton clock, portrait rotation,
and accessible project dialogs without an exported site-builder runtime. Layout
styles live in `portfolio-base.css`; project-specific components keep their own
stylesheets. The asterisk favicon and chat icons are intentional branding.

Run `python3 tests/test_template_cleanup.py` for asset, metadata and residue checks.
The DOM interaction test (`tests/test_portfolio_runtime.cjs`) additionally needs
`linkedom` available to Node (for example through a temporary `NODE_PATH`).
