import React from "react";
import { Route } from "react-router";
import { useSelector } from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";

const UserRoute = ({ component: Component, ...rest }) => {
  const { user } = useSelector((state) => ({ ...state }));
  return (
    <Route
      {...rest}
      component={(props) =>
        user && user.token ? (
          <Component {...props} />
        ) : (
          <LoadingToRedirect></LoadingToRedirect>
        )
      }
    />
  );
};

export default UserRoute;
