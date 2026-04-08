import { useEffect, useState } from "react";
import SectionTitle from "../components/SectionTitle";
import SessionTable from "../components/SessionTable";
import StudentTable from "../components/StudentTable";
import { useAuth } from "../context/AuthContext";
import {
  createCareerPath,
  createCounsellor,
  createResource,
  getCareerPaths,
  getCounsellors,
  getDashboardStats,
  getSessions,
  getStudents,
  updateSessionStatus,
} from "../services/api";

const initialCareerForm = {
  title: "",
  category: "",
  description: "",
  requiredSkills: "",
  roadmap: "",
  averagePackage: "",
  growthOutlook: "",
  demandLevel: "",
  featured: false,
  studentsExplored: 0,
};

const initialResourceForm = {
  title: "",
  type: "Course",
  description: "",
  url: "",
  duration: "",
  level: "Beginner",
  careerPathId: "",
};

const initialCounsellorForm = {
  fullName: "",
  specialization: "",
  experienceYears: 0,
  profileSummary: "",
  languages: "",
  email: "",
  availableDays: "",
  sessionFee: 0,
  imageUrl: "",
  rating: 4.5,
};

function AdminDashboardPage() {
  const { admin } = useAuth();
  const [stats, setStats] = useState(null);
  const [careerPaths, setCareerPaths] = useState([]);
  const [counsellors, setCounsellors] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [careerForm, setCareerForm] = useState(initialCareerForm);
  const [resourceForm, setResourceForm] = useState(initialResourceForm);
  const [counsellorForm, setCounsellorForm] = useState(initialCounsellorForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [pendingSessionId, setPendingSessionId] = useState(null);

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const [statsData, careerPathData, counsellorData, sessionData, studentData] = await Promise.all([
        getDashboardStats(),
        getCareerPaths(),
        getCounsellors(),
        getSessions(),
        getStudents(),
      ]);

      setStats(statsData);
      setCareerPaths(careerPathData);
      setCounsellors(counsellorData);
      setSessions(sessionData);
      setStudents(studentData);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  function handleCareerFormChange(event) {
    const { name, value, type, checked } = event.target;
    setCareerForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleResourceFormChange(event) {
    const { name, value } = event.target;
    setResourceForm((current) => ({ ...current, [name]: value }));
  }

  function handleCounsellorFormChange(event) {
    const { name, value } = event.target;
    setCounsellorForm((current) => ({ ...current, [name]: value }));
  }

  async function handleCareerSubmit(event) {
    event.preventDefault();
    setActionError("");
    setActionMessage("");

    try {
      await createCareerPath({
        ...careerForm,
        studentsExplored: Number(careerForm.studentsExplored),
      });
      setCareerForm(initialCareerForm);
      await loadDashboard();
      setActionMessage("Career path added successfully.");
    } catch (submitError) {
      setActionError(submitError.message);
    }
  }

  async function handleResourceSubmit(event) {
    event.preventDefault();
    setActionError("");
    setActionMessage("");

    try {
      await createResource({
        ...resourceForm,
        careerPathId: Number(resourceForm.careerPathId),
      });
      setResourceForm(initialResourceForm);
      await loadDashboard();
      setActionMessage("Resource added successfully.");
    } catch (submitError) {
      setActionError(submitError.message);
    }
  }

  async function handleCounsellorSubmit(event) {
    event.preventDefault();
    setActionError("");
    setActionMessage("");

    try {
      await createCounsellor({
        ...counsellorForm,
        experienceYears: Number(counsellorForm.experienceYears),
        sessionFee: Number(counsellorForm.sessionFee),
        rating: Number(counsellorForm.rating),
      });
      setCounsellorForm(initialCounsellorForm);
      await loadDashboard();
      setActionMessage("Counsellor added successfully.");
    } catch (submitError) {
      setActionError(submitError.message);
    }
  }

  async function handleStatusChange(sessionId, status) {
    setPendingSessionId(sessionId);
    setActionError("");
    setActionMessage("");

    try {
      await updateSessionStatus(sessionId, status);
      await loadDashboard();
      setActionMessage("Session status updated.");
    } catch (updateError) {
      setActionError(updateError.message);
    } finally {
      setPendingSessionId(null);
    }
  }

  const metricCards = stats
      ? [
        { label: "Students", value: stats.totalStudents },
        { label: "Career Paths", value: stats.totalCareerPaths },
        { label: "Resources", value: stats.totalResources },
        { label: "Counsellors", value: stats.totalCounsellors },
        { label: "Pending Sessions", value: stats.pendingSessions },
        { label: "Completed Sessions", value: stats.completedSessions },
        { label: "Total Sessions", value: stats.totalSessions },
      ]
    : [];

  return (
    <div className="page-stack container">
      <SectionTitle
        eyebrow="Admin dashboard"
        title="Manage platform content and track student engagement"
        description="This page acts as a project-ready control room for adding content and monitoring counselling requests."
      />

      <section className="admin-profile-banner card">
        <div>
          <span className="eyebrow">Logged in admin</span>
          <h3>{admin.fullName}</h3>
          <p>
            {admin.designation} in {admin.department}. This account can manage platform
            content and view registered student details.
          </p>
        </div>
      </section>

      {error ? <div className="error-box">{error}</div> : null}
      {actionError ? <div className="error-box inline">{actionError}</div> : null}
      {actionMessage ? <div className="success-box">{actionMessage}</div> : null}

      <section className="metric-grid">
        {metricCards.map((metric) => (
          <article key={metric.label} className="metric-card admin">
            <strong>{loading ? "..." : metric.value}</strong>
            <span>{metric.label}</span>
          </article>
        ))}
      </section>

      <section className="admin-grid">
        <form className="card form-card" onSubmit={handleCareerSubmit}>
          <h3>Add Career Path</h3>
          <div className="form-grid compact-grid">
            <label className="field-group">
              <span>Title</span>
              <input name="title" value={careerForm.title} onChange={handleCareerFormChange} required />
            </label>
            <label className="field-group">
              <span>Category</span>
              <input name="category" value={careerForm.category} onChange={handleCareerFormChange} required />
            </label>
            <label className="field-group">
              <span>Average package</span>
              <input
                name="averagePackage"
                value={careerForm.averagePackage}
                onChange={handleCareerFormChange}
                required
              />
            </label>
            <label className="field-group">
              <span>Demand level</span>
              <input
                name="demandLevel"
                value={careerForm.demandLevel}
                onChange={handleCareerFormChange}
                required
              />
            </label>
            <label className="field-group full-width">
              <span>Description</span>
              <textarea
                name="description"
                value={careerForm.description}
                onChange={handleCareerFormChange}
                rows="3"
                required
              />
            </label>
            <label className="field-group full-width">
              <span>Required skills</span>
              <input
                name="requiredSkills"
                value={careerForm.requiredSkills}
                onChange={handleCareerFormChange}
                placeholder="Comma separated skills"
                required
              />
            </label>
            <label className="field-group full-width">
              <span>Roadmap</span>
              <textarea
                name="roadmap"
                value={careerForm.roadmap}
                onChange={handleCareerFormChange}
                rows="3"
                required
              />
            </label>
            <label className="field-group">
              <span>Growth outlook</span>
              <input
                name="growthOutlook"
                value={careerForm.growthOutlook}
                onChange={handleCareerFormChange}
                required
              />
            </label>
            <label className="field-group">
              <span>Students explored</span>
              <input
                type="number"
                name="studentsExplored"
                value={careerForm.studentsExplored}
                onChange={handleCareerFormChange}
                min="0"
                required
              />
            </label>
            <label className="checkbox-row full-width">
              <input
                type="checkbox"
                name="featured"
                checked={careerForm.featured}
                onChange={handleCareerFormChange}
              />
              <span>Mark as featured on the home page</span>
            </label>
          </div>
          <button type="submit" className="primary-button form-submit">
            Save Career Path
          </button>
        </form>

        <form className="card form-card" onSubmit={handleResourceSubmit}>
          <h3>Add Resource</h3>
          <div className="form-grid compact-grid">
            <label className="field-group">
              <span>Title</span>
              <input name="title" value={resourceForm.title} onChange={handleResourceFormChange} required />
            </label>
            <label className="field-group">
              <span>Type</span>
              <select name="type" value={resourceForm.type} onChange={handleResourceFormChange}>
                <option value="Course">Course</option>
                <option value="Practice">Practice</option>
                <option value="Project">Project</option>
                <option value="Reference">Reference</option>
                <option value="Portfolio">Portfolio</option>
              </select>
            </label>
            <label className="field-group full-width">
              <span>Description</span>
              <textarea
                name="description"
                value={resourceForm.description}
                onChange={handleResourceFormChange}
                rows="3"
                required
              />
            </label>
            <label className="field-group full-width">
              <span>Resource URL</span>
              <input name="url" value={resourceForm.url} onChange={handleResourceFormChange} required />
            </label>
            <label className="field-group">
              <span>Duration</span>
              <input name="duration" value={resourceForm.duration} onChange={handleResourceFormChange} required />
            </label>
            <label className="field-group">
              <span>Level</span>
              <select name="level" value={resourceForm.level} onChange={handleResourceFormChange}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </label>
            <label className="field-group full-width">
              <span>Career path</span>
              <select
                name="careerPathId"
                value={resourceForm.careerPathId}
                onChange={handleResourceFormChange}
                required
              >
                <option value="">Select a career path</option>
                {careerPaths.map((careerPath) => (
                  <option key={careerPath.id} value={careerPath.id}>
                    {careerPath.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button type="submit" className="primary-button form-submit">
            Save Resource
          </button>
        </form>

        <form className="card form-card" onSubmit={handleCounsellorSubmit}>
          <h3>Add Counsellor</h3>
          <div className="form-grid compact-grid">
            <label className="field-group">
              <span>Name</span>
              <input
                name="fullName"
                value={counsellorForm.fullName}
                onChange={handleCounsellorFormChange}
                required
              />
            </label>
            <label className="field-group">
              <span>Specialization</span>
              <input
                name="specialization"
                value={counsellorForm.specialization}
                onChange={handleCounsellorFormChange}
                required
              />
            </label>
            <label className="field-group">
              <span>Experience years</span>
              <input
                type="number"
                name="experienceYears"
                value={counsellorForm.experienceYears}
                onChange={handleCounsellorFormChange}
                min="0"
                required
              />
            </label>
            <label className="field-group">
              <span>Session fee</span>
              <input
                type="number"
                step="0.01"
                name="sessionFee"
                value={counsellorForm.sessionFee}
                onChange={handleCounsellorFormChange}
                required
              />
            </label>
            <label className="field-group full-width">
              <span>Profile summary</span>
              <textarea
                name="profileSummary"
                value={counsellorForm.profileSummary}
                onChange={handleCounsellorFormChange}
                rows="3"
                required
              />
            </label>
            <label className="field-group">
              <span>Languages</span>
              <input
                name="languages"
                value={counsellorForm.languages}
                onChange={handleCounsellorFormChange}
                required
              />
            </label>
            <label className="field-group">
              <span>Availability</span>
              <input
                name="availableDays"
                value={counsellorForm.availableDays}
                onChange={handleCounsellorFormChange}
                required
              />
            </label>
            <label className="field-group">
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={counsellorForm.email}
                onChange={handleCounsellorFormChange}
                required
              />
            </label>
            <label className="field-group">
              <span>Rating</span>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                name="rating"
                value={counsellorForm.rating}
                onChange={handleCounsellorFormChange}
                required
              />
            </label>
            <label className="field-group full-width">
              <span>Image URL</span>
              <input
                name="imageUrl"
                value={counsellorForm.imageUrl}
                onChange={handleCounsellorFormChange}
                required
              />
            </label>
          </div>
          <button type="submit" className="primary-button form-submit">
            Save Counsellor
          </button>
        </form>
      </section>

      <section className="card admin-session-panel">
        <div className="panel-header">
          <div>
            <h3>Session Management</h3>
            <p>Track recent student bookings and update their counselling status.</p>
          </div>
        </div>
        <SessionTable sessions={sessions} onStatusChange={handleStatusChange} pendingId={pendingSessionId} />
      </section>

      <section className="card admin-session-panel">
        <div className="panel-header">
          <div>
            <h3>Registered Students</h3>
            <p>Admins can review student account details, branch, graduation year, and interests.</p>
          </div>
        </div>
        <StudentTable students={students} />
      </section>

      {stats?.recentSessions?.length ? (
        <section className="recent-session-grid">
          {stats.recentSessions.map((session) => (
            <article key={session.id} className="card recent-session-card">
              <span className={`status-badge ${session.status.toLowerCase()}`}>{session.status}</span>
              <h3>{session.studentName}</h3>
              <p>{session.interestArea}</p>
              <div className="recent-session-meta">
                <span>{session.counsellorName}</span>
                <span>{session.preferredDate}</span>
              </div>
            </article>
          ))}
        </section>
      ) : null}
    </div>
  );
}

export default AdminDashboardPage;
