import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  // Shared active vs inactive link styling function
  const navLinkStyle = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "text-indigo-600 font-semibold"
        : "text-gray-600 hover:text-indigo-600"
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand Identity */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              DevBoard
            </span>
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/jobs" className={navLinkStyle}>
              Jobs
            </NavLink>
            <NavLink to="/companies" className={navLinkStyle}>
              Companies
            </NavLink>
            <NavLink to="/about" className={navLinkStyle}>
              About
            </NavLink>
          </div>

          {/* Right Action Authentication Links */}
          <div className="flex items-center space-x-4">
            <NavLink to="/login" className={navLinkStyle}>
              Login
            </NavLink>
            <Link
              to="/register"
              className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
