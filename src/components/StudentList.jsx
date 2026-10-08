import StudentItem from './StudentItem';

const StudentList = ({ students, onDelete }) => (
  <table className="student-table">
    <thead>
      <tr>
        <th>STT</th>
        <th>Họ tên</th>
        <th>Lớp</th>
        <th>Điểm</th>
        <th>Xếp loại</th>
        <th>Hành động</th>
      </tr>
    </thead>
    <tbody>
      {students.length === 0 ? (
        <tr>
          <td colSpan="6" className="empty">Không có sinh viên nào.</td>
        </tr>
      ) : (
        students.map((student, index) => (
          <StudentItem key={student.id} index={index} student={student} onDelete={onDelete} />
        ))
      )}
    </tbody>
  </table>
);

export default StudentList;
