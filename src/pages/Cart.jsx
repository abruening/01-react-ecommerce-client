import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ProductCartInCheckout from "../component/cards/ProductCartInCheckout";
import { userCart } from "../helpers/user";
import { type } from "../types/type";

const Cart = ({ history }) => {
  const { cart, user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const getTotal = () => {
    return cart.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const saveOrderToDb = () => {
    dispatch({ type: type.CASH_ON_DELIVERY, payload: false });
    userCart(cart, user.token)
      .then((res) => {
        if (res.data.ok) {
          history.push("/checkout");
        }
      })
      .catch((err) => {
        console.log("cart save error", err);
      });
  };
  const saveCashOrderToDb = () => {
    dispatch({ type: type.CASH_ON_DELIVERY, payload: true });
    userCart(cart, user.token)
      .then((res) => {
        if (res.data.ok) {
          history.push("/checkout");
        }
      })
      .catch((err) => {
        console.log("cart save error", err);
      });
  };
  const showCartItems = () => (
    <table className="table table-bordered">
      <thead className="thead-light">
        <tr>
          <th scope="col">Image</th>
          <th scope="col">Title</th>
          <th scope="col">Price</th>
          <th scope="col">Brand</th>
          <th scope="col">Color</th>
          <th scope="col">Count</th>
          <th scope="col">Shipping</th>
          <th scope="col">Remove</th>
        </tr>
      </thead>
      {cart.map((el, i) => (
        <ProductCartInCheckout key={i} product={el}></ProductCartInCheckout>
      ))}
      <tbody>
        <tr></tr>
      </tbody>
    </table>
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-8">
          <h4>Cart / {cart.length} Products</h4>
          {!cart.length ? (
            <h4>
              No Products in Cart. <Link to="/shop">Continue Shopping</Link>
            </h4>
          ) : (
            showCartItems()
          )}
        </div>
        <div className="col-md-4">
          <h4>Order Summary</h4>
          <hr />
          <b>Products</b>
          {cart.map((el, i) => (
            <div key={i}>
              <p>
                {el.title} x {el.count} = $ {el.count * el.price}
              </p>
            </div>
          ))}
          <hr />
          Total: <b>$ {getTotal()}</b>
          <hr />
          {user ? (
            <>
              <button
                onClick={saveOrderToDb}
                className="btn btn-sm btn-primary mt-2"
                disabled={!cart.length}
              >
                Proceed to Checkout
              </button>
              <br />
              <button
                onClick={saveCashOrderToDb}
                className="btn btn-sm btn-primary mt-2 text-danger"
                disabled={!cart.length}
              >
                Pay Cash on Delivery
              </button>
            </>
          ) : (
            <button className="btn btn-sm btn-primary mt-2">
              <Link to={{ pathname: "/login", state: { from: "cart" } }}>
                Login to Checkout
              </Link>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
