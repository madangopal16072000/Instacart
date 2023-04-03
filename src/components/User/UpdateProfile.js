import "./UpdateProfile.css";
import Loader from "../Loader";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import "./LoginSignUp.css";
import Face3 from "@mui/icons-material/Face3";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import { useEffect, useState } from "react";
import {
  selectCurrentUser,
  selectError,
  selectStatus,
} from "../../api/authSlice";
import { updateProfile } from "../../api/authSlice";
import profileImage from "../../images/Profile.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //   const { user } = useSelector((state) => state.user);
  //   const { error, isUpdated, loading } = useSelector((state) => state.profile);
  const user = useSelector(selectCurrentUser);
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(profileImage);

  const updateProfileSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("avatar", avatar);
    try {
      dispatch(updateProfile(myForm));
      toast.success("profile updated successfully");
      navigate("/account");
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  const updateProfileDataChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar.url);
    }

    if (status === "failed") {
      console.log(error);
    }
  }, [error, user, status, navigate]);
  return (
    <>
      {status === "loading" ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Update Profile" />
          <div className="updateProfileContainer">
            <div className="updateProfileBox">
              <h2 className="updateProfileHeading">Update Profile</h2>

              <form
                className="updateProfileForm"
                encType="multipart/form-data"
                onSubmit={updateProfileSubmit}
              >
                <div className="updateProfileName">
                  <Face3 />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="updateProfileEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div id="updateProfileImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={updateProfileDataChange}
                  />
                </div>
                <input
                  type="submit"
                  value="Update"
                  className="updateProfileBtn"
                />
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UpdateProfile;
