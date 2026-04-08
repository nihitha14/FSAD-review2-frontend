import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles = [], loginPath = "/login" }) {
  const location = useLocation();
  const { authReady, isAuthenticated, role } = useAuth();

  if (!authReady) {
    return (
      <div className="page-stack container">
        <div className="loading-box">Loading your account...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={loginPath} replace state={{ from: `${location.pathname}${location.search}` }} />;
  }

  if (allowedRoles.length && !allowedRoles.includes(role)) {
    const fallbackPath = role === "admin" ? "/admin" : "/student-dashboard";
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
}

export default ProtectedRoute;
