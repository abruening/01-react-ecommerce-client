import React, { useState, useEffect, useRef } from "react";
import UserNav from "../../component/nav/UserNav";
import { getOrders } from "../../helpers/user";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import ShowPaymentInfo from "../../component/cards/ShowPaymentInfo";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  PDFViewer,
} from "@react-pdf/renderer";
import Invoice from "../../component/order/Invoice";

const History = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));
  const componentRef = useRef();

  const loadUserOrders = () => {
    getOrders(user.token)
      .then((res) => {
        setOrders(res.data);
      })
      .catch();
  };

  useEffect(() => {
    loadUserOrders();
  }, []);

  const showOrderInTable = (order) => (
    <table className="table table-bordered">
      <thead className="thead-light">
        <tr>
          <th scope="col">Title</th>
          <th scope="col">Price</th>
          <th scope="col">Brand</th>
          <th scope="col">Color</th>
          <th scope="col">Count</th>
          <th scope="col">Shipping</th>
        </tr>
      </thead>
      <tbody>
        {order.products.map((product, i) => (
          <tr key={i}>
            <td>
              <b>{product.product.title}</b>
            </td>
            <td className="text-right">$ {product.product.price.toFixed(2)}</td>
            <td>{product.product.brand}</td>
            <td>{product.color}</td>
            <td className="text-right">{product.count.toFixed(2)}</td>
            <td>
              {product.product.shipping === "Yes" ? (
                <CheckCircleOutlined className="text-primary" />
              ) : (
                <CloseCircleOutlined className="text-danger" />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const showEachOrders = () =>
    orders.reverse().map((order, i) => (
      <div key={i} className="m-5 p-3 card">
        <ShowPaymentInfo order={order} />
        {showOrderInTable(order)}
        <div className="row">
          <div className="col">{showDownloadLink(order)}</div>
        </div>
      </div>
    ));

  const showDownloadLink = (order) => (
    <PDFDownloadLink
      document={<Invoice order={order}></Invoice>}
      fileName="invoice.pdf"
      className="btn btn-sm btn-block btn-outline-primary"
    >
      Download PDF
    </PDFDownloadLink>
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <UserNav></UserNav>
        </div>
        <div className="col text-center">
          <h4>
            {orders.length > 0 ? "User purchase orders" : " No purchase orders"}
          </h4>

          {showEachOrders()}
        </div>
      </div>
    </div>
  );
};

export default History;
