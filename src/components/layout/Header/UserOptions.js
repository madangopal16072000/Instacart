import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
// import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import { useState } from "react";
import ProfileImage from "../../../images/Profile.png";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logout } from "../../../api/authSlice";
import "./Header.css";
import { Backdrop } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { selectCartItems } from "../../../api/cartSlice";
const UserOptions = ({ user }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const options = [
    { icon: <ListAltIcon />, name: "Orders", func: orders },
    { icon: <PersonIcon />, name: "Profile", func: account },
    {
      icon: (
        <ShoppingCartIcon
          style={{ color: cartItems.length > 0 ? "tomato" : "unset" }}
        />
      ),
      name: `Cart(${cartItems.length})`,
      func: cart,
    },
    { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
  ];

  if (user.role === "admin") {
    options.unshift({
      icon: <DashboardIcon />,
      name: "Dashboard",
      func: dashboard,
    });
  }

  function dashboard() {
    navigate("/dashboard");
  }

  function orders() {
    navigate("/orders");
  }

  function account() {
    navigate("/account");
  }

  function logoutUser() {
    dispatch(logout());
    toast.success("Logout Successfully");
  }

  function cart() {
    navigate("/cart");
  }
  return (
    <>
      <Backdrop open={open} style={{ zIndex: 10 }} />
      <SpeedDial
        ariaLabel="SpeedDial"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        className="speedDial"
        style={{ zIndex: 11 }}
        icon={
          <img
            className="speedDialIcon"
            src={user.avatar.url ? user.avatar.url : ProfileImage}
            alt="Profile"
          />
        }
        direction="up"
      >
        {options.map((item) => {
          return (
            <SpeedDialAction
              key={item.name}
              icon={item.icon}
              tooltipTitle={item.name}
              onClick={item.func}
              tooltipOpen={window.innerWidth <= 600 ? true : false}
            />
          );
        })}
      </SpeedDial>
    </>
  );
};

export default UserOptions;
