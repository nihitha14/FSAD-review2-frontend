import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { studentLogin } = useAuth();
  const initialEmail = useMemo(() => location.state?.email || "", [location.state]);
  const [form, setForm] = useState({ email: initialEmail, password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const successMessage = location.state?.registered
    ? "Signup completed successfully. Please login with your new student account."
    : "";

  const redirectTo = location.state?.from || "/home";

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await studentLogin(form);
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
        <div className="auth-showcase">
          <span className="eyebrow">Student access</span>
          <h1>Login to continue your career journey.</h1>
          <p>
            Save your student profile, get a more guided booking flow, and keep the
            platform focused on student outcomes instead of only admin management.
          </p>

          <div className="auth-demo-card">
            <strong>Demo student account</strong>
            <p>Email: student@careercompass.com</p>
            <p>Password: student123</p>
          </div>
        </div>

        <form className="card auth-card" onSubmit={handleSubmit}>
          <SectionTitle
            eyebrow="Login"
            title="Student login"
            description="Use your registered email and password to continue."
          />

          <div className="auth-form-grid">
            <label className="field-group">
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
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
                placeholder="Enter your password"
                required
              />
            </label>
          </div>

          {successMessage ? <div className="success-box inline">{successMessage}</div> : null}
          {error ? <div className="error-box inline">{error}</div> : null}

          <button type="submit" className="primary-button auth-submit" disabled={submitting}>
            {submitting ? "Logging in..." : "Login as Student"}
          </button>

          <p className="auth-footnote">
            New student?
            {" "}
            <Link to="/signup">Create an account</Link>
          </p>
          <p className="auth-footnote alt">
            Admin user?
            {" "}
            <Link to="/admin/login">Admin login</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default LoginPage;
