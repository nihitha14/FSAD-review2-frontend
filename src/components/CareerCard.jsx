function CareerCard({ career }) {
  const skills = career.requiredSkills.split(",").map((skill) => skill.trim());

  return (
    <article className="card career-card">
      <div className="card-chip">{career.category}</div>
      <div className="career-card-top">
        <div>
          <h3>{career.title}</h3>
          <p>{career.description}</p>
        </div>
        <span className="career-demand">{career.demandLevel}</span>
      </div>

      <div className="career-stats">
        <div>
          <strong>{career.averagePackage}</strong>
          <span>Average package</span>
        </div>
        <div>
          <strong>{career.studentsExplored}+</strong>
          <span>Students explored</span>
        </div>
      </div>

      <div className="tag-list">
        {skills.map((skill) => (
          <span key={skill} className="tag">
            {skill}
          </span>
        ))}
      </div>

      <div className="roadmap-box">
        <h4>Roadmap</h4>
        <p>{career.roadmap}</p>
      </div>
    </article>
  );
}

export default CareerCard;
