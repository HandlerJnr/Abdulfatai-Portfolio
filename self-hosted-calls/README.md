# Self-hosted portfolio walkthrough calls — preview

No third-party video service, SDK, signalling API, analytics, public STUN service or recording is used. The Python standard-library server handles requests and exchanges SDP/ICE messages. WebRTC sends audio/video between the two browsers. SQLite stores short-lived requests and connection messages on the host machine.

## Run locally

Requires Python 3.10+ and a current browser. No pip/npm installation is needed.

From the repository root:

```sh
python3 self-hosted-calls/server.py --site-root .
```

Open http://localhost:8765/calls/host in your host browser and http://localhost:8765/calls/demo in a separate browser profile/private window as the visitor. The server prints the path to your generated host-password file, never the password. Open that file locally and enter it in the host sign-in form. Keep the password private.

The default password file is `~/.portfolio-calls/host-password`, created with owner-only permissions. Use `--state-dir /an/absolute/private/path` to change it. It must never be committed or placed beneath a publicly served web root.

1. Sign in as host and choose **Go available**. Keep this dashboard open.
2. Optionally choose **Enable request notifications**. This uses browser desktop notifications while the dashboard runs; it does not send SMS, email, or background push notifications.
3. As visitor, choose **Request a live walkthrough**, enter a name and a reason, and submit. No camera or microphone is requested yet.
4. As host, click **Accept** and grant camera/microphone permission. A denial leaves the request unaccepted.
5. As visitor, choose **Join call**, then grant camera/microphone permission.
6. Test bidirectional audio and video, mute, camera off, minimising, page browsing, and end call.

Each accepted call has a 20-minute maximum; waiting requests expire after 90 seconds. Only one call may be accepted at a time. Closing a participant tab sends an end request when the browser allows it. If a tab crashes, the connection closes; the accepted server reservation expires at its deadline. The dashboard becomes unavailable after losing its heartbeat for 20 seconds.

## Connect the Vercel preview to your server

The server must be reachable by both browsers. `localhost` on another person's device points to their own device, not yours.

Run this server on a machine you control with an HTTPS hostname and a valid certificate. The server supports `--certfile` and `--keyfile`, or you can put your own existing TLS reverse proxy in front of it. Bind explicitly with `--bind 0.0.0.0` only when you intend to expose the service. Do not expose the default plain-HTTP test service to the public internet.

Allow the exact preview origin using `--origin https://YOUR-PREVIEW-HOST`, and set the **preview branch's** `call-config.json` to:

```json
{"signalUrl":"https://YOUR-OWN-SIGNALLING-HOST"}
```

No secret belongs in that file. The host dashboard lives at `https://YOUR-OWN-SIGNALLING-HOST/calls/host`. Host login stays on that origin. Visitor polling uses a per-request capability rather than the host cookie.

The Git/Vercel preview deliberately shows **unavailable** until the host server is reachable and its dashboard is available. It does not fake an accepted call or substitute a provider room.

## Direct network connectivity

No external ICE servers are configured by default. Direct calls can work on localhost, a LAN, or compatible public networks. They are not guaranteed across arbitrary NAT/firewall combinations.

An optional basic IPv4 STUN binding service is included:

```sh
python3 self-hosted-calls/stun.py --bind YOUR-SERVER-IP --port 3478
python3 self-hosted-calls/server.py --stun-url stun:YOUR-OWN-HOST:3478
```

This must be your own reachable server. STUN discovers addresses; it does not relay media. There is no TURN relay in this preview. Restrictive networks may fail; the UI reports the failure and lets the visitor end the call or email you. Existing internet and bandwidth are still required.

## Privacy and operational limits

- No audio/video recording or transcription.
- Request text, SDP and candidates are private to the relevant authenticated host/visitor. Candidate addresses can disclose network information to the other participant as part of WebRTC.
- SQLite and password files are owner-readable only. Records older than one hour are removed during requests and by periodic cleanup while the server runs.
- State must be on persistent local storage. Do not run this SQLite service as a stateless Vercel function or store its database in a public static directory.
- The host page requires a password, uses an HttpOnly/SameSite cookie, restricts origins, and rate-limits sign-in and call requests. There is no public host token in URLs.
- The server is a preview implementation. Public internet exposure, TLS configuration, independent security review, and real two-network media tests remain deployment prerequisites.

## Validation

```sh
python3 -m unittest discover -s tests -p 'test_calls.py' -v
node tests/test-peer.cjs
```

Tests exercise the actual local HTTP server for request/accept/signal/end, rejection, expiry, authorization, CORS, single-call exclusion, limits, private-file routing and STUN encoding. The client test uses a peer mock to verify permission gating, candidate queuing and cleanup. These do not establish a successful media call between two physical devices.

Chrome Beta was found in the implementation session, but isolated browser launch failed, so a complete real-browser media test has not been claimed. Do not publish this feature to production before that acceptance test passes.
