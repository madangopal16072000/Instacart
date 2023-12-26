import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "./baseUrl";
const user = JSON.parse(localStorage.getItem("user"));
const authToken = user && user.data && user.data.token;

const initialState = {
  order: {},
  status: "idle",
  error: null,
};

export const getOrderDetails = createAsyncThunk(
  "adminOrderDetails/getOrderDetails",
  async (id, thunkAPI) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${authToken}`,
        },
      };

      const response = await axios.get(`${baseUrl}/order/${id}`, config);
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

export const updateOrderDetails = createAsyncThunk(
  "adminOrderDetails/updateOrderDetails",
  async (data, thunkAPI) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${authToken}`,
        },
      };

      const id = data.id;
      const order = data.order;
      console.log(id);
      console.log(order);
      const response = await axios.put(
        `${baseUrl}/admin/order/${id}`,
        order,
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
const adminOrderDetailsSlice = createSlice({
  name: "adminOrderDetails",
  initialState,
  reducers: {
    resetAdminOrderDetails(state, action) {
      state.status = "idle";
      state.order = {};
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getOrderDetails.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.order = action.payload.order;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateOrderDetails.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateOrderDetails.fulfilled, (state, action) => {
        state.status = "updated";
        state.order = action.payload.updatedOrder;
      })
      .addCase(updateOrderDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetAdminOrderDetails } = adminOrderDetailsSlice.actions;
export const selectAdminOrderDetails = (state) => state.adminOrderDetails.order;
export const selectAdminOrderDetailsStatus = (state) =>
  state.adminOrderDetails.status;
export const selectAdminOrderDetailsError = (state) =>
  state.adminOrderDetails.error;
export default adminOrderDetailsSlice.reducer;
