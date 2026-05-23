import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Homepage from "./Landingpage/home/Homepage";
import Signup from "./Landingpage/signup/signup";
import Login from "./Landingpage/Login/Login";
import Aboutpage from "./Landingpage/about/Aboutpage";
import Productpage from "./Landingpage/products/Productpage";
import Pricingpage from "./Landingpage/pricing/Pricingpage";
import Supportportal from "./Landingpage/support/Supportportal";
import NotFound from "./Landingpage/NotFound";
import Navbar from "./Landingpage/Navbar";
import Footer from "./Landingpage/Footer";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<Aboutpage />} />
      <Route path="/product" element={<Productpage />} />
      <Route path="/pricing" element={<Pricingpage />} />
      <Route path="/support" element={<Supportportal />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer />
  </BrowserRouter>
);