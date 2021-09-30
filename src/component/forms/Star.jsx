import React from "react";
import StarRatings from "react-star-ratings/build/star-ratings";

const Star = ({ starClick, numberOfStars }) => (
  <>
    <StarRatings
      changeRating={() => starClick(numberOfStars)}
      numberOfStars={numberOfStars}
      starDimension="20px"
      starSpacing="2px"
      starHoverColor="red"
      starEmptyColor="red"
    ></StarRatings>
  </>
);

export default Star;
