import React from "react";
import StarRating from "react-star-ratings";

export const showAverage = (product) => {
  if (product && product.ratings) {
    let ratingArray = product && product.ratings;
    let total = [];
    let length = ratingArray.length;
    ratingArray.map((r) => total.push(r.star));
    let totalReduce = total.reduce(
      (p, n) => p + n, // previo + next
      0 // valor inicial
    );
    let highest = length * 5; // maximo valor posible de rating de todos los puntuadores
    let result = (totalReduce * 5) / highest;
    return (
      <div className="text-center pt-1 pb-3">
        <span>
          <StarRating
            starDimension="20px"
            starSpacing="2px"
            editiing={false}
            rating={result}
            starRatedColor="red"
          />
          <span className="m-2">({product.ratings.length})</span>
        </span>
      </div>
    );
  }
};
