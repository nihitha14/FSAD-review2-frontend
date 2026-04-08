import { useDeferredValue, useEffect, useState } from "react";
import CareerCard from "../components/CareerCard";
import EmptyState from "../components/EmptyState";
import SectionTitle from "../components/SectionTitle";
import { getCareerPaths } from "../services/api";

function CareersPage() {
  const [careerPaths, setCareerPaths] = useState([]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    let mounted = true;

    async function loadCareerPaths() {
      try {
        const data = await getCareerPaths();
        if (mounted) {
          setCareerPaths(data);
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

    loadCareerPaths();
    return () => {
      mounted = false;
    };
  }, []);

  const categories = ["All", ...new Set(careerPaths.map((career) => career.category))];
  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const filteredCareerPaths = careerPaths.filter((career) => {
    const matchesCategory = activeCategory === "All" || career.category === activeCategory;
    const matchesQuery =
      !normalizedQuery ||
      career.title.toLowerCase().includes(normalizedQuery) ||
      career.category.toLowerCase().includes(normalizedQuery) ||
      career.description.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="page-stack container">
      <SectionTitle
        eyebrow="Career explorer"
        title="Compare roles based on skills, growth, and roadmap"
        description="Students can use this section to shortlist roles that align with their interests and strengths."
      />

      <section className="filter-panel">
        <label className="field-group">
          <span>Search career paths</span>
          <input
            type="search"
            placeholder="Try software, analytics, design..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <div className="chip-row">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`filter-chip ${activeCategory === category ? "active" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {loading ? <div className="loading-box">Loading career paths...</div> : null}
      {error ? <div className="error-box">{error}</div> : null}

      {!loading && !error && filteredCareerPaths.length ? (
        <div className="card-grid">
          {filteredCareerPaths.map((career) => (
            <CareerCard key={career.id} career={career} />
          ))}
        </div>
      ) : null}

      {!loading && !error && !filteredCareerPaths.length ? (
        <EmptyState
          title="No matching careers found"
          description="Try another keyword or remove the category filter to explore more options."
        />
      ) : null}
    </div>
  );
}

export default CareersPage;
