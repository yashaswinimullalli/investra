import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer style={{ backgroundColor: "rgb(250, 250, 250)" }}>
      <div className="container border-top mt-5">
        <div className="row mt-5">
          <div className="col">
            <img src="images/logo.svg" alt="Logo" style={{ width: "50%" }} />
            <p>
              &copy; 2024, Investra Broking Ltd. All rights reserved.
            </p>
          </div>
          <div className="col">
            <p>Company</p>
            <Link to="/about" style={{ textDecoration: "none", display: "block", marginBottom: "6px" }}>About</Link>
            <Link to="/product" style={{ textDecoration: "none", display: "block", marginBottom: "6px" }}>Products</Link>
            <Link to="/pricing" style={{ textDecoration: "none", display: "block", marginBottom: "6px" }}>Pricing</Link>
            <a href="/" style={{ textDecoration: "none", display: "block", marginBottom: "6px" }}>Referral programme</a>
            <a href="/" style={{ textDecoration: "none", display: "block", marginBottom: "6px" }}>Careers</a>
            <a href="/" style={{ textDecoration: "none", display: "block", marginBottom: "6px" }}>Press &amp; media</a>
          </div>
          <div className="col">
            <p>Support</p>
            <Link to="/support" style={{ textDecoration: "none", display: "block", marginBottom: "6px" }}>Contact</Link>
            <Link to="/support" style={{ textDecoration: "none", display: "block", marginBottom: "6px" }}>Support portal</Link>
            <a href="/" style={{ textDecoration: "none", display: "block", marginBottom: "6px" }}>Z-Connect blog</a>
            <a href="/" style={{ textDecoration: "none", display: "block", marginBottom: "6px" }}>List of charges</a>
            <a href="/" style={{ textDecoration: "none", display: "block", marginBottom: "6px" }}>Downloads &amp; resources</a>
          </div>
          <div className="col">
            <p>Account</p>
            <Link to="/signup" style={{ textDecoration: "none", display: "block", marginBottom: "6px" }}>Open an account</Link>
            <a href="/" style={{ textDecoration: "none", display: "block", marginBottom: "6px" }}>Fund transfer</a>
            <a href="/" style={{ textDecoration: "none", display: "block", marginBottom: "6px" }}>60 day challenge</a>
          </div>
        </div>
        <div className="mt-5 text-muted" style={{ fontSize: "14px" }}>
          <p>
            Investra Broking Ltd.: Member of NSE &amp; BSE – SEBI Registration no.:
            INZ000031633 CDSL: Depository services through Investra Securities
            Pvt. Ltd. – SEBI Registration no.: IN-DP-100-2015 Commodity Trading
            through Investra Commodities Pvt. Ltd. MCX: 46025 – SEBI Registration
            no.: INZ000038238 Registered Address: Investra Broking Ltd.,
            #153/154, 4th Cross, Dollars Colony, Bengaluru - 560078, Karnataka, India.
            For any complaints pertaining to securities broking please write to
            complaints@investra.com.
          </p>
          <p>
            Investments in securities market are subject to market risks; read
            all the related documents carefully before investing.
          </p>
          <p>
            "Prevent unauthorised transactions in your account. Update your
            mobile numbers/email IDs with your stock brokers. Receive
            information of your transactions directly from Exchange on your
            mobile/email at the end of the day. Issued in the interest of investors."
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;