# Portfolio conversation

The homepage field submits to the side modal without changing pages. Floating chat and AI Practice buttons open the same modal. Session history and source cards are restored within the current browser tab; reload never resends a question. Page awareness uses the visitor’s current portfolio page. Frontend and backend validation prevent trivial inputs from reaching the model. The dedicated chat page and its voice UI have been removed.

Verify with Python unit tests, test-agent-input.cjs and test-home-agent.cjs (serve on port 4187, supply PLAYWRIGHT_PATH and CHROME_PATH).
