import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "./baseUrl";
const user = JSON.parse(localStorage.getItem("user"));
const token = user && user.data && user.data.token;

const initialState = {
  users: [],
  status: "idle",
  error: null,
};
export const getAllUsers = createAsyncThunk(
  "adminUsers/getAllUsers",
  async (thunkAPI) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${baseUrl}/admin/users`, config);
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

export const deleteUser = createAsyncThunk(
  "adminUsers/deleteUser",
  async (id, thunkAPI) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.delete(
        `${baseUrl}/admin/user/${id}`,
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
const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    resetAdminUsersStatus(state, action) {
      state.status = "idle";
    },
    resetAdminUsersError(state, action) {
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllUsers.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload.users;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = "deleted";
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { resetAdminUsersStatus, resetAdminUsersError } =
  adminUsersSlice.actions;
export const selectAllUsers = (state) => state.adminUsers.users;
export const selectAdminUsersStatus = (state) => state.adminUsers.status;
export const selectAdminUsersError = (state) => state.adminUsers.error;
export default adminUsersSlice.reducer;
