import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "./baseUrl";
import axios from "axios";

const localData = JSON.parse(localStorage.getItem("user"));
const initialState = {
  product: {},
  status: "idle",
  error: null,
};

export const createProduct = createAsyncThunk(
  "adminProduct/createProduct",
  async (formData, thunkAPI) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localData.data.token}`,
        },
      };
      console.log(formData);
      const response = await axios.post(
        `${baseUrl}/admin/product/new`,
        formData,
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

// export const getProductDetailsAdmin = createAsyncThunk(
//   "adminProduct/getProductDetailsAdmin",
//   async (productId, thunkAPI) => {
//     try {
//       const response = await axios.get(`${baseUrl}/product/${productId}`);

//       return response.data;
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();

//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

export const updateProduct = createAsyncThunk(
  "adminProduct/updateProduct",
  async (data, thunkAPI) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${localData.data.token}`,
        },
      };
      const id = data.id;
      const formData = data.formData;
      const response = await axios.put(
        `${baseUrl}/admin/product/${id}`,
        formData,
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

export const deleteProduct = createAsyncThunk(
  "adminProduct/deleteProduct",
  async (id, thunkAPI) => {
    try {
      const config = {
        headers: {
          authorization: `Bearer ${localData.data.token}`,
        },
      };

      const response = await axios.delete(
        `${baseUrl}/admin/product/${id}`,
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

const adminProductSlice = createSlice({
  name: "adminProduct",
  initialState,
  reducers: {
    resetProductStatus(state, action) {
      state.status = "idle";
      state.product = {};
    },
    resetProductError(state, action) {
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createProduct.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.product = action.payload.product;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // .addCase(getProductDetailsAdmin.pending, (state, action) => {
      //   state.status = "loading";
      // })
      // .addCase(getProductDetailsAdmin.fulfilled, (state, action) => {
      //   state.status = "succeeded";
      //   state.product = action.payload.product;
      // })
      // .addCase(getProductDetailsAdmin.rejected, (state, action) => {
      //   state.status = "failed";
      //   state.error = action.payload;
      // })
      .addCase(updateProduct.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.product = action.payload.updatedProduct;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.product = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default adminProductSlice.reducer;
export const selectAdminProduct = (state) => state.adminProduct.product;
export const selectAdminProductStatus = (state) => state.adminProduct.status;
export const selectAdminProductError = (state) => state.adminProduct.error;
export const { resetProductStatus, resetProductError } =
  adminProductSlice.actions;
