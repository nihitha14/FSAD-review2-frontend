function ResourceCard({ resource }) {
  return (
    <article className="card resource-card">
      <div className="resource-meta">
        <span className="card-chip">{resource.type}</span>
        <span className="resource-level">{resource.level}</span>
      </div>
      <h3>{resource.title}</h3>
      <p>{resource.description}</p>
      <div className="resource-footer">
        <div>
          <strong>{resource.careerPathTitle}</strong>
          <span>{resource.duration}</span>
        </div>
        <a href={resource.url} target="_blank" rel="noreferrer">
          Open Resource
        </a>
      </div>
    </article>
  );
}

export default ResourceCard;
