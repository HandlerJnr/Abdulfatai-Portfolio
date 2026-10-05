# Portfolio conversation and AI practice

- `/ai/` presents documented AI practice and links to Kremor, Settle, Bizinc and references. Proposed work and unvalidated research are labelled.
- The floating bubble opens the existing side dialog. “Open full conversation” continues in `/ask/` in the same tab, carrying the transcript, draft, successful model history, sources and original page context.
- Session storage is browser-tab scoped, expires on restoration after 24 hours, and contains at most 24 visible turns and eight model-history messages. New conversation clears the session and original page context. Storage failures leave chat usable without continuity. Excerpts are never promoted to model history.
- Voice uses browser SpeechRecognition (including the prefixed implementation) and speechSynthesis; it does not require a new paid provider or API secret. Talk mode alone never requests microphone access. Visitors start the microphone explicitly, review/edit the transcript, then send it. Text answers remain visible. Stop, mute, mode changes, navigation and backgrounding stop speech/recording.
- Browser speech recognition support and voice quality vary. Unsupported browsers retain typing and, where available, speech output. The browser may send audio to its recognition service; only transcript text is sent to `/api/agent`. Permission/network/no-speech failures have actionable text states.
- Existing backend validation, retrieval, page context, evidence routing, source visibility and response formatting remain unchanged.

## Verification

`python3 -m unittest discover -s tests` and `node tests/test-agent-input.cjs` cover input guards and routing.

Serve the repository on localhost:4187, then run `tests/test-agent-experience.cjs` with Playwright available. `PLAYWRIGHT_PATH` can point to a bundled package; `CHROME_PATH` optionally selects an installed browser. Integration fixtures simulate model replies and speech, checking handoff, drafts, source cards, original-page context, voice modes/transcripts/mute/permission denial, unsupported-browser fallback, reset and desktop/mobile light/dark layout. They do not verify physical microphone capture or a browser's remote recognition service.

## Homepage introduction and centred welcome

The homepage form beneath the wordmark stores a short-lived pending prompt and opens `/ask/`. The full page consumes it once, removes the navigation parameters and sends it through the same guarded agent flow. Reloads restore the answer without resending. When session storage is unavailable, a query-string fallback is consumed and immediately removed. Existing side-panel expansion continues its prior thread; a homepage introduction starts a fresh exchange with homepage context. A fresh page displays the centred welcome and composer; conversation and reset update both states.

`tests/test-home-agent.cjs` verifies prompt handoff, exactly-once submission, reload safety, storage-blocked fallback, input guards and light/dark layouts at desktop, 390px and 320px.
