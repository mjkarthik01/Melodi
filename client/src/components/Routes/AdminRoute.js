import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth";
import Spinner from "../Spinner";

const AdminRoute = () => {
  const [auth] = useAuth();

  if (!auth?.initialized) {
    return <Spinner />;
  }

  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  if (auth?.user?.role !== 1) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
