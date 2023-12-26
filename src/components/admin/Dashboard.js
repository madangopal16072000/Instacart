import Sidebar from "./Sidebar";
import "./Dashboard.css";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Doughnut, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductsAdmin,
  selectAdminProducts,
  selectAdminProductsStatus,
  selectAdminProudctsError,
} from "../../api/adminProductsSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  getAllAdminOrders,
  selectAllAdminOrders,
} from "../../api/adminOrdersSlice";
import {
  getAllUsers,
  resetAdminUsersError,
  selectAdminUsersError,
  selectAdminUsersStatus,
  selectAllUsers,
} from "../../api/adminUsersSlice";

Chart.register(...registerables);
const Dashboard = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAdminProducts);
  const status = useSelector(selectAdminProductsStatus);
  const error = useSelector(selectAdminProudctsError);
  const orders = useSelector(selectAllAdminOrders);
  const users = useSelector(selectAllUsers);
  const usersError = useSelector(selectAdminUsersError);
  const usersStatus = useSelector(selectAdminUsersStatus);

  let outOfStock = 0;
  products &&
    Array.isArray(products) &&
    products.forEach((item) => {
      if (item.Stock === 0) {
        outOfStock += 1;
      }
    });

  useEffect(() => {
    if (error) {
      toast.error(error);
    }

    if (status === "idle") {
      dispatch(fetchProductsAdmin());
      dispatch(getAllAdminOrders());
    }

    if (usersError) {
      toast.error(usersError);
      dispatch(resetAdminUsersError());
    }
    if (usersStatus === "idle") {
      dispatch(getAllUsers());
    }
  }, [dispatch, error, status, products, outOfStock, usersStatus, usersError]);

  let totalAmount = 0;
  orders &&
    orders.forEach((item) => {
      totalAmount += item.totalPrice;
    });
  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["tomato"],
        hoverBackgroundColor: ["rgb(197, 72, 49)"],
        data: [0, totalAmount],
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "InStock"],
    datasets: [
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [outOfStock, products.length - outOfStock],
      },
    ],
  };
  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboardContainer">
        <Typography component="h1">Dashboard</Typography>
        <div className="dashboardSummary">
          <div>
            <p>
              Total Amount <br /> ${totalAmount}
            </p>
          </div>
          <div className="dashboardSummaryBox2">
            <Link to="/admin/products">
              <p>Product</p>
              <p>{products?.length}</p>
            </Link>
            <Link to="/admin/orders">
              <p>Orders</p>
              <p>{orders && orders.length}</p>
            </Link>
            <Link to="/admin/users">
              <p>Users</p>
              <p>{users?.length}</p>
            </Link>
          </div>
        </div>
        <div className="lineChart">
          <Line data={lineState} />
        </div>
        <div className="doughnutChart">
          <Doughnut data={doughnutState} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
