import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import Orders from "../Orders";

jest.mock("axios");

const mockOrders = [
  { _id: "abc123", name: "WIPRO", qty: 1, price: 0, mode: "BUY" },
  { _id: "def456", name: "TCS", qty: 2, price: 3000, mode: "SELL" },
];

describe("Orders component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state initially", () => {
    axios.get.mockImplementation(() => new Promise(() => {}));
    render(<Orders />);
    expect(screen.getByText("Loading orders...")).toBeInTheDocument();
  });

  it("shows empty state when no orders", async () => {
    axios.get.mockResolvedValue({ data: [] });
    render(<Orders />);
    await waitFor(() => {
      expect(
        screen.getByText("You haven't placed any orders today")
      ).toBeInTheDocument();
    });
  });

  it("renders orders table with correct data", async () => {
    axios.get.mockResolvedValue({ data: mockOrders });
    render(<Orders />);
    await waitFor(() => {
      expect(screen.getByText("Orders (2)")).toBeInTheDocument();
      expect(screen.getByText("WIPRO")).toBeInTheDocument();
      expect(screen.getByText("TCS")).toBeInTheDocument();
    });
  });

  it("shows BUY in green and SELL in orange/red class", async () => {
    axios.get.mockResolvedValue({ data: mockOrders });
    render(<Orders />);
    await waitFor(() => {
      const buyCell = screen.getByText("BUY");
      const sellCell = screen.getByText("SELL");
      expect(buyCell.className).toBe("profit");
      expect(sellCell.className).toBe("loss");
    });
  });

  it("shows Market for price=0 orders", async () => {
    axios.get.mockResolvedValue({ data: mockOrders });
    render(<Orders />);
    await waitFor(() => {
      expect(screen.getByText("Market")).toBeInTheDocument();
      expect(screen.getByText("₹3000.00")).toBeInTheDocument();
    });
  });

  it("delete button calls DELETE endpoint", async () => {
    axios.get.mockResolvedValue({ data: mockOrders });
    axios.delete.mockResolvedValue({ data: { message: "Order deleted", id: "abc123" } });

    // Set a token so auth passes
    Storage.prototype.getItem = jest.fn((key) => key === "token" ? "mock-token" : null);

    render(<Orders />);
    await waitFor(() => {
      expect(screen.getByText("Orders (2)")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText("✕ Delete");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        "http://localhost:3002/order/abc123",
        expect.objectContaining({ headers: expect.objectContaining({ Authorization: "Bearer mock-token" }) })
      );
    });
  });
});
