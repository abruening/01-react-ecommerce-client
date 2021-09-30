import React, { useState, useEffect } from "react";
import AdminNav from "../../../component/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getProduct, updateProduct } from "../../../helpers/product";
import {
  getCategories,
  getCategorySubCategory,
} from "../../../helpers/category";
import FileUpload from "../../../component/forms/FileUpload";
import ProductUpdateForm from "../../../component/forms/ProductUpdateForm";

const initialState = {
  title: "",
  description: "",
  price: "",
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

const ProductUpdate = ({ history, match }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [values, setValues] = useState(initialState);
  const [originalValues, setOriginalValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showSubCategory, setShowSubCategory] = useState(false);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [arraySubCategory, setArraySubCategory] = useState([]);
  const [arraySubCategoryOriginal, setArraySubCategoryOriginal] = useState([]);

  const loadProduct = () => {
    getProduct(match.params.slug).then((res) => {
      setValues({ ...values, ...res.data });
      setOriginalValues({ ...originalValues, ...res.data });
      getCategorySubCategory(res.data.category._id).then((e) => {
        setSubCategoryOptions(e.data);
        setShowSubCategory(true);
        let arr = [];

        res.data.subcategory.map((e) => {
          arr.push(e._id);
        });
        setArraySubCategory((prev) => arr);
        setArraySubCategoryOriginal((prev) => arr);
      });
    });
  };

  const loadCategories = () => {
    getCategories().then((res) => {
      setCategories(res.data);
    });
  };

  useEffect(() => {
    loadProduct();
    loadCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    values.subcategory = arraySubCategory; // Verificar por que no funciana con useState

    updateProduct(match.params.slug, values, user.token)
      .then((res) => {
        setLoading(false);
        toast.success(`${res.data.title} is updated`);
        history.goBack();
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
      if (e.target.value !== "") {
        getCategorySubCategory(e.target.value)
          .then((res) => {
            if (originalValues.category._id === e.target.value) {
              setSubCategoryOptions(res.data);
              setShowSubCategory(true);

              setArraySubCategory((prev) => arraySubCategoryOriginal);
            } else {
              setShowSubCategory(true);
              setSubCategoryOptions(res.data);
              setArraySubCategory([]);
            }
          })
          .catch((err) => {
            toast.error(err.response);
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
          <h4>Update Product</h4>
          <hr />
          <div>
            <FileUpload
              values={values}
              setValues={setValues}
              setLoading={setLoading}
            ></FileUpload>
          </div>
          <ProductUpdateForm
            handleSubmit={handleSubmit}
            values={values}
            setValues={setValues}
            handleChange={handleChange}
            subCategoryOptions={subCategoryOptions}
            showSubCategory={showSubCategory}
            categories={categories}
            arraySubCategory={arraySubCategory}
            setArraySubCategory={setArraySubCategory}
          ></ProductUpdateForm>
        </div>
      </div>
    </div>
  );
};
export default ProductUpdate;
