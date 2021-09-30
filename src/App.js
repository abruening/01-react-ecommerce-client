import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./component/nav/Header";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RegisterComplete from "./pages/auth/RegisterComplete";
import Home from "./pages/Home";
import UserRoute from "./routes/UserRoute";

import { auth } from "./firebase";
import { useDispatch } from "react-redux";
import { type } from "./types/type";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { currentUser } from "./helpers/auth";
import History from "./pages/user/History";
import Password from "./pages/user/Password";
import Wishlist from "./pages/user/Wishlist";
import AdminRoute from "./routes/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CategoryCreate from "./pages/admin/Category/CategoryCreate";
import CategoryUpdate from "./pages/admin/Category/CategoryUpdate";
import SubCategoryCreate from "./pages/admin/SubCategory/SubCategoryCreate";
import SubCategoryUpdate from "./pages/admin/SubCategory/SubCategoryUpdate";
import ProductCreate from "./pages/admin/Product/ProductCreate";
import AllProducts from "./pages/admin/Product/AllProducts";
import ProductUpdate from "./pages/admin/Product/ProductUpdate";
import Product from "./pages/Product";
import CategoryHome from "./pages/category/CategoryHome";
import SubCategoryHome from "./pages/subcategory/SubCategoryHome";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import SideDrawer from "./component/drawer/SideDrawer";
import CheckOut from "./pages/CheckOut";
import CreateCouponPage from "./pages/coupon/CreateCouponPage";
import Payment from "./pages/Payment";

function App() {
  const dispatch = useDispatch();

  // para verificar el estado de la autenticacion

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        currentUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: type.LOG_IN_USER,
              payload: {
                displayName: res.data.name,
                email: res.data.email,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              },
            });
          })
          .catch((error) => {});
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  // Limpiar

  return (
    <>
      <Header></Header>
      <SideDrawer></SideDrawer>
      <ToastContainer></ToastContainer>
      <Switch>
        <Route exact path="/" component={Home}></Route>
        <Route exact path="/login" component={Login}></Route>
        <Route exact path="/register" component={Register}></Route>
        <Route exact path="/forgot/password" component={ForgotPassword}></Route>
        <UserRoute exact path="/user/history" component={History}></UserRoute>
        <UserRoute exact path="/user/password" component={Password}></UserRoute>
        <UserRoute exact path="/user/wishlist" component={Wishlist}></UserRoute>
        <Route exact path="/product/:slug" component={Product}></Route>
        <Route exact path="/category/:slug" component={CategoryHome}></Route>
        <Route exact path="/shop" component={Shop}></Route>
        <Route exact path="/cart" component={Cart}></Route>
        <UserRoute exact path="/checkout" component={CheckOut}></UserRoute>
        <UserRoute exact path="/payment" component={Payment}></UserRoute>
        <Route
          exact
          path="/subcategory/:slug"
          component={SubCategoryHome}
        ></Route>
        <AdminRoute
          exact
          path="/admin/dashboard"
          component={AdminDashboard}
        ></AdminRoute>
        <AdminRoute
          exact
          path="/admin/category"
          component={CategoryCreate}
        ></AdminRoute>
        <AdminRoute
          exact
          path="/admin/subcategory"
          component={SubCategoryCreate}
        ></AdminRoute>
        <AdminRoute
          exact
          path="/admin/category/:slug"
          component={CategoryUpdate}
        ></AdminRoute>
        <AdminRoute
          exact
          path="/admin/subcategory/:slug"
          component={SubCategoryUpdate}
        ></AdminRoute>
        <AdminRoute
          exact
          path="/admin/product"
          component={ProductCreate}
        ></AdminRoute>
        <AdminRoute
          exact
          path="/admin/products"
          component={AllProducts}
        ></AdminRoute>
        <AdminRoute
          exact
          path="/admin/product/:slug"
          component={ProductUpdate}
        ></AdminRoute>
        <AdminRoute
          exact
          path="/admin/coupon"
          component={CreateCouponPage}
        ></AdminRoute>
        <Route
          exact
          path="/register/complete"
          component={RegisterComplete}
        ></Route>

        {/* {user ? <Redirect to="/home"></Redirect> : <Redirect to="/"></Redirect>} */}
      </Switch>
    </>
  );
}

export default App;
