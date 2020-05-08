import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { setSources } from "../actions/index";

var firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

class Firebase {
  constructor() {
    firebase.initializeApp(firebaseConfig);
    this.auth = firebase.auth();
    this.db = firebase.firestore();
  }

  getAllArticles = () => {
    this.db
      .collection("headlines")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log(doc.id, "=>", doc.data());
        });
      })
      .catch((err) => {
        console.log("Error getting documents", err);
      });
  };

  getAllSources = () => {
    this.db
      .collection("sources")
      .doc("en")
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log(doc.data().sources);
        }
      })
      .catch((err) => {
        console.log("Error getting documents", err);
      });
  };

  getArticles = (query) => {
    //get specific based off date range query
  };
}

export default Firebase;
