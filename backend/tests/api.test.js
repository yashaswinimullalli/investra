/**
 * Investra Backend – API Integration Tests
 * Uses supertest to test all Express routes against a real MongoDB connection.
 */

require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

const TEST_USER = {
  name: "Test User",
  email: `test_${Date.now()}@investra.com`,
  phone: "9999999999",
  password: "test1234",
};

let authToken = "";
let createdOrderId = "";

// ─── Setup / Teardown ──────────────────────────────────────────────────────────
beforeAll(async () => {
  const uri = process.env.MONGO_URL;
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.close();
});

// ─── Health Check ──────────────────────────────────────────────────────────────
describe("GET /health", () => {
  it("should return status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body).toHaveProperty("timestamp");
  });
});

// ─── Auth – Signup ─────────────────────────────────────────────────────────────
describe("POST /signup", () => {
  it("should create a new user and return a JWT token", async () => {
    const res = await request(app).post("/signup").send(TEST_USER);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.name).toBe(TEST_USER.name);
    authToken = res.body.token;
  });

  it("should reject signup with duplicate email", async () => {
    const res = await request(app).post("/signup").send(TEST_USER);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Email already registered");
  });

  it("should reject signup with missing fields", async () => {
    const res = await request(app).post("/signup").send({ email: "bad@test.com" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});

// ─── Auth – Login ──────────────────────────────────────────────────────────────
describe("POST /login", () => {
  it("should login with valid credentials", async () => {
    const res = await request(app).post("/login").send({
      email: TEST_USER.email,
      password: TEST_USER.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.name).toBe(TEST_USER.name);
    authToken = res.body.token; // refresh token
  });

  it("should reject login with wrong password", async () => {
    const res = await request(app).post("/login").send({
      email: TEST_USER.email,
      password: "wrongpass",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Invalid email or password");
  });

  it("should reject login with non-existent email", async () => {
    const res = await request(app).post("/login").send({
      email: "nobody@nowhere.com",
      password: "pass",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Invalid email or password");
  });
});

// ─── GET /me – Protected Route ─────────────────────────────────────────────────
describe("GET /me", () => {
  it("should return user profile with valid token", async () => {
    const res = await request(app)
      .get("/me")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(TEST_USER.email);
    expect(res.body).not.toHaveProperty("password");
  });

  it("should return 401 without token", async () => {
    const res = await request(app).get("/me");
    expect(res.statusCode).toBe(401);
  });

  it("should return 403 with invalid token", async () => {
    const res = await request(app)
      .get("/me")
      .set("Authorization", "Bearer invalidtoken123");
    expect(res.statusCode).toBe(403);
  });
});

// ─── Holdings ──────────────────────────────────────────────────────────────────
describe("GET /allHoldings", () => {
  it("should return an array of holdings", async () => {
    const res = await request(app).get("/allHoldings");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// ─── Positions ─────────────────────────────────────────────────────────────────
describe("GET /allPositions", () => {
  it("should return an array of positions", async () => {
    const res = await request(app).get("/allPositions");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// ─── Orders – CRUD ─────────────────────────────────────────────────────────────
describe("Orders CRUD", () => {
  it("POST /newOrder – should create a new order", async () => {
    const res = await request(app).post("/newOrder").send({
      name: "WIPRO",
      qty: 2,
      price: 500,
      mode: "BUY",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("order");
    expect(res.body.order.name).toBe("WIPRO");
    createdOrderId = res.body.order._id;
  });

  it("POST /newOrder – should reject order missing required fields", async () => {
    const res = await request(app).post("/newOrder").send({ price: 100 });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("GET /allOrders – should return orders array including the new order", async () => {
    const res = await request(app).get("/allOrders");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const found = res.body.find((o) => o._id === createdOrderId);
    expect(found).toBeDefined();
  });

  it("DELETE /order/:id – should delete the created order with auth", async () => {
    const res = await request(app)
      .delete(`/order/${createdOrderId}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(createdOrderId);
  });

  it("DELETE /order/:id – should return 401 without token", async () => {
    const res = await request(app).delete(`/order/${createdOrderId}`);
    expect(res.statusCode).toBe(401);
  });
});

// ─── Live Stock API ────────────────────────────────────────────────────────────
describe("GET /stock/:symbol", () => {
  it("should return stock data or graceful note for a valid symbol", async () => {
    const res = await request(app).get("/stock/IBM");
    expect(res.statusCode).toBe(200);
    // Either real data or a note about API limits
    expect(res.body).toHaveProperty("symbol");
  }, 15000);
});
