require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const path = require("path");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { UserModel } = require("./model/UserModel");

const JWT_SECRET = process.env.JWT_SECRET || "investra_secret";
const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

app.use(cors());
app.use(bodyParser.json());

// ─── JWT Auth Middleware ───────────────────────────────────────────────────────
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      error: "Invalid or expired token.",
    });
  }
};

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// ─── Auth Routes ───────────────────────────────────────────────────────────────
app.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        error: "All fields are required.",
      });
    }

    const existing = await UserModel.findOne({ email });

    if (existing) {
      return res.status(400).json({
        error: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      {
        id: newUser._id,
        email,
        name,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Account created successfully!",
      token,
      name,
    });
  } catch (err) {
    res.status(500).json({
      error: "Signup failed. Please try again.",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password required.",
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful!",
      token,
      name: user.name,
    });
  } catch (err) {
    res.status(500).json({
      error: "Login failed. Please try again.",
    });
  }
});

app.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch user profile",
    });
  }
});

// ─── Seed Routes (Dev Only) ───────────────────────────────────────────────────
app.get("/addHoldings", async (req, res) => {
  try {
    const tempHoldings = [
      {
        name: "BHARTIARTL",
        qty: 2,
        avg: 538.05,
        price: 541.15,
        net: "+0.58%",
        day: "+2.99%",
      },
    ];

    const saves = tempHoldings.map(
      (item) => new HoldingsModel(item).save()
    );

    await Promise.all(saves);

    res.send(
      "Holdings added! (" + tempHoldings.length + " records)"
    );
  } catch (err) {
    res.status(500).json({
      error: "Failed to add holdings",
    });
  }
});

app.get("/addPositions", async (req, res) => {
  try {
    const tempPositions = [
      {
        product: "CNC",
        name: "EVEREADY",
        qty: 2,
        avg: 316.27,
        price: 312.35,
        net: "+0.58%",
        day: "-1.24%",
        isLoss: true,
      },
    ];

    const saves = tempPositions.map(
      (item) => new PositionsModel(item).save()
    );

    await Promise.all(saves);

    res.send(
      "Positions added! (" + tempPositions.length + " records)"
    );
  } catch (err) {
    res.status(500).json({
      error: "Failed to add positions",
    });
  }
});

// ─── Holdings Routes ───────────────────────────────────────────────────────────
app.get("/allHoldings", async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch holdings",
    });
  }
});

app.delete("/holding/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await HoldingsModel.findByIdAndDelete(
      req.params.id
    );

    if (!deleted) {
      return res.status(404).json({
        error: "Holding not found",
      });
    }

    res.json({
      message: "Holding deleted",
      id: req.params.id,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to delete holding",
    });
  }
});

// ─── Positions Routes ──────────────────────────────────────────────────────────
app.get("/allPositions", async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({});
    res.json(allPositions);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch positions",
    });
  }
});

// ─── Orders Routes ─────────────────────────────────────────────────────────────
app.get("/allOrders", async (req, res) => {
  try {
    const allOrders = await OrdersModel.find({}).sort({
      _id: -1,
    });

    res.json(allOrders);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch orders",
    });
  }
});

app.post("/newOrder", async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;

    if (!name || !qty || !mode) {
      return res.status(400).json({
        error: "name, qty and mode are required",
      });
    }

    const newOrder = new OrdersModel({
      name,
      qty,
      price: price || 0,
      mode,
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order saved!",
      order: newOrder,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to save order",
    });
  }
});

app.delete("/order/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await OrdersModel.findByIdAndDelete(
      req.params.id
    );

    if (!deleted) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    res.json({
      message: "Order deleted",
      id: req.params.id,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to delete order",
    });
  }
});

// ─── Live Stock Market API ────────────────────────────────────────────────────
app.get("/stock/:symbol", async (req, res) => {
  const { symbol } = req.params;
  const apiKey = process.env.ALPHA_VANTAGE_KEY || "demo";

  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

    const response = await axios.get(url, {
      timeout: 8000,
    });

    const quote = response.data["Global Quote"];

    if (!quote || !quote["05. price"]) {
      return res.json({
        symbol,
        price: null,
        change: null,
        changePercent: null,
        note: "API limit reached or symbol not found.",
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
      prevClose: parseFloat(
        quote["08. previous close"]
      ),
    });
  } catch (err) {
    res.status(502).json({
      error: "Failed to fetch stock data",
      symbol,
    });
  }
});

app.post("/stocks/batch", async (req, res) => {
  const { symbols } = req.body;

  if (!symbols || !Array.isArray(symbols)) {
    return res.status(400).json({
      error: "symbols array required",
    });
  }

  const apiKey = process.env.ALPHA_VANTAGE_KEY || "demo";
  const results = {};

  for (const symbol of symbols.slice(0, 5)) {
    try {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

      const response = await axios.get(url, {
        timeout: 6000,
      });

      const quote = response.data["Global Quote"];

      if (quote && quote["05. price"]) {
        results[symbol] = {
          price: parseFloat(quote["05. price"]),
          change: parseFloat(quote["09. change"]),
          changePercent:
            quote["10. change percent"],
        };
      }
    } catch {
      results[symbol] = null;
    }
  }

  res.json(results);
});

// ─── FRONTEND + DASHBOARD DEPLOYMENT ──────────────────────────────────────────

// Frontend
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Dashboard
app.use(
  "/admin",
  express.static(path.join(__dirname, "../dashboard/build"))
);

// Dashboard Route
app.get("/admin", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "../dashboard/build/index.html"
    )
  );
});

// Frontend Route
app.get("/*", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "../frontend/build/index.html"
    )
  );
});

// ─── Start Server ──────────────────────────────────────────────────────────────
mongoose
  .connect(uri)
  .then(() => {
    console.log("DB connected successfully!");

    app.listen(PORT, () => {
      console.log("App started on port " + PORT);
    });
  })
  .catch((err) => {
    console.error(
      "DB connection error:",
      err.message
    );

    process.exit(1);
  });