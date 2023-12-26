import Toolbar from "@mui/material/Toolbar";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import useTheme from "@mui/material/styles/useTheme";
import { useLocation, useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectCurrentUser } from "../../../api/authSlice";
import { toast } from "react-toastify";
import { Box, Stack } from "@mui/material";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";

const PAGES = [
  {
    title: "Home",
    url: "/",
  },
  { title: "Products", url: "/products" },
  { title: "Cart", url: "/cart" },
  { title: "Search", url: "/search" },
  { title: "About", url: "/about" },
];

function LinkTab(props) {
  return <Tab component={Link} {...props} />;
}
const Navbar = () => {
  const theme = useTheme();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(0);

  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(logout());
    toast.success("Logout Successfully");
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  return (
    <>
      <AppBar sx={{ background: "rgb(34, 33, 33)" }} position="static">
        <Toolbar>
          {isMatch ? (
            <>
              {/* <DrawerComponent /> */}
              <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: "flex", md: "none" },
                }}
              >
                <Typography
                  marginRight="auto"
                  sx={{
                    fontSize: "2rem",
                    paddingX: 2,
                    color: "#eb4034",
                  }}
                >
                  InstaCart
                </Typography>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {PAGES.map((page, index) => (
                    <MenuItem key={index} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">
                        <Link to={page.url} style={{ textDecoration: "none" }}>
                          {page.title}
                        </Link>
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </>
          ) : (
            <>
              {/* <Typography
                sx={{
                  fontSize: "2rem",
                  paddingLeft: 2,
                  color: "#eb4034",
                }}
              >
                <ShoppingCartIcon
                  sx={{
                    color: "white",
                    size: "large",
                    paddingX: 1,
                    color: "tomato",
                  }}
                />
                InstaCart
              </Typography> */}
              <Button
                sx={{
                  fontSize: "1.5rem",
                  color: "tomato",
                  textTransform: "none",
                }}
              >
                <ShoppingCartIcon
                  sx={{
                    size: "large",
                    paddingX: 1,
                    color: "tomato",
                  }}
                />
                InstaCart
              </Button>
              <Stack direction="row" spacing={2} ml="auto">
                {PAGES.map((page, index) => {
                  return (
                    <Button
                      color="inherit"
                      variant="text"
                      key={page.title}
                      onClick={(e) => {
                        navigate(`${page.url}`);
                      }}
                    >
                      {page.title}
                    </Button>
                  );
                })}
              </Stack>
              {!user ? (
                <>
                  <Button
                    sx={{ marginLeft: "auto" }}
                    variant="outlined"
                    color="warning"
                    onClick={() => {
                      return navigate("/login");
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    sx={{ marginLeft: "10px" }}
                    variant="outlined"
                    color="warning"
                    onClick={() => {
                      return navigate("/login");
                    }}
                  >
                    SignUp
                  </Button>
                </>
              ) : (
                <Button
                  sx={{ marginLeft: "auto" }}
                  variant="outlined"
                  color="warning"
                  onClick={logoutHandler}
                >
                  LogOut
                </Button>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
