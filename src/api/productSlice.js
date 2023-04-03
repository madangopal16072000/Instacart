import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = "https://instacart-api.onrender.com/api/v1";

// const PRODUCTS_URL = "api/v1/products";
const initialState = {
  products: {
    products: [],
    productsCount: 0,
    resultPerPage: 0,
    filteredProductsCount: 0,
  },
  status: "idle",
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (Args = {}) => {
    const keyword = Args.keyword ? Args.keyword : "";
    const currentPage = Args.currentPage ? Args.currentPage : 1;
    const price = Args.price ? Args.price : [0, 25000];
    const category = Args.category ? Args.category : "";
    const ratings = Args.rating ? Args.rating : 0;

    let link = `${baseUrl}/products?page=${currentPage}&keyword=${keyword}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;
    if (category) {
      link = `${baseUrl}/products?page=${currentPage}&keyword=${keyword}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}&category=${category}`;
    }
    const response = await axios.get(link);

    return response.data;
  }
);

// getSingleProduct
// export const fetchSingleProduct = createAsyncThunk(
//   "products/fetchSingleProducts",

//   async (productId) => {
//     const response = await axios.get(`/api/v1/product/${productId}`);
//     return response.data;
//   }
// );

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    productsAdded(state, action) {
      state.products.push(action.payload);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Add any fetched products to the array
        // state.products.products = state.products.products.concat(
        //   action.payload.products
        // );
        state.products.products = action.payload.products;
        state.products.productsCount = action.payload.productCount;
        state.products.resultPerPage = action.payload.resultPerPage;
        state.products.filteredProductsCount =
          action.payload.filteredProductsCount;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    // .addCase(fetchSingleProduct.fulfilled, (state, action) => {
    //   state.status = "succeeded";

    //   // Add any fetched products to the array
    //   state.products = state.products.concat(action.payload.product);
    // })
    // .addCase(fetchSingleProduct.pending, (state, action) => {
    //   state.status = "loading";
    // })
    // .addCase(fetchSingleProduct.rejected, (state, action) => {
    //   state.status = "failed";
    //   state.error = action.error.message;
    // });
  },
});

export const selectAllProducts = (state) => state.products.products;
export const getProductsStatus = (state) => state.products.status;
export const getProductsError = (state) => state.products.error;

export const getSingleProduct = (state, productId) => {
  return state.products.products.products.find((product) => {
    return product._id === productId;
  });
};

export const { productsAdded } = productSlice.actions;

export default productSlice.reducer;
