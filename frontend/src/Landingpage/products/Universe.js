import React from "react";

function Universe() {
  return (
    <div className="container mt-5">
      <div className="row text-center">
        <h1>The Zerodha Universe</h1>
        <p>
          Extend your trading and investment experience even further with our
          partner platforms
        </p>

        <div className="col-4 p-3 mt-5">
          <img src="images/smallcaseLogo.png" alt="" 
          />
          <p className="text-small text-muted">Thematic investment platform</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img src="images/streakLogo.png" alt="" width="100px"  />
          <p className="text-small text-muted">Algo & Strategy Platform</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img src="images/sensibullLogo.svg" alt="" width="100px"/>
          <p className="text-small text-muted">Options tradingplatform</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img src="images/zerodhaFundhouse.png" alt=""  width="100px"/>
          <p className="text-small text-muted">Asset Management</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img src="images/goldenpiLogo.png" alt="" width="100px"/>
          <p className="text-small text-muted">Bonds trading platform</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img src="images/dittoLogo.png" alt="" width="100px"/>
          <p className="text-small text-muted">Insureable</p>
        </div>
        <button
          className="p-2 btn btn-primary fs-5 mb-5"
          style={{ width: "20%", margin: "0 auto" }}
        >
          Signup Now
        </button>
      </div>
    </div>
  );
}

export default Universe;