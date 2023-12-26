import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import "./LoginSignUp.css";
import Face3 from "@mui/icons-material/Face3";
import Profile from "../../images/Profile.png";
import Loader from "../layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  register,
  selectError,
  selectStatus,
} from "../../api/authSlice";
import { toast } from "react-toastify";

const LoginSignUp = () => {
  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);
  const [avatar, setAvatar] = useState(Profile);
  const [avatarPreview, setAvatarPreview] = useState(Profile);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const { name, email, password } = user;
  const dispatch = useDispatch();
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);
  // let canLogin =
  //   [loginEmail, loginPassword].every(Boolean) && status === "idle";

  const redirect = location.search ? "/" + location.search.split("=")[1] : from;
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (status === "succeeded") {
      navigate(redirect, { replace: true });
    }
  }, [error, status, navigate, redirect]);

  const loginSubmit = (e) => {
    e.preventDefault();

    // if (canLogin) {
    dispatch(login({ email: loginEmail, password: loginPassword }));
    navigate(from, { replace: true });
    // }
  };

  const registerSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    if (password.length < 8) {
      toast.error("Password length should be greater than 8");
      return;
    }

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("avatar", avatar);

    // for (const value of myForm.values()) console.log(value);

    if (myForm) {
      dispatch(register(myForm));
      // navigate(from, { replace: true });
    }
  };

  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }

    if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };
  return (
    <>
      {status === "loading" ? (
        <Loader />
      ) : (
        <div className="LoginSignUpContainer">
          <div className="LoginSignUpBox">
            <div>
              <div className="login_signUp_toggle">
                <p onClick={(e) => switchTabs(e, "login")}>Login</p>
                <p onClick={(e) => switchTabs(e, "register")}>Register</p>
              </div>
              <button ref={switcherTab}></button>
            </div>
            <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
              <div className="loginEmail">
                <MailOutlineIcon />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>

              <div className="loginPassword">
                <LockOpenIcon />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              <Link to="/password/forget">Forget Password ?</Link>
              <input type="submit" value="Login" className="loginBtn" />
            </form>

            <form
              className="signUpForm"
              ref={registerTab}
              encType="multipart/form-data"
              onSubmit={registerSubmit}
            >
              <div className="signUpName">
                <Face3 />
                <input
                  type="text"
                  placeholder="Name"
                  required
                  name="name"
                  value={name}
                  onChange={registerDataChange}
                />
              </div>
              <div className="signUpEmail">
                <MailOutlineIcon />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  name="email"
                  value={email}
                  onChange={registerDataChange}
                />
              </div>
              <div className="signUpPassword">
                <LockOpenIcon />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  name="password"
                  value={password}
                  onChange={registerDataChange}
                />
              </div>
              <div id="registerImage">
                <img src={avatarPreview} alt="Avatar Preview" />
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={registerDataChange}
                />
              </div>
              <input
                type="submit"
                value="Register"
                className="signUpBtn"
                // disabled={loading ? true : false}
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginSignUp;
