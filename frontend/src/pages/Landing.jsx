import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import Spinner from "../components/Spinner";
import jobService from "../services/jobService";

export default function Landing() {
  const [latestJobs, setLatestJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        setIsLoading(true);
        const response = await jobService.getJobs();
        setLatestJobs(response.data.slice(0, 5));
      } catch (err) {
        console.error("Failed to load backend job postings:", err);
        setError("Could not load latest job openings. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <header className="bg-white border-b border-gray-100 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
            Find Your Next{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Developer Opportunity
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join thousands of developers and world-class engineering companies
            building the future together.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/jobs"
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md text-center"
            >
              Browse Jobs
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold rounded-xl transition-all shadow-sm text-center"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Latest Jobs Grid Section */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-y-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Latest Openings
            </h2>
            <p className="text-sm text-gray-500">
              Hand-picked engineering positions updated live
            </p>
          </div>
          <Link
            to="/jobs"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center"
          >
            View all positions &rarr;
          </Link>
        </div>

        {/* Clean, declarative layout rendering rules */}
        {isLoading && <Spinner />}

        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 text-center">
            {error}
          </div>
        )}

        {!isLoading && !error && latestJobs.length === 0 && (
          <p className="text-center text-gray-500 py-12">
            No current opportunities found.
          </p>
        )}

        {!isLoading && !error && latestJobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestJobs.map((job) => (
              <div key={job._id} className="flex justify-center">
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}

        {/* Browse Jobs CTA block bottom wrapper */}
        <div className="mt-12 flex justify-center">
          <Link
            to="/jobs"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors duration-200"
          >
            Browse All Active Jobs
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
