import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import {
  deleteUser,
  resetAdminUsersError,
  resetAdminUsersStatus,
  selectAdminUsersError,
  selectAdminUsersStatus,
  selectAllUsers,
} from "../../api/adminUsersSlice";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { getAllUsers } from "../../api/adminUsersSlice";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";

const UsersList = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const status = useSelector(selectAdminUsersStatus);
  const error = useSelector(selectAdminUsersError);

  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAdminUsersError());
    }

    if (status === "idle") {
      dispatch(getAllUsers());
    }

    if (status === "deleted") {
      toast.success("User deleted Successfully");
      dispatch(resetAdminUsersStatus());
    }
  }, [status, error, dispatch]);

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 180, flex: 0.8 },

    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 0.5,
    },

    {
      field: "role",
      headerName: "Role",
      type: "number",
      minWidth: 150,
      flex: 0.3,
      cellClassName: (params) => {
        return params.row.role === "admin" ? "greenColor" : "redColor";
      },
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
          <>
            <Link to={`/admin/user/${params.row.id}`}>
              <EditIcon />
            </Link>

            <Button onClick={() => deleteUserHandler(params.row.id)}>
              <DeleteIcon />
            </Button>
          </>
        );
      },
    },
  ];

  const rows = [];

  users &&
    users.forEach((item) => {
      rows.push({
        id: item._id,
        role: item.role,
        email: item.email,
        name: item.name,
      });
    });

  return (
    <>
      <MetaData title={`All Users - Admin`} />

      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL USERS</h1>

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
    </>
  );
};

export default UsersList;
