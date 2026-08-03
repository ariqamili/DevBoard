import { Link, NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useUser();

  const navLinkStyle = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "text-indigo-600 font-semibold"
        : "text-gray-600 hover:text-indigo-600"
    }`;

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            DevBoard
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/jobs" className={navLinkStyle}>
              Jobs
            </NavLink>

            <NavLink to="/about" className={navLinkStyle}>
              About
            </NavLink>

            {isAuthenticated && (
              <>
                <NavLink to="/dashboard" className={navLinkStyle}>
                  Dashboard
                </NavLink>

                <NavLink to="/profile" className={navLinkStyle}>
                  Profile
                </NavLink>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <NotificationBell />

                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 hover:border-red-300 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkStyle}>
                  Login
                </NavLink>

                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
