import React, { useState, useEffect } from "react";
import { getProductsByCount, fetchProductsByFilter } from "../helpers/product";
import { getCategories } from "../helpers/category";
import { getSubCategories } from "../helpers/subcategory";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../component/cards/ProductCard";
import { Menu, Slider, Checkbox, Radio } from "antd";
import {
  BgColorsOutlined,
  DollarOutlined,
  DownSquareOutlined,
  ShoppingFilled,
  StarOutlined,
  AntDesignOutlined,
} from "@ant-design/icons";
import { type } from "../types/type";
import Star from "../component/forms/Star";

const { SubMenu, Item } = Menu;

const Shop = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState([0, 0]);
  const [ok, setOk] = useState(false);
  const [categories, setcategories] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [star, setStar] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [brand, setBrand] = useState("");
  const [brands, setBrands] = useState([
    "Apple",
    "Samsung",
    "Microsoft",
    "Lenovo",
    "ASUS",
  ]);
  const [color, setColor] = useState("");
  const [colors, setColors] = useState([
    "Black",
    "Brown",
    "Silver",
    "White",
    "Blue",
  ]);
  const [shipping, setShipping] = useState("");
  const [shippings, setShippings] = useState(["Yes", "No"]);

  let { search } = useSelector((state) => ({ ...state }));
  const { text } = search;

  const loadAllCategory = () => {
    getCategories()
      .then((a) => setcategories(a.data))
      .catch();
  };

  const loadAllSubCategory = () => {
    getSubCategories()
      .then((a) => setSubCategories(a.data))
      .catch();
  };

  const loadAllProducts = () => {
    setLoading(true);
    getProductsByCount(12)
      .then((a) => {
        setProducts(a.data);
        setLoading(false);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    loadAllProducts();
    loadAllCategory();
    loadAllSubCategory();
  }, []);

  useEffect(() => {
    const delayed = setTimeout(() => {
      fetchProducts({ query: text });
      if (!text) {
        loadAllProducts();
      }
    }, 300);
    return () => clearTimeout(delayed);
  }, [text]);

  const fetchProducts = (arg) => {
    fetchProductsByFilter(arg)
      .then((a) => {
        setProducts(a.data);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    fetchProducts({ price });
  }, [ok]);

  const handleSlider = (value) => {
    setBrand("");
    setSubCategory([]);
    dispatch({ type: type.SEARCH_QUERY, payload: { text: "" } });
    setCategoryIds([]);
    setColor("");
    setShipping("");
    setPrice(value);
    setTimeout(() => {
      setOk(!ok);
    }, 300);
  };

  const showCategories = () =>
    categories.map((el) => (
      <div key={el._id}>
        <Checkbox
          onChange={handleCheck}
          className="pb-2 pl-4 pr-4"
          value={el._id}
          checked={categoryIds.includes(el._id)}
          name="categories"
        >
          {el.name}
        </Checkbox>
        <br />
      </div>
    ));

  const handleCheck = (e) => {
    setBrand("");
    setSubCategory([]);
    setPrice([0, 0]);
    setColor("");
    setShipping("");
    dispatch({ type: type.SEARCH_QUERY, payload: { text: "" } });
    let inTheState = [...categoryIds];
    let justChecked = e.target.value;
    let foundInTheState = inTheState.indexOf(justChecked);

    if (foundInTheState === -1) {
      inTheState.push(justChecked);
    } else {
      inTheState.splice(foundInTheState, 1);
    }
    setCategoryIds(inTheState);
    fetchProducts({ category: inTheState });
  };

  const handleStarClick = (num) => {
    setBrand("");
    setSubCategory([]);
    setPrice([0, 0]);
    setCategoryIds([]);
    setColor("");
    setShipping("");
    dispatch({ type: type.SEARCH_QUERY, payload: { text: "" } });
    setStar(num);
    fetchProducts({ stars: num });
  };

  const showStars = () => (
    <div className="pr-4 pl-4 pb-2">
      <div>
        <Star starClick={handleStarClick} numberOfStars={5}></Star>
      </div>
      <div>
        <Star starClick={handleStarClick} numberOfStars={4}></Star>
      </div>
      <div>
        <Star starClick={handleStarClick} numberOfStars={3}></Star>
      </div>
      <div>
        <Star starClick={handleStarClick} numberOfStars={2}></Star>
      </div>
      <div>
        <Star starClick={handleStarClick} numberOfStars={1}></Star>
      </div>
    </div>
  );

  const handleSubCategory = (el) => {
    setBrand("");
    setSubCategory(el);
    setPrice([0, 0]);
    setCategoryIds([]);
    dispatch({ type: type.SEARCH_QUERY, payload: { text: "" } });
    setStar("");
    setColor("");
    setShipping("");
    fetchProducts({ subcategory: subCategory._id });
  };

  const showSubCategories = () =>
    subCategories.map((el) => (
      <div
        key={el._id}
        onClick={() => handleSubCategory(el)}
        className="p-1 m-1 badge badge-secondary"
        style={{ cursor: "pointer" }}
      >
        {el.name}
      </div>
    ));

  const handleBrand = (e) => {
    setSubCategory([]);
    setPrice([0, 0]);
    setCategoryIds([]);
    dispatch({ type: type.SEARCH_QUERY, payload: { text: "" } });
    setStar("");
    setColor("");
    setShipping("");
    setBrand(e.target.value);
    fetchProducts({ brand: e.target.value });
  };

  const showBrands = () =>
    brands.map((el) => (
      <>
        <Radio
          key={el}
          value={el}
          name={el}
          checked={el === brand}
          onChange={handleBrand}
          className="pr-4 pl-4 pb-2"
        >
          {el}
        </Radio>
        <br />
      </>
    ));

  const handleColor = (e) => {
    setSubCategory([]);
    setPrice([0, 0]);
    setCategoryIds([]);
    dispatch({ type: type.SEARCH_QUERY, payload: { text: "" } });
    setStar("");
    setBrand("");
    setShipping("");
    setColor(e.target.value);
    fetchProducts({ color: e.target.value });
  };

  const showColors = () =>
    colors.map((el) => (
      <>
        <Radio
          key={el}
          value={el}
          name={el}
          checked={el === color}
          onChange={handleColor}
          className="pr-4 pl-4 pb-2"
        >
          {el}
        </Radio>
        <br />
      </>
    ));

  const handleShipping = (e) => {
    setSubCategory([]);
    setPrice([0, 0]);
    setCategoryIds([]);
    dispatch({ type: type.SEARCH_QUERY, payload: { text: "" } });
    setStar("");
    setBrand("");
    setColor("");
    setShipping(e.target.value);
    fetchProducts({ shipping: e.target.value });
  };

  const showShippings = () =>
    shippings.map((el) => (
      <>
        <Radio
          key={el}
          value={el}
          name={el}
          checked={el === shipping}
          onChange={handleShipping}
          className="pr-4 pl-4 pb-2"
        >
          {el}
        </Radio>
        <br />
      </>
    ));

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <h4>Search/Filter Menu</h4>

          <hr />
          <Menu
            mode="inline"
            defaultOpenKeys={[
              "price",
              "brand",
              "rating",
              "categories",
              "subcategories",
              "color",
              "shipping",
            ]}
          >
            <SubMenu
              key="price"
              title={
                <span className="h6">
                  <DollarOutlined></DollarOutlined>
                  <span className="ml-2">Price</span>
                </span>
              }
            >
              <div>
                <Slider
                  className="ml-4 mr-4"
                  tipFormatter={(v) => `$ ${v}`}
                  range
                  value={price}
                  onChange={handleSlider}
                  max={5000}
                  min={0}
                ></Slider>
              </div>
            </SubMenu>

            <SubMenu
              key="categories"
              style={{ marginTop: "-10px" }}
              title={
                <span className="h6">
                  <DownSquareOutlined></DownSquareOutlined>
                  <span className="ml-2">Categories</span>
                </span>
              }
            >
              {showCategories()}
            </SubMenu>
            <SubMenu
              key="rating"
              style={{ marginTop: "-10px" }}
              title={
                <span className="h6">
                  <StarOutlined></StarOutlined>
                  <span className="ml-2">Rating</span>
                </span>
              }
            >
              {showStars()}
            </SubMenu>
            <SubMenu
              key="subcategories"
              style={{ marginTop: "-10px" }}
              title={
                <span className="h6">
                  <DownSquareOutlined></DownSquareOutlined>
                  <span className="ml-2">Sub-Categories</span>
                </span>
              }
            >
              <div className="pl-4 pr-4"> {showSubCategories()}</div>
            </SubMenu>
            <SubMenu
              key="brand"
              style={{ marginTop: "-10px" }}
              title={
                <span className="h6">
                  <AntDesignOutlined></AntDesignOutlined>
                  <span className="ml-2">Brand</span>
                </span>
              }
            >
              <div className="pr-4"> {showBrands()}</div>
            </SubMenu>
            <SubMenu
              key="color"
              style={{ marginTop: "-10px" }}
              title={
                <span className="h6">
                  <BgColorsOutlined></BgColorsOutlined>
                  <span className="ml-2">Color</span>
                </span>
              }
            >
              <div className="pr-4"> {showColors()}</div>
            </SubMenu>
            <SubMenu
              key="shipping"
              style={{ marginTop: "-10px" }}
              title={
                <span className="h6">
                  <ShoppingFilled></ShoppingFilled>
                  <span className="ml-2">Shipping</span>
                </span>
              }
            >
              <div className="pr-4"> {showShippings()}</div>
            </SubMenu>
          </Menu>
        </div>
        <div className="col-md-9 pt-3">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4 className="text-danger">Products</h4>
          )}
          {products.length < 1 && <p>No Products Found</p>}
          <div className="row pb-5">
            {products.map((el) => (
              <div key={el._id} className="col-md-4">
                <ProductCard product={el}></ProductCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
