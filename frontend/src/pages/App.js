import React, { useState } from "react";
import { Router, Route, Switch } from "react-router";
import NewsArchiver from "./NewsArchiver";

const App = (props) => {
  return (
    <Router>
      <div>Landing</div>
      <Switch>
        <Route path="/news">
          <NewsArchiver />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
