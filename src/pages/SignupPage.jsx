import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  collegeName: "",
  branch: "",
  graduationYear: "2027",
  careerInterest: "",
};

function SignupPage() {
  const navigate = useNavigate();
  const { studentSignup } = useAuth();
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
      await studentSignup({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        collegeName: form.collegeName,
        branch: form.branch,
        graduationYear: Number(form.graduationYear),
        careerInterest: form.careerInterest,
      });
      navigate("/login", {
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
      <section className="auth-layout signup-layout">
        <div className="auth-showcase">
          <span className="eyebrow">Create account</span>
          <h1>Build a student profile before booking sessions.</h1>
          <p>
            Signup makes the platform feel like a proper student portal by keeping
            account details, interests, and student identity in one place.
          </p>

          <div className="auth-benefits">
            <div className="auth-benefit">
              <strong>Faster session booking</strong>
              <span>Name, email, college, and branch can be pre-filled.</span>
            </div>
            <div className="auth-benefit">
              <strong>Personal student space</strong>
              <span>Students see a dashboard tailored to their profile and goals.</span>
            </div>
            <div className="auth-benefit">
              <strong>Original project feel</strong>
              <span>The app now supports both student access and admin management.</span>
            </div>
          </div>
        </div>

        <form className="card auth-card" onSubmit={handleSubmit}>
          <SectionTitle
            eyebrow="Signup"
            title="Student signup"
            description="Create your student account first, then login to unlock guided booking and the student portal."
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
              <span>College name</span>
              <input name="collegeName" value={form.collegeName} onChange={handleChange} required />
            </label>

            <label className="field-group">
              <span>Branch</span>
              <input name="branch" value={form.branch} onChange={handleChange} required />
            </label>

            <label className="field-group">
              <span>Graduation year</span>
              <input
                type="number"
                name="graduationYear"
                value={form.graduationYear}
                onChange={handleChange}
                min="2024"
                max="2035"
                required
              />
            </label>

            <label className="field-group">
              <span>Career interest</span>
              <input
                name="careerInterest"
                value={form.careerInterest}
                onChange={handleChange}
                placeholder="Example: Data Analytics"
                required
              />
            </label>
          </div>

          {error ? <div className="error-box inline">{error}</div> : null}

          <button type="submit" className="primary-button auth-submit" disabled={submitting}>
            {submitting ? "Creating account..." : "Create Student Account"}
          </button>

          <p className="auth-footnote">
            Already have an account?
            {" "}
            <Link to="/login">Login here</Link>
          </p>
          <p className="auth-footnote alt">
            Admin registration?
            {" "}
            <Link to="/admin/signup">Create admin account</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default SignupPage;
