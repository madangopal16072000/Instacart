import webfont from "webfontloader";
import React, { useState } from "react";
import { useEffect } from "react";
import Footer from "./components/layout/Footer";
import Home from "./components/Home/Home.js";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import ProductDetails from "./components/Product/ProductDetails.js";
import Products from "./components/Product/Products";
import Search from "./components/Product/Search";
import LoginSignUp from "./components/User/LoginSignUp";
import Profile from "./components/User/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "./store";
import { selectCurrentUser, setCredentials } from "./api/authSlice";
import { useSelector } from "react-redux";
import UserOptions from "./components/layout/Header/UserOptions";
import UpdateProfile from "./components/User/UpdateProfile";
import { fetchProducts } from "./api/productSlice";
import Cart from "./components/Cart/Cart.js";
import Shipping from "./components/Cart/Shipping";
import ConfirmOder from "./components/Cart/ConfirmOrder";
import axios from "axios";
import Payment from "./components/Cart/Payment.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./components/Cart/OrderSuccess";
import MyOrders from "./components/Order/MyOrders.js";
import OrderDetails from "./components/Order/OrderDetails";
import RequireAuth from "./components/User/RequireAuth";
import Navbar from "./components/layout/Header/Navbar";
import Header from "./components/layout/Header/Header";
import NotFound from "./components/Home/NotFound";
import { baseUrl } from "./api/baseUrl";
function App() {
  const user = useSelector(selectCurrentUser);

  const [stripeApiKey, setStripeApiKey] = useState("");

  // const getStripeApiKey = async (token) => {
  //   const response = await axios.get(`${baseUrl}/api/v1/stripeapikey`, {
  //     headers: {
  //       authorization: `Bearer ${token}`,
  //     },
  //   });

  //   const data = await response.json();

  //   console.log(data);

  //   setStripeApiKey(data.stripeApiKey);
  // };
  useEffect(() => {
    webfont.load({
      google: {
        families: ["Roboto", "Orold Sans", "Chilanka"],
      },
    });

    store.dispatch(fetchProducts());

    //calling stripeapikey

    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      store.dispatch(setCredentials(userData.data));

      const token = userData.data.token;

      axios
        .get(`${baseUrl}/stripeapikey`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((response) => setStripeApiKey(response.data.stripeApiKey))
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  return (
    <>
      <Navbar />
      {user && <UserOptions user={user} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/cart" element={<Cart />} />
        <Route element={<NotFound />} />
        <Route element={<RequireAuth />}>
          <Route path="/account" element={<Profile />} />
          <Route path="/user/update" element={<UpdateProfile />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/order/confirm" element={<ConfirmOder />} />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/order/:id" element={<OrderDetails />} />
        </Route>
      </Routes>
      {stripeApiKey && (
        <Elements stripe={loadStripe(stripeApiKey)}>
          <Routes>
            <Route path="/process/payment" element={<Payment />} />
          </Routes>
        </Elements>
      )}
      <ToastContainer />
      <Footer />
    </>
  );
}

export default App;
