const getRank = (score) => {
  if (score >= 8) return { label: 'Giỏi', type: 'excellent' };
  if (score >= 6.5) return { label: 'Khá', type: 'good' };
  if (score >= 5) return { label: 'Trung bình', type: 'average' };
  return { label: 'Trượt', type: 'failed' };
};

const StudentItem = ({ student, index, onDelete }) => {
  const { id, name, score, class: className } = student;
  const { label, type } = getRank(score);

  const handleDelete = () => {
    if (window.confirm(`Bạn có chắc muốn xóa sinh viên "${name}"?`)) {
      onDelete(id);
    }
  };

  return (
    <tr>
      <td>{index + 1}</td>
      <td>{name}</td>
      <td>{className}</td>
      <td>{score}</td>
      <td>
        <span className={`badge badge-${type}`}>{label}</span>
      </td>
      <td>
        <button className="delete-btn" onClick={handleDelete}>Xóa</button>
      </td>
    </tr>
  );
};

export default StudentItem;
