const Statistics = ({ students }) => {
  const total = students.length;
  const sum = students.reduce((acc, { score }) => acc + score, 0);
  const average = total > 0 ? (sum / total).toFixed(2) : '0.00';

  return (
    <div className="statistics">
      <div className="stat">
        <span className="stat-label">Tổng số sinh viên</span>
        <span className="stat-value">{total}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Điểm trung bình cả lớp</span>
        <span className="stat-value">{average}</span>
      </div>
    </div>
  );
};

export default Statistics;
