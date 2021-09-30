import { type } from "../types/type";

export const drawerReducer = (state = false, action) => {
  switch (action.type) {
    case type.SET_VISIBLE:
      return action.payload;
    default:
      return state;
  }
};
