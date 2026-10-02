# Portfolio search and colour themes

All 17 pages load theme.js before styles to apply the saved Light, Dark or System preference. System follows the device setting. The preference is shared across routes and browser tabs. Artwork and PDF documents retain their original colours.

The Ask about Jamiu drawer is a local, keyword-based portfolio search, not generative AI. No API key, external AI request or question storage is used. It retrieves excerpts and thumbnail cards from portfolio-knowledge.json. Update that public index when case studies, CV dates or credentials change; do not add private information. Card URLs and images must point to published local files.

Checks: JavaScript syntax; local references on all 17 routes; knowledge source and thumbnail existence; browser checks for light/dark switching and persistence, 390px layout, project/branding queries, no-match response, Escape closing and focus restoration.
