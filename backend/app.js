require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { UserModel } = require("./model/UserModel");

const JWT_SECRET = process.env.JWT_SECRET || "investra_secret";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ─── JWT Auth Middleware ───────────────────────────────────────────────────────
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Auth Routes ───────────────────────────────────────────────────────────────
app.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const existing = await UserModel.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ name, email, phone, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id, email, name }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ message: "Account created successfully!", token, name });
  } catch (err) {
    res.status(500).json({ error: "Signup failed. Please try again." });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required." });
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });
    const token = jwt.sign({ id: user._id, email, name: user.name }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ message: "Login successful!", token, name: user.name });
  } catch (err) {
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

app.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// ─── Seed Routes (dev only) ────────────────────────────────────────────────────
app.get("/addHoldings", async (req, res) => {
  const tempHoldings = [
    { name: "BHARTIARTL", qty: 2, avg: 538.05, price: 541.15, net: "+0.58%", day: "+2.99%" },
    { name: "HDFCBANK", qty: 2, avg: 1383.4, price: 1522.35, net: "+10.04%", day: "+0.11%" },
    { name: "HINDUNILVR", qty: 1, avg: 2335.85, price: 2417.4, net: "+3.49%", day: "+0.21%" },
    { name: "INFY", qty: 1, avg: 1350.5, price: 1555.45, net: "+15.18%", day: "-1.60%", isLoss: true },
    { name: "ITC", qty: 5, avg: 202.0, price: 207.9, net: "+2.92%", day: "+0.80%" },
    { name: "KPITTECH", qty: 5, avg: 250.3, price: 266.45, net: "+6.45%", day: "+3.54%" },
    { name: "M&M", qty: 2, avg: 809.9, price: 779.8, net: "-3.72%", day: "-0.01%", isLoss: true },
    { name: "RELIANCE", qty: 1, avg: 2193.7, price: 2112.4, net: "-3.71%", day: "+1.44%" },
    { name: "SBIN", qty: 4, avg: 324.35, price: 430.2, net: "+32.63%", day: "-0.34%", isLoss: true },
    { name: "SGBMAY29", qty: 2, avg: 4727.0, price: 4719.0, net: "-0.17%", day: "+0.15%" },
    { name: "TATAPOWER", qty: 5, avg: 104.2, price: 124.15, net: "+19.15%", day: "-0.24%", isLoss: true },
    { name: "TCS", qty: 1, avg: 3041.7, price: 3194.8, net: "+5.03%", day: "-0.25%", isLoss: true },
    { name: "WIPRO", qty: 4, avg: 489.3, price: 577.75, net: "+18.08%", day: "+0.32%" },
  ];
  const saves = tempHoldings.map((item) => new HoldingsModel(item).save());
  await Promise.all(saves);
  res.send("Holdings added! (" + tempHoldings.length + " records)");
});

app.get("/addPositions", async (req, res) => {
  const tempPositions = [
    { product: "CNC", name: "EVEREADY", qty: 2, avg: 316.27, price: 312.35, net: "+0.58%", day: "-1.24%", isLoss: true },
    { product: "CNC", name: "JUBLFOOD", qty: 1, avg: 3124.75, price: 3082.65, net: "+10.04%", day: "-1.35%", isLoss: true },
  ];
  const saves = tempPositions.map((item) => new PositionsModel(item).save());
  await Promise.all(saves);
  res.send("Positions added! (" + tempPositions.length + " records)");
});

// ─── Holdings Routes ───────────────────────────────────────────────────────────
app.get("/allHoldings", async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch holdings" });
  }
});

app.delete("/holding/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await HoldingsModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Holding not found" });
    res.json({ message: "Holding deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete holding" });
  }
});

// ─── Positions Routes ──────────────────────────────────────────────────────────
app.get("/allPositions", async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({});
    res.json(allPositions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch positions" });
  }
});

// ─── Orders Routes ─────────────────────────────────────────────────────────────
app.get("/allOrders", async (req, res) => {
  try {
    const allOrders = await OrdersModel.find({}).sort({ _id: -1 });
    res.json(allOrders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.post("/newOrder", async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;
    if (!name || !qty || !mode) return res.status(400).json({ error: "name, qty and mode are required" });
    const newOrder = new OrdersModel({ name, qty, price: price || 0, mode });
    await newOrder.save();
    res.status(201).json({ message: "Order saved!", order: newOrder });
  } catch (err) {
    res.status(500).json({ error: "Failed to save order" });
  }
});

app.delete("/order/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await OrdersModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete order" });
  }
});

// ─── Live Stock Market API Proxy ───────────────────────────────────────────────
// Uses Alpha Vantage (free tier: 25 req/day with API key, or "demo" for limited symbols)
app.get("/stock/:symbol", async (req, res) => {
  const { symbol } = req.params;
  const apiKey = process.env.ALPHA_VANTAGE_KEY || "demo";
  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
    const response = await axios.get(url, { timeout: 8000 });
    const quote = response.data["Global Quote"];
    if (!quote || !quote["05. price"]) {
      // Fallback: return simulated data if API limit hit
      return res.json({
        symbol,
        price: null,
        change: null,
        changePercent: null,
        note: "API limit reached or symbol not found. Using cached data.",
      });
    }
    res.json({
      symbol: quote["01. symbol"],
      price: parseFloat(quote["05. price"]),
      change: parseFloat(quote["09. change"]),
      changePercent: quote["10. change percent"],
      volume: quote["06. volume"],
      high: parseFloat(quote["03. high"]),
      low: parseFloat(quote["04. low"]),
      open: parseFloat(quote["02. open"]),
      prevClose: parseFloat(quote["08. previous close"]),
    });
  } catch (err) {
    res.status(502).json({ error: "Failed to fetch stock data", symbol });
  }
});

// Batch stock lookup for watchlist symbols
app.post("/stocks/batch", async (req, res) => {
  const { symbols } = req.body; // array of symbols
  if (!symbols || !Array.isArray(symbols)) {
    return res.status(400).json({ error: "symbols array required" });
  }
  const apiKey = process.env.ALPHA_VANTAGE_KEY || "demo";
  const results = {};
  // Alpha Vantage free tier: fetch sequentially to avoid rate limits
  for (const symbol of symbols.slice(0, 5)) {
    try {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
      const response = await axios.get(url, { timeout: 6000 });
      const quote = response.data["Global Quote"];
      if (quote && quote["05. price"]) {
        results[symbol] = {
          price: parseFloat(quote["05. price"]),
          change: parseFloat(quote["09. change"]),
          changePercent: quote["10. change percent"],
        };
      }
    } catch {
      results[symbol] = null;
    }
  }
  res.json(results);
});

module.exports = app;
