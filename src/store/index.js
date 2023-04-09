import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../api/productSlice";
import authReducer from "../api/authSlice";
import cartReducer from "../api/cartSlice";
// import profileReducer from "../components/User/profileSlice";
import orderReducer from "../api/orderSlice";
import myOrdersReducer from "../api/myOrdersSlice";
import reviewReducer from "../api/reviewSlice";
import productDetailsReducer from "../api/productDetailsSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
    cart: cartReducer,
    order: orderReducer,
    myOrders: myOrdersReducer,
    review: reviewReducer,
    productDetails: productDetailsReducer,
    // profileReducer: profileReducer,
  },
  devTools: true,
});

export default store;
