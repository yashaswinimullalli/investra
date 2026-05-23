import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const COLORS = [
  "rgba(65,132,243,0.8)", "rgba(72,194,55,0.8)", "rgba(250,118,78,0.8)",
  "rgba(255,206,86,0.8)", "rgba(153,102,255,0.8)", "rgba(54,162,235,0.8)",
  "rgba(255,99,132,0.8)", "rgba(75,192,192,0.8)", "rgba(255,159,64,0.8)",
  "rgba(199,199,199,0.8)", "rgba(83,102,255,0.8)", "rgba(255,51,102,0.8)",
  "rgba(40,167,69,0.8)",
];

const Summary = () => {
  const [holdings, setHoldings] = useState([]);
  const [orders, setOrders] = useState([]);
  const username = localStorage.getItem("username") || "User";

  useEffect(() => {
    axios.get("http://localhost:3002/allHoldings").then((res) => setHoldings(res.data)).catch(() => {});
    axios.get("http://localhost:3002/allOrders").then((res) => setOrders(res.data)).catch(() => {});
  }, []);

  const totalInvestment = holdings.reduce((sum, s) => sum + s.avg * s.qty, 0);
  const currentValue = holdings.reduce((sum, s) => sum + s.price * s.qty, 0);
  const pnl = currentValue - totalInvestment;
  const pnlPercent = totalInvestment > 0 ? ((pnl / totalInvestment) * 100).toFixed(2) : 0;
  const pnlClass = pnl >= 0 ? "profit" : "loss";

  const formatK = (val) => {
    if (Math.abs(val) >= 1000) return (val / 1000).toFixed(2) + "k";
    return Math.abs(val) < 0.01 ? "0.00" : val.toFixed(2);
  };

  const doughnutData = {
    labels: holdings.map((s) => s.name),
    datasets: [
      {
        label: "Portfolio Value (₹)",
        data: holdings.map((s) => (s.price * s.qty).toFixed(2)),
        backgroundColor: COLORS,
        borderColor: COLORS.map((c) => c.replace("0.8", "1")),
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { position: "right", labels: { font: { size: 11 } } },
      title: { display: true, text: "Portfolio Allocation" },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + parseFloat(b), 0);
            const pct = ((ctx.parsed / total) * 100).toFixed(1);
            return ` ${ctx.label}: ₹${parseFloat(ctx.parsed).toLocaleString("en-IN")} (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <>
      <div className="username">
        <h6>Hi, {username}!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span><p>Equity</p></span>
        <div className="data">
          <div className="first">
            <h3>3.74k</h3>
            <p>Margin available</p>
          </div>
          <hr />
          <div className="second">
            <p>Margins used <span>0</span></p>
            <p>Opening balance <span>3.74k</span></p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span><p>Holdings ({holdings.length})</p></span>
        <div className="data">
          <div className="first">
            <h3 className={pnlClass}>
              {pnl >= 0 ? "+" : "-"}{formatK(Math.abs(pnl))}{" "}
              <small>{pnl >= 0 ? "+" : ""}{pnlPercent}%</small>
            </h3>
            <p>P&amp;L</p>
          </div>
          <hr />
          <div className="second">
            <p>Current Value <span>₹{formatK(currentValue)}</span></p>
            <p>Investment <span>₹{formatK(totalInvestment)}</span></p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span><p>Orders ({orders.length})</p></span>
        <div className="data">
          <div className="second">
            <p>Orders placed <span>{orders.length}</span></p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      {holdings.length > 0 && (
        <div style={{ maxWidth: "480px", margin: "20px auto" }}>
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      )}
    </>
  );
};

export default Summary;
