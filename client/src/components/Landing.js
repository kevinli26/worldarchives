import React from "react";
import "../css/Landingbutton.css";
import { Link } from "react-router-dom";
import "../css/Landing.css";

const Landing = () => {
  return (
    <div
      id="landing"
      style={{
        backgroundColor: "#293241",
        color: "#E0FBFC",
        margin: "0",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Link to="/login" class="brk-btn">
        Get Started
      </Link>
    </div>
  );
};

export default Landing;
