import React, { useState } from "react";
import { Divider, Menu, Badge } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  UserAddOutlined,
  LogoutOutlined,
  AppstoreAddOutlined,
  ShopOutlined,
  CarOutlined,
  ShoppingOutlined,
  CarryOutOutlined,
  ShoppingCartOutlined,
  WindowsFilled,
} from "@ant-design/icons";
import { Link, useHistory } from "react-router-dom";
import { auth } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { type } from "../../types/type";
import Search from "../../component/forms/Search";
//import { IconsList } from "../../helpers/IconsList";

const { SubMenu, Item } = Menu;

const Header = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { user, cart } = useSelector((state) => ({ ...state })); // acceder a los datos del states

  // const [itemsMenu, setItemsMenu] = useState([
  //   {
  //     nombre: "Prueba1",
  //     visible: true,
  //     icon: IconsList("HomeOutlined"),
  //     path: "/login",
  //     menuType: "SubMenu",
  //   },
  //   {
  //     nombre: "Prueba2",
  //     visible: true,
  //     icon: IconsList("UserOutlined"),
  //     path: "/register",
  //     menuType: "ItemMenu",
  //   },
  // ]);

  const [current, setCurrent] = useState("home");

  const handleClick = (e) => {
    setCurrent(e.key);
  };
  const handleLogout = () => {
    if (cart) {
      let resp = window.confirm(
        "Tiene productos en el carrito, ¿Desea Salir Igual?"
      );
      if (!resp) {
        history.goBack();
        return;
      }
    }
    auth.signOut();
    if (typeof window !== undefined) {
      localStorage.removeItem("cart");
    }
    dispatch({ type: type.ADD_TO_CART, payload: [] });
    dispatch({
      type: type.LOG_OUT_USER,
      payload: null,
    });
    history.push("/login");
  };

  return (
    <>
      <Menu
        onClick={handleClick}
        selectedKeys={[current]}
        mode="horizontal"
        theme="dark"
        style={{ overflow: "hidden" }}
      >
        {user && (
          <Item key="home" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Item>
        )}
        <Item key="shop" icon={<ShopOutlined />}>
          <Link to="/shop">Shop</Link>
        </Item>
        <Item key="cart" icon={<ShoppingCartOutlined />}>
          <Link to="/cart">
            Cart
            <Badge
              count={cart.length}
              offset={[3, -15]}
              style={{ color: "white" }}
            ></Badge>
          </Link>
        </Item>
        {user && (
          <SubMenu
            key="username"
            icon={<SettingOutlined />}
            title={user.displayName}
            className="float-right"
          >
            {user && user.role === "subscriber" && (
              <Item key="dashboard" icon={<UserOutlined />}>
                <Link to="/user/history">Dashboard</Link>
              </Item>
            )}

            {user && user.role === "admin" && (
              <Item key="dashboard" icon={<UserOutlined />}>
                <Link to="/admin/dashboard">Dashboard</Link>
              </Item>
            )}
            <Item key="item2" icon={<UserOutlined />}>
              <Link to="/login">item 2</Link>
            </Item>
            <Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
              <Link to="/logout">Logout</Link>
            </Item>
          </SubMenu>
        )}
        {!user && (
          <Item key="login" icon={<UserOutlined />}>
            <Link to="/login">Login</Link>
          </Item>
        )}
        {!user && (
          <Item key="register" icon={<UserAddOutlined />}>
            <Link to="/register">Register</Link>
          </Item>
        )}
      </Menu>
      <div className="row col-md-12">
        <div className="col-md-6 text-center">
          <Search></Search>
        </div>
      </div>
    </>
  );
};

export default Header;
