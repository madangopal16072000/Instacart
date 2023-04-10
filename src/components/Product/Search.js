import { useState } from "react";
import "./Search.css";
import { useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData";
const Search = () => {
  const [keyword, setKeyword] = useState("");

  const navigate = useNavigate();
  const searchSubmitHandler = (e) => {
    e.preventDefault();
    const searchWord = keyword.trim();

    if (searchWord) {
      navigate(`/products/${keyword}`);
    } else {
      navigate("/products");
    }
  };
  return (
    <>
      <MetaData title="Search A Product" />
      <form className="searchBox" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search a product"
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
        />
        <input type="submit" value="search" />
      </form>
      ;
    </>
  );
};

export default Search;
