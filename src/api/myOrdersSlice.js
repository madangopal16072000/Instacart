import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// const baseUrl = "https://instacart-api.onrender.com/api/v1";
import { baseUrl } from "../baseUrl";

const initialState = {
  orders: [],
  status: "idle",
  error: null,
};
const localData = JSON.parse(localStorage.getItem("user"));

export const fetchMyOrders = createAsyncThunk(
  "myOrders/fetchMyOrders",
  async (thunkAPI) => {
    try {
      const config = {
        headers: {
          authorization: `Bearer ${localData.data.token}`,
        },
      };
      const response = await axios.get(`${baseUrl}/orders/me`, config);

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
const myOrdersSlice = createSlice({
  name: "myOrders",
  initialState,
  reducers: {
    resetMyOrdersStatus(state, action) {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload.orders;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetMyOrdersStatus } = myOrdersSlice.actions;
export const selectMyOrders = (state) => state.myOrders.orders;
export const selectMyOrdersError = (state) => state.myOrders.error;
export const selectMyOrdersStatus = (state) => state.myOrders.status;
export default myOrdersSlice.reducer;
