import axios from "axios";

export const createPaymentIntent = (authtoken, coupons) =>
  axios.post(
    `${process.env.REACT_APP_API}/create-payment-intent`,
    { couponApplied: coupons },
    { headers: { authtoken } }
  );
