import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployerJobs, deleteJob } from "../redux/slices/jobSlice";
import { fetchJobApplications } from "../redux/slices/applicationSlice";
import { Link } from "react-router-dom";
import JobCard from "../components/JobCard";
import ApplicationCard from "../components/ApplicationCard";
import StatusBadge from "../components/StatusBadge";

export default function EmployerDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { jobs, loading: jobsLoading } = useSelector((state) => state.jobs);
  const { applications, loading: appsLoading } = useSelector(
    (state) => state.applications
  );

  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    dispatch(fetchEmployerJobs());
  }, [dispatch]);

  const handleViewApplications = (jobId) => {
    setSelectedJob(jobId);
    dispatch(fetchJobApplications({ jobId }));
  };

  const handleDeleteJob = (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      dispatch(deleteJob(id));
    }
  };

  const stats = {
    total: jobs.length,
    approved: jobs.filter((j) => j.status === "approved").length,
    pending: jobs.filter((j) => j.status === "pending_approval").length,
    rejected: jobs.filter((j) => j.status === "rejected").length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Employer Dashboard
          </h1>
          <p className="text-gray-500">
            Welcome back, {user?.name}. Manage your job postings.
          </p>
        </div>
        <Link
          to="/jobs/create"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          + Create Job
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">Total Jobs</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
          <p className="text-sm text-gray-500">Approved</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-sm text-gray-500">Pending</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
          <p className="text-sm text-gray-500">Rejected</p>
        </div>
      </div>

      {selectedJob ? (
        <div>
          <button
            onClick={() => setSelectedJob(null)}
            className="text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Jobs
          </button>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Applications for: {jobs.find((j) => j._id === selectedJob)?.title}
          </h2>
          {appsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No applications received yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {applications.map((app) => (
                <ApplicationCard key={app._id} application={app} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {jobsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>You have not created any jobs yet.</p>
              <Link
                to="/jobs/create"
                className="text-indigo-600 hover:text-indigo-800 font-medium mt-2 inline-block"
              >
                Create your first job posting
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  showStatus
                  actions={
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewApplications(job._id)}
                        className="text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Applications
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="text-sm bg-red-50 text-red-700 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  }
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
