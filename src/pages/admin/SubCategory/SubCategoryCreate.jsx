import React, { useState, useEffect } from "react";
import AdminNav from "../../../component/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getCategories } from "../../../helpers/category";
import {
  createSubCategory,
  getSubCategories,
  removeSubCategory,
} from "../../../helpers/subcategory";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import CategoryForm from "../../../component/forms/CategoryForm";
import LocalSearch from "../../../component/forms/LocalSearch";

const SubCategoryCreate = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  const loadSubCategories = () => {
    getSubCategories().then((res) => {
      setSubCategories(res.data);
    });
  };
  const loadCategories = () => {
    getCategories().then((res) => {
      setCategories(res.data);
    });
  };

  useEffect(() => {
    loadSubCategories();
    loadCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (category === "") {
      toast.error("Must Select a Category");
      return;
    }
    setLoading(true);
    createSubCategory({ name, parent: category }, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        setCategory("");
        loadSubCategories();
        toast.success(`${res.data.name} is created`);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.status === 400) {
          toast.error(err.response.data);
        }
      });
  };

  const search = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

  const handleRemove = async (slug) => {
    if (window.confirm("Delete?")) {
      setLoading(true);
      removeSubCategory(slug, user.token)
        .then((res) => {
          setLoading(false);
          loadSubCategories();
          toast.error(`${res.data.name} is deleted`);
        })
        .catch((err) => {
          setLoading(false);
          if (err.response.status === 400) {
            toast.error(err.response.data);
          }
        });
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <AdminNav></AdminNav>
        </div>
        <div className="col">
          <h4>Create Sub-Category</h4>
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
          <LocalSearch keyword={keyword} setKeyword={setKeyword}></LocalSearch>
          <hr></hr>
          {subcategories.filter(search(keyword)).map((e) => (
            <div className="alert alert-secondary" key={e._id}>
              {e.name}
              <span
                onClick={() => handleRemove(e.slug)}
                className="btn btn-sm float-right"
              >
                <DeleteOutlined className="text-danger"></DeleteOutlined>
              </span>
              <Link to={`/admin/subcategory/${e.slug}`}>
                <span className="btn btn-sm float-right">
                  <EditOutlined></EditOutlined>
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubCategoryCreate;
