import React, { useState, Component } from "react";
import "../css/App.css";
import { withFirebase } from "../firebase/index";
import { connect } from "react-redux";
import Calendar from "../components/Calendar";
import Button from "../components/Button";
import { setSources } from "../actions/index";
import CheckboxGroup from "react-checkbox-group";

const mapStateToProps = (state) => {
  return {
    startDate: state.startDate,
    endDate: state.endDate,
    calKey: state.calKey,
    articles: state.articles,
    sources: state.sources,
  };
};

class App extends Component {
  constructor(props) {
    super(props);
    // this.props.firebase.getAllSources();
  }

  async componentDidMount() {
    const doc = await this.props.firebase.db
      .collection("sources")
      .doc("en")
      .get();
    if (doc.exists) {
      this.props.dispatch(setSources(doc.data().sources));
    }
  }

  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh",
        }}
      >
        <div
          style={{
            margin: "20px",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Calendar
            dispatch={this.props.dispatch}
            startDate={this.props.startDate}
            endDate={this.props.endDate}
            calKey={this.props.calKey}
          />
        </div>
        <Button
          startDate={this.props.startDate}
          endDate={this.props.endDate}
          firebase={this.props.firebase}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(withFirebase(App));
