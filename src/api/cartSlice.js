import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = "https://instacart-api.onrender.com/api/v1";

const localCartData = JSON.parse(localStorage.getItem("cartItems"));
const localShippingInfo = JSON.parse(localStorage.getItem("shippingInfo")) ?? {
  address: "",
  city: "",
  state: "",
  country: "",
  pinCode: "",
  phoneNo: "",
};
const initialState = {
  cartItems: localCartData ? localCartData : [],
  shippingInfo: localShippingInfo ? localShippingInfo : null,
  status: "idle",
  error: null,
};
export const saveShippingInfo = createAsyncThunk(
  "cart/saveShippingInfo",
  async (data) => {
    localStorage.setItem("shippingInfo", JSON.stringify(data));
    return data;
  }
);

export const addItemsToCart = createAsyncThunk(
  "cart/addItemToCart",
  async (body, thunkAPI) => {
    try {
      const response = await axios.get(`${baseUrl}/product/${body.id}`);

      const cartData = {
        product: response.data.product._id,
        name: response.data.product.name,
        price: response.data.product.price,
        image: response.data.product.images[0].url,
        stock: response.data.product.Stock,
        quantity: body.quantity,
      };
      console.log(cartData);
      console.log(response.data);
      if (response.data) {
        let localCartData = JSON.parse(localStorage.getItem("cartItems"));

        console.log(localCartData);

        if (localCartData) {
          const isItemExist = localCartData.find((item) => {
            return item.product === cartData.product;
          });

          if (isItemExist) {
            localCartData.map((item) => {
              return item.product === cartData.product ? cartData : item;
            });
          } else {
            localCartData.unshift(cartData);
          }
        } else {
          localCartData = [];
          localCartData.unshift(cartData);
        }
        localStorage.setItem("cartItems", JSON.stringify(localCartData));
      }

      return cartData;
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

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    changeItemQuantity(state, action) {
      const { productId, newQuantity } = action.payload;
      const matchItem = state.cartItems.find((item) => {
        return productId === item.product;
      });

      matchItem.quantity = newQuantity;
    },
    removeItemFromCart(state, action) {
      const productId = action.payload;

      const products = state.cartItems.filter((item) => {
        return item.product !== productId;
      });

      state.cartItems = products;
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addItemsToCart.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(addItemsToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        const item = action.payload;

        const isItemExist = state.cartItems.find((i) => {
          return i.product === item.product;
        });

        if (isItemExist) {
          state.cartItems = state.cartItems.map((i) => {
            return i.product === isItemExist.product ? item : i;
          });
        } else {
          state.cartItems = state.cartItems.concat(item);
        }
      })
      .addCase(addItemsToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveShippingInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.shippingInfo = action.payload;
      });
  },
});

export const { changeItemQuantity, removeItemFromCart } = cartSlice.actions;
export const selectCartItems = (state) => state.cart.cartItems;
export const selectCartStatus = (state) => state.cart.status;
export const selectCartError = (state) => state.cart.error;
export const selectShippingInfo = (state) => state.cart.shippingInfo;
export default cartSlice.reducer;
