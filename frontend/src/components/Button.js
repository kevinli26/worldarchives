import React from "react";
import "../css/Button.css";

const Button = ({ startDate, endDate, firebase }) => {
  return (
    <div id="container">
      <button
        class="learn-more"
        onClick={() => {
          console.log(startDate.toISOString().split("T")[0]);
          firebase.getAllArticles();
        }}
      >
        <span class="circle" aria-hidden="true">
          <span class="icon arrow"></span>
        </span>
        <span class="button-text">Let's Go Back</span>
      </button>
    </div>
  );
};

export default Button;
