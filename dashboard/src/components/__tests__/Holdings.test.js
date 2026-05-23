import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import Holdings from "../Holdings";

// Mock axios
jest.mock("axios");

const mockHoldings = [
  { _id: "1", name: "WIPRO", qty: 4, avg: 489.3, price: 577.75, net: "+18.08%", day: "+0.32%", isLoss: false },
  { _id: "2", name: "INFY", qty: 1, avg: 1350.5, price: 1555.45, net: "+15.18%", day: "-1.60%", isLoss: true },
  { _id: "3", name: "TCS", qty: 1, avg: 3041.7, price: 3194.8, net: "+5.03%", day: "-0.25%", isLoss: true },
];

describe("Holdings component", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockHoldings });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders Holdings title with correct count", async () => {
    render(<Holdings />);
    await waitFor(() => {
      expect(screen.getByText(`Holdings (${mockHoldings.length})`)).toBeInTheDocument();
    });
  });

  it("renders all stock names from the API data", async () => {
    render(<Holdings />);
    await waitFor(() => {
      expect(screen.getByText("WIPRO")).toBeInTheDocument();
      expect(screen.getByText("INFY")).toBeInTheDocument();
      expect(screen.getByText("TCS")).toBeInTheDocument();
    });
  });

  it("shows loading state initially", () => {
    axios.get.mockImplementation(() => new Promise(() => {})); // never resolves
    render(<Holdings />);
    expect(screen.getByText("Loading holdings...")).toBeInTheDocument();
  });

  it("displays correct P&L values", async () => {
    render(<Holdings />);
    await waitFor(() => {
      // WIPRO P&L = (577.75 - 489.3) * 4 = 354.2
      const pnl = ((577.75 - 489.3) * 4).toFixed(2);
      expect(screen.getAllByText(pnl).length).toBeGreaterThan(0);
    });
  });

  it("renders table headers correctly", async () => {
    render(<Holdings />);
    await waitFor(() => {
      expect(screen.getByText("Instrument")).toBeInTheDocument();
      expect(screen.getByText("Qty.")).toBeInTheDocument();
      expect(screen.getByText("LTP")).toBeInTheDocument();
    });
  });
});
