import { Navigate } from "react-router-dom";
import Spinner from "./Spinner";
import { useUser } from "../context/UserContext";

export default function GuestRoute({ children }) {
  const { loading, isAuthenticated } = useUser();

  if (loading) {
    return <Spinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}
