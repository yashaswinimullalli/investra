import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const navigate = useNavigate();

  const handleMenuClick = (index) => setSelectedMenu(index);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div className="menu-container">
      <img src="/logo.png" style={{ width: "50px" }} alt="logo" />
      <div className="menus">
        <ul>
          <li><Link style={{ textDecoration: "none" }} to="/dashboard" onClick={() => handleMenuClick(0)}><p className={selectedMenu === 0 ? activeMenuClass : menuClass}>Dashboard</p></Link></li>
          <li><Link style={{ textDecoration: "none" }} to="/dashboard/orders" onClick={() => handleMenuClick(1)}><p className={selectedMenu === 1 ? activeMenuClass : menuClass}>Orders</p></Link></li>
          <li><Link style={{ textDecoration: "none" }} to="/dashboard/holdings" onClick={() => handleMenuClick(2)}><p className={selectedMenu === 2 ? activeMenuClass : menuClass}>Holdings</p></Link></li>
          <li><Link style={{ textDecoration: "none" }} to="/dashboard/positions" onClick={() => handleMenuClick(3)}><p className={selectedMenu === 3 ? activeMenuClass : menuClass}>Positions</p></Link></li>
          <li><Link style={{ textDecoration: "none" }} to="/dashboard/funds" onClick={() => handleMenuClick(4)}><p className={selectedMenu === 4 ? activeMenuClass : menuClass}>Funds</p></Link></li>
          <li><Link style={{ textDecoration: "none" }} to="/dashboard/apps" onClick={() => handleMenuClick(5)}><p className={selectedMenu === 5 ? activeMenuClass : menuClass}>Apps</p></Link></li>
        </ul>
        <hr />
        <div className="profile" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="avatar">YS</div>
          <p className="username">{localStorage.getItem("username") || "User"}</p>
          <button onClick={handleLogout} style={{ fontSize: "0.75rem", background: "#f44336", color: "#fff", border: "none", borderRadius: "4px", padding: "4px 10px", cursor: "pointer", marginLeft: "8px" }}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Menu;
