import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../Home/ProductCard";
import Loader from "../Loader";
import {
  getProductsError,
  getProductsStatus,
  selectAllProducts,
  fetchProducts,
} from "../../api/productSlice";
import "./Products.css";
import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import MetaData from "../layout/MetaData";

const categories = [
  "Laptop",
  "Footwear",
  "Button",
  "Tops",
  "Attire",
  "Camera",
  "smartphone",
];

function Products() {
  const [rating, setRating] = useState(0);
  const [isRatingChanged, setIsRatingChanged] = useState(false);

  const [category, setCategory] = useState("");
  const [price, setPrice] = useState([0, 25000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageChanged, setIsPageChanged] = useState(false);
  const dispatch = useDispatch();
  const [isPriceChanged, setPriceChanged] = useState(false);
  const [isCategoryChanged, setIsCategoryChanged] = useState(false);

  const status = useSelector(getProductsStatus);
  const error = useSelector(getProductsError);
  const productsData = useSelector(selectAllProducts);
  const products = productsData.products;

  const { keyword } = useParams();
  const productsCount = productsData.productsCount;
  const resultPerPage = productsData.resultPerPage;
  const filteredProductsCount = productsData.filteredProductsCount;

  useEffect(() => {
    if (error) {
      return error;
    }
    let isDataChanged =
      isPageChanged | isPriceChanged | isCategoryChanged | isRatingChanged;

    if (status === "idle" || isDataChanged) {
      const Args = {
        keyword: keyword,
        currentPage: currentPage,
        price: price,
        category: category,
        rating: rating,
      };
      dispatch(fetchProducts(Args));
      setIsPageChanged(false);
      setPriceChanged(false);
      setIsCategoryChanged(false);
      setIsRatingChanged(false);
    }
  }, [
    dispatch,
    error,
    status,
    keyword,
    currentPage,
    isPriceChanged,
    isPageChanged,
    isCategoryChanged,
    rating,
    isRatingChanged,
    price,
    category,
  ]);

  const setCurrentPageNo = (event) => {
    setCurrentPage(event);
    setIsPageChanged(true);
  };

  const priceChangeHandler = (event, newPrice) => {
    setPrice(newPrice);
    setPriceChanged(true);
  };

  return (
    <>
      {status === "loading" ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Products -- Instacart" />
          <h2 className="productsHeading">Products</h2>
          <div className="products">
            {products &&
              products.map((product) => {
                return <ProductCard key={product._id} product={product} />;
              })}
          </div>
        </>
      )}
      <div className="filterBox">
        <Typography>Price</Typography>
        <Slider
          value={price}
          onChange={priceChangeHandler}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
          min={0}
          max={25000}
        />

        <Typography>Categories</Typography>
        <ul className="categoryBox">
          {categories.map((category) => {
            return (
              <li
                className="category-link"
                key={category}
                onClick={() => {
                  setCategory(category);
                  setIsCategoryChanged(true);
                }}
              >
                {category}
              </li>
            );
          })}
        </ul>

        <fieldset>
          <Typography component="legend">Ratings Above</Typography>
          <Slider
            value={rating}
            onChange={(e, newRating) => {
              setRating(newRating);
              setIsRatingChanged(true);
            }}
            aria-labelledby="continuous slider"
            min={0}
            max={5}
            valueLabelDisplay="auto"
          />
        </fieldset>
      </div>
      {resultPerPage < filteredProductsCount && (
        <div className="paginationBox">
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={resultPerPage}
            totalItemsCount={productsCount}
            onChange={setCurrentPageNo}
            nextPageText="Next"
            prevPageText="Prev"
            firstPageText="1st"
            lastPageText="Last"
            itemClass="page-item"
            linkClass="page-link"
            activeClass="pageItemActive"
            activeLinkClass="pageLinkActive"
          />
        </div>
      )}
    </>
  );
}

export default Products;
