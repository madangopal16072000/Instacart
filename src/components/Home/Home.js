import { CgMouse } from "react-icons/cg";
import ProductCard from "./ProductCard";
import "./Home.css";
import MetaData from "../layout/MetaData";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
  getProductsError,
  getProductsStatus,
  selectAllProducts,
} from "../../api/productSlice";
import { useEffect } from "react";
import Loader from "../Loader";

function Home() {
  const dispatch = useDispatch();
  const productsData = useSelector(selectAllProducts);
  const products = productsData.products;
  const status = useSelector(getProductsStatus);
  const error = useSelector(getProductsError);

  useEffect(() => {
    if (error) {
      return error;
    }

    if (status === "idle") {
      console.log("entered");
      dispatch(fetchProducts());
    }
  }, [status, dispatch, error]);

  return (
    <>
      {status === "loading" ? (
        <Loader />
      ) : (
        <>
          <MetaData title="InstaCart" />
          <div className="banner">
            <p>Welcome to InstaCart</p>
            <h1>Find Amazing products below</h1>

            <a href="#container">
              <button>
                Scoll <CgMouse />
              </button>
            </a>
          </div>
          <div className="container" id="container">
            {products &&
              products.map((product) => {
                return <ProductCard product={product} />;
              })}
          </div>
        </>
      )}
    </>
  );
}

export default Home;
