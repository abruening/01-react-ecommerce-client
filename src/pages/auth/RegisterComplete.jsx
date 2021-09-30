import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import { type } from "../../types/type";
import { createOrUpdateUser } from "../../helpers/auth";

const RegisterComplete = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [users, setUser] = useState({
    email: "",
    username: "",
    password1: "",
    password2: "",
  });

  const { email, username, password1, password2 } = users;

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    const ac = new AbortController();
    setUser({
      ...user,
      email: window.localStorage.getItem("emailForRegistration"),
    });
    return () => ac.abort();
  }, [user, history]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleClick = async () => {
    if (!password1 || !email) {
      toast.error("El Correo Electronico y Contraseña es requerido");
      return;
    }
    if (password1.length < 6) {
      toast.error("La Contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (password1 !== password2) {
      toast.error("Las Contraseñas ingresadas no son iguales");
      setUser({ ...user, password1: "", password2: "" });
      return;
    }

    try {
      const result = await auth.signInWithEmailLink(
        email,
        window.location.href // Direccion web de la pagina actual
      );

      if (result.user.emailVerified) {
        // remover usuario de localstorage
        window.localStorage.removeItem("emailForRegistration");
        // obenter token de usuario
        let user = auth.currentUser;

        await user.updatePassword(password1);
        await user.updateProfile({ displayName: username });
        const idToken = await user.getIdTokenResult();
        createOrUpdateUser(idToken.token)
          .then((res) => {
            dispatch({
              type: type.LOG_IN_USER,
              payload: {
                displayName: res.data.name,
                email: res.data.email,
                token: idToken.token,
                role: res.data.role,
                _id: res.data._id,
              },
            });
          })
          .catch((error) => {});
        // redirec

        history.push("/");
        toast.success("Registro Realizado Correctamente");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const completeRegistrationForm = () => (
    <form>
      <input type="email" className="form-control" value={email} disabled />
      <input
        type="text"
        className="form-control"
        value={username}
        onChange={handleChange}
        autoFocus
        placeholder="Enter your username"
        id="username"
        name="username"
      />
      <input
        type="password"
        className="form-control"
        value={password1}
        onChange={handleChange}
        name="password1"
        id="password1"
        placeholder="Enter your password"
      />
      <input
        type="password"
        className="form-control"
        value={password2}
        onChange={handleChange}
        name="password2"
        id="password2"
        placeholder="Re-Enter your password"
      />
      <Button
        type="primary"
        block
        shape="round"
        style={{ marginTop: "10px" }}
        className="btn btn-raised"
        onClick={handleClick}
      >
        Complete Registration
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
          <h4>Register Complete</h4>

          {completeRegistrationForm()}
        </div>
      </div>
    </div>
  );
};

export default RegisterComplete;
