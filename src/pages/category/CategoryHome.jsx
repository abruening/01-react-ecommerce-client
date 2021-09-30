import React, { useState, useEffect } from "react";
import { getCategory } from "../../helpers/category";
import { Link } from "react-router-dom";
import ProductCard from "../../component/cards/ProductCard";

const CategoryHome = ({ match }) => {
  const [category, setCategory] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCategory(match.params.slug)
      .then((res) => {
        setCategory(res.data.category);
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
              {products.length} Products in "{category.name}" category
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

export default CategoryHome;
