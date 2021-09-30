import React from "react";

const LocalSearch = ({ keyword, setKeyword }) => {
  const handleChangeSearch = (e) => {
    e.preventDefault();
    setKeyword(e.target.value.toLowerCase());
  };
  return (
    <div className="container pt-4 pb-4">
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Filter"
        value={keyword}
        onChange={handleChangeSearch}
      ></input>
    </div>
  );
};

export default LocalSearch;
