import { createStore } from "redux";
import rootReducer from "../reducers/index";

const persistedState = sessionStorage.getItem("reduxState")
  ? JSON.parse(sessionStorage.getItem("reduxState"))
  : undefined;
if (persistedState) {
  persistedState.startDate = new Date();
  persistedState.endDate = new Date();
}

const store = createStore(rootReducer, persistedState);

window.store = store;

store.subscribe(() => {
  sessionStorage.setItem("reduxState", JSON.stringify(store.getState()));
});

export default store;
