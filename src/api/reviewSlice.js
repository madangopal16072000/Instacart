import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// const baseUrl = "https://instacart-api.onrender.com/api/v1";
import { baseUrl } from "../baseUrl";

const localData = JSON.parse(localStorage.getItem("user"));

const initialState = {
  product: {},
  status: "idle",
  error: null,
};

export const newReview = createAsyncThunk(
  "review/newReview",
  async (body, thunkAPI) => {
    try {
      const response = await axios.put(`${baseUrl}/reviews`, body, {
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
const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    resetReviewStatus(state, action) {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(newReview.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(newReview.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.product = action.payload.product;
      })
      .addCase(newReview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetReviewStatus } = reviewSlice.actions;
export const selectReviewStatus = (state) => state.review.status;
export const selectReviewError = (state) => state.review.error;
export default reviewSlice.reducer;
