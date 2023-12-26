import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../api/productSlice";
import authReducer from "../api/authSlice";
import cartReducer from "../api/cartSlice";
// import profileReducer from "../components/User/profileSlice";
import orderReducer from "../api/orderSlice";
import myOrdersReducer from "../api/myOrdersSlice";
import reviewReducer from "../api/reviewSlice";
import productDetailsReducer from "../api/productDetailsSlice";
import adminProductsReducer from "../api/adminProductsSlice";
import adminProductReducer from "../api/adminProductSlice";
import adminProductDetailsReducer from "../api/adminProductDetails";
import adminOrdersReducer from "../api/adminOrdersSlice";
import adminOrderDetailsReducer from "../api/adminOrderDetailsSlice";
import adminUsersReducer from "../api/adminUsersSlice";
import adminUserDetailsReducer from "../api/adminUserDetailsSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
    cart: cartReducer,
    order: orderReducer,
    myOrders: myOrdersReducer,
    review: reviewReducer,
    productDetails: productDetailsReducer,
    adminProducts: adminProductsReducer,
    adminProduct: adminProductReducer,
    adminProductDetails: adminProductDetailsReducer,
    adminOrders: adminOrdersReducer,
    adminOrderDetails: adminOrderDetailsReducer,
    adminUsers: adminUsersReducer,
    adminUserDetails: adminUserDetailsReducer,
  },
  devTools: true,
});

export default store;
