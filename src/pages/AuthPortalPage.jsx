import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AuthPortalPage() {
  const { authReady, isAuthenticated, isAdmin } = useAuth();

  if (!authReady) {
    return (
      <div className="page-stack container">
        <div className="loading-box">Preparing your access portal...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin" : "/home"} replace />;
  }

  return (
    <div className="page-stack auth-portal-shell">
      <section className="container auth-portal">
        <div className="auth-portal-copy">
          <span className="eyebrow">Career guidance platform</span>
          <h1>Choose the right career path with guided access for students and admins.</h1>
          <p>
            CareerCompass is now a gated platform. Students sign up and log in to explore
            careers and resources, while admins log in separately to manage content and
            track student activity.
          </p>

          <div className="auth-portal-points">
            <div className="auth-portal-point">
              <strong>Students</strong>
              <span>Can sign up, log in, view all learning content, and book sessions.</span>
            </div>
            <div className="auth-portal-point">
              <strong>Admins</strong>
              <span>Can log in, manage platform content, and view student details and activity.</span>
            </div>
          </div>
        </div>

        <div className="auth-portal-visual">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
            alt="Students discussing career plans"
            className="auth-portal-image"
          />

          <div className="auth-portal-card-stack">
            <Link to="/login" className="auth-choice auth-choice-student">
              <span className="auth-choice-label">Student Login</span>
              <strong>Existing student</strong>
              <p>Access your dashboard, resources, counsellors, and booking flow.</p>
            </Link>

            <Link to="/signup" className="auth-choice auth-choice-signup">
              <span className="auth-choice-label">Student Signup</span>
              <strong>New student</strong>
              <p>Create an account first, then log in to explore the platform.</p>
            </Link>

            <Link to="/admin/login" className="auth-choice auth-choice-admin">
              <span className="auth-choice-label">Admin Login</span>
              <strong>Platform management</strong>
              <p>Open the admin control room for content, sessions, and student details.</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AuthPortalPage;
