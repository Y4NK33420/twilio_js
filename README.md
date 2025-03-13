# Twilio-ElevenLabs AI Phone Agent

An AI phone agent that handles incoming calls using Twilio, ElevenLabs, and OpenAI.

## How It Works

The system follows this flow for handling incoming calls:

1. **Call Reception**: When a call comes in, Twilio forwards it to the `/incoming` webhook
2. **Initial Greeting**: The system plays a welcome message using ElevenLabs voice synthesis
3. **Conversation Loop**:
   - User speaks and their audio is captured
   - Speech is converted to text
   - OpenAI processes the text and generates a response
   - Response is converted to speech using ElevenLabs
   - Audio is played back to the caller
4. **Call End**: The conversation continues until the user hangs up

### System Architecture

```
┌─────────┐    ┌──────────┐    ┌───────────┐
│  Caller │───>│  Twilio  │───>│  Server   │
└─────────┘    └──────────┘    └───────────┘
                                     │
                              ┌──────┴──────┐
                              │             │
                         ┌────┴───┐   ┌─────┴────┐
                         │ OpenAI │   │ElevenLabs│
                         └────────┘   └──────────┘
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your credentials:
- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN
- ELEVENLABS_API_KEY
- OPENAI_API_KEY
- PORT (optional, defaults to 3000)

3. Start the server:
```bash
npm start
```

## Features

- Handles incoming calls with AI-powered responses
- Uses ElevenLabs for natural voice synthesis
- OpenAI integration for intelligent conversation


The corresponding webhook server code for 11Labs Agent can be found at https://github.com/Y4NK33420/11Labs_Stock
