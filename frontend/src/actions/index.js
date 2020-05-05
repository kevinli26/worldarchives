import {
  ADD_ARTICLE,
  SET_START_DATE,
  SET_END_DATE,
  SET_SOURCES,
  SET_SELECTED_SOURCES,
} from "../constants/action-types";

export function addArticle(payload) {
  return { type: ADD_ARTICLE, payload };
}

export function setStartDate(payload) {
  return { type: SET_START_DATE, payload };
}

export function setEndDate(payload) {
  return { type: SET_END_DATE, payload };
}

export function setSources(payload) {
  return { type: SET_SOURCES, payload };
}

export function setSelectedSources(payload) {
  return { type: SET_SELECTED_SOURCES, payload };
}
