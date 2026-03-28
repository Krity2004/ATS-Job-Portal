import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function JobCard({ job, showStatus = false, actions = null }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
          <p className="text-indigo-600 font-medium">{job.company}</p>
        </div>
        {showStatus && <StatusBadge status={job.status} />}
      </div>

      <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.location}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          {job.salary}
        </span>
        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded capitalize">
          {job.type}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {job.description}
      </p>

      {job.requirements && job.requirements.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.requirements.slice(0, 4).map((req, i) => (
            <span
              key={i}
              className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded"
            >
              {req}
            </span>
          ))}
          {job.requirements.length > 4 && (
            <span className="text-xs text-gray-400">
              +{job.requirements.length - 4} more
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <Link
          to={`/jobs/${job._id}`}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          View Details
        </Link>
        {actions}
      </div>
    </div>
  );
}
