import { useDeferredValue, useEffect, useState } from "react";
import CounsellorCard from "../components/CounsellorCard";
import EmptyState from "../components/EmptyState";
import SectionTitle from "../components/SectionTitle";
import { getCounsellors } from "../services/api";

function CounsellorsPage() {
  const [counsellors, setCounsellors] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    let mounted = true;

    async function loadCounsellors() {
      try {
        const data = await getCounsellors();
        if (mounted) {
          setCounsellors(data);
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
  }, []);

  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const filteredCounsellors = counsellors.filter((counsellor) => {
    if (!normalizedQuery) {
      return true;
    }

    return (
      counsellor.fullName.toLowerCase().includes(normalizedQuery) ||
      counsellor.specialization.toLowerCase().includes(normalizedQuery) ||
      counsellor.languages.toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <div className="page-stack container">
      <SectionTitle
        eyebrow="Mentor discovery"
        title="Book a counsellor based on your career interest"
        description="Students can compare counsellor specialization, experience, language comfort, and availability."
      />

      <section className="filter-panel">
        <label className="field-group">
          <span>Search counsellors</span>
          <input
            type="search"
            placeholder="Search by name, language, or specialization"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </section>

      {loading ? <div className="loading-box">Loading counsellors...</div> : null}
      {error ? <div className="error-box">{error}</div> : null}

      {!loading && !error && filteredCounsellors.length ? (
        <div className="counsellor-grid">
          {filteredCounsellors.map((counsellor) => (
            <CounsellorCard key={counsellor.id} counsellor={counsellor} />
          ))}
        </div>
      ) : null}

      {!loading && !error && !filteredCounsellors.length ? (
        <EmptyState
          title="No counsellors matched your search"
          description="Try another keyword or remove the filter to view all available experts."
        />
      ) : null}
    </div>
  );
}

export default CounsellorsPage;
