# Portfolio agent and colour themes

All 17 pages load theme.js before styles to apply the saved Light, Dark or System preference. System follows the device setting. The preference is shared across routes and browser tabs. Artwork and PDF documents retain their original colours.

## Ask Jamiu's agent

The portfolio drawer is now a hosted AI agent grounded only in the public records inside `portfolio-knowledge.json`. Visitors do not download a model, WebGPU runtime or local inference package. The browser performs lightweight retrieval against the public portfolio index, sends only the question plus up to three relevant public excerpts to `/api/agent`, and renders the model response with links back to the evidence.

The Vercel function uses Vercel AI Gateway. On Vercel it authenticates with `VERCEL_OIDC_TOKEN` when OIDC is enabled, so no provider key is exposed to visitors or committed to GitHub. `AI_GATEWAY_API_KEY` is accepted as a server-side fallback. The default model is `openai/gpt-5.4-mini`; set `PORTFOLIO_AGENT_MODEL` in Vercel only if a different Gateway model is preferred.

Questions are not persisted by this site. The agent is instructed to use only supplied published evidence and not to invent private details, availability, pricing, visa information, metrics or unpublished work. If the hosted model is unavailable, the drawer immediately falls back to the existing deterministic portfolio retrieval so the visitor can keep exploring instead of hitting an error state.

Update the public knowledge index when case studies, CV dates or credentials change. Do not add private information. Card URLs and images must point to published local files.

## Checks

- JavaScript syntax for the browser agent and Vercel function.
- Local references on all 17 routes.
- Knowledge source and thumbnail existence.
- Light/dark switching and persistence.
- 390px layout.
- Project, fintech, branding, design-system and experience questions.
- Hosted response and server-unavailable fallback.
- No-match response.
- Escape closing and focus restoration.
