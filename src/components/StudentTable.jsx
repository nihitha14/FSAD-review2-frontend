function StudentTable({ students }) {
  if (!students.length) {
    return (
      <div className="empty-state compact">
        <h3>No student accounts found</h3>
        <p>Newly registered students will appear here for admin review.</p>
      </div>
    );
  }

  return (
    <div className="table-shell">
      <table className="session-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>College</th>
            <th>Branch</th>
            <th>Graduation</th>
            <th>Career Interest</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>
                <strong>{student.fullName}</strong>
                <span>{student.email}</span>
              </td>
              <td>{student.collegeName}</td>
              <td>{student.branch}</td>
              <td>{student.graduationYear}</td>
              <td>{student.careerInterest}</td>
              <td>{new Date(student.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentTable;
