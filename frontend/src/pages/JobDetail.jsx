import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Spinner from "../components/Spinner";
import { getJob } from "../services/jobService";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchJobDetails() {
      try {
        setIsLoading(true);
        const data = await getJob(id);
        setJob(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch details for this position.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchJobDetails();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-3xl w-full mx-auto px-4 py-12 flex-grow">
        {/* Back Link */}
        <Link
          to="/jobs"
          className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors mb-6 group"
        >
          <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">
            &larr;
          </span>{" "}
          Back to Jobs
        </Link>

        {/* Global Component Shell States */}
        {isLoading && <Spinner />}

        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 text-center">
            {error}
          </div>
        )}

        {!isLoading && !error && !job && (
          <div className="p-8 text-center text-gray-500 bg-white border border-gray-100 rounded-2xl shadow-sm">
            Job position not found.
          </div>
        )}

        {!isLoading && !error && job && (
          <article className="space-y-6">
            {/* Header Block */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
                {job.title}
              </h1>
              <h2 className="text-lg font-bold text-indigo-600 mb-6">
                {job.company?.name || job.company}
              </h2>

              <div className="flex flex-wrap gap-3 text-xs sm:text-sm font-medium text-gray-600">
                <span className="bg-gray-50 px-3 py-1.5 rounded-xl">
                  📍 {job.location}
                </span>
                <span className="bg-gray-50 px-3 py-1.5 rounded-xl">
                  💰{" "}
                  {job.salary?.min && job.salary?.max
                    ? `€${job.salary.min}–${job.salary.max}`
                    : "Competitive"}
                </span>
                <span className="bg-gray-50 px-3 py-1.5 rounded-xl">
                  🕒 {job.employmentType || "Full-time"}
                </span>
                <span className="bg-gray-50 px-3 py-1.5 rounded-xl">
                  ⭐ {job.experienceLevel || "Mid-level"}
                </span>
              </div>
            </div>

            {/* Tech Stack Block */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Content Details Block */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  Job Description
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </div>

              {job.niceToHaveSkills?.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    Nice to Have
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    {job.niceToHaveSkills.map((skill, idx) => (
                      <li key={idx}>{skill}</li>
                    ))}
                  </ul>
                </div>
              )}

              {job.benefits?.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    Benefits
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    {job.benefits.map((benefit, idx) => (
                      <li key={idx}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Application Bar */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
              <span className="text-xs text-gray-400 font-medium pl-2">
                Posted{" "}
                {job.createdAt
                  ? new Date(job.createdAt).toLocaleDateString()
                  : "Recently"}
              </span>
              <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all">
                Apply Now
              </button>
            </div>
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}
