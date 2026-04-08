import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import { useAuth } from "../context/AuthContext";

function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminLogin } = useAuth();
  const initialEmail = useMemo(() => location.state?.email || "", [location.state]);
  const [form, setForm] = useState({ email: initialEmail, password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const successMessage = location.state?.registered
    ? "Admin account created successfully. Please login to continue."
    : "";

  const redirectTo = location.state?.from || "/admin";

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await adminLogin(form);
      navigate(redirectTo, { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-stack container">
      <section className="auth-layout">
        <div className="auth-showcase admin-showcase">
          <span className="eyebrow">Admin access</span>
          <h1>Open the control room for the platform.</h1>
          <p>
            Admins can manage content, track sessions, and view registered student
            details without exposing the admin dashboard to student users.
          </p>

          <div className="auth-demo-card">
            <strong>Demo admin account</strong>
            <p>Email: admin@careercompass.com</p>
            <p>Password: admin123</p>
          </div>
        </div>

        <form className="card auth-card" onSubmit={handleSubmit}>
          <SectionTitle
            eyebrow="Admin login"
            title="Administrator login"
            description="Use admin credentials to access the management dashboard."
          />

          <div className="auth-form-grid">
            <label className="field-group">
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter admin email"
                required
              />
            </label>

            <label className="field-group">
              <span>Password</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter admin password"
                required
              />
            </label>
          </div>

          {successMessage ? <div className="success-box inline">{successMessage}</div> : null}
          {error ? <div className="error-box inline">{error}</div> : null}

          <button type="submit" className="primary-button auth-submit" disabled={submitting}>
            {submitting ? "Logging in..." : "Login as Admin"}
          </button>

          <p className="auth-footnote">
            Need an admin account?
            {" "}
            <Link to="/admin/signup">Create admin account</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default AdminLoginPage;
