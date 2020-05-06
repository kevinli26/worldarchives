import React from "react";
import "../css/Loader.css";

const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "95vh",
      }}
    >
      <div class="lds-dual-ring"></div>
    </div>
  );
};

export default Loader;
