import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Spinner from "./Spinner";

export default function ProtectedRoute() {
  const { loading, isAuthenticated } = useUser();
  const location = useLocation();

  if (loading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
