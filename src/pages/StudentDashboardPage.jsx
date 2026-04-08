import { Link } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import { useAuth } from "../context/AuthContext";

function StudentDashboardPage() {
  const { student } = useAuth();

  const profileCards = [
    { label: "College", value: student.collegeName },
    { label: "Branch", value: student.branch },
    { label: "Graduation Year", value: student.graduationYear },
    { label: "Career Interest", value: student.careerInterest },
  ];

  return (
    <div className="page-stack container">
      <SectionTitle
        eyebrow="Student dashboard"
        title={`Welcome back, ${student.fullName.split(" ")[0]}`}
        description="This student space makes the platform feel complete by giving learners a dedicated area after login."
      />

      <section className="student-hero card">
        <div>
          <span className="eyebrow">Your profile</span>
          <h2>{student.fullName}</h2>
          <p>
            Signed in as {student.email}. Use this space to move from exploration to
            action with careers, resources, and guided counselling.
          </p>
        </div>

        <div className="student-hero-actions">
          <Link to="/book-session" className="primary-button">
            Book a Session
          </Link>
          <Link to="/careers" className="secondary-button">
            Explore Careers
          </Link>
        </div>
      </section>

      <section className="metric-grid">
        {profileCards.map((item) => (
          <article key={item.label} className="metric-card student">
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <section className="student-dashboard-grid">
        <article className="card student-panel">
          <h3>Suggested next step</h3>
          <p>
            Because your current interest is in {student.careerInterest}, a strong next
            move is to compare role roadmaps and shortlist one counsellor for personalized guidance.
          </p>
          <Link to="/counsellors">Find a counsellor</Link>
        </article>

        <article className="card student-panel">
          <h3>How login improves the flow</h3>
          <p>
            Your basic student details can now be reused during booking so the platform
            behaves more like a real portal and less like a static website.
          </p>
          <Link to="/resources">Browse resources</Link>
        </article>

        <article className="card student-panel">
          <h3>Academic project highlight</h3>
          <p>
            This version now supports student authentication, role-based navigation,
            protected booking, and a separate admin experience for management.
          </p>
          <Link to="/student-dashboard">Stay in student space</Link>
        </article>
      </section>
    </div>
  );
}

export default StudentDashboardPage;
