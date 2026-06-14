import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth";
import Spinner from "../Spinner";

export default function PrivateRoute() {
  const [auth] = useAuth();

  if (!auth?.initialized) {
    return <Spinner />;
  }

  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
