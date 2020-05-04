import firebase from "firebase";

const config = {
  apiKey: "ADD-YOUR-DETAILS-HERE",
  authDomain: "ADD-YOUR-DETAILS-HERE",
  databaseURL: "ADD-YOUR-DETAILS-HERE",
};

firebase.initializeApp(config);
export const auth = firebase.auth;
export const db = firebase.database();
