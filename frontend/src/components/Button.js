import React from "react";
import "../css/Button.css";

const Button = ({
  startDate,
  endDate,
  firebase,
  selectedSources,
  onButtonPress,
}) => {
  return (
    <div id="container">
      <button
        class="learn-more"
        onClick={() => {
          onButtonPress();
          // console.log(startDate.toISOString().split("T")[0]);
          // console.log(endDate.toISOString().split("T")[0]);
          // console.log(selectedSources);
          // firebase.getAllArticles();
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
