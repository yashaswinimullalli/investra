import React from "react";

function ProductHero() {
  return (
    <div className="container p-5 mt-3">
      <div className="row text-center">
        <h1 className="fs-2 mb-3">Zerodha Products</h1>
      
        <h3 className="text-muted mt-3 fs-4">
          Sleek, modern and intuitive trading platforms
        </h3>
        <p className="mt-3 mb-5">
          Check out our{" "}
          <a href="/" style={{ textDecoration: "none" }}>
            investment offerings{" "}
            <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
          </a>
        </p>
      </div>
    </div>
  );
}

export default ProductHero;
