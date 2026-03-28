import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CandidateDashboard from "./pages/CandidateDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import JobDetails from "./pages/JobDetails";
import CreateJob from "./pages/CreateJob";

const roleToPath = {
  candidate: "/candidate",
  employer: "/employer",
  coordinator: "/coordinator",
  recruiter: "/recruiter",
};

function RootRedirect() {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={roleToPath[user.role] || "/login"} replace />;
}

function Unauthorized() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
      <p className="text-xl text-gray-700 mb-2">Access Denied</p>
      <p className="text-gray-500">
        You do not have permission to view this page.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            <Route
              path="/candidate"
              element={
                <ProtectedRoute roles={["candidate"]}>
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/employer"
              element={
                <ProtectedRoute roles={["employer"]}>
                  <EmployerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/coordinator"
              element={
                <ProtectedRoute roles={["coordinator"]}>
                  <CoordinatorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/recruiter"
              element={
                <ProtectedRoute roles={["recruiter"]}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/jobs/create"
              element={
                <ProtectedRoute roles={["employer"]}>
                  <CreateJob />
                </ProtectedRoute>
              }
            />

            <Route
              path="/jobs/:id"
              element={
                <ProtectedRoute
                  roles={[
                    "candidate",
                    "employer",
                    "coordinator",
                    "recruiter",
                  ]}
                >
                  <JobDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="*"
              element={
                <div className="min-h-[60vh] flex flex-col items-center justify-center">
                  <h1 className="text-4xl font-bold text-gray-400 mb-4">404</h1>
                  <p className="text-xl text-gray-600">Page not found</p>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
