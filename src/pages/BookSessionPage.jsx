import { startTransition, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import { useAuth } from "../context/AuthContext";
import { bookSession, getCounsellors } from "../services/api";

const initialFormState = {
  studentName: "",
  studentEmail: "",
  collegeName: "",
  branch: "",
  interestArea: "",
  preferredDate: "",
  preferredTimeSlot: "",
  mode: "Online",
  message: "",
  counsellorId: "",
};

function BookSessionPage() {
  const [searchParams] = useSearchParams();
  const { student } = useAuth();
  const [counsellors, setCounsellors] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadCounsellors() {
      try {
        const data = await getCounsellors();
        if (!mounted) {
          return;
        }

        setCounsellors(data);

        const selectedCounsellor = searchParams.get("counsellor");
        if (selectedCounsellor && data.some((item) => String(item.id) === selectedCounsellor)) {
          setForm((current) => ({ ...current, counsellorId: selectedCounsellor }));
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadCounsellors();
    return () => {
      mounted = false;
    };
  }, [searchParams]);

  useEffect(() => {
    if (!student) {
      return;
    }

    setForm((current) => ({
      ...current,
      studentName: student.fullName || current.studentName,
      studentEmail: student.email || current.studentEmail,
      collegeName: student.collegeName || current.collegeName,
      branch: student.branch || current.branch,
      interestArea: current.interestArea || student.careerInterest || "",
    }));
  }, [student]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    const selectedCounsellorId = form.counsellorId;

    try {
      await bookSession({
        ...form,
        counsellorId: Number(form.counsellorId),
      });

      startTransition(() => {
        setForm({
          ...initialFormState,
          studentName: student.fullName,
          studentEmail: student.email,
          collegeName: student.collegeName,
          branch: student.branch,
          interestArea: student.careerInterest || "",
          counsellorId: selectedCounsellorId,
        });
        setSuccessMessage("Session request submitted successfully. The counsellor will review it soon.");
      });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-stack container">
      <SectionTitle
        eyebrow="Session booking"
        title="Schedule a counselling session in a few minutes"
        description="Students can share their branch, interests, and doubts so the counsellor has proper context before the meeting."
      />

      <section className="booking-layout">
        <div className="booking-panel">
          <h3>Why students use this section</h3>
          <ul className="benefit-list">
            <li>Get clarity between multiple career options.</li>
            <li>Ask for a roadmap based on your branch and skill level.</li>
            <li>Discuss internships, portfolio projects, and placements.</li>
            <li>Choose online or offline sessions based on convenience.</li>
          </ul>
        </div>

        <form className="card form-card" onSubmit={handleSubmit}>
          <div className="account-banner">
            Booking as {student.fullName} from {student.collegeName}
          </div>

          <div className="form-grid">
            <label className="field-group">
              <span>Student name</span>
              <input
                name="studentName"
                value={form.studentName}
                onChange={handleChange}
                placeholder="Enter your full name"
                readOnly
                required
              />
            </label>

            <label className="field-group">
              <span>Email</span>
              <input
                type="email"
                name="studentEmail"
                value={form.studentEmail}
                onChange={handleChange}
                placeholder="Enter your email"
                readOnly
                required
              />
            </label>

            <label className="field-group">
              <span>College name</span>
              <input
                name="collegeName"
                value={form.collegeName}
                onChange={handleChange}
                placeholder="Enter your college"
                readOnly
                required
              />
            </label>

            <label className="field-group">
              <span>Branch</span>
              <input
                name="branch"
                value={form.branch}
                onChange={handleChange}
                placeholder="Example: CSE"
                readOnly
                required
              />
            </label>

            <label className="field-group">
              <span>Career interest</span>
              <input
                name="interestArea"
                value={form.interestArea}
                onChange={handleChange}
                placeholder="Example: Data Analytics"
                required
              />
            </label>

            <label className="field-group">
              <span>Select counsellor</span>
              <select
                name="counsellorId"
                value={form.counsellorId}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Choose a counsellor</option>
                {counsellors.map((counsellor) => (
                  <option key={counsellor.id} value={counsellor.id}>
                    {counsellor.fullName} - {counsellor.specialization}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-group">
              <span>Preferred date</span>
              <input
                type="date"
                name="preferredDate"
                value={form.preferredDate}
                onChange={handleChange}
                required
              />
            </label>

            <label className="field-group">
              <span>Preferred time slot</span>
              <select
                name="preferredTimeSlot"
                value={form.preferredTimeSlot}
                onChange={handleChange}
                required
              >
                <option value="">Choose a time slot</option>
                <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                <option value="11:00 AM - 11:30 AM">11:00 AM - 11:30 AM</option>
                <option value="4:00 PM - 4:30 PM">4:00 PM - 4:30 PM</option>
                <option value="6:00 PM - 6:30 PM">6:00 PM - 6:30 PM</option>
              </select>
            </label>

            <label className="field-group">
              <span>Session mode</span>
              <select name="mode" value={form.mode} onChange={handleChange} required>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </label>

            <label className="field-group full-width">
              <span>Your message</span>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Mention your confusion, goals, or skills you want guidance on."
                rows="5"
                required
              />
            </label>
          </div>

          {error ? <div className="error-box inline">{error}</div> : null}
          {successMessage ? <div className="success-box">{successMessage}</div> : null}

          <button type="submit" className="primary-button form-submit" disabled={submitting || loading}>
            {submitting ? "Submitting..." : "Confirm Session Request"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default BookSessionPage;
