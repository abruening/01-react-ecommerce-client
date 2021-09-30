import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { Button } from "antd";
import { CheckOutlined } from "@ant-design/icons";

const Register = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    if (user && user.token) {
      history.push("/");
    }
  }, [user, history]);

  const handleClick = async () => {
    if (!email) {
      toast.error("El Correo Electronico es requerido");
      return;
    }
    const config = {
      url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
      handleCodeInApp: true,
    };
    try {
      await auth.sendSignInLinkToEmail(email, config);
      toast.success(
        `Email sent to ${email}. Click the link to complete your registration.`
      );
      window.localStorage.setItem("emailForRegistration", email);
      setEmail("");
      history.push("/");
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleChange = (e) => {
    setEmail(e.target.value);
  };
  const registerForm = () => (
    <form>
      <input
        type="email"
        className="form-control"
        value={email}
        onChange={handleChange}
        autoFocus
      />
      <Button
        type="primary"
        block
        style={{ marginTop: "10px" }}
        shape="round"
        icon={<CheckOutlined />}
        onClick={handleClick}
      >
        Register
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
          <h4>Register</h4>
          {registerForm()}
        </div>
      </div>
    </div>
  );
};

export default Register;
