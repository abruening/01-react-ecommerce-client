import React, { useState, useEffect } from "react";
import AdminNav from "../../../component/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  createCategory,
  getCategories,
  removeCategory,
} from "../../../helpers/category";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import CategoryForm from "../../../component/forms/CategoryForm";
import LocalSearch from "../../../component/forms/LocalSearch";

const CategoryCreate = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  const loadCategories = () => {
    getCategories().then((res) => {
      setCategories(res.data);
    });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createCategory({ name }, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        loadCategories();
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
      removeCategory(slug, user.token)
        .then((res) => {
          setLoading(false);
          loadCategories();
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
          <h4>Create Category</h4>
          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
          ></CategoryForm>
          <LocalSearch keyword={keyword} setKeyword={setKeyword}></LocalSearch>
          <hr></hr>
          {categories.filter(search(keyword)).map((e) => (
            <div className="alert alert-secondary" key={e._id}>
              {e.name}
              <span
                onClick={() => handleRemove(e.slug)}
                className="btn btn-sm float-right"
              >
                <DeleteOutlined className="text-danger"></DeleteOutlined>
              </span>
              <Link to={`/admin/category/${e.slug}`}>
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

export default CategoryCreate;
