function SessionTable({ sessions, onStatusChange, pendingId }) {
  if (!sessions.length) {
    return (
      <div className="empty-state compact">
        <h3>No sessions found</h3>
        <p>New bookings from students will appear here.</p>
      </div>
    );
  }

  return (
    <div className="table-shell">
      <table className="session-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Career Interest</th>
            <th>Counsellor</th>
            <th>Date</th>
            <th>Mode</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.id}>
              <td>
                <strong>{session.studentName}</strong>
                <span>{session.studentEmail}</span>
              </td>
              <td>{session.interestArea}</td>
              <td>{session.counsellorName}</td>
              <td>
                <strong>{session.preferredDate}</strong>
                <span>{session.preferredTimeSlot}</span>
              </td>
              <td>{session.mode}</td>
              <td>
                <select
                  className={`status-select status-${session.status.toLowerCase()}`}
                  value={session.status}
                  onChange={(event) => onStatusChange(session.id, event.target.value)}
                  disabled={pendingId === session.id}
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SessionTable;
