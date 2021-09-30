import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCart,
  emptyCart,
  saveAddress,
  applyCoupon,
  createCashOrderForUser,
} from "../helpers/user";
import NumberFormat from "react-number-format";
import { type } from "../types/type";
import { toast } from "react-toastify";

const CheckOut = ({ history }) => {
  const dispatch = useDispatch();
  const { user, coupons, COD } = useSelector((state) => ({ ...state }));
  const [products, setProducts] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [address, setAddress] = useState("");
  const [hasAddress, setHasAddress] = useState(false);

  useEffect(() => {
    getCart(user.token)
      .then((res) => {
        setProducts(res.data.products);
        setCartTotal(res.data.cartTotal);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [address]);

  const handleEmptyCart = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
      dispatch({ type: type.ADD_TO_CART, payload: [] });
      emptyCart(user.token)
        .then((res) => {
          setProducts([]);
          setCartTotal(0);
          dispatch({
            type: type.COUPON_APPLIED,
            payload: {
              couponApplied: false,
              totalAfterDiscount: 0,
              discountError: "",
            },
          });
          history.push("/");
          toast.success("Cart is empty.  Continue Shopping");
        })
        .catch((err) => console.log(err));
    }
  };

  const saveAddressToDb = () => {
    saveAddress(address, user.token)
      .then((res) => {
        if (res.data.ok) {
          toast.success("Address Saved!");
          setHasAddress(true);
        }
      })
      .catch((err) => {});
  };

  const showAddress = () => (
    <>
      <textarea onChange={(e) => setAddress(e.target.value)}></textarea>
      <br></br>
      <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>
        Save
      </button>
    </>
  );

  const showProductSummary = () => (
    <>
      {products.map((el, i) => (
        <div key={i}>
          <p>
            {el.product.title} ({el.color}) - {el.count} x
            <NumberFormat
              value={el.price}
              displayType={"text"}
              thousandSeparator={true}
              prefix={" $ "}
            />
            =
            <NumberFormat
              value={el.count * el.price}
              displayType={"text"}
              thousandSeparator={true}
              prefix={" $ "}
            />
          </p>
        </div>
      ))}
    </>
  );

  const applyDiscountCoupon = () => {
    applyCoupon(coupon, user.token).then((res) => {
      if (res.data && !res.data.err) {
        dispatch({
          type: type.COUPON_APPLIED,
          payload: {
            couponApplied: true,
            totalAfterDiscount: res.data,
            discountError: "",
          },
        });
      }
      // error
      if (res.data.err) {
        dispatch({
          type: type.COUPON_APPLIED,
          payload: {
            couponApplied: false,
            totalAfterDiscount: 0,
            discountError: res.data.err,
          },
        });

        // update redux coupon applied true/false
      }
    });
  };

  const showApplyCoupon = () => (
    <>
      <input
        onChange={(e) => setCoupon(e.target.value)}
        type="text"
        className="form-control"
        placeholder="input your coupon"
      ></input>
      <button onClick={applyDiscountCoupon} className="btn btn-primary mt-2">
        Apply
      </button>
    </>
  );

  const createCashOrder = () => {
    createCashOrderForUser(user.token, COD, coupons)
      .then((res) => {
        if (res.data && !res.data.err) {
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
          dispatch({ type: type.CASH_ON_DELIVERY, payload: false });
          emptyCart(user.token);
          setTimeout(() => {
            history.push("/user/history");
          }, 1000);
        }
      })
      .catch((err) => {});
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <h4>Delivery Address</h4>
        <br />
        <br />
        {showAddress()}
        <hr />
        <h4>Got Coupon?</h4>
        <br />
        {showApplyCoupon()}
        <br />
        {coupons.discountError && (
          <p className="bg-danger p-2">{coupons.discountError}</p>
        )}
      </div>
      <div className="col-md-6">
        <h4>Order Summary</h4>
        <hr />
        <p>Products {products.length ? products.length : 0}</p>
        <hr />
        <p>List of Products</p>
        <hr />
        {showProductSummary()}
        <hr />
        <p>
          Cart Total:
          <NumberFormat
            value={cartTotal}
            displayType={"text"}
            thousandSeparator={true}
            prefix={" $ "}
          />
        </p>
        {coupons.totalAfterDiscount > 0 && (
          <>
            <p className="bg-success p-2 m-0">Discount Applied:</p>
            <p className="bg-success p-2 m-0">
              Total Payable:
              <NumberFormat
                value={coupons.totalAfterDiscount}
                displayType={"text"}
                thousandSeparator={true}
                prefix={" $ "}
              />
            </p>
          </>
        )}
        <div className="row">
          <div className="col-md-6">
            {COD ? (
              <button
                disabled={!hasAddress || !products.length}
                className="btn btn-primary"
                onClick={createCashOrder}
              >
                Place Order
              </button>
            ) : (
              <button
                disabled={!hasAddress || !products.length}
                className="btn btn-primary"
                onClick={() => history.push("/payment")}
              >
                Place Order
              </button>
            )}
          </div>
          <div className="col-md-6">
            <button
              disabled={!products.length}
              className="btn btn-danger"
              onClick={handleEmptyCart}
            >
              Empty Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
