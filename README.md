# 📊 Stock Market API & 📵 AI Phone Agent

This project integrates two components to create a voice-enabled AI assistant that provides real-time stock data:

1. **Stock Market REST API** – A FastAPI-based backend serving stock prices, historical data, and financial news.
2. **AI Phone Agent** – A Node.js-based AI phone assistant that uses Twilio, OpenAI, and ElevenLabs to converse with users over the phone and access live stock data.

---

## 📈 Stock Market API

A RESTful API built with **FastAPI** to serve stock-related data and news in real-time.

### 📁 Project Structure

```
11Labs_Stock/
├── api/
│   ├── stock/
│   │   ├── __init__.py         # Router setup
│   │   ├── price.py            # Real-time stock prices
│   │   ├── history.py          # Historical time series
│   │   ├── market_summary.py   # Market indices and summary
│   │   └── vantage.py          # Alpha Vantage integration
│   └── search/
│       ├── __init__.py         # Search router
│       └── search.py           # SerpAPI search
├── main.py                     # FastAPI app entry point
├── requirements.txt            # Python dependencies
├── .env                        # API keys and config
└── .env.example                # Sample .env file
```

### ⚙️ Core Modules

* \`\`: Sets up the FastAPI app, mounts routers, adds CORS, serves Swagger docs at `/docs`.
* **Stock API** (`api/stock/`):

  * `price.py`: Real-time prices
  * `history.py`: Historical data
  * `market_summary.py`: Market indices and overview
  * `vantage.py`: Alpha Vantage news, movers, sentiment
* **Search API** (`api/search/`): General market and news search via SerpAPI

### 🔁 API Workflow

```
Client Request → FastAPI Router → Module Handler → External API → JSON Response
```

### 🚀 Endpoints

* `GET /api/stock/price` – Real-time stock prices
* `GET /api/stock/history` – Historical price data
* `GET /api/stock/market-summary` – Major indices and summaries
* `GET /api/stock/vantage/news` – News from Alpha Vantage
* `GET /api/stock/vantage/market-movers` – Gainers and losers
* `GET /api/search` – Market/news search via SerpAPI

### 🛠️ Setup Instructions

1. Copy `.env.example` to `.env`

2. Add your API keys:

   ```env
   ALPHA_VANTAGE_API_KEY=your_key
   SERPAPI_API_KEY=your_key
   ```

3. Install and run:

   ```bash
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

4. Visit API docs:
   [http://localhost:3000/docs](http://localhost:3000/docs)

---

## 📵 AI Phone Agent

A voice-enabled AI assistant that interacts with users through phone calls, providing real-time answers using OpenAI, ElevenLabs, and optional stock data from the REST API.

### 🧠 Features

* Receives phone calls using **Twilio**
* Converts voice → text
* Sends text → **OpenAI** for generating replies
* Converts reply text → voice using **ElevenLabs**
* Fetches stock data from the FastAPI backend

**Example conversation:**

```
User: What's the price of TSLA today?
AI: (calls /api/stock/price → responds with real-time price)
```

### ⚙️ Architecture

```
Caller → Twilio → Node.js Server → OpenAI / ElevenLabs → Voice Reply
```

### 📂 Repository & Setup

The AI agent lives in the [twilio\_js GitHub Repository](https://github.com/Y4NK33420/twilio_js)

#### Setup

1. Clone the repo:

   ```bash
   git clone https://github.com/Y4NK33420/twilio_js.git
   cd twilio_js
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure `.env`:

   ```env
   TWILIO_ACCOUNT_SID=your_sid
   TWILIO_AUTH_TOKEN=your_token
   OPENAI_API_KEY=your_key
   ELEVENLABS_API_KEY=your_key
   ```

4. Start the server:

   ```bash
   npm start
   ```

---

## 🔗 Integration Potential

The phone agent and stock API are designed to integrate seamlessly:

* The AI assistant can **query the API during calls** to provide real-time market information.
* This allows natural, human-like interaction with stock data.

---

## ✅ Requirements

| Component    | Version / Requirement                              |
| ------------ | -------------------------------------------------- |
| Python       | 3.8+                                               |
| Node.js      | 16+                                                |
| Accounts/API | Alpha Vantage, SerpAPI, OpenAI, ElevenLabs, Twilio |

---

## 📚 Related Repositories

* 📦 Stock API: [11Labs\_Stock](https://github.com/Y4NK33420/11Labs_Stock)
* 📵 AI Phone Agent: [twilio\_js](https://github.com/Y4NK33420/twilio_js)
