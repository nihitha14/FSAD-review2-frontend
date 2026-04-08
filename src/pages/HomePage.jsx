import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CareerCard from "../components/CareerCard";
import EmptyState from "../components/EmptyState";
import SectionTitle from "../components/SectionTitle";
import { useAuth } from "../context/AuthContext";
import { getCareerPaths, getDashboardStats } from "../services/api";

const highlights = [
  {
    title: "Explore the right path",
    description:
      "Students can compare trending careers based on skills, growth, opportunities, and roadmaps.",
  },
  {
    title: "Connect with experts",
    description:
      "One-on-one sessions with career counsellors help students convert confusion into clear action.",
  },
  {
    title: "Track student engagement",
    description:
      "Admins can manage content, monitor bookings, and keep the platform active with fresh resources.",
  },
];

function HomePage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [featuredCareers, setFeaturedCareers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadHomeData() {
      try {
        const [featuredData, statsData] = await Promise.all([
          getCareerPaths({ featured: true }),
          getDashboardStats(),
        ]);

        if (!mounted) {
          return;
        }

        setFeaturedCareers(featuredData);
        setStats(statsData);
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

    loadHomeData();
    return () => {
      mounted = false;
    };
  }, []);

  const metricCards = stats
    ? [
        { value: stats.totalCareerPaths, label: "Career paths" },
        { value: stats.totalResources, label: "Learning resources" },
        { value: stats.totalCounsellors, label: "Expert counsellors" },
        { value: stats.totalSessions, label: "Sessions tracked" },
      ]
    : [];

  return (
    <div className="page-stack">
      <section className="hero-section container">
        <div className="hero-copy">
          <span className="eyebrow">Career guidance platform</span>
          <h1>Help students discover careers they can actually grow into.</h1>
          <p>
            CareerCompass brings career exploration, mentorship, skill roadmaps, and
            counselling into one original fullstack platform built for modern students.
          </p>
          <div className="hero-actions">
            <Link to="/careers" className="primary-button">
              Explore Careers
            </Link>
            <Link
              to={isAuthenticated ? (isAdmin ? "/admin" : "/student-dashboard") : "/signup"}
              className="secondary-button"
            >
              {isAuthenticated ? (isAdmin ? "Open Admin Dashboard" : "Open Student Dashboard") : "Student Sign Up"}
            </Link>
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-panel-card">
            <span className="mini-label">Weekly student pulse</span>
            <strong>Focused guidance for better decisions</strong>
            <p>
              From skill discovery to mentor booking, the platform guides students through
              each stage of career planning.
            </p>
          </div>

          <div className="hero-grid">
            {metricCards.map((metric) => (
              <div key={metric.label} className="metric-card">
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container">
        <SectionTitle
          eyebrow="Platform strengths"
          title="Designed for both students and admins"
          description="The experience is split into clear student-facing journeys and a practical admin dashboard."
        />
        <div className="feature-grid">
          {highlights.map((item) => (
            <article key={item.title} className="card feature-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container">
        <SectionTitle
          eyebrow="Featured paths"
          title="Popular careers students are exploring"
          description="These career tracks are seeded from the backend and can be managed by the admin panel."
        />

        {loading ? (
          <div className="loading-box">Loading featured careers...</div>
        ) : error ? (
          <div className="error-box">{error}</div>
        ) : featuredCareers.length ? (
          <div className="card-grid">
            {featuredCareers.map((career) => (
              <CareerCard key={career.id} career={career} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No featured careers yet"
            description="Add a featured career path from the admin dashboard to display it here."
          />
        )}
      </section>
    </div>
  );
}

export default HomePage;
