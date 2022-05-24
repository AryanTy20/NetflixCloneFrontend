import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks";

const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();
  return auth?.accessToken ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace={true} />
  );
};

export default RequireAuth;
