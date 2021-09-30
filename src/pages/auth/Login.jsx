import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { GoogleOutlined, MailOutlined } from "@ant-design/icons";
import { auth, googleAuthProvider } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { type } from "../../types/type";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { createOrUpdateUser } from "../../helpers/auth";

const Login = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const { user } = useSelector((state) => ({ ...state }));

  const roleBaseRedirect = (res) => {
    let intended = history.location.state;
    if (intended) {
      console.log(intended.from);
      history.push(intended.from);
    } else {
      if (res.data.role === "admin") {
        history.push("/admin/dashboard");
      } else {
        history.push("/user/history");
      }
    }
  };

  useEffect(() => {
    const ac = new AbortController();
    let intended = history.location.state;
    if (intended) {
      return;
    } else {
      if (user && user.token) {
        history.push("/");
      }
    }
    return () => ac.abort();
  }, [history]);

  const handleClick = async () => {
    setLoading(true);
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();

      createOrUpdateUser(idTokenResult.token)
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
          roleBaseRedirect(res);
          setLoading(false);
        })
        .catch((error) => {});
    } catch (error) {
      setPassword("");
      toast.error(error.message);
      setLoading(false);
    }
  };
  const handleGoogleLogin = async () => {
    setLoading(true);
    auth
      .signInWithPopup(googleAuthProvider)
      .then(async (result) => {
        const { user } = result;
        const idTokenResult = await user.getIdTokenResult();
        createOrUpdateUser(idTokenResult.token).then((res) => {
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
          roleBaseRedirect(res);
          setLoading(false);
        });
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const loginForm = () => (
    <form>
      <input
        type="email"
        className="form-control"
        value={email}
        autoFocus
        placeholder="Enter your email"
        name="email"
        id="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="form-control"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        name="password"
        id="password"
        placeholder="Enter your password"
      />
      <Button
        type="primary"
        block
        shape="round"
        onClick={handleClick}
        icon={<MailOutlined />}
        size="large"
        style={{ marginTop: "10px" }}
        disabled={!email || password.length < 6}
      >
        Login with Email/Password
      </Button>
    </form>
  );

  return (
    <div
      className="container p-5"
      style={{ marginTop: "100px", width: "500px" }}
    >
      <div className="row">
        <div className="col-md-12 offset-md-12">
          {!loading ? (
            <h4>Login</h4>
          ) : (
            <h4 className="text-danger">Loading...</h4>
          )}

          {loginForm()}
          <Button
            type="danger"
            onClick={handleGoogleLogin}
            block
            shape="round"
            icon={<GoogleOutlined />}
            size="large"
          >
            Login with Google
          </Button>
          <Link
            to="/forgot/password"
            className="float-right text-danger"
            style={{ marginTop: "15px" }}
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
