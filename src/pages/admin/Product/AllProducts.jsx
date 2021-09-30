import React, { useEffect, useState } from "react";
import AdminProductCard from "../../../component/cards/AdminProductCard";
import AdminNav from "../../../component/nav/AdminNav";
import { getProductsByCount, removeProduct } from "../../../helpers/product";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const AllProducts = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllProducts();
  }, []);

  const loadAllProducts = () => {
    getProductsByCount(100)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRemove = async (slug) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        setLoading(true);
        removeProduct(slug, user.token)
          .then((res) => {
            setLoading(false);
            loadAllProducts();
            toast.error(`${res.data.name} is deleted`);
          })
          .catch((err) => {
            setLoading(false);
            if (err.response.status === 400) {
              toast.error(err.response.data);
            }
          });
      }
    });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav></AdminNav>
        </div>

        <div className="col">
          <h4 className="col-md-4">All Products</h4>
          <div className="row">
            {products.map((product) => (
              <div
                className="col-md-4"
                key={product._id}
                className="col-md-4 pb-3"
              >
                <AdminProductCard
                  product={product}
                  handleRemove={handleRemove}
                ></AdminProductCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
