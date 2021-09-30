import React, { useState } from "react";
import UserNav from "../../component/nav/UserNav";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { Button } from "antd";
import { useSelector } from "react-redux";
import AdminNav from "../../component/nav/AdminNav";

const Password = () => {
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));

  const handleClick = async () => {
    if (password !== password1) {
      toast.error("Password doesn't match");
      setPassword("");
      setPassword1("");
      return;
    }
    setLoading(true);
    await auth.currentUser
      .updatePassword(password)
      .then(() => {
        toast.success("Password Updated!");
        setPassword("");
        setPassword1("");
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.message);
        setPassword("");
        setPassword1("");
        setLoading(false);
      });
  };

  const passwordUpdateForm = () => (
    <form>
      <div className="form-group">
        <input
          type="password"
          id="password"
          value={password}
          name="password"
          className="form-control col-md-4"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter the new password"
          autoFocus
          disabled={loading}
        ></input>
        <br></br>
        <input
          type="password"
          id="password1"
          value={password1}
          name="password1"
          onChange={(e) => setPassword1(e.target.value)}
          placeholder="Confirm the new password"
          className="form-control col-md-4"
          disabled={loading}
        ></input>
        <br></br>
        <Button
          type="danger"
          className="col-md-4"
          shape="round"
          onClick={handleClick}
          style={{ marginTop: "10px" }}
          disabled={!password || loading || password.length < 6}
        >
          Submit
        </Button>
      </div>
    </form>
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          {user.role === "admin" ? <AdminNav></AdminNav> : <UserNav></UserNav>}
        </div>
        <div className="col">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Password Update</h4>
          )}
          {passwordUpdateForm()}
        </div>
      </div>
    </div>
  );
};

export default Password;
