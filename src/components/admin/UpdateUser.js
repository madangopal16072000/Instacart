import { useState, useEffect, Fragment } from "react";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import Loader from "../layout/Loader";
import PersonIcon from "@mui/icons-material/Person";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdminUserDetails,
  resetAdminUserDetails,
  resetAdminUserDetailsError,
  selectAdminUserDetails,
  selectAdminUserDetailsError,
  updateAdminUserDetails,
  selectAdminUserDetailsStatus,
} from "../../api/adminUserDetailsSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { resetAdminUsersStatus } from "../../api/adminUsersSlice";

const UpdateUser = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const user = useSelector(selectAdminUserDetails);
  const status = useSelector(selectAdminUserDetailsStatus);
  const error = useSelector(selectAdminUserDetailsError);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const userId = params.id;

  useEffect(() => {
    if (user && user._id !== userId) {
      dispatch(getAdminUserDetails(userId));
    } else {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
    if (error) {
      toast.error(error);
      dispatch(resetAdminUserDetailsError());
    }

    if (status === "updated") {
      toast.success("User Updated Successfully");
      navigate("/admin/users");
      dispatch(resetAdminUserDetails());
      dispatch(resetAdminUsersStatus());
    }
  }, [user, error, dispatch, userId, navigate, status]);

  const updateUserSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("role", role);

    dispatch(updateAdminUserDetails({ userId, myForm }));
  };

  return (
    <Fragment>
      <MetaData title="Update User" />
      <div className="dashboard">
        <Sidebar />
        <div className="newProductContainer">
          {status === "loading" ? (
            <Loader />
          ) : (
            <form
              className="createProductForm"
              onSubmit={updateUserSubmitHandler}
            >
              <h1>Update User</h1>

              <div>
                <PersonIcon />
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <MailOutlineIcon />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <VerifiedUserIcon />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Choose Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              <Button
                id="createProductBtn"
                type="submit"
                disabled={
                  status === "loading"
                    ? true
                    : false || role === ""
                    ? true
                    : false
                }
              >
                Update
              </Button>
            </form>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateUser;
