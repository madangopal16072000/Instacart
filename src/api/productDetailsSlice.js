import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// const baseUrl = "https://instacart-api.onrender.com/api/v1";
import { baseUrl } from "./baseUrl";

const initialState = {
  product: {},
  status: "idle",
  error: null,
};

export const fetchProductDetails = createAsyncThunk(
  "productDetails/fetchProductDetails",
  async (productId, thunkAPI) => {
    try {
      const response = await axios.get(`${baseUrl}/product/${productId}`);

      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);
const productDetailsSlice = createSlice({
  name: "productDetails",
  initialState,
  reducers: {
    resetProductDetailsStatus(state, action) {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetails.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.product = action.payload.product;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetProductDetailsStatus } = productDetailsSlice.actions;
export default productDetailsSlice.reducer;
export const selectProductDetails = (state) => state.productDetails.product;
export const selectProductDetailStatus = (state) => state.productDetails.status;
export const selectProductDetailsError = (state) => state.productDetails.error;
