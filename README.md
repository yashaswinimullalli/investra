# Investra

A full-stack stock trading platform built with React, Node.js, Express, and MongoDB.

🌐 [Live Demo](https://investra.vercel.app) · 🔗 [Backend API](https://investra-f0c2.onrender.com/health)


## Features

- **Auth** — Signup / Login with JWT
- **Dashboard** — Portfolio summary with P&L and charts
- **Holdings** — Avg cost, LTP, and net P&L per stock
- **Orders** — Place, view, and delete buy/sell orders
- **Positions** — Open intraday/CNC positions
- **Watchlist** — Monitor stocks with live Buy/Sell actions
- **Funds** — Available margin and cash balance
- **Live Prices** — NIFTY 50 & SENSEX via Alpha Vantage API


## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, React Router v7, Axios |
| UI | Material UI, Chart.js |
| Backend | Node.js, Express 5, Mongoose |
| Database | MongoDB Atlas |
| Auth | JWT + bcryptjs |
| Market Data | Alpha Vantage API |
| Hosting | Vercel (frontend) + Render (backend) |


## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone
```bash
git clone https://github.com/yashaswinimullalli/investra.git
cd investra
```

### 2. Backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=3002
ALPHA_VANTAGE_KEY=your_alpha_vantage_key
```

```bash
npm start   # http://localhost:3002
```

### 3. Frontend
```bash
cd frontend
npm install
npm start   # http://localhost:3000
```

---

## API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/signup` | Register user |
| POST | `/login` | Login, returns JWT |
| GET | `/me` | Current user *(auth required)* |

### Data
| Method | Endpoint | Description |
|---|---|---|
| GET | `/allHoldings` | All holdings |
| GET | `/allPositions` | All positions |
| GET | `/allOrders` | All orders |
| POST | `/newOrder` | Place an order |
| DELETE | `/order/:id` | Delete order *(auth required)* |
| DELETE | `/holding/:id` | Delete holding *(auth required)* |

### Market
| Method | Endpoint | Description |
|---|---|---|
| GET | `/stock/:symbol` | Live price for a symbol |
| POST | `/stocks/batch` | Batch price lookup |
| GET | `/health` | Health check |



## Routes

| URL | Page |
|---|---|
| `/` | Landing |
| `/login` | Login |
| `/signup` | Signup |
| `/dashboard` | Portfolio *(protected)* |
| `/dashboard/holdings` | Holdings *(protected)* |
| `/dashboard/orders` | Orders *(protected)* |
| `/dashboard/positions` | Positions *(protected)* |
| `/dashboard/funds` | Funds *(protected)* |

> Protected routes redirect to `/login` if no JWT is found.


## Tests

```bash
cd backend
npm test   # Jest + Supertest
```
