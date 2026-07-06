// export default function JobCard({ job }) {
//   return (
//     <div>
//       <h3>{job.title}</h3>
//       <h4>{job.company}</h4>
//       <p>{job.description}</p>
//       <ul>
//         {job.techStack.map((techStack, idx) => (
//           <li key={idx}>{techStack}</li>
//         ))}
//       </ul>
//       <h6>Status: {job.status}</h6>
//     </div>
//   );
// }

export default function JobCard({ job }) {
  // Dynamic color matching for the status badge
  const statusColors =
    job.status === "open"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";

  return (
    <div className="max-w-md p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-gray-900 leading-tight">
          {job.title}
        </h3>
        <span
          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusColors}`}
        >
          {job.status}
        </span>
      </div>

      {/* Company and Location row */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm mb-4">
        <h4 className="font-semibold text-indigo-600">{job.company}</h4>
        <span className="text-gray-300 hidden sm:inline">•</span>
        <div className="flex items-center text-gray-500 font-medium">
          {/* Inline SVG Location Pin Icon */}
          <svg
            className="w-4 h-4 mr-1 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {job.location}
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-5 leading-relaxed">
        {job.description.slice(0, 120)}...
      </p>

      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">
          Tech Stack
        </span>
        <ul className="flex flex-wrap gap-2">
          {job.techStack.map((tech, idx) => (
            <li
              key={idx}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md border border-gray-200"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
