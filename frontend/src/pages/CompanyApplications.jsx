import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Spinner from "../components/Spinner";
import applicationService from "../services/applicationService";

const STATUS_OPTIONS = ["pending", "reviewed", "accepted", "rejected"];

const STATUS_STYLES = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
  reviewed: "bg-blue-50 text-blue-700 border-blue-100",
  accepted: "bg-green-50 text-green-700 border-green-100",
  rejected: "bg-red-50 text-red-700 border-red-100",
};

export default function CompanyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await applicationService.getCompany();
        setApplications(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      const response = await applicationService.updateStatus(id, status);
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? response.data : app)),
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Applications</h1>

        {loading && <Spinner />}

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100">
            {error}
          </div>
        )}

        {!loading && applications.length === 0 && !error && (
          <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <p className="text-gray-500">
              No applications have been submitted to your jobs yet.
            </p>
          </div>
        )}

        {!loading && applications.length > 0 && (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {app.applicantName || app.user?.email}
                    </h3>
                    {app.applicantName && (
                      <p className="text-xs text-gray-400">{app.user?.email}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Applied for{" "}
                      <span className="font-semibold">{app.job?.title}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Applied {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border capitalize whitespace-nowrap ${
                      STATUS_STYLES[app.status] || STATUS_STYLES.pending
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                {app.coverLetter && (
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4 mb-4 whitespace-pre-line">
                    {app.coverLetter}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-gray-500">
                    Update status:
                  </label>
                  <select
                    value={app.status}
                    disabled={updatingId === app._id}
                    onChange={(e) =>
                      handleStatusChange(app._id, e.target.value)
                    }
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1.5"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
