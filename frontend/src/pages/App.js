import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import NewsArchiver from "./NewsArchiver";
import { withFirebase } from "../firebase/index";
import Login from "./Login";
import { connect } from "react-redux";
import Landing from "../components/Landing";

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.isAuthenticated,
  };
};

const App = (props) => {
  function PrivateRoute({ children, ...rest }) {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          props.isAuthenticated ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location },
              }}
            />
          )
        }
      />
    );
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Landing />
        </Route>
        <PrivateRoute path="/news">
          <NewsArchiver firebase={props.firebase} />
        </PrivateRoute>
        <Route
          exact
          path="/login"
          render={() => (
            <Login
              firebaseInstance={props.firebase}
              dispatch={props.dispatch}
            />
          )}
        />
      </Switch>
    </Router>
  );
};

export default connect(mapStateToProps)(withFirebase(App));
