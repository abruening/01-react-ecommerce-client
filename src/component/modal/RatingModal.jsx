import React, { useState } from "react";
import { Modal, Button } from "antd";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { StarOutlined } from "@ant-design/icons";
import { useHistory, useParams } from "react-router";

const RatingModal = ({ children }) => {
  let history = useHistory();
  let { slug } = useParams();
  const { user } = useSelector((state) => ({ ...state }));
  const [modalVisible, setModalVisible] = useState(false);

  const handleClick = () => {
    if (user && user.token) {
      setModalVisible(true);
    } else {
      history.push({
        pathname: "/login",
        state: { from: `/product/${slug}` },
      });
    }
  };
  return (
    <>
      <div onClick={handleClick}>
        <StarOutlined className="text-danger"></StarOutlined>
        <br />
        {user ? "Leave Rating" : "Login to Leave Rating"}
      </div>
      <Modal
        title="Leave your Rating"
        centered
        visible={modalVisible}
        onOk={() => {
          setModalVisible(false);
          toast.success("Thanks for your review. It will appear soon");
        }}
        onCancel={() => setModalVisible(false)}
      >
        {children}
      </Modal>
    </>
  );
};

export default RatingModal;
