import React from "react";
import { Drawer } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { type } from "../../types/type";

const SideDrawer = () => {
  const dispatch = useDispatch();

  const { drawer, cart } = useSelector((state) => ({ ...state }));
  const imageStyle = {
    with: "100%",
    height: "50px",
    objectFit: "cover",
  };

  return (
    <Drawer
      title={`Cart / ${cart.length} Products`}
      placement="right"
      closable={false}
      onClose={() => {
        dispatch({ type: type.SET_VISIBLE, payload: false });
      }}
      visible={drawer}
    >
      {cart.map((el) => (
        <div key={el._id} className="row">
          <div className="col">
            {el.images[0] ? (
              <>
                <img src={el.images[0].url} style={{ imageStyle }}></img>
                <p className="text-center bg-secondary text-light">
                  {el.title} x{el.count}
                </p>
              </>
            ) : (
              <>
                No Image
                <p className="text-center bg-secondary text-light">
                  {el.title} x {el.count}
                </p>
              </>
            )}
          </div>
        </div>
      ))}
      <Link to="/cart">
        <button
          onClick={() => {
            dispatch({ type: type.SET_VISIBLE, payload: false });
          }}
          className="btn btn-primary btn-raised btn-block "
        >
          Go to Cart
        </button>
      </Link>
    </Drawer>
  );
};

export default SideDrawer;
