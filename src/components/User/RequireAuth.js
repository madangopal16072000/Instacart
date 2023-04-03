import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../api/authSlice";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const RequireAuth = () => {
  const location = useLocation();
  const user = useSelector(selectCurrentUser);
  return (
    <>
      {user ? (
        <Outlet />
      ) : (
        <Navigate to="/login" state={{ from: location }} replace />
      )}
    </>
  );
};

export default RequireAuth;
