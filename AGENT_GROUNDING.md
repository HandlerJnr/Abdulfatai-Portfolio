# Agent knowledge and grounded replies

`agent-facts.json` holds core facts with category, status and provenance. Update facts here when information changes; this file takes priority over retrieval snippets. Preserve `ongoing` and `unknown` rather than turning missing information into a negative claim. Portfolio and supplementary records supply project-specific evidence.

For each turn the server resolves referential queries using prior visitor messages, not previous model claims. A newly named topic takes priority. Ranked passages and core facts form one bounded evidence set.

The model receives a response contract: compose and check a natural answer, then return either evidence-backed claim segments or a social/general reply. A grounded answer is constructed from reviewed segments. The server rejects nonexistent sources, invalid source references (source text is attached by the server, not copied by the model), unchecked extra answer text and personal claims disguised as social replies. No unvalidated draft is sent to the browser. This uses one provider request, avoiding the extra token usage of an independent second-model review.

Source validation establishes source membership and response coverage; model-supplied quotes, if present, must match the original source. Entailment is assessed by the model; this is not an independent factual oracle and does not guarantee zero hallucinations. Provider rate limits can still interrupt replies. Validation failures are retryable errors, never a fallback to an unchecked answer.

Run local checks with `python3 -m unittest discover -s tests -p 'test_*.py'`. Run actual deployed conversations with `python3 tests/evaluate_grounding.py --base-url URL --case 'academic status'`. The evaluation runner reuses real answers as follow-up history and stops at a provider rate limit. A temporary Vercel access URL can be supplied in `AGENT_PREVIEW_ACCESS_URL`; it must never be committed or printed.

The conversation suite includes ownership follow-ups, academic status, contact actions, unknown details, slang, topic changes, correction of a prior invented team and prompt injection. Phrase assertions are regression signals; inspect the generated answers for meaning as well.

All generation paths share the guide's voice; first-person portfolio copy does not change the assistant's identity. A perspective guard rejects unquoted personal ownership claims such as “I designed”. The client retains supporting evidence IDs with assistant history. Passage IDs are content-stable across retrieval order, so later replies can identify discussed material. Elaboration requests should add a new relevant aspect, not reuse the same sources; a knowledge-boundary response remains valid when no more detail is available. Source novelty is a useful check, not a guarantee of semantic novelty, so the live conversation suite also checks and reviews repeated answers.


`recruiter-knowledge.json` adds project evidence dossiers and recruiter discussion
coverage. Strengths are interpretations tied to exact portfolio decision excerpts;
they are not new claims of research, performance, or personality. The original
portfolio record remains the authority for ownership, scope, delivery and limits.
Recruiter topics describe what evidence is needed; they are not scripted answers.
Missing personal anecdotes are handled with a short specific answer and an offer
to contact Jamiu through the existing cards. No invented interview evidence is
added to make a dossier appear complete.


Concrete recruiter questions carry an answer target: project scope plus the
kind of evidence required. Deadline questions need an actual account of what
was cut or postponed; ordinary product decisions cannot stand in for one.
Results questions need recorded delivery/evaluation/results and their limits,
not generic descriptions of good design practice. Ambiguous project questions
ask for the project instead of adopting an unrelated assistant example.

Provider/validation failure never quotes a keyword-selected portfolio excerpt
as if it answered the question. It offers a bounded, honest contact/recovery
path. This replaces the former extractive fallback that could select unrelated
project descriptions. Regression tests include the deadline/garment-workflow
failure and success-evidence questions without recorded user research.


The server resolves elliptical turns before retrieval: a project selection,
ordinal answer or delegated choice completes the active request rather than
replacing it. Each response carries compact `conversation_context` (the visitor
request and validated subject IDs), which both clients retain with history.
This preserves intent across clarification turns, restored sessions and history
truncation; it never promotes prior assistant prose into factual evidence.
Explicit new questions reset the request, while acknowledgements remain social.
Unsupported superlatives are rejected in grounded claims and repaired privately.

Conversation state also tracks validated collection/document subjects and the
order of offered choices. Pronouns retain the subject while substantive new
questions replace the task; explicit topic changes reset both. Social replies
retain the previous task. This applies to branding, credentials, education,
technical capabilities and project work. Prior assistant answers remain context,
never evidence.

`reference-catalog.json` indexes the existing brand and credential documents.
Automatic references derive from validated citations and catalog URLs, with
specific named documents preferred over their collection. Both portfolio views
render and retain these references, including restored conversations and the
Google-inspired overview-to-chat transition. No model-generated URL is trusted.

The primary completion window is bounded at five seconds; provider recovery
remains one short attempt. A provider outage preserves the resolved subject
and request rather than erasing conversation state.
