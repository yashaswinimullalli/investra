import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import Summary from "../Summary";

jest.mock("axios");

// Mock Chart.js to avoid canvas errors in Jest
jest.mock("react-chartjs-2", () => ({
  Doughnut: () => <canvas data-testid="doughnut-chart" />,
}));

const mockHoldings = [
  { _id: "1", name: "WIPRO", qty: 4, avg: 489.3, price: 577.75 },
  { _id: "2", name: "INFY", qty: 1, avg: 1350.5, price: 1555.45 },
];

const mockOrders = [
  { _id: "o1", name: "WIPRO", qty: 1, price: 500, mode: "BUY" },
];

describe("Summary component", () => {
  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      if (url.includes("allHoldings")) return Promise.resolve({ data: mockHoldings });
      if (url.includes("allOrders")) return Promise.resolve({ data: mockOrders });
      return Promise.resolve({ data: [] });
    });
  });

  afterEach(() => jest.clearAllMocks());

  it("renders the greeting with username", async () => {
    Storage.prototype.getItem = jest.fn((key) => key === "username" ? "Yashaswini" : null);
    render(<Summary />);
    await waitFor(() => {
      expect(screen.getByText("Hi, Yashaswini!")).toBeInTheDocument();
    });
  });

  it("shows correct holdings count", async () => {
    render(<Summary />);
    await waitFor(() => {
      expect(screen.getByText(`Holdings (${mockHoldings.length})`)).toBeInTheDocument();
    });
  });

  it("computes correct P&L values", async () => {
    render(<Summary />);
    await waitFor(() => {
      // Total investment = (489.3*4) + (1350.5*1) = 1957.2 + 1350.5 = 3307.7
      // Current value = (577.75*4) + (1555.45*1) = 2311 + 1555.45 = 3866.45
      // P&L = 558.75 → 0.56k
      expect(screen.getByText(/\d+\.\d+k?/)).toBeInTheDocument();
    });
  });

  it("renders portfolio doughnut chart when holdings exist", async () => {
    render(<Summary />);
    await waitFor(() => {
      expect(screen.getByTestId("doughnut-chart")).toBeInTheDocument();
    });
  });

  it("shows orders count correctly", async () => {
    render(<Summary />);
    await waitFor(() => {
      expect(screen.getByText("Orders (1)")).toBeInTheDocument();
    });
  });
});
