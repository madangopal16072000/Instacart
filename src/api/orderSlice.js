import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// const baseUrl = "https://instacart-api.onrender.com/api/v1";
import { baseUrl } from "../baseUrl";

const localData = JSON.parse(localStorage.getItem("user"));

const initialState = {
  orderDetails: {},
  status: "idle",
  error: null,
};
export const createOrder = createAsyncThunk(
  "order/newOrder",
  async (order, thunkAPI) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localData.data.token}`,
        },
      };
      const response = await axios.post(`${baseUrl}/order/new`, order, config);

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

export const fetchOrderDetails = createAsyncThunk(
  "order/fetchOrderDetails",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${baseUrl}/order/${id}`, {
        headers: {
          authorization: `Bearer ${localData.data.token}`,
        },
      });

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

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetOrderStatus(state, action) {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = "fullfilled";
        state.orderDetails = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchOrderDetails.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orderDetails = action.payload.order;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;
export const selectOrderDetails = (state) => state.order.orderDetails;
export const selectOrderStatus = (state) => state.order.status;
export const selectOrderError = (state) => state.order.error;
