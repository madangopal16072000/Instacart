import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseUrl } from "./baseUrl";
import axios from "axios";
const localData = JSON.parse(localStorage.getItem("user"));

const initialState = {
  products: [],
  status: "idle",
  error: null,
};

export const fetchProductsAdmin = createAsyncThunk(
  "adminProducts/fetchProductsAdmin",
  async (thunkAPI) => {
    try {
      const config = {
        headers: {
          authorization: `Bearer ${localData.data.token}`,
        },
      };
      const response = await axios.get(`${baseUrl}/admin/products`, config);

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

const adminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {
    resetAdminProductsStatus(state) {
      state.status = "idle";
    },
    resetAdminProductsError(state) {
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProductsAdmin.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchProductsAdmin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.products;
      })
      .addCase(fetchProductsAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});
export default adminProductsSlice.reducer;
export const selectAdminProducts = (state) => state.adminProducts.products;
export const selectAdminProductsStatus = (state) => state.adminProducts.status;
export const selectAdminProudctsError = (state) => state.adminProducts.error;
export const { resetAdminProductsStatus } = adminProductsSlice.actions;
