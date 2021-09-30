import React, { useEffect, useState } from "react";
import UserNav from "../../component/nav/UserNav";
import { getWishlist, removeWishlist } from "../../helpers/user";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));

  const loadWishlist = () => {
    getWishlist(user.token)
      .then((res) => {
        setWishlist(res.data.wishlist);
      })
      .catch();
  };
  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = (productId) => {
    removeWishlist(productId, user.token)
      .then((res) => {
        loadWishlist();
      })
      .catch();
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav></UserNav>
        </div>
        <div className="col">
          <h4>User Whislist</h4>
          {wishlist.map((wishlist) => (
            <div key={wishlist._id} className="alert alert-secondary">
              <Link to={`/product/${wishlist.slug}`}>{wishlist.title}</Link>
              <span
                className="btn btn-sm float-right text-danger"
                onClick={() => handleRemove(wishlist._id)}
              >
                <DeleteOutlined></DeleteOutlined>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
