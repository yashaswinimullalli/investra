import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav
      className="navbar navbar-expand-lg border-bottom"
      style={{ backgroundColor: "#FFF" }}
    >
      <div className="container p-2">
        <Link className="navbar-brand" to="/">
          <img
            src="images/logo.svg"
            style={{ width: "25%" }}
            alt="Logo"
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-lg-0">
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/product">Product</Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/pricing">Pricing</Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/support">Support</Link>
            </li>

            {token ? (
              <>
                <li className="nav-item mx-2 d-flex align-items-center">
                  <span className="nav-link text-muted">👤 {username}</span>
                </li>
                <li className="nav-item mx-2">
                  <a
                    href="http://localhost:3001"
                    className="btn btn-outline-primary btn-sm me-2"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Dashboard
                  </a>
                </li>
                <li className="nav-item mx-2">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item mx-2">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item mx-2">
                  <Link
                    className="btn btn-primary btn-sm px-3"
                    to="/signup"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;