import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("bar");

  useEffect(() => {
    axios
      .get("https://investra-f0c2.onrender.com/allHoldings")
      .then((res) => {
        setAllHoldings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="title">Loading holdings...</p>;

  const labels = allHoldings.map((s) => s.name);
  const avgCosts = allHoldings.map((s) => s.avg);
  const ltpValues = allHoldings.map((s) => s.price);
  const pnlValues = allHoldings.map((s) =>
    parseFloat(((s.price - s.avg) * s.qty).toFixed(2))
  );

  const barData = {
    labels,
    datasets: [
      {
        label: "Avg Cost (₹)",
        data: avgCosts,
        backgroundColor: "rgba(65, 132, 243, 0.6)",
        borderColor: "rgba(65, 132, 243, 1)",
        borderWidth: 1,
      },
      {
        label: "LTP (₹)",
        data: ltpValues,
        backgroundColor: "rgba(72, 194, 55, 0.6)",
        borderColor: "rgba(72, 194, 55, 1)",
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels,
    datasets: [
      {
        label: "P&L per Stock (₹)",
        data: pnlValues,
        borderColor: "rgba(65,132,243,0.9)",
        backgroundColor: "rgba(65,132,243,0.1)",
        pointBackgroundColor: pnlValues.map((v) =>
          v >= 0 ? "rgba(72,194,55,1)" : "rgba(250,118,78,1)"
        ),
        pointRadius: 5,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: chartType === "bar" ? "Avg Cost vs LTP by Stock" : "P&L per Stock (₹)",
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `₹${ctx.parsed.y.toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `₹${value.toLocaleString("en-IN")}`,
        },
      },
    },
  };

  const totalInvestment = allHoldings.reduce((s, h) => s + h.avg * h.qty, 0);
  const currentValue = allHoldings.reduce((s, h) => s + h.price * h.qty, 0);
  const pnl = currentValue - totalInvestment;

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&amp;L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>
          <tbody>
            {allHoldings.map((stock, index) => {
              const curValue = stock.price * stock.qty;
              const pnlVal = curValue - stock.avg * stock.qty;
              const isProfit = pnlVal >= 0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";
              return (
                <tr key={index}>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>
                  <td className={profClass}>{pnlVal.toFixed(2)}</td>
                  <td className={profClass}>{stock.net}</td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="row" style={{ marginTop: "4%" }}>
        <div className="col">
          <h5>₹{totalInvestment.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>₹{currentValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5 style={{ color: pnl >= 0 ? "rgb(72,194,55)" : "rgb(250,118,78)" }}>
            {pnl >= 0 ? "+" : ""}₹{pnl.toFixed(2)} (
            {((pnl / totalInvestment) * 100).toFixed(2)}%)
          </h5>
          <p>P&amp;L</p>
        </div>
      </div>

      {/* Chart Toggle */}
      <div style={{ margin: "20px 0 10px", display: "flex", gap: "10px" }}>
        <button
          onClick={() => setChartType("bar")}
          style={{
            padding: "6px 16px",
            background: chartType === "bar" ? "#4184f3" : "#eee",
            color: chartType === "bar" ? "#fff" : "#333",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Bar Chart
        </button>
        <button
          onClick={() => setChartType("line")}
          style={{
            padding: "6px 16px",
            background: chartType === "line" ? "#4184f3" : "#eee",
            color: chartType === "line" ? "#fff" : "#333",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          P&amp;L Line Chart
        </button>
      </div>

      <div style={{ maxWidth: "100%", padding: "10px 0" }}>
        {chartType === "bar" ? (
          <Bar options={chartOptions} data={barData} />
        ) : (
          <Line options={chartOptions} data={lineData} />
        )}
      </div>
    </>
  );
};

export default Holdings;
