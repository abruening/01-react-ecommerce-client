import React, { useEffect, useState } from "react";
import SingleProduct from "../component/cards/SingleProduct";
import { getProduct, productStar, getRelated } from "../helpers/product";
import { useSelector } from "react-redux";
import ProductCard from "../component/cards/ProductCard";

const Product = ({ match, history }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [product, setProduct] = useState({});
  const [related, setRelated] = useState([]);
  const [star, setStar] = useState(0);
  const { slug } = match.params;

  useEffect(() => {
    loadSingleProduct();
  }, [slug]);

  useEffect(() => {
    if (product.ratings && user) {
      let existingRatingObject = product.ratings.find(
        (ele) => ele.postedBy.toString() === user._id.toString()
      );
      existingRatingObject && setStar(existingRatingObject.star);
    }
  });

  const loadSingleProduct = () => {
    getProduct(slug)
      .then((res) => {
        setProduct(res.data);
        getRelated(res.data._id)
          .then((res) => {
            setRelated(res.data);
          })
          .catch((err) => {});
      })
      .catch((err) => console.log(err));
  };

  const onStarClick = (newRating, name) => {
    setStar(newRating);
    productStar(name, newRating, user.token)
      .then((res) => loadSingleProduct())
      .catch();
  };
  return (
    <div className="container-fluid">
      <div className="row pt-4">
        <SingleProduct
          product={product}
          onStarClick={onStarClick}
          star={star}
        ></SingleProduct>
      </div>
      <hr />
      <div className="row">
        <div className="col text-center pt-5 pb-5">
          <hr />
          <h4>Related Products</h4>
          <hr />
        </div>
      </div>
      <div className="row pb-5">
        {related.length > 0 ? (
          related.map((r) => (
            <div className="col md-4" key={r._id}>
              <ProductCard product={r}></ProductCard>
            </div>
          ))
        ) : (
          <div className="text-center col">No Product Found</div>
        )}
      </div>
      <hr />
    </div>
  );
};

export default Product;
