import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobById } from "../redux/slices/jobSlice";
import { applyToJob } from "../redux/slices/applicationSlice";
import StatusBadge from "../components/StatusBadge";

export default function JobDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentJob: job, loading } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);
  const { loading: appLoading, error: appError } = useSelector(
    (state) => state.applications
  );

  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState("");
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    dispatch(fetchJobById(id));
  }, [dispatch, id]);

  const handleApply = (e) => {
    e.preventDefault();
    dispatch(
      applyToJob({ jobId: id, data: { coverLetter, resume } })
    ).then((res) => {
      if (!res.error) {
        setApplied(true);
        setShowApplyForm(false);
      }
    });
  };

  if (loading || !job) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {job.title}
            </h1>
            <p className="text-xl text-indigo-600 font-medium">{job.company}</p>
          </div>
          <StatusBadge status={job.status} />
        </div>

        <div className="flex flex-wrap gap-4 mb-6 text-gray-600">
          <span className="flex items-center gap-1.5">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            {job.salary}
          </span>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full capitalize text-sm">
            {job.type}
          </span>
        </div>

        {job.employer && (
          <p className="text-sm text-gray-500 mb-6">
            Posted by: {job.employer.name}
          </p>
        )}

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Description
          </h2>
          <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
        </div>

        {job.requirements && job.requirements.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Requirements
            </h2>
            <ul className="space-y-2">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-6">
          <span>R1 Check: {job.R1Approved ? "Passed" : "Pending"}</span>
          <span>R2 Check: {job.R2Approved ? "Passed" : "Pending"}</span>
        </div>

        {user?.role === "candidate" && job.status === "approved" && (
          <div className="border-t border-gray-100 pt-6">
            {applied ? (
              <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg">
                Application submitted successfully!
              </div>
            ) : !showApplyForm ? (
              <button
                onClick={() => setShowApplyForm(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Apply Now
              </button>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <h3 className="text-lg font-semibold">Apply for this position</h3>
                {appError && (
                  <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {appError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resume URL
                  </label>
                  <input
                    type="text"
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Letter
                  </label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="Tell the employer why you're a great fit..."
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={appLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    {appLoading ? "Submitting..." : "Submit Application"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApplyForm(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
