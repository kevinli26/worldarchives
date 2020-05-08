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
        }}
      >
        <span class="circle" aria-hidden="true">
          <span class="icon arrow"></span>
        </span>
        <span class="button-text">View Archives</span>
      </button>
    </div>
  );
};

export default Button;
