import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllJobs, approveJob } from "../redux/slices/jobSlice";
import JobCard from "../components/JobCard";
import StatusBadge from "../components/StatusBadge";

export default function CoordinatorDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { jobs, loading } = useSelector((state) => state.jobs);

  const [filter, setFilter] = useState("pending_approval");
  const [r1Map, setR1Map] = useState({});
  const [r2Map, setR2Map] = useState({});

  useEffect(() => {
    dispatch(fetchAllJobs({ status: filter }));
  }, [dispatch, filter]);

  const handleApprove = (jobId) => {
    dispatch(
      approveJob({
        id: jobId,
        data: {
          status: "approved",
          R1Approved: r1Map[jobId] ?? true,
          R2Approved: r2Map[jobId] ?? true,
        },
      })
    );
  };

  const handleReject = (jobId) => {
    dispatch(approveJob({ id: jobId, data: { status: "rejected" } }));
  };

  const handleR1Toggle = (jobId) => {
    setR1Map((prev) => ({ ...prev, [jobId]: !prev[jobId] }));
  };

  const handleR2Toggle = (jobId) => {
    setR2Map((prev) => ({ ...prev, [jobId]: !prev[jobId] }));
  };

  const stats = {
    total: jobs.length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Coordinator Dashboard
        </h1>
        <p className="text-gray-500">
          Welcome, {user?.name}. Approve jobs and manage R1/R2 form checks.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {["pending_approval", "approved", "rejected", "draft", "closed"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <span className="capitalize">{status.replace("_", " ")}</span>
            </button>
          )
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 inline-block">
        <span className="text-sm text-gray-500">
          Showing {jobs.length} jobs with status:{" "}
        </span>
        <StatusBadge status={filter} />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No jobs found with this status.
        </div>
      ) : (
        <div className="space-y-5">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {job.title}
                  </h3>
                  <p className="text-indigo-600 font-medium">{job.company}</p>
                  <p className="text-sm text-gray-500">
                    {job.location} | {job.type} | {job.salary}
                  </p>
                  {job.employer && (
                    <p className="text-xs text-gray-400 mt-1">
                      Posted by: {job.employer.name} ({job.employer.email})
                    </p>
                  )}
                </div>
                <StatusBadge status={job.status} />
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {job.description}
              </p>

              {job.requirements && job.requirements.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {job.requirements.map((req, i) => (
                    <span
                      key={i}
                      className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              )}

              {filter === "pending_approval" && (
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Form Checks
                  </h4>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={r1Map[job._id] ?? job.R1Approved}
                        onChange={() => handleR1Toggle(job._id)}
                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">
                        R1 Form Approved
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={r2Map[job._id] ?? job.R2Approved}
                        onChange={() => handleR2Toggle(job._id)}
                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">
                        R2 Form Approved
                      </span>
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(job._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Approve Job
                    </button>
                    <button
                      onClick={() => handleReject(job._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Reject Job
                    </button>
                  </div>
                </div>
              )}

              {job.approvedBy && (
                <p className="text-xs text-gray-400 mt-3">
                  Reviewed by: {job.approvedBy.name}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
