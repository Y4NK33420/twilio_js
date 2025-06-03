# Stock Market API & AI Phone Agent

This project integrates two systems:

1. **Stock Market REST API** – A FastAPI backend for real-time stock prices, historical data, and market news.
2. **AI Phone Agent** – A Node.js-based AI phone assistant using Twilio, ElevenLabs, and OpenAI to handle live voice conversations.

---

## 📈 Stock Market API

A FastAPI-based REST API for fetching stock data, financial news, and performing market-related searches.

### 🔧 Project Structure

11Labs_Stock/
├── api/
│ ├── stock/
│ │ ├── init.py
│ │ ├── price.py
│ │ ├── history.py
│ │ ├── market_summary.py
│ │ └── vantage.py
│ └── search/
│ ├── init.py
│ └── search.py
├── main.py
├── requirements.txt
├── .env
└── .env.example

markdown
Copy
Edit

### 💡 Core Components

#### `main.py`
- Initializes the FastAPI app
- Sets up CORS middleware
- Mounts routers
- Hosts Swagger docs at `/docs`

#### `api/stock/`
- **price.py**: Real-time price endpoints
- **history.py**: Historical time series data
- **market_summary.py**: Market indices and summary
- **vantage.py**: Alpha Vantage for news and market movers

#### `api/search/`
- Market/news search using SerpAPI

### 🔁 API Flow

Client Request → FastAPI Router → Handler Module → External API → JSON Response

markdown
Copy
Edit

### 🚀 Endpoints

- `GET /api/stock/price` – Real-time prices
- `GET /api/stock/history` – Historical time series
- `GET /api/stock/market-summary` – Market overview
- `GET /api/stock/vantage/news` – News via Alpha Vantage
- `GET /api/stock/vantage/market-movers` – Gainers/losers
- `GET /api/search` – Market or news search

### ⚙️ Setup Instructions

1. Copy `.env.example` → `.env`
2. Add your keys:
ALPHA_VANTAGE_API_KEY=your_key
SERPAPI_API_KEY=your_key

arduino
Copy
Edit

3. Install and run:
```bash
pip install -r requirements.txt
uvicorn main:app --reload
Visit API docs: http://localhost:3000/docs

📞 AI Phone Agent
A voice-enabled AI assistant that receives phone calls via Twilio and uses OpenAI and ElevenLabs to have live voice conversations.

🧠 Features
Receives and processes incoming phone calls

Converts voice → text using Twilio

Sends text → OpenAI for response

Uses ElevenLabs to generate AI voice

Optionally calls the Stock API for live data (e.g., “What’s the price of TSLA?”)

⚙️ Architecture
arduino
Copy
Edit
Caller → Twilio → Node.js Server → OpenAI / ElevenLabs → AI Voice Reply
📂 Repo & Setup
Clone the agent from:

👉 twilio_js GitHub Repository

Then:

Install dependencies:

bash
Copy
Edit
npm install
Configure .env:

ini
Copy
Edit
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
OPENAI_API_KEY=...
ELEVENLABS_API_KEY=...
Start the server:

bash
Copy
Edit
npm start
🔗 Integration Potential
The AI Phone Agent can call the Stock Market API endpoints during a voice conversation to respond with live market data. For example:

User: “What's the price of AAPL today?”

AI: (fetches data from /api/stock/price and replies)

📚 Related Repositories
🔗 Stock API: 11Labs_Stock

🔗 Phone Agent: twilio_js

🛠️ Requirements
Python 3.8+ (for API)

Node.js 16+ (for phone agent)

Accounts for:

Alpha Vantage

SerpAPI

OpenAI

ElevenLabs

Twilio