import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllJobs } from "../redux/slices/jobSlice";
import {
  fetchJobApplications,
  fetchShortlistedCandidates,
  shortlistCandidate,
  updateR1Status,
  updateR2Status,
  hireCandidate,
  rejectCandidate,
} from "../redux/slices/applicationSlice";
import ApplicationCard from "../components/ApplicationCard";

export default function RecruiterDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { jobs } = useSelector((state) => state.jobs);
  const { applications, shortlisted, loading } = useSelector(
    (state) => state.applications
  );

  const [activeTab, setActiveTab] = useState("jobs");
  const [selectedJob, setSelectedJob] = useState(null);
  const [scoreInputs, setScoreInputs] = useState({});
  const [noteInputs, setNoteInputs] = useState({});

  useEffect(() => {
    dispatch(fetchAllJobs({ status: "approved" }));
    dispatch(fetchShortlistedCandidates());
  }, [dispatch]);

  const handleSelectJob = (jobId) => {
    setSelectedJob(jobId);
    dispatch(fetchJobApplications({ jobId }));
  };

  const handleShortlist = (appId) => {
    dispatch(
      shortlistCandidate({ id: appId, notes: noteInputs[appId] || "" })
    );
  };

  const handleR1 = (appId) => {
    dispatch(
      updateR1Status({
        id: appId,
        R1Score: parseInt(scoreInputs[appId] || "0", 10),
        notes: noteInputs[appId] || "",
      })
    );
  };

  const handleR2 = (appId) => {
    dispatch(
      updateR2Status({
        id: appId,
        R2Score: parseInt(scoreInputs[appId] || "0", 10),
        notes: noteInputs[appId] || "",
      })
    );
  };

  const handleHire = (appId) => {
    dispatch(hireCandidate({ id: appId, notes: noteInputs[appId] || "" }));
  };

  const handleReject = (appId) => {
    dispatch(rejectCandidate({ id: appId, notes: noteInputs[appId] || "" }));
  };

  const renderActions = (app) => {
    const status = app.status;
    return (
      <div className="space-y-3 w-full">
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            max="100"
            placeholder="Score"
            value={scoreInputs[app._id] || ""}
            onChange={(e) =>
              setScoreInputs({ ...scoreInputs, [app._id]: e.target.value })
            }
            className="w-20 px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <input
            type="text"
            placeholder="Notes..."
            value={noteInputs[app._id] || ""}
            onChange={(e) =>
              setNoteInputs({ ...noteInputs, [app._id]: e.target.value })
            }
            className="flex-1 px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {status === "applied" && (
            <button
              onClick={() => handleShortlist(app._id)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              Shortlist
            </button>
          )}
          {status === "shortlisted" && (
            <button
              onClick={() => handleR1(app._id)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              Pass R1
            </button>
          )}
          {status === "r1_cleared" && (
            <button
              onClick={() => handleR2(app._id)}
              className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              Pass R2
            </button>
          )}
          {(status === "r2_cleared" ||
            status === "r1_cleared" ||
            status === "shortlisted") && (
            <button
              onClick={() => handleHire(app._id)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              Hire
            </button>
          )}
          {status !== "hired" && status !== "rejected" && (
            <button
              onClick={() => handleReject(app._id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              Reject
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Recruiter Dashboard
        </h1>
        <p className="text-gray-500">
          Welcome, {user?.name}. Screen candidates and manage hiring pipeline.
        </p>
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
          Jobs & Applications
        </button>
        <button
          onClick={() => {
            setActiveTab("shortlisted");
            dispatch(fetchShortlistedCandidates());
          }}
          className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
            activeTab === "shortlisted"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          Shortlisted Pipeline
        </button>
      </div>

      {activeTab === "jobs" && (
        <>
          {!selectedJob ? (
            <>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Select a job to view applications
              </h2>
              {jobs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No approved jobs to screen.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {jobs.map((job) => (
                    <button
                      key={job._id}
                      onClick={() => handleSelectJob(job._id)}
                      className="text-left bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-indigo-300 transition-all"
                    >
                      <h3 className="font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      <p className="text-indigo-600 text-sm">{job.company}</p>
                      <p className="text-gray-500 text-sm mt-1">
                        {job.location}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Jobs
              </button>

              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Applications for:{" "}
                {jobs.find((j) => j._id === selectedJob)?.title}
              </h2>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No applications for this job.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {applications.map((app) => (
                    <ApplicationCard
                      key={app._id}
                      application={app}
                      actions={renderActions(app)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {activeTab === "shortlisted" && (
        <>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Candidates in Pipeline (Shortlisted / R1 / R2)
          </h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          ) : shortlisted.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No candidates in the pipeline yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {shortlisted.map((app) => (
                <ApplicationCard
                  key={app._id}
                  application={app}
                  actions={renderActions(app)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
