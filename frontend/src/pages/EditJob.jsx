import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Spinner from "../components/Spinner";
import JobForm from "../components/JobForm";
import jobService from "../services/jobService";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await jobService.getJob(id);
        setJob(response.data);
      } catch (err) {
        console.error(err);
        setLoadError("Failed to load this job posting.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleUpdate = async (payload) => {
    await jobService.updateJob(id, payload);
    navigate(`/jobs/${id}`, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Job</h1>

        {loading && <Spinner />}

        {loadError && (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100">
            {loadError}
          </div>
        )}

        {!loading && !loadError && job && (
          <JobForm
            initialData={job}
            onSubmit={handleUpdate}
            submitLabel="Save Changes"
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
