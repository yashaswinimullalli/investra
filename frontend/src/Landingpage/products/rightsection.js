import React from "react";

// 1. Capitalize the function name to 'RightSection'
function RightSection({ imageURL, productName, productDesription, learnMore }) {
  return (
    <div className="container mt-5">
      <div className="row">
        {/* Text column */}
        <div className="col-6 p-5 mt-5">
          <h1>{productName}</h1>
          <p>{productDesription}</p>
          <div>
            {/* Added a right arrow icon common in these layouts */}
            <a href={learnMore} style={{ textDecoration: "none" }}>
              Learn More <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
            </a>
          </div>
        </div>
        
        {/* Image column */}
        <div className="col-6">
          {/* Added alt attribute and img-fluid for responsiveness */}
          <img src={imageURL} alt={productName} className="img-fluid" />
        </div>
      </div>
    </div>
  );
}

// 2. Update the export to match the capitalized name
export default RightSection;