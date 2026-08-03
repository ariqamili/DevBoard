import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-7xl font-bold text-indigo-600">404</h1>

          <h2 className="text-3xl font-bold mt-4 mb-4">Page Not Found</h2>

          <p className="text-gray-500 mb-8">
            The page you are looking for doesn't exist.
          </p>

          <Link
            to="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Back Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
