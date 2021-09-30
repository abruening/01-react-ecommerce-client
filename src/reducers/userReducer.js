import { type } from "../types/type";

export const userReducer = (state = null, action) => {
  switch (action.type) {
    case type.LOG_IN_USER:
      return action.payload;
    case type.LOG_OUT_USER:
      return action.payload;
    default:
      return state;
  }
};
