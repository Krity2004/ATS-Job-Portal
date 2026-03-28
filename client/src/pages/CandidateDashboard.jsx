import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApprovedJobs } from "../redux/slices/jobSlice";
import { fetchMyApplications } from "../redux/slices/applicationSlice";
import JobCard from "../components/JobCard";
import ApplicationCard from "../components/ApplicationCard";

export default function CandidateDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { jobs, loading: jobsLoading } = useSelector((state) => state.jobs);
  const { applications, loading: appsLoading } = useSelector(
    (state) => state.applications
  );

  const [activeTab, setActiveTab] = useState("jobs");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchApprovedJobs());
    dispatch(fetchMyApplications());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchApprovedJobs({ search }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {user?.name}
        </h1>
        <p className="text-gray-500">Browse jobs and track your applications</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("jobs")}
          className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
            activeTab === "jobs"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          Browse Jobs
        </button>
        <button
          onClick={() => setActiveTab("applications")}
          className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
            activeTab === "applications"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          My Applications ({applications.length})
        </button>
      </div>

      {activeTab === "jobs" && (
        <>
          <form onSubmit={handleSearch} className="mb-6 flex gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Search jobs by title or company..."
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              Search
            </button>
          </form>

          {jobsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No approved jobs found. Check back later!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "applications" && (
        <>
          {appsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              You have not applied to any jobs yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {applications.map((app) => (
                <ApplicationCard key={app._id} application={app} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
