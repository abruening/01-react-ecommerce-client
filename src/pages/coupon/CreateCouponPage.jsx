import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import { getCoupons, removeCoupon, createCoupon } from "../../helpers/coupon";
import "react-datepicker/dist/react-datepicker.css";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AdminNav from "../../component/nav/AdminNav";

const CreateCouponPage = () => {
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState(new Date());
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadAllCoupons();
  }, []);

  const loadAllCoupons = () => {
    getCoupons()
      .then((res) => setCoupon(res.data))
      .catch((err) => console.log(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createCoupon({ name, expiry, discount }, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        setDiscount("");
        setExpiry(new Date());
        loadAllCoupons();
        toast.success("Coupon Created!");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleRemove = (couponId) => {
    if (window.confirm("Delete?")) {
      removeCoupon(couponId, user.token)
        .then((res) => {
          toast.error("Coupon Deleted.");
          loadAllCoupons();
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <AdminNav></AdminNav>
        </div>
        <div className="col-md-9">
          <h4>Create Coupon</h4>
          <hr />
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="text-muted">Name</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
                value={name}
                id={name}
                name={name}
                autoFocus
                required
              ></input>
            </div>
            <div className="form-group">
              <label className="text-muted">Discount %</label>
              <input
                type="number"
                className="form-control"
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
                id={discount}
                name={discount}
                required
              ></input>
            </div>
            <div className="form-group">
              <label className="text-muted">Expiry</label>
              <DatePicker
                className="form-control"
                selected={new Date()}
                value={expiry}
                name={expiry}
                id={expiry}
                onChange={(date) => setExpiry(date)}
                required
              ></DatePicker>
            </div>

            <button className="btn btn-outline-primary">Save</button>
          </form>
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Expiry</th>
                <th scope="col">Discount</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {coupon.map((e, i) => (
                <tr key={i}>
                  <td className="">{e.name}</td>
                  <td>{new Date(e.expiry).toLocaleDateString()}</td>
                  <td className="text-right">{e.discount}%</td>
                  <td>
                    <span
                      onClick={() => handleRemove(e._id)}
                      className="btn btn-sm float-right"
                    >
                      <DeleteOutlined className="text-danger"></DeleteOutlined>
                    </span>
                    <Link to={`/admin/coupon/${e._id}`}>
                      <span className="btn btn-sm float-left">
                        <EditOutlined></EditOutlined>
                      </span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreateCouponPage;
