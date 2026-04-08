import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import ResourceCard from "../components/ResourceCard";
import SectionTitle from "../components/SectionTitle";
import { getCareerPaths, getResources } from "../services/api";

function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [careerPaths, setCareerPaths] = useState([]);
  const [selectedCareerPath, setSelectedCareerPath] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadResources() {
      try {
        const [resourceData, careerData] = await Promise.all([getResources(), getCareerPaths()]);

        if (!mounted) {
          return;
        }

        setResources(resourceData);
        setCareerPaths(careerData);
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

    loadResources();
    return () => {
      mounted = false;
    };
  }, []);

  const resourceTypes = ["all", ...new Set(resources.map((resource) => resource.type))];
  const filteredResources = resources.filter((resource) => {
    const matchesCareerPath =
      selectedCareerPath === "all" || String(resource.careerPathId) === selectedCareerPath;
    const matchesType = selectedType === "all" || resource.type === selectedType;
    return matchesCareerPath && matchesType;
  });

  return (
    <div className="page-stack container">
      <SectionTitle
        eyebrow="Learning hub"
        title="Resources students can use after getting guidance"
        description="The platform groups practical materials by career path so students know what to learn next."
      />

      <section className="filter-grid">
        <label className="field-group">
          <span>Filter by career path</span>
          <select
            value={selectedCareerPath}
            onChange={(event) => setSelectedCareerPath(event.target.value)}
          >
            <option value="all">All career paths</option>
            {careerPaths.map((careerPath) => (
              <option key={careerPath.id} value={careerPath.id}>
                {careerPath.title}
              </option>
            ))}
          </select>
        </label>

        <label className="field-group">
          <span>Filter by resource type</span>
          <select value={selectedType} onChange={(event) => setSelectedType(event.target.value)}>
            {resourceTypes.map((type) => (
              <option key={type} value={type}>
                {type === "all" ? "All resource types" : type}
              </option>
            ))}
          </select>
        </label>
      </section>

      {loading ? <div className="loading-box">Loading resources...</div> : null}
      {error ? <div className="error-box">{error}</div> : null}

      {!loading && !error && filteredResources.length ? (
        <div className="resource-grid">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : null}

      {!loading && !error && !filteredResources.length ? (
        <EmptyState
          title="No resources available for this filter"
          description="Try another combination to browse more courses, practice sets, and references."
        />
      ) : null}
    </div>
  );
}

export default ResourcesPage;
