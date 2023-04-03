import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData";
import { Fragment } from "react";
import "./Profile.css";
const Profile = () => {
  const localData = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  useEffect(() => {
    if (!localData) {
      navigate("/login");
    }
  }, [localData, navigate]);

  let currUser;
  if (localData) currUser = localData.data.user;

  return (
    <>
      {currUser ? (
        <Fragment>
          <MetaData title={`${currUser.name}'s Profile`} />
          <div className="profileContainer">
            <div>
              <h1>My Profile</h1>
              <img src={currUser.avatar.url} alt={currUser.name} />
              <Link to="/user/update">Edit Profile</Link>
            </div>
            <div>
              <div>
                <h4>Full Name</h4>
                <p>{currUser.name}</p>
              </div>
              <div>
                <h4>Email</h4>
                <p>{currUser.email}</p>
              </div>
              <div>
                <h4>Joined On</h4>
                <p>{String(currUser.createdAt).substring(0, 10)}</p>
              </div>

              <div>
                <Link to="/orders">My Orders</Link>
                <Link to="/password/update">Change Password</Link>
              </div>
            </div>
          </div>
        </Fragment>
      ) : (
        ""
      )}
    </>
  );
};

export default Profile;
