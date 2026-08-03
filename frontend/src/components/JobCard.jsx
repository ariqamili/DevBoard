import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  // Helper function to calculate relative "days ago" from MongoDB timestamps
  const formatDaysAgo = (dateString) => {
    if (!dateString) return "Recently";
    const created = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - created);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0
      ? "Today"
      : diffDays === 1
        ? "1 day ago"
        : `${diffDays} days ago`;
  };

  return (
    <div className="w-full max-w-sm p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-62.5">
      <div>
        {/* Title & Company */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-1">
            {job.title}
          </h3>
          <p className="text-sm font-semibold text-indigo-600 line-clamp-1">
            {job.companyProfile?.companyName ||
              job.companyProfile?.user?.email ||
              "Unknown company"}
          </p>
        </div>

        {/* Location & Salary Meta Metadata */}
        <div className="flex items-center gap-x-4 text-xs font-medium text-gray-500 mb-4">
          <span className="flex items-center">
            <span className="mr-1">📍</span> {job.location}
          </span>
          <span className="flex items-center">
            <span className="mr-1">💰</span>
            {job.salary && job.salary.min != null && job.salary.max != null
              ? `€${job.salary.min}–${job.salary.max}`
              : job.salary || "Not specified"}
          </span>
        </div>

        {/* Minimal Stack String Line */}
        <p className="text-xs font-medium text-gray-400 line-clamp-1 mb-4">
          {job.requiredSkills?.join(" • ") || "No skills listed"}
        </p>
      </div>

      {/* Footer Row: Timestamp and Call-to-Action */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <span className="text-xs text-gray-400 font-medium">
          Posted {formatDaysAgo(job.createdAt)}
        </span>
        <Link
          to={`/jobs/${job._id}`}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-3 py-1.5 rounded-lg transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
