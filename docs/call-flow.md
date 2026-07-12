# Twilio ↔ Server ↔ ElevenLabs Agent Call Flow (First-Time Deep Dive)

This document explains the complete runtime path of an inbound phone call in this repository, from the first ring to audio being played back to the caller.

It is based on:

- `/home/runner/work/twilio_js/twilio_js/index.js`
- `/home/runner/work/twilio_js/twilio_js/inbound-calls.js`

---

## 1) Components and responsibility

1. **Caller (PSTN/phone network)**
   - The human on a phone call.
2. **Twilio Voice**
   - Receives the phone call and requests call instructions (TwiML) from this server.
   - Streams caller audio to this server over WebSocket.
   - Plays audio back to caller from media sent by this server.
3. **This Node/Fastify server**
   - Exposes webhook and WebSocket endpoints.
   - Bridges real-time audio/events between Twilio and ElevenLabs Conversational AI.
4. **ElevenLabs Conversational AI**
   - Receives caller audio chunks.
   - Runs the configured agent.
   - Returns synthesized response audio and control events.

---

## 2) Environment variables and startup-time auth checks

At startup, the app loads `.env` (`dotenv.config()` in `index.js`).

`registerInboundRoutes()` validates required credentials:

- `ELEVENLABS_API_KEY`
- `ELEVENLABS_AGENT_ID`

If either is missing, startup fails immediately with:
- `Missing ELEVENLABS_API_KEY or ELEVENLABS_AGENT_ID`

### Why this exists

- Without `ELEVENLABS_API_KEY`, the server cannot authenticate when asking ElevenLabs for a signed conversation URL.
- Without `ELEVENLABS_AGENT_ID`, the server cannot select which ElevenLabs agent to run.

---

## 3) Entry point routes and connection surfaces

### HTTP routes

- `GET /` in `index.js`
  - Returns `index.html` for a simple health/landing page.

- `ALL /incoming-call-eleven` in `inbound-calls.js`
  - Twilio webhook target for inbound voice calls.
  - Returns TwiML that tells Twilio to open a media stream to this server.

### WebSocket route

- `GET /media-stream` (WebSocket) in `inbound-calls.js`
  - Accepts Twilio’s bidirectional media stream.
  - Also opens a second WebSocket from this server to ElevenLabs.
  - Acts as the bridge between both streams.

---

## 4) Full sequence: call to agent and back to user

## Stage A — Caller dials Twilio number

1. Caller places call to your Twilio number.
2. Twilio triggers webhook to this server at `/incoming-call-eleven`.

Data sent by Twilio (high-level):
- Standard webhook call metadata (call identifiers, from/to, etc.).

Why:
- Twilio needs runtime instructions for what to do with this call.

## Stage B — Server returns TwiML instructions

`/incoming-call-eleven` responds with:

```xml
<Response>
  <Connect>
    <Stream url="wss://{host}/media-stream" />
  </Connect>
</Response>
```

Connection detail:
- `wss://` (TLS WebSocket), host derived from `request.headers.host`.

Why:
- Twilio must know where to send and receive real-time audio for this call.

## Stage C — Twilio opens media WebSocket to `/media-stream`

When Twilio connects:
- Server logs `Twilio connected to media stream.`
- `streamSid` placeholder is initialized.

Why:
- `streamSid` is required in outbound media events sent back to the exact Twilio call stream.

## Stage D — Server authenticates with ElevenLabs and opens second WebSocket

Before bridging audio, server executes `getSignedUrl()`:

HTTP request:
- `GET https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id={ELEVENLABS_AGENT_ID}`
- Header: `xi-api-key: {ELEVENLABS_API_KEY}`

Response expectation:
- JSON containing `signed_url`.

Then server opens:
- `new WebSocket(signed_url)` to ElevenLabs.

Why:
- ElevenLabs signed URL is short-lived auth material that authorizes a realtime conversation with a specific agent.
- Keeps long-term API key server-side only.

## Stage E — Twilio → Server event flow

Twilio sends JSON events over `/media-stream`.

### 1. `start`

Server behavior:
- Reads `data.streamSid`.
- Stores it for future outbound audio packets.

Why:
- Every return media frame to Twilio must include `streamSid`.

### 2. `media`

Twilio payload (relevant part):
- `data.media.payload` (base64 encoded caller audio chunk).

Server converts and forwards to ElevenLabs as:

```json
{
  "user_audio_chunk": "<base64 audio>"
}
```

Why:
- ElevenLabs expects user audio in `user_audio_chunk`.
- Enables incremental low-latency streaming to the agent.

### 3. `stop`

Server behavior:
- Closes ElevenLabs WebSocket.

Why:
- Call ended; conversation session should be terminated cleanly.

## Stage F — ElevenLabs → Server event flow

Server listens for JSON messages from ElevenLabs.

### 1. `conversation_initiation_metadata`

Server behavior:
- Logs event.

Why:
- Signifies conversation setup metadata has arrived.

### 2. `audio`

ElevenLabs payload (relevant):
- `message.audio_event.audio_base_64`

Server wraps and sends to Twilio:

```json
{
  "event": "media",
  "streamSid": "<twilio stream sid>",
  "media": {
    "payload": "<base64 audio>"
  }
}
```

Why:
- Twilio plays `media.payload` audio back to caller on the live call.

### 3. `interruption`

Server sends to Twilio:

```json
{
  "event": "clear",
  "streamSid": "<twilio stream sid>"
}
```

Why:
- Tells Twilio to clear buffered playback when agent/turn interruption is needed.

### 4. `ping`

If `message.ping_event.event_id` exists, server responds to ElevenLabs:

```json
{
  "type": "pong",
  "event_id": "<same event id>"
}
```

Why:
- Keeps websocket session healthy / confirms liveness.

## Stage G — Connection teardown and error handling

- If Twilio socket closes or errors: server closes ElevenLabs socket.
- If ElevenLabs init or processing fails: server closes both connections.
- If unhandled promise rejection occurs at process level, app exits.

Why:
- Avoids orphaned realtime sessions and stale audio bridges.

---

## 5) Authentication and security map by stage

### Twilio → `/incoming-call-eleven`

Current state:
- Endpoint accepts requests and returns TwiML.
- No explicit Twilio signature verification is implemented in current code.

Implication:
- The route relies on deployment/network controls today, not app-level request signature verification.

### Server → ElevenLabs signed URL endpoint

Auth used:
- `xi-api-key` header with `ELEVENLABS_API_KEY`.
- Agent scoping via `agent_id` query parameter.

Why:
- Authenticates your backend and requests a signed session URL bound to the target agent.

### Server → ElevenLabs conversational WebSocket

Auth used:
- Authorization is embedded in the signed URL itself.

Why:
- Realtime socket auth is delegated to the short-lived signed URL instead of sending raw API key over websocket frames.

### Twilio media stream WebSocket

Connection used:
- `wss://{host}/media-stream`.

Why:
- TLS encryption for audio/event transit between Twilio and your server.

---

## 6) Data inventory: what is sent and why

## Twilio to server

- Webhook metadata on call arrival (call context).
- WebSocket control events (`start`, `stop`) for lifecycle.
- Base64 audio chunks in `media.payload` for caller speech.

Purpose:
- Provide call state and caller audio input for AI inference.

## Server to ElevenLabs

- Signed URL request with API key + agent ID (session bootstrap).
- `user_audio_chunk` base64 frames (caller speech).
- `pong` heartbeats.

Purpose:
- Start authenticated conversation and stream caller speech in real time.

## ElevenLabs to server

- Metadata events for conversation init.
- Agent-generated TTS audio in `audio_event.audio_base_64`.
- Interruption and ping control events.

Purpose:
- Deliver synthesized response and session control signals.

## Server to Twilio

- TwiML `<Connect><Stream .../></Connect>` to start stream.
- `media` events containing response audio.
- `clear` events for playback interruption handling.

Purpose:
- Instruct Twilio and return AI voice audio to the caller.

---

## 7) Practical end-to-end summary (single sentence)

The server acts as a real-time audio bridge: Twilio streams caller audio in, the server forwards chunks to an authenticated ElevenLabs agent session, and the agent’s response audio is streamed back through Twilio to the caller.
