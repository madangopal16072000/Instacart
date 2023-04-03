import { Typography } from "@mui/material";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import { selectCurrentUser } from "../../api/authSlice";
import { selectCartItems, selectShippingInfo } from "../../api/cartSlice";
import CheckoutSteps from "./CheckoutSteps";
import { Link, useNavigate } from "react-router-dom";
import "./ConfirmOrder.css";

const ConfirmOder = () => {
  const cartItems = useSelector(selectCartItems);
  const shippingInfo = useSelector(selectShippingInfo);
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const shippingCharges = subtotal >= 1000 ? 0 : 100;
  const tax = subtotal * 0.18;

  const totalPrice = subtotal + tax + shippingCharges;

  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

  const proceedToPayment = () => {
    const data = {
      subtotal,
      shippingInfo,
      shippingCharges,
      tax,
      totalPrice,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(data));

    navigate("/process/payment");
  };
  return (
    <>
      <MetaData title="Confirm Order" />
      <CheckoutSteps activeStep={1} />
      <div className="confirmOrderPage">
        <div>
          <div className="confirmshippingArea">
            <Typography>Shipping Info</Typography>
            <div className="confirmshippingAreaBox">
              <div>
                <p>Name : {user.name}</p>
                {/* <span>{user.name}</span> */}
              </div>
              <div>
                <p>Phone : {shippingInfo.phoneNo}</p>
                {/* <span>{shippingInfo.phoneNo}</span> */}
              </div>
              <div>
                <p>Address : {address}</p>
                {/* <span>{address}</span> */}
              </div>
            </div>
          </div>
          <div className="confirmCartItems">
            <Typography>Your Cart Items:</Typography>
            <div className="confirmCartItemsContainer">
              {cartItems &&
                cartItems.map((item) => (
                  <div key={item.product}>
                    <img src={item.image} alt="Product" />
                    <Link to={`/product/${item.product}`}>
                      {item.name}
                    </Link>{" "}
                    <span>
                      {item.quantity} X ₹{item.price} ={" "}
                      <b>₹{item.price * item.quantity}</b>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/*  */}
        <div>
          <div className="orderSummary">
            <Typography>Order Summery</Typography>
            <div>
              <div>
                <p>Subtotal : ₹{subtotal}</p>
                {/* <span>₹{subtotal}</span> */}
              </div>
              <div>
                <p>Shipping Charges : ₹{shippingCharges}</p>
                {/* <span>₹{shippingCharges}</span> */}
              </div>
              <div>
                <p>GST : ₹{tax}</p>
                {/* <span>₹{tax}</span> */}
              </div>
            </div>

            <div className="orderSummaryTotal">
              <p>
                <b>Total : ₹{totalPrice}</b>
              </p>
              {/* <span>₹{totalPrice}</span> */}
            </div>

            <button onClick={proceedToPayment}>Proceed To Payment</button>
          </div>
        </div>
      </div>
    </>
  );
};
export default ConfirmOder;
