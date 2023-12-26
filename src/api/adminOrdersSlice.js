import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseUrl } from "./baseUrl";
import axios from "axios";
const user = JSON.parse(localStorage.getItem("user"));
const authToken = user && user.data && user.data.token;

const initialState = {
  orders: [],
  totalAmount: 0,
  status: "idle",
  error: null,
};

export const getAllAdminOrders = createAsyncThunk(
  "adminOrders/getAllAdminOrders",
  async (thunkAPI) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${authToken}`,
        },
      };

      const response = await axios.get(`${baseUrl}/admin/orders`, config);
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

export const deleteAdminOrder = createAsyncThunk(
  "adminOrders/deleteAdminOrder",
  async (id, thunkAPI) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${authToken}`,
        },
      };

      const response = await axios.delete(
        `${baseUrl}/admin/order/${id}`,
        config
      );
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
const adminOrdersSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {
    resetAdminOrdersStatus(state) {
      state.status = "idle";
    },
    resetAdminOrders(state) {
      state.status = "idle";
      state.orders = [];
      state.totalAmount = 0;
      state.error = null;
    },
    resetAdminOrdersError(state) {
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllAdminOrders.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getAllAdminOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload.orders;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(getAllAdminOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteAdminOrder.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteAdminOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(deleteAdminOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  resetAdminOrders,
  resetAdminOrdersError,
  resetAdminOrdersStatus,
} = adminOrdersSlice.actions;

export const selectAllAdminOrders = (state) => state.adminOrders.orders;
export const selectAllAdminOrdersStatus = (state) => state.adminOrders.status;
export const selectAllAdminOrdersError = (state) => state.adminOrders.error;
export default adminOrdersSlice.reducer;
