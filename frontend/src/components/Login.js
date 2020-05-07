import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase";
import { setAuthenticated } from "../actions/index";
import { useHistory } from "react-router-dom";

const Login = (props) => {
  let history = useHistory();
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => {
        props.dispatch(setAuthenticated(true));
        history.push("/news");
      },
    },
  };
  return (
    <div>
      <h1>My App</h1>
      <p>Please sign-in:</p>
      <StyledFirebaseAuth
        uiConfig={uiConfig}
        firebaseAuth={props.firebaseInstance.auth}
      />
    </div>
  );
};

export default Login;
