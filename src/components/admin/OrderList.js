import { useDispatch, useSelector } from "react-redux";
import {
  deleteAdminOrder,
  getAllAdminOrders,
  resetAdminOrders,
  resetAdminOrdersError,
  selectAllAdminOrders,
  selectAllAdminOrdersError,
  selectAllAdminOrdersStatus,
} from "../../api/adminOrdersSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import "./ProductList.css";

const OrderList = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectAllAdminOrders);
  const ordersStatus = useSelector(selectAllAdminOrdersStatus);
  const ordersError = useSelector(selectAllAdminOrdersError);

  const deleteOrderHandler = (id) => {
    dispatch(deleteAdminOrder(id));
    dispatch(resetAdminOrders());
  };
  useEffect(() => {
    if (ordersError) {
      toast.error(ordersError);
      dispatch(resetAdminOrdersError());
    }

    if (ordersStatus === "idle") {
      dispatch(getAllAdminOrders());
    }
  }, [ordersStatus, dispatch, ordersError]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.5,
      cellClassName: (params) => {
        return params.row.status === "Delivered" ? "greenColor" : "redColor";
      },
    },
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
          <>
            <Link to={`/admin/order/${params.row.id}`}>
              <EditIcon />
            </Link>
            <Button onClick={() => deleteOrderHandler(params.row.id)}>
              <DeleteIcon />
            </Button>
          </>
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

  return (
    <>
      <MetaData title={"All Orders - Admin"} />
      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <h1 id="productListHeading">All Orders</h1>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableRowSelectionOnClick
            className="productListTable"
            autoHeight
          />
        </div>
      </div>
    </>
  );
};

export default OrderList;
