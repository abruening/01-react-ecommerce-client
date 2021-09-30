import React from "react";
import { Select } from "antd";

const { Option } = Select;

const ProductCreateForm = ({
  handleSubmit,
  handleChange,
  values,
  subCategoryOptions,
  showSubCategory,
  setValues,
}) => {
  const {
    title,
    description,
    price,
    categories,
    category,
    subcategory,
    shipping,
    quantity,
    images,
    colors,
    brands,
    color,
    brand,
  } = values;
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          required
          className="form-control"
          value={title}
          onChange={handleChange}
          autoFocus
        />
        <label htmlFor="description">Description</label>
        <input
          type="text"
          required
          name="description"
          id="description"
          className="form-control"
          value={description}
          onChange={handleChange}
        />
        <label htmlFor="price">Price</label>
        <input
          type="number"
          required
          name="price"
          id="price"
          className="form-control"
          value={price}
          onChange={handleChange}
        />
        <label htmlFor="shipping">Shipping</label>
        <select
          name="shipping"
          value={shipping}
          required
          id="shipping"
          className="form-control"
          onChange={handleChange}
        >
          <option value="">Please Select</option>
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
        <label htmlFor="quantity">Quantity</label>
        <input
          type="number"
          name="quantity"
          required
          id="quantity"
          className="form-control"
          value={quantity}
          onChange={handleChange}
        />
        <label htmlFor="color">Color</label>
        <select
          name="color"
          value={color}
          required
          id="color"
          className="form-control"
          onChange={handleChange}
        >
          <option value="">Please Select</option>
          {colors.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
        <label htmlFor="brand">Brand</label>
        <select
          name="brand"
          value={brand}
          required
          id="brand"
          className="form-control"
          onChange={handleChange}
        >
          <option value=""> Please Select</option>
          {brands.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
        <label>Category</label>
        <select
          name="category"
          className="form-control"
          value={category}
          onChange={handleChange}
        >
          <option value="">Please Select a Category</option>
          {categories.length > 0 &&
            categories.map((e) => (
              <option key={e._id} value={e._id}>
                {e.name}
              </option>
            ))}
        </select>
        {showSubCategory && <label>Sub-Category</label>}
        {showSubCategory && (
          <Select
            name="subcategory"
            style={{ width: "100%" }}
            mode="multiple"
            className="form-control"
            value={subcategory}
            placeholder="Please Select"
            onChange={(value) => {
              setValues({ ...values, subcategory: value });
            }}
          >
            {subCategoryOptions.length > 0 &&
              subCategoryOptions.map((e) => (
                <Option key={e._id} value={e._id}>
                  {e.name}
                </Option>
              ))}
          </Select>
        )}
      </div>
      <br />
      <button className="btn btn-outline-info">Save</button>
    </form>
  );
};

export default ProductCreateForm;
