import React from "react";

const ShowPaymentInfo = ({ order, showStatus = true }) => (
  <div>
    <p>
      <span>Order Id: {order.paymentIntent.id}</span>
      {" / "}
      <span>
        Amount:{" "}
        {(order.paymentIntent.amount / 100).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </span>
      {" / "}
      <span>Currency: {order.paymentIntent.currency.toUpperCase()}</span>
      {" / "}
      <span>
        Method: {order.paymentIntent.payment_method_types[0].toUpperCase()}
      </span>
      {" / "}
      <span>Payment: {order.paymentIntent.status.toUpperCase()}</span>
      {" / "}
      <span>
        Order On:{" "}
        {new Date(order.paymentIntent.created * 1000).toLocaleString()}
      </span>
      {" / "}
      <br />
      {showStatus && (
        <span className="badge bg-primary text-white">
          STATUS: {order.orderStatus.toUpperCase()}
        </span>
      )}
    </p>
  </div>
);

export default ShowPaymentInfo;
