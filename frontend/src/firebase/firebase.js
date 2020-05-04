import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "test-XXXX.firebaseapp.com",
  databaseURL: "https://test-XXXXXX.firebaseio.com",
  projectId: "test-XXXX",
  storageBucket: "test-XXXX.appspot.com",
  messagingSenderId: "XXXXXXX",
  appId: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
};

class Firebase {
  constructor() {
    firebase.initializeApp(firebaseConfig);
    this.auth = firebase.auth();
    this.db = firebase.db();
  }

  getAllArticles = () => {
    this.db.ref("articles/");
  };

  getArticles = (query) => {
    //get specific based off date range query
  };
}

export default Firebase;
