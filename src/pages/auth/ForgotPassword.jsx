import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "../../firebase";

const ForgotPassword = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    if (user && user.token) {
      history.push("/");
    }
  }, [user, history]);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };
  const handleClick = async () => {
    setLoading(true);

    const config = {
      url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT_URL,
      handleCodeInApp: true,
    };

    await auth
      .sendPasswordResetEmail(email, config)
      .then(() => {
        setEmail("");
        setLoading(false);
        toast.success("Check your email for password reset link");
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  };
  return (
    <div className="container col-md-6 offset-md-6 p-5">
      {loading ? (
        <h4 className="text-danger">Loading...</h4>
      ) : (
        <h4>Forgot Password</h4>
      )}
      <form>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={handleChange}
          placeholder="Type your email"
          autoFocus
        />
        <Button
          type="primary"
          onClick={handleClick}
          block
          shape="round"
          style={{ marginTop: "15px" }}
          disabled={!email}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
