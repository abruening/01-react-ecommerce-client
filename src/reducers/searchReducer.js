import { type } from "../types/type";

export const searchReducer = (state = { text: "" }, action) => {
  switch (action.type) {
    case type.SEARCH_QUERY:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
