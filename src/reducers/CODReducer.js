import { type } from "../types/type";

export const CODReducer = (state = false, action) => {
  switch (action.type) {
    case type.CASH_ON_DELIVERY:
      return action.payload;
    default:
      return state;
  }
};
