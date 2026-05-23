import React, { useState, useEffect } from "react";
import axios from "axios";
import Menu from "./Menu";

const TopBar = () => {
  const [indices, setIndices] = useState({
    nifty: { price: "...", change: "...", up: null },
    sensex: { price: "...", change: "...", up: null },
  });

  useEffect(() => {
    // Fetch NIFTY 50 and SENSEX from backend proxy
    const fetchIndex = async (symbol, key) => {
      try {
        const res = await axios.get(`http://localhost:3002/stock/${symbol}`);
        if (res.data.price) {
          const up = res.data.change >= 0;
          setIndices((prev) => ({
            ...prev,
            [key]: {
              price: res.data.price.toLocaleString("en-IN", { maximumFractionDigits: 2 }),
              change: `${up ? "+" : ""}${res.data.changePercent || ""}`,
              up,
            },
          }));
        }
      } catch {
        // silently fallback
      }
    };

    // Alpha Vantage symbols for Indian indices (BSE Sensex = ^BSESN, NSE Nifty = ^NSEI)
    fetchIndex("^NSEI", "nifty");
    fetchIndex("^BSESN", "sensex");
  }, []);

  const indexStyle = (up) => ({
    color: up === null ? "rgb(97,97,97)" : up ? "rgb(72,194,55)" : "rgb(223,73,73)",
    fontSize: "0.8rem",
    fontWeight: 500,
  });

  return (
    <div className="topbar-container">
      <div className="indices-container">
        <div className="nifty">
          <p className="index">NIFTY 50</p>
          <p style={indexStyle(indices.nifty.up)}>{indices.nifty.price}</p>
          <p className="percent" style={{ color: indices.nifty.up === false ? "rgb(223,73,73)" : "rgb(72,194,55)" }}>
            {indices.nifty.change}
          </p>
        </div>
        <div className="sensex">
          <p className="index">SENSEX</p>
          <p style={indexStyle(indices.sensex.up)}>{indices.sensex.price}</p>
          <p className="percent" style={{ color: indices.sensex.up === false ? "rgb(223,73,73)" : "rgb(72,194,55)" }}>
            {indices.sensex.change}
          </p>
        </div>
      </div>
      <Menu />
    </div>
  );
};

export default TopBar;
