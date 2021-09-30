import React, { useEffect, useState } from "react";
import AdminNav from "../../component/nav/AdminNav";
import { getOrders, changeStatus } from "../../helpers/admin";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Orders from "../../component/order/Orders";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));



  const loadOrders = () => {
    getOrders(user.token)
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = (orderId, orderStatus) => {
    changeStatus(orderId, orderStatus, user.token)
      .then((res) => {
        toast.success("Status Updated.");
        loadOrders();
      })
      .catch();
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav></AdminNav>
        </div>
        <div className="col-md-10">
          <h4>Admin Dashboard</h4>
          <Orders orders={orders} handleStatusChange={handleStatusChange}>
           
          </Orders>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
