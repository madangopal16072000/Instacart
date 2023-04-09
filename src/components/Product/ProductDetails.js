import "./ProductDetails.css";
import Carousel from "react-material-ui-carousel";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

import ReviewCard from "./ReviewCard";
import MetaData from "../layout/MetaData";
import { useEffect, useState } from "react";
import { addItemsToCart } from "../../api/cartSlice";
import { toast } from "react-toastify";
import Loader from "../Loader";
import {
  newReview,
  selectReviewError,
  selectReviewStatus,
} from "../../api/reviewSlice";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Rating,
  Box,
} from "@mui/material";
import {
  fetchProductDetails,
  resetProductDetailsStatus,
  selectProductDetailStatus,
  selectProductDetails,
  selectProductDetailsError,
} from "../../api/productDetailsSlice";
import { resetReviewStatus } from "../../api/reviewSlice";
import { selectCurrentUser } from "../../api/authSlice";
const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const location = useLocation();
  const url = useParams();
  const productId = url.id;
  // const product = useSelector((state) => getSingleProduct(state, productId));
  // const status = useSelector(getProductsStatus);
  const product = useSelector(selectProductDetails);
  const status = useSelector(selectProductDetailStatus);
  const error = useSelector(selectProductDetailsError);
  const reviewStatus = useSelector(selectReviewStatus);
  const reviewError = useSelector(selectReviewError);
  const user = useSelector(selectCurrentUser);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetProductDetailsStatus());
  }, [location, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }

    if (reviewError) {
      toast.error(reviewError);
    }

    if (status === "idle" || reviewStatus === "succeeded") {
      dispatch(fetchProductDetails(productId));
      dispatch(resetReviewStatus());
    }
  }, [error, status, dispatch, reviewStatus, productId, reviewError]);

  const options = {
    size: "larget",
    value: product.ratings,
    precision: 0.5,
    readOnly: true,
  };

  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };
  const decreaseQuantity = () => {
    if (quantity <= 0) return;

    setQuantity((prev) => {
      return prev - 1;
    });
  };

  const increaseQuantity = () => {
    if (product.Stock <= quantity) return;

    setQuantity((prev) => prev + 1);
  };

  const addItemToCartHandler = () => {
    toast.success("Item added to Cart Successfully");
    dispatch(addItemsToCart({ id: productId, quantity }));
  };

  const reviewSubmitHandler = () => {
    const myForm = new FormData();

    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", productId);

    dispatch(newReview(myForm));
    toast.success("Review Submitted Successfully");
    setOpen(false);
  };

  return (
    <>
      {status === "loading" ? (
        <Loader />
      ) : (
        <>
          <MetaData title={`${product.name} -- Instacart`} />
          <div className="ProductDetails">
            <div>
              <Carousel sx={{ width: "20vmax" }}>
                {product.images &&
                  product.images.map((item, i) => {
                    return (
                      <Box>
                        <img
                          className="CarouselImage"
                          key={item.public_id}
                          src={item.url}
                          alt={`${i} slide`}
                        />
                      </Box>
                    );
                  })}
              </Carousel>
            </div>

            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <Rating {...options} />
                <span className="detailsBlock-2-span">
                  {product.numOfReviews} Reviews
                </span>
              </div>
              <div className="detailsBlock-3">
                <h1>{`₹${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <input value={quantity} type="number" readOnly />
                    <button onClick={increaseQuantity}>+</button>
                  </div>
                  <button
                    disabled={product.Stock < 1}
                    onClick={addItemToCartHandler}
                  >
                    Add to Cart
                  </button>
                </div>
                <p>
                  Status:
                  <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                    {product.Stock < 1 ? "Out of Stock" : "InStock"}
                  </b>
                </p>
              </div>
              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>
              {user && (
                <button className="submitReview" onClick={submitReviewToggle}>
                  Submit Review
                </button>
              )}
            </div>
          </div>

          <h3 className="reviewsHeading">REVIEWS</h3>

          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              />

              <textarea
                required
                aria-required
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <DialogActions>
                <Button color="secondary" onClick={submitReviewToggle}>
                  Cancel
                </Button>
                <Button color="primary" onClick={reviewSubmitHandler}>
                  Submit
                </Button>
              </DialogActions>
            </DialogContent>
          </Dialog>

          {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review, index) => (
                  <ReviewCard key={review.user} review={review} />
                ))}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
        </>
      )}
    </>
  );
};

export default ProductDetails;
