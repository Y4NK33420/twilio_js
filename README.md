# Stock Market API & AI Phone Agent

This repository contains two integrated systems:

1. **Stock Market REST API** – A FastAPI backend for real-time stock prices, historical data, news sentiment, and market insights.
2. **AI Phone Agent** – A Twilio-based phone system using ElevenLabs and OpenAI to handle live voice conversations.

---

## Stock Market API

### Overview

A RESTful API built with FastAPI to provide:

- Real-time stock prices
- Historical data
- Market summaries
- News sentiment and gainers/losers via Alpha Vantage
- Market/news search via SerpAPI

### Project Structure

```
11Labs_Stock/
├── api/
│   ├── stock/
│   └── search/
├── main.py
├── requirements.txt
├── .env / .env.example
```

### Key Endpoints

- `/api/stock/price`
- `/api/stock/history`
- `/api/stock/market-summary`
- `/api/stock/vantage/news`
- `/api/stock/vantage/market-movers`
- `/api/search`

### Setup

1. Copy `.env.example` to `.env` and add your API keys.
2. Install dependencies: `pip install -r requirements.txt`
3. Start server: `uvicorn main:app --reload`
4. API Docs: `http://localhost:3000/docs`

---

## AI Phone Agent

### Overview

A Node.js-based phone assistant that:

- Handles incoming Twilio calls
- Uses ElevenLabs for voice synthesis
- Uses OpenAI for conversation
- Converts speech-to-text and responds with AI-generated audio

### Architecture

```
Caller → Twilio → Node.js Server → OpenAI / ElevenLabs
```

### Setup

1. Clone: `git clone https://github.com/Y4NK33420/twilio_js`
2. Install: `npm install`
3. Configure `.env` with:
   - TWILIO_ACCOUNT_SID
   - TWILIO_AUTH_TOKEN
   - ELEVENLABS_API_KEY
   - OPENAI_API_KEY
4. Start: `npm start`

---

## Integration Potential

The Phone Agent can optionally call the Stock API to provide live stock information through voice. For example, "What's the price of TSLA?" can trigger a request to `/api/stock/price`.

---

## Repositories

- Stock API: https://github.com/Y4NK33420/11Labs_Stock
- Phone Agent: https://github.com/Y4NK33420/twilio_js
