import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 text-center sm:flex sm:justify-between sm:items-center text-sm text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} DevBoard Inc. All rights reserved.
        </p>
        <div className="flex justify-center space-x-6 mt-4 sm:mt-0">
          <Link to="/terms" className="hover:text-gray-600 transition-colors">
            Terms
          </Link>
          <Link to="/privacy" className="hover:text-gray-600 transition-colors">
            Privacy
          </Link>
          <Link to="/contact" className="hover:text-gray-600 transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    </footer>
  );
}
