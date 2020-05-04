import {
  ADD_ARTICLE,
  SET_START_DATE,
  SET_END_DATE,
} from "../constants/action-types";
const initialState = {
  startDate: null,
  endDate: null,
  key: "selection",
  articles: [],
};

function rootReducer(state = initialState, action) {
  if (action.type === ADD_ARTICLE) {
    return Object.assign({}, state, {
      ...state,
      articles: state.articles.concat(action.payload),
    });
  } else if (action.type === SET_START_DATE) {
  } else if (action.type === SET_END_DATE) {
  }
  return state;
}

export default rootReducer;
