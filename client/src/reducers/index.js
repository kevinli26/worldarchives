import {
  ADD_ARTICLE,
  SET_START_DATE,
  SET_END_DATE,
  SET_SOURCES,
  SET_SELECTED_SOURCES,
  SET_AUTHENTICATED,
  CLEAR_ARTICLES,
} from "../constants/action-types";

const initialState = {
  startDate: new Date(),
  endDate: new Date(),
  calKey: "selection",
  articles: [],
  sources: [],
  selectedSources: [],
  isAuthenticated: false,
};

function rootReducer(state = initialState, action) {
  if (action.type === ADD_ARTICLE) {
    return {
      ...state,
      articles: state.articles.concat(action.payload),
    };
  } else if (action.type === SET_START_DATE) {
    return {
      ...state,
      startDate: action.payload,
    };
  } else if (action.type === SET_END_DATE) {
    return {
      ...state,
      endDate: action.payload,
    };
  } else if (action.type === SET_SOURCES) {
    return {
      ...state,
      sources: action.payload,
    };
  } else if (action.type === SET_SELECTED_SOURCES) {
  } else if (action.type === SET_AUTHENTICATED) {
    return {
      ...state,
      isAuthenticated: action.payload,
    };
  } else if (action.type === CLEAR_ARTICLES) {
    return {
      ...state,
      articles: [],
    };
  }
  return state;
}

export default rootReducer;
