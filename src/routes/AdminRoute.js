import React, { useEffect, useState } from "react";
import { Route } from "react-router";
import { useSelector } from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";
import { currentAdmin } from "../helpers/auth";

const AdminRoute = ({ component: Component, ...rest }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (user && user.token) {
      console.log(user);
      currentAdmin(user.token)
        .then((res) => {
          setOk(true);
        })
        .catch((err) => {
          console.log("admin route error", err);
          setOk(false);
        });
    }
  }, [user]);

  return (
    <Route
      {...rest}
      component={(props) =>
        ok ? <Component {...props} /> : <LoadingToRedirect></LoadingToRedirect>
      }
    />
  );
};

export default AdminRoute;
