import StatusBadge from "./StatusBadge";

export default function ApplicationCard({ application, actions = null }) {
  const job = application.job;
  const candidate = application.candidate;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex justify-between items-start mb-3">
        <div>
          {candidate && (
            <h4 className="text-base font-semibold text-gray-900">
              {candidate.name}
            </h4>
          )}
          {candidate && (
            <p className="text-sm text-gray-500">{candidate.email}</p>
          )}
          {job && (
            <p className="text-sm text-indigo-600 font-medium mt-1">
              {job.title} at {job.company}
            </p>
          )}
        </div>
        <StatusBadge status={application.status} />
      </div>

      {application.coverLetter && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {application.coverLetter}
        </p>
      )}

      <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-3">
        {application.R1Score !== null && application.R1Score !== undefined && (
          <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded">
            R1 Score: {application.R1Score}
          </span>
        )}
        {application.R2Score !== null && application.R2Score !== undefined && (
          <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded">
            R2 Score: {application.R2Score}
          </span>
        )}
        {application.screenedBy && (
          <span className="text-gray-400">
            Screened by: {application.screenedBy.name || "N/A"}
          </span>
        )}
      </div>

      {application.notes && (
        <p className="text-xs text-gray-500 italic mb-3 bg-gray-50 p-2 rounded">
          Notes: {application.notes}
        </p>
      )}

      <div className="text-xs text-gray-400 mb-3">
        Applied: {new Date(application.createdAt).toLocaleDateString()}
      </div>

      {actions && (
        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
          {actions}
        </div>
      )}
    </div>
  );
}
