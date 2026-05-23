import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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

import ProtectedRoute from "./dashboard/ProtectedRoute";
import TopBar from "./dashboard/TopBar";
import DashboardLayout from "./dashboard/DashboardLayout";

// Wrapper to conditionally show Navbar/Footer only on non-dashboard pages
const AppShell = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Navbar />}
      {isDashboard && <TopBar />}
      <Routes>
        {/* Public landing pages */}
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<Aboutpage />} />
        <Route path="/product" element={<Productpage />} />
        <Route path="/pricing" element={<Pricingpage />} />
        <Route path="/support" element={<Supportportal />} />

        {/* Protected dashboard */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isDashboard && <Footer />}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AppShell />
  </BrowserRouter>
);