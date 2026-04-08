import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  department: "",
  designation: "",
};

function AdminSignupPage() {
  const navigate = useNavigate();
  const { adminSignup } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Password and confirm password should match.");
      return;
    }

    setSubmitting(true);

    try {
      await adminSignup({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        department: form.department,
        designation: form.designation,
      });
      navigate("/admin/login", {
        replace: true,
        state: {
          registered: true,
          email: form.email,
        },
      });
    } catch (signupError) {
      setError(signupError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-stack container">
      <section className="auth-layout">
        <div className="auth-showcase admin-showcase">
          <span className="eyebrow">Admin onboarding</span>
          <h1>Create an admin account for platform management.</h1>
          <p>
            This flow lets you present a proper administrator experience separately from
            student access, which is closer to an original fullstack product.
          </p>
        </div>

        <form className="card auth-card" onSubmit={handleSubmit}>
          <SectionTitle
            eyebrow="Admin signup"
            title="Create admin account"
            description="Register an administrator profile first, then login to continue to the control panel."
          />

          <div className="auth-form-grid two-column">
            <label className="field-group">
              <span>Full name</span>
              <input name="fullName" value={form.fullName} onChange={handleChange} required />
            </label>

            <label className="field-group">
              <span>Email</span>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>

            <label className="field-group">
              <span>Password</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                minLength="6"
                required
              />
            </label>

            <label className="field-group">
              <span>Confirm password</span>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                minLength="6"
                required
              />
            </label>

            <label className="field-group">
              <span>Department</span>
              <input name="department" value={form.department} onChange={handleChange} required />
            </label>

            <label className="field-group">
              <span>Designation</span>
              <input name="designation" value={form.designation} onChange={handleChange} required />
            </label>
          </div>

          {error ? <div className="error-box inline">{error}</div> : null}

          <button type="submit" className="primary-button auth-submit" disabled={submitting}>
            {submitting ? "Creating admin..." : "Create Admin Account"}
          </button>

          <p className="auth-footnote">
            Already an admin?
            {" "}
            <Link to="/admin/login">Login here</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default AdminSignupPage;
