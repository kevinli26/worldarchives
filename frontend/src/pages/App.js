import React, { useState } from "react";
import "../css/App.css";
import { withFirebase } from "../firebase/index";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    startDate: state.startDate,
    endDate: state.endDate,
    key: state.key,
    articles: state.articles,
  };
};

const App = ({ startDate, endDate, key, articles }) => {
  return <div className="App">Hello</div>;
};

export default connect(mapStateToProps)(withFirebase(App));
