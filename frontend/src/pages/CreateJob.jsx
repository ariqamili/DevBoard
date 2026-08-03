import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobForm from "../components/JobForm";
import jobService from "../services/jobService";

export default function CreateJob() {
  const navigate = useNavigate();

  const handleCreate = async (payload) => {
    const response = await jobService.createJob(payload);
    navigate(`/jobs/${response.data._id}`, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Post a New Job
        </h1>

        <JobForm onSubmit={handleCreate} submitLabel="Post Job" />
      </main>

      <Footer />
    </div>
  );
}
