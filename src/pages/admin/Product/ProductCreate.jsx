import React, { useState, useEffect } from "react";
import AdminNav from "../../../component/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { createProduct } from "../../../helpers/product";
import {
  getCategories,
  getCategorySubCategory,
} from "../../../helpers/category";
import ProductCreateForm from "../../../component/forms/ProductCreateForm";
import FileUpload from "../../../component/forms/FileUpload";

const initialState = {
  title: "",
  description: "",
  price: "",
  categories: [],
  category: "",
  subcategory: [],
  shipping: "",
  quantity: "",
  images: [],
  colors: ["Black", "Brown", "Silver", "White", "Blue"],
  brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"],
  color: "",
  brand: "",
};

const ProductCreate = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [showSubCategory, setShowSubCategory] = useState(false);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);

  const loadCategories = () => {
    getCategories().then((res) => {
      setValues({ ...values, categories: res.data });
    });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    createProduct(values, user.token)
      .then((res) => {
        setLoading(false);
        toast.success(`${res.data.title} is created`);
        window.location.reload();
      })
      .catch((err) => {
        setLoading(false);
        // if (err.response.status === 400) {
        toast.error(err.response.data.err);
        // }
      });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    if (e.target.name === "category") {
      setShowSubCategory(false);
      setSubCategoryOptions([]);
      if (e.target.value !== "") {
        getCategorySubCategory(e.target.value)
          .then((res) => {
            setShowSubCategory(true);
            setSubCategoryOptions(res.data);
          })
          .catch((err) => {
            toast.error(err.response.data.err);
          });
      }
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav></AdminNav>
        </div>
        <div className="col-md-10">
          <h4>Create Product</h4>
          <hr />
          <div>
            <FileUpload
              values={values}
              setValues={setValues}
              setLoading={setLoading}
            ></FileUpload>
          </div>
          <ProductCreateForm
            handleSubmit={handleSubmit}
            values={values}
            setValues={setValues}
            handleChange={handleChange}
            subCategoryOptions={subCategoryOptions}
            showSubCategory={showSubCategory}
          ></ProductCreateForm>
        </div>
      </div>
    </div>
  );
};
export default ProductCreate;
