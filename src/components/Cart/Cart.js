import CartItemCard from "./CartItemCard.js";
import "./Cart.css";
import { useDispatch, useSelector } from "react-redux";
import { changeItemQuantity, selectCartItems } from "../../api/cartSlice.js";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { Typography } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const navigate = useNavigate();
  const location = useLocation();

  const changeQuantityHandler = (id, quantity, stock) => {
    if (stock < quantity || quantity <= 0) {
      return;
    }
    dispatch(changeItemQuantity({ productId: id, newQuantity: quantity }));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=shipping", { state: { from: location } });
  };
  const content =
    cartItems.length === 0 ? (
      <div className="emptyCart">
        <RemoveShoppingCartIcon />
        <Typography>No Product in Your Cart</Typography>
        <Link to="/products">View Product</Link>
      </div>
    ) : (
      <>
        <div className="cartPage">
          <div className="cartHeader">
            <p>Product</p>
            <p>Quantity</p>
            <p>Subtotal</p>
          </div>

          {cartItems &&
            cartItems.map((item) => {
              return (
                <div className="cartContainer" key={item.product}>
                  <CartItemCard item={item} />
                  <div className="cartInput">
                    <button
                      onClick={() => {
                        return changeQuantityHandler(
                          item.product,
                          item.quantity - 1,
                          item.stock
                        );
                      }}
                    >
                      -
                    </button>
                    <input value={item.quantity} type="number" readOnly />
                    <button
                      onClick={() => {
                        return changeQuantityHandler(
                          item.product,
                          item.quantity + 1,
                          item.stock
                        );
                      }}
                    >
                      +
                    </button>
                  </div>
                  <p className="cartSubtotal">{`₹${
                    item.price * item.quantity
                  }`}</p>
                </div>
              );
            })}
          <div className="cartGrossProfit">
            <div></div>
            <div className="cartGrossProfitBox">
              <p>Gross Total</p>
              <p>
                {cartItems.reduce((acc, item) => {
                  return acc + item.price * item.quantity;
                }, 0)}
              </p>
            </div>
            <div></div>
            <div className="checkOutBtn">
              <button onClick={checkoutHandler}>Check Out</button>
            </div>
          </div>
        </div>
      </>
    );

  return <>{content}</>;
};

export default Cart;
