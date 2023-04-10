import {
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
} from "@stripe/react-stripe-js";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import EventIcon from "@mui/icons-material/Event";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import "./Payment.css";
import MetaData from "../layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";
import { Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../api/authSlice";
import axios from "axios";
import { selectCartItems, selectShippingInfo } from "../../api/cartSlice";
import { useNavigate } from "react-router-dom";
import {
  createOrder,
  resetOrderStatus,
  selectOrderError,
} from "../../api/orderSlice";
import { baseUrl } from "../../api/baseUrl";

const Payment = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const payBtn = useRef(null);
  const user = useSelector(selectCurrentUser);

  const stripe = useStripe();
  const elements = useElements();
  const shippingInfo = useSelector(selectShippingInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const error = useSelector(selectOrderError);
  const cartItems = useSelector(selectCartItems);

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  };

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };
  const localData = JSON.parse(localStorage.getItem("user"));
  const paymentFormSubmitHandler = async (e) => {
    e.preventDefault();

    payBtn.current.disabled = true;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localData.data.token}`,
        },
      };
      const { data } = await axios.post(
        `${baseUrl}/payment/process`,
        paymentData,
        config
      );
      const client_secret = data.client_secret;

      if (!stripe || !elements) return;

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.pinCode,
              country: shippingInfo.country,
            },
          },
        },
      });
      if (result.error) {
        payBtn.current.disabled = false;
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };

          dispatch(createOrder(order));
          dispatch(resetOrderStatus());
          navigate("/success");
        } else {
          toast.error("There's is some issue while processing your payment");
        }
      }
    } catch (error) {
      payBtn.current.disabled = false;
      toast.error(error.message);
    }
    // try {
    //   order.paymentInfo = {
    //     id: "payment id",
    //     status: "payment status",
    //   };
    //   dispatch(createOrder(order));
    //   navigate("/success");
    // } catch (error) {
    //   payBtn.current.disabled = false;
    //   toast.error(error);
    // }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      <MetaData title="Payment" />
      <CheckoutSteps activeStep={2} />
      <div className="paymentContainer">
        <form className="paymentForm" onSubmit={paymentFormSubmitHandler}>
          <Typography>Card Info</Typography>
          <div>
            <CreditCardIcon />
            <CardNumberElement className="paymentInput" />
          </div>
          <div>
            <EventIcon />
            <CardExpiryElement className="paymentInput" />
          </div>
          <div>
            <VpnKeyIcon />
            <CardCvcElement className="paymentInput" />
          </div>
          <input
            type="submit"
            value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
            ref={payBtn}
            className="paymentFormBtn"
          />
        </form>
      </div>
    </>
  );
};
export default Payment;
