import React, { useState, useEffect } from "react";
import Jumbotron from "../component/cards/Jumbotron";
import NewArrivals from "../component/home/NewArrivals";
import BestSellers from "../component/home/BestSellers";
import CategoryList from "../component/category/CategoryList";
import SubCategoryList from "../component/subcategory/SubCategoryList";

const Home = () => {
  return (
    <div>
      <div className="jumbotron text-center text-danger h1 font-weight-bold">
        <Jumbotron
          text={["Latest Products", "New Arrivals", "Best Sellers"]}
        ></Jumbotron>
      </div>
      <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
        New Arrivals
      </h4>
      <NewArrivals />
      <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
        Best Sellers
      </h4>
      <BestSellers />
      <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
        Category
      </h4>
      <CategoryList />
      <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
        Sub-Category
      </h4>
      <SubCategoryList />
    </div>
  );
};

export default Home;
