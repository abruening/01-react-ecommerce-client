import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../helpers/category";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getCategories()
      .then((res) => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch();
  }, []);
  const showCategories = () =>
    categories.map((el) => (
      <div
        key={el._id}
        className="col btn btn-outlined btn-lg btn-block btn-raised m3"
      >
        <Link to={`/category/${el.slug}`}>{el.name}</Link>
      </div>
    ));
  return (
    <div className="container">
      <div className="row">
        {loading ? (
          <h4 className="text-center">Loading...</h4>
        ) : (
          showCategories()
        )}
      </div>
    </div>
  );
};

export default CategoryList;
