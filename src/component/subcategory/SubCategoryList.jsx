import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSubCategories } from "../../helpers/subcategory";

const SubCategoryList = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getSubCategories()
      .then((res) => {
        setSubCategories(res.data);
        setLoading(false);
      })
      .catch();
  }, []);
  const showSubCategories = () =>
    subCategories.map((el) => (
      <div
        key={el._id}
        className="col btn btn-outlined btn-lg btn-block btn-raised m3"
      >
        <Link to={`/subcategory/${el.slug}`}>{el.name}</Link>
      </div>
    ));
  return (
    <div className="container">
      <div className="row">
        {loading ? (
          <h4 className="text-center">Loading...</h4>
        ) : (
          showSubCategories()
        )}
      </div>
    </div>
  );
};

export default SubCategoryList;
