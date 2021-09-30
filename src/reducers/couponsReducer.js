import { type } from "../types/type";

const initialState = {
  couponApplied: false,
  totalAfterDiscount: 0,
  discountError: "",
};

export const couponsReducer = (state = initialState, action) => {
  switch (action.type) {
    case type.COUPON_APPLIED:
      return action.payload;
    default:
      return state;
  }
};
