import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { createOrder } from "../../helpers/user";
import { createPaymentIntent } from "../../helpers/stripe";
import { emptyCart } from "../../helpers/user";
import { Card } from "antd";
import { DollarOutlined, CheckOutlined } from "@ant-design/icons";
import { type } from "../../types/type";

const StripeCheckout = ({ history }) => {
  const dispatch = useDispatch();
  const { user, coupons } = useSelector((state) => ({ ...state }));
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [cartTotal, setCartTotal] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [payable, setPayable] = useState(0);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    createPaymentIntent(user.token, coupons)
      .then((res) => {
        console.log(res);
        setClientSecret(res.data.clientSecret);
        setCartTotal(res.data.cartTotal);
        setTotalAfterDiscount(res.data.totalAfterDiscount);
        setPayable(res.data.payable);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: { name: e.target.name.value },
      },
    });
    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
      setSucceeded(false);
    } else {
      createOrder(payload, user.token)
        .then((res) => {
          if (res.data.ok) {
            if (typeof window !== undefined) {
              localStorage.removeItem("cart");
            }
            dispatch({ type: type.ADD_TO_CART, payload: [] });
            dispatch({
              type: type.COUPON_APPLIED,
              payload: {
                couponApplied: false,
                totalAfterDiscount: 0,
                discountError: "",
              },
            });
            emptyCart(user.token);
          }
        })
        .catch();
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };

  const handleChange = async (e) => {
    setDisabled(e.empyt);
    setError(e.error ? e.error.message : "");
  };

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <>
      {!succeeded && (
        <div>
          {coupons && totalAfterDiscount !== undefined ? (
            <p className="alert alert-success">{`Total after discount: $${totalAfterDiscount}`}</p>
          ) : (
            <p className="alert alert-danger">No coupon applied</p>
          )}
        </div>
      )}
      <div className="text-center pb-5">
        <Card
          actions={[
            <>
              <DollarOutlined className="text-info"></DollarOutlined>
              <br />
              Total: $ {cartTotal.toFixed(2)}
            </>,
            <>
              <CheckOutlined></CheckOutlined>
              <br />
              Total Payable: $ {(payable / 100).toFixed(2)}
            </>,
          ]}
          style={{ height: "200px", objectFit: "cover", marginBottom: "-50px" }}
        ></Card>
      </div>
      <form id="payment-form" className="stripe-form" onSubmit={handleSubmit}>
        <CardElement
          id="card-element"
          options={cardStyle}
          onChange={handleChange}
        ></CardElement>
        <button
          className="stripe-button"
          disabled={processing || disabled || succeeded}
        >
          <span id="button-text">
            {" "}
            {processing ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              <div>Pay</div>
            )}
          </span>
        </button>
        <br />
        {error && (
          <div className="card-error" role="alert">
            {error}
          </div>
        )}
        <br />
        <p className={succeeded ? "result-message" : "result-message hidden"}>
          Payment Successful.
          <Link to="/user/history"> See it in your purchase history</Link>
        </p>
      </form>
    </>
  );
};

export default StripeCheckout;
