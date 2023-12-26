import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductsAdmin,
  resetAdminProductsStatus,
  selectAdminProducts,
  selectAdminProductsStatus,
  selectAdminProudctsError,
} from "../../api/adminProductsSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import Sidebar from "./Sidebar";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MetaData from "../layout/MetaData";
import "./ProductList.css";
import {
  deleteProduct,
  selectAdminProductError,
  selectAdminProductStatus,
  resetProductStatus,
} from "../../api/adminProductSlice";

const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAdminProducts);
  const error = useSelector(selectAdminProudctsError);
  const status = useSelector(selectAdminProductsStatus);
  const deleteStatus = useSelector(selectAdminProductStatus);
  const deleteError = useSelector(selectAdminProductError);
  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id));
  };
  useEffect(() => {
    if (error) {
      toast.error(error);
    }

    if (deleteError) {
      toast.error(deleteError);
    }
    if (status === "idle") {
      dispatch(fetchProductsAdmin());
    }

    if (deleteStatus === "succeeded") {
      toast.success("Product Deleted Successfully");
      dispatch(resetAdminProductsStatus());
      dispatch(resetProductStatus());
    }
  }, [error, status, dispatch, deleteError, deleteStatus]);

  const columns = [
    { field: "id", headerName: "Product ID", minWidth: 200, flex: 0.5 },

    {
      field: "name",
      headerName: "Name",
      minWidth: 350,
      flex: 1,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 150,
      flex: 0.3,
    },

    {
      field: "price",
      headerName: "Price",
      type: "number",
      minWidth: 270,
      flex: 0.5,
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link to={`/admin/product/${params.row.id}`}>
              <EditIcon />
            </Link>

            <Button onClick={() => deleteProductHandler(params.row.id)}>
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  products &&
    products.forEach((item) => {
      rows.push({
        id: item._id,
        stock: item.Stock,
        price: item.price,
        name: item.name,
      });
    });

  return (
    <Fragment>
      <MetaData title={`ALL PRODUCTS - Admin`} />

      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL PRODUCTS</h1>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="productListTable"
            autoHeight
          />
        </div>
      </div>
    </Fragment>
  );
};

export default ProductList;
