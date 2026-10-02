# Portfolio agent and colour themes

All 17 pages load `theme.js` before styles to apply the saved Light, Dark or System preference. System follows the device setting. The preference is shared across routes and browser tabs. Artwork and PDF documents retain their original colours.

## Ask Jamiu's agent

The portfolio drawer uses a server-side retrieval-augmented agent. Visitors do not download model weights, WebGPU, Ollama, Transformers, or an inference runtime.

### Architecture

1. The browser sends only the visitor question plus recent conversation turns to `/api/agent`.
2. The Python Vercel Function reads the canonical public records in `portfolio-knowledge.json`.
3. LlamaIndex builds section-level nodes and uses BM25 retrieval over the portfolio.
4. GPT-OSS-120B performs semantic source planning so arbitrary wording, pronouns, comparisons, skepticism and follow-ups are not limited by keyword matching.
5. LlamaIndex retrieves the strongest sections inside the selected projects, including ownership, outcomes, evidence limits and next-validation notes.
6. GPT-OSS-120B writes the grounded answer from those sections.
7. The response returns the exact source IDs used so the drawer displays matching evidence cards.

The preferred inference provider is Groq through `GROQ_API_KEY`. If that key is not configured, the function can use Vercel AI Gateway through `AI_GATEWAY_API_KEY` or the deployment OIDC token. The default model is `openai/gpt-oss-120b`, overrideable with `PORTFOLIO_AGENT_MODEL`.

No credentials are exposed to the browser. Questions are not persisted by the portfolio.

### Grounding

- Broad questions synthesize across multiple sources.
- Specific questions stay focused on the named project or topic.
- Skeptical and weakness questions use explicit evidence limits and validation gaps instead of invented criticism.
- Generic praise must be backed by named portfolio evidence.
- Missing facts are stated as unpublished rather than guessed.

### Fallback

If the hosted model is unavailable, the browser retains a lightweight local portfolio match so the drawer remains usable. That fallback does not control the hosted Agent's understanding.

### Deployment

Python dependencies are pinned in `requirements.txt`. The Agent runs in `api/agent.py` on Vercel's Python runtime with a 60-second function ceiling.
