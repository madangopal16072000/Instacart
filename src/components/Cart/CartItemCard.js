import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import "./CartItemCard.css";
import { removeItemFromCart } from "../../api/cartSlice";
import { toast } from "react-toastify";
const CartItemCard = ({ item }) => {
  const dispatch = useDispatch();

  const cartItemRemoveHandler = (productId) => {
    dispatch(removeItemFromCart(productId));
    toast.success("Item removed successfully");
  };
  return (
    <>
      <div className="CartItemCard">
        <img src={item.image} alt="ssa" />
        <div>
          <Link to={`/product/${item.product}`}>{item.name}</Link>
          <span>{`Price : ₹${item.price}`}</span>
          <p
            onClick={() => {
              cartItemRemoveHandler(item.product);
            }}
          >
            Remove
          </p>
        </div>
      </div>
    </>
  );
};

export default CartItemCard;
