import React, { useState, useEffect } from "react";
import AdminNav from "../../../component/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { updateCategory, getCategory } from "../../../helpers/category";
import CategoryForm from "../../../component/forms/CategoryForm";

const CategoryUpdate = ({ history, match }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const loadCategory = () => {
    getCategory(match.params.slug).then((res) => {
      setName(res.data.name);
    });
  };

  useEffect(() => {
    loadCategory();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    updateCategory(match.params.slug, { name }, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        toast.success(`${res.data.name} is updated`);
        history.goBack();
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.status === 400) {
          toast.error(err.response.data);
        }
      });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <AdminNav></AdminNav>
        </div>
        <div className="col">
          <h4>Update Category</h4>
          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
          ></CategoryForm>
          <hr></hr>
        </div>
      </div>
    </div>
  );
};

export default CategoryUpdate;
