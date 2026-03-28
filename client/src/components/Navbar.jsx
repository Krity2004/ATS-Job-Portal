import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import { useState } from "react";

const roleToPath = {
  candidate: "/candidate",
  employer: "/employer",
  coordinator: "/coordinator",
  recruiter: "/recruiter",
};

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => navigate("/login"));
  };

  const dashboardPath = user ? roleToPath[user.role] || "/" : "/";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to={dashboardPath} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ATS</span>
            </div>
            <span className="text-xl font-bold text-gray-900">JobPortal</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link
                  to={dashboardPath}
                  className="text-gray-600 hover:text-indigo-600 font-medium"
                >
                  Dashboard
                </Link>
                <span className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full capitalize">
                  {user.role}
                </span>
                <span className="text-gray-700 font-medium">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-indigo-600 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {user ? (
              <>
                <Link
                  to={dashboardPath}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Dashboard
                </Link>
                <div className="px-3 py-2 text-sm text-gray-500">
                  {user.name} ({user.role})
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
