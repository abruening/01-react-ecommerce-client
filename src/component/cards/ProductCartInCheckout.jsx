import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import ModalImage from "react-modal-image";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { type } from "../../types/type";

const ProductCartInCheckout = ({ product }) => {
  const dispatch = useDispatch();
  const [colors, setColors] = useState([
    "Black",
    "Brown",
    "Silver",
    "White",
    "Blue",
  ]);

  const handleColorChange = (e) => {
    let cart = [];

    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      cart.map((el, i) => {
        if (el._id === product._id) {
          cart[i].color = e.target.value;
        }
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch({ type: type.ADD_TO_CART, payload: cart });
    }
  };

  const handleQuantityChange = (e) => {
    let count = e.target.value < 1 ? 1 : e.target.value;
    if (e.target.value > product.quantity) {
      toast.error(`Max avaible quantity: ${product.quantity}`);
      return;
    }
    let cart = [];
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      cart.map((el, i) => {
        if (el._id === product._id) {
          cart[i].count = count;
        }
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch({ type: type.ADD_TO_CART, payload: cart });
    }
  };

  const handleRemove = () => {
    let cart = [];
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      cart.map((el, i) => {
        if (el._id === product._id) {
          cart.splice(i, 1);
        }
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch({ type: type.ADD_TO_CART, payload: cart });
    }
  };

  return (
    <tbody>
      <tr>
        <td>
          <div style={{ width: "50px", height: "auto" }}>
            {product.images.length ? (
              <ModalImage
                small={product.images[0].url}
                large={product.images[0].url}
              ></ModalImage>
            ) : (
              "No Image"
            )}
          </div>
        </td>
        <td width="200px">{product.title}</td>
        <td width="100px" className="text-right">
          $ {product.price}
        </td>
        <td>{product.brand}</td>
        <td>
          <select
            onChange={handleColorChange}
            name="color"
            id="color"
            className="form-control"
          >
            {product.color ? (
              <option value={product.color}>{product.color}</option>
            ) : (
              <option>Select</option>
            )}
            {colors
              .filter((el) => el !== product.color)
              .map((el) => (
                <option value={el} key={el}>
                  {el}
                </option>
              ))}
          </select>
        </td>
        <td>
          <input
            type="number"
            value={product.count}
            className="form-control text-right"
            onChange={handleQuantityChange}
          ></input>
        </td>
        <td className="text-center">
          {product.shipping === "Yes" ? (
            <CheckCircleOutlined className="text-success"></CheckCircleOutlined>
          ) : (
            <CloseCircleOutlined className="text-danger"></CloseCircleOutlined>
          )}
        </td>
        <td className="text-center">
          <a>
            <CloseOutlined
              className="text-danger"
              onClick={handleRemove}
            ></CloseOutlined>
          </a>
        </td>
      </tr>
    </tbody>
  );
};

export default ProductCartInCheckout;
