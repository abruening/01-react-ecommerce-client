import React, { useState, useEffect } from "react";
import { getSubCategory } from "../../helpers/subcategory";
import ProductCard from "../../component/cards/ProductCard";

const SubCategoryHome = ({ match }) => {
  const [subCategory, setSubCategory] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSubCategory(match.params.slug)
      .then((res) => {
        setSubCategory(res.data.subcategory);
        setProducts(res.data.products);
        setLoading(false);
      })
      .catch();
  }, []);
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          {loading ? (
            <h4 className=" text-center p-3 mt-5 mb-5 display-4 jumbotron">
              Loading...
            </h4>
          ) : (
            <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
              {products.length} Products in "{subCategory.name}" subcategory
            </h4>
          )}
        </div>
      </div>
      <div className="row">
        {products.map((el) => (
          <div className="col-md-4" key={el._id}>
            <ProductCard product={el}></ProductCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubCategoryHome;
