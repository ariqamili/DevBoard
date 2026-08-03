import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Spinner from "../components/Spinner";
import applicationService from "../services/applicationService";

const STATUS_STYLES = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
  reviewed: "bg-blue-50 text-blue-700 border-blue-100",
  accepted: "bg-green-50 text-green-700 border-green-100",
  rejected: "bg-red-50 text-red-700 border-red-100",
};

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await applicationService.getMine();
        setApplications(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load your applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          My Applications
        </h1>

        {loading && <Spinner />}

        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100">
            {error}
          </div>
        )}

        {!loading && !error && applications.length === 0 && (
          <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <p className="text-gray-500 mb-4">
              You haven&apos;t applied to any jobs yet.
            </p>
            <Link
              to="/jobs"
              className="inline-block px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition"
            >
              Browse Jobs
            </Link>
          </div>
        )}

        {!loading && !error && applications.length > 0 && (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-bold text-gray-900">
                    {app.job?.title || "Job no longer available"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {app.job?.companyProfile?.companyName || "Unknown company"}
                    {app.job?.location ? ` · ${app.job.location}` : ""}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Applied {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border capitalize ${
                    STATUS_STYLES[app.status] || STATUS_STYLES.pending
                  }`}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
