import React, { useState, useEffect } from "react";
import AdminNav from "../../../component/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getCategories } from "../../../helpers/category";
import {
  getSubCategory,
  updateSubCategory,
} from "../../../helpers/subcategory";
import CategoryForm from "../../../component/forms/CategoryForm";

const SubCategoryUpdate = ({ history, match }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const loadCategories = () => {
    getCategories().then((res) => {
      setCategories(res.data);
    });
  };

  const loadSubCategories = () => {
    getSubCategory(match.params.slug).then((e) => {
      setName(e.data.name);
      setCategory(e.data.parent);
    });
  };

  useEffect(() => {
    loadCategories();
    loadSubCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    updateSubCategory(match.params.slug, { name, parent: category }, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        history.goBack();
        toast.success(`${res.data.name} is updated`);
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
          <h4>Update Sub-Category</h4>
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Please Select a Category</option>
              {categories.length > 0 &&
                categories.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.name}
                  </option>
                ))}
            </select>
          </div>
          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
          ></CategoryForm>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryUpdate;
