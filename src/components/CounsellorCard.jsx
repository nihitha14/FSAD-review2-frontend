import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function CounsellorCard({ counsellor }) {
  const { isAdmin } = useAuth();

  return (
    <article className="card counsellor-card">
      <img src={counsellor.imageUrl} alt={counsellor.fullName} className="counsellor-image" />
      <div className="counsellor-content">
        <div className="counsellor-head">
          <div>
            <h3>{counsellor.fullName}</h3>
            <p>{counsellor.specialization}</p>
          </div>
          <span className="rating-pill">{counsellor.rating}/5</span>
        </div>

        <p className="counsellor-summary">{counsellor.profileSummary}</p>

        <div className="counsellor-details">
          <span>{counsellor.experienceYears}+ years experience</span>
          <span>{counsellor.languages}</span>
          <span>{counsellor.availableDays}</span>
        </div>

        <div className="counsellor-footer">
          <strong>INR {counsellor.sessionFee}</strong>
          {isAdmin ? (
            <span className="admin-view-label">Admin view only</span>
          ) : (
            <Link to={`/book-session?counsellor=${counsellor.id}`}>Book Session</Link>
          )}
        </div>
      </div>
    </article>
  );
}

export default CounsellorCard;
