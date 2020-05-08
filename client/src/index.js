import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import App from "./pages/App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import store from "./store/index";
import Firebase, { FirebaseContext } from "./firebase";

ReactDOM.render(
  <React.StrictMode>
    <FirebaseContext.Provider value={new Firebase()}>
      <Provider store={store}>
        <App />
      </Provider>
    </FirebaseContext.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
