import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "./baseUrl";
import axios from "axios";

const initialState = {
  product: {},
  status: "idle",
  error: null,
};

export const getProductDetailsAdmin = createAsyncThunk(
  "adminProductDetails/getProductDetailsAdmin",
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

const adminProductDetailsSlice = createSlice({
  name: "adminProduct",
  initialState,
  reducers: {
    resetProductDetailsStatus(state, action) {
      state.status = "idle";
      state.product = {};
    },
    resetProductDetailsError(state, action) {
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getProductDetailsAdmin.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getProductDetailsAdmin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.product = action.payload.product;
      })
      .addCase(getProductDetailsAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default adminProductDetailsSlice.reducer;
export const selectAdminProductDetails = (state) =>
  state.adminProductDetails.product;
export const selectAdminProductDetailsStatus = (state) =>
  state.adminProductDetails.status;
export const selectAdminProductDetailsError = (state) =>
  state.adminProductDetails.error;
export const { resetProductDetailsStatus, resetProductDetailsError } =
  adminProductDetailsSlice.actions;
