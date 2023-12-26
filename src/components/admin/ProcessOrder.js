import { useDispatch, useSelector } from "react-redux";
import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import {
  getOrderDetails,
  resetAdminOrderDetails,
  selectAdminOrderDetails,
  selectAdminOrderDetailsError,
  selectAdminOrderDetailsStatus,
  updateOrderDetails,
} from "../../api/adminOrderDetailsSlice";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import "./ProcessOrder.css";

const ProcessOrder = () => {
  const [orderStatus, setOrderStatus] = useState("");
  const order = useSelector(selectAdminOrderDetails);
  const status = useSelector(selectAdminOrderDetailsStatus);
  const error = useSelector(selectAdminOrderDetailsError);
  const params = useParams();
  const id = params.id;
  const dispatch = useDispatch();

  console.log(order);

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("status", orderStatus);

    console.log("entered");
    for (let pair of myForm.entries()) {
      console.log(pair[0] + " : " + pair[1]);
    }
    dispatch(updateOrderDetails({ id: id, order: myForm }));
    dispatch(resetAdminOrderDetails());
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }

    if (status === "idle") {
      dispatch(getOrderDetails(id));
      dispatch(resetAdminOrderDetails());
    }

    if (status === "updated") {
      toast.success("Order Updated Successfully");
      // dispatch(resetAdminOrderDetails());
    }
  }, [error, status, dispatch, id]);

  return (
    <>
      <MetaData title="Process Order" />
      <div className="dashboard">
        <Sidebar />
        <div className="newProductContainer">
          {status === "loading" ? (
            <Loader />
          ) : (
            <div
              className="confirmOrderPage"
              style={{
                display:
                  order && order.orderStatus === "Delivered" ? "block" : "grid",
              }}
            >
              <div>
                <div className="confirmshippingArea">
                  <Typography>Shipping Info</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p>Name:</p>
                      <span>{order.user && order.user.name}</span>
                    </div>
                    <div>
                      <p>Phone:</p>
                      <span>
                        {order.shippingInfo && order.shippingInfo.phoneNo}
                      </span>
                    </div>
                    <div>
                      <p>Address:</p>
                      <span>
                        {order.shippingInfo &&
                          `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
                      </span>
                    </div>
                  </div>

                  <Typography>Payment</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p
                        className={
                          order.paymentInfo &&
                          order.paymentInfo.status === "succeeded"
                            ? "greenColor"
                            : "redColor"
                        }
                      >
                        {order.paymentInfo &&
                        order.paymentInfo.status === "succeeded"
                          ? "PAID"
                          : "NOT PAID"}
                      </p>
                    </div>

                    <div>
                      <p>Amount:</p>
                      <span>{order.totalPrice && order.totalPrice}</span>
                    </div>
                  </div>

                  <Typography>Order Status</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p
                        className={
                          order &&
                          order.orderStatus &&
                          order.orderStatus === "Delivered"
                            ? "greenColor"
                            : "redColor"
                        }
                      >
                        {order && order.orderStatus && order.orderStatus}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="confirmCartItems">
                  <Typography>Your Cart Items:</Typography>
                  <div className="confirmCartItemsContainer">
                    {order.orderItems &&
                      order.orderItems.map((item) => (
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
              <div
                style={{
                  display: order.orderStatus === "Delivered" ? "none" : "block",
                }}
              >
                <form
                  className="updateOrderForm"
                  onSubmit={updateOrderSubmitHandler}
                >
                  <h1>Process Order</h1>

                  <div>
                    <AccountTreeIcon />
                    <select onChange={(e) => setOrderStatus(e.target.value)}>
                      <option value="">Choose Category</option>
                      {order.orderStatus === "Processing" && (
                        <option value="Shipped">Shipped</option>
                      )}

                      {order.orderStatus === "Shipped" && (
                        <option value="Delivered">Delivered</option>
                      )}
                    </select>
                  </div>

                  <Button
                    id="createProductBtn"
                    type="submit"
                    disabled={
                      status === "loading"
                        ? true
                        : false || status === ""
                        ? true
                        : false
                    }
                  >
                    Process
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProcessOrder;
