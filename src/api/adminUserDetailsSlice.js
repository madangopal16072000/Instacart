import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "./baseUrl";
const user = JSON.parse(localStorage.getItem("user"));
const token = user && user.data && user.data.token;

const initialState = {
  user: {},
  status: "idle",
  error: null,
};

export const getAdminUserDetails = createAsyncThunk(
  "adminUserDetails/getAdminUserDetails",
  async (id, thunkAPI) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${baseUrl}/admin/user/${id}`, config);
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

export const updateAdminUserDetails = createAsyncThunk(
  "adminUserDetails/updateAdminUserDetails",
  async (data, thunkAPI) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      };
      const id = data.userId;
      const body = data.myForm;
      const response = await axios.put(
        `${baseUrl}/admin/user/${id}`,
        body,
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
const adminUserDetailsSlice = createSlice({
  name: "adminUserDetails",
  initialState,
  reducers: {
    resetAdminUserDetailsStatus(state, action) {
      state.status = "idle";
    },
    resetAdminUserDetails(state, action) {
      state.status = "idle";
      state.user = {};
      state.error = null;
    },
    resetAdminUserDetailsError(state, action) {
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAdminUserDetails.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getAdminUserDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
      })
      .addCase(getAdminUserDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateAdminUserDetails.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateAdminUserDetails.fulfilled, (state, action) => {
        state.status = "updated";
        state.user = action.payload.user;
      })
      .addCase(updateAdminUserDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  resetAdminUserDetails,
  resetAdminUserDetailsStatus,
  resetAdminUserDetailsError,
} = adminUserDetailsSlice.actions;
export const selectAdminUserDetails = (state) => state.adminUserDetails.user;
export const selectAdminUserDetailsStatus = (state) =>
  state.adminUserDetails.status;
export const selectAdminUserDetailsError = (state) =>
  state.adminUserDetails.error;
export default adminUserDetailsSlice.reducer;
