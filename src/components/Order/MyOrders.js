import LaunchIcon from "@mui/icons-material/Launch";
import MetaData from "../layout/MetaData";
import Loader from "../Loader";
import { DataGrid } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../api/authSlice";
import {
  fetchMyOrders,
  resetMyOrdersStatus,
  selectMyOrders,
  selectMyOrdersError,
  selectMyOrdersStatus,
} from "../../api/myOrdersSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom";
import "./MyOrders.css";
const MyOrders = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const orders = useSelector(selectMyOrders);
  const status = useSelector(selectMyOrdersStatus);
  const error = useSelector(selectMyOrdersError);
  const location = useLocation();

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },
    { field: "status", headerName: "Status", minWidth: 150, flex: 0.5 },
    {
      field: "itemQty",
      headerName: "Quantity",
      type: "number",
      minWidth: 150,
      flex: 0.3,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 270,
      flex: 0.5,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.3,
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/order/${params.row.id}`}>
            <LaunchIcon />
          </Link>
        );
      },
    },
  ];

  const rows = [];

  orders &&
    orders.forEach((item, index) => {
      rows.push({
        itemQty: item.orderItems.length,
        id: item._id,
        status: item.orderStatus,
        amount: item.totalPrice,
      });
    });

  useEffect(() => {
    if (error) {
      toast.error(error);
    }

    if (status === "idle") {
      dispatch(fetchMyOrders());
    }
  }, [error, dispatch, status]);

  return (
    <>
      <MetaData title={`${user.name} Orders`} />

      {status === "loading" ? (
        <Loader />
      ) : (
        <div className="myOrdersPage">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableRowSelectionOnClick
            className="myOrdersTable"
            autoHeight
          ></DataGrid>

          <Typography id="myOrdersHeading">{user.name}'s Orders</Typography>
        </div>
      )}
    </>
  );
};

export default MyOrders;
