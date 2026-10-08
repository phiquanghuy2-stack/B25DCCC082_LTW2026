import { useState } from 'react';
import StudentForm from './components/StudentForm';
import FilterBar from './components/FilterBar';
import Statistics from './components/Statistics';
import StudentList from './components/StudentList';

const initialStudents = [
  { id: 1, name: 'Nguyễn Văn An', score: 8.5, class: 'CNTT1' },
  { id: 2, name: 'Trần Thị Bình', score: 4.0, class: 'CNTT2' },
  { id: 3, name: 'Lê Hoàng Cường', score: 6.5, class: 'CNTT1' },
  { id: 4, name: 'Phạm Minh Dung', score: 9.2, class: 'CNTT3' },
];

// Mỗi bộ lọc gồm nhãn hiển thị và hàm điều kiện
const FILTERS = {
  all: { label: 'Tất cả', test: () => true },
  excellent: { label: 'Giỏi (≥ 8)', test: ({ score }) => score >= 8 },
  failed: { label: 'Trượt (< 5)', test: ({ score }) => score < 5 },
};

const App = () => {
  const [students, setStudents] = useState(initialStudents);
  const [filter, setFilter] = useState('all');

  const handleAdd = ({ name, score, class: className }) => {
    const newStudent = { id: Date.now(), name, score, class: className };
    // Dùng spread để giữ nguyên dữ liệu cũ
    setStudents((prev) => [...prev, newStudent]);
  };

  const handleDelete = (id) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
  };

  const filteredStudents = students.filter(FILTERS[filter].test);

  return (
    <div className="container">
      <h1>📚 Quản lý Điểm Sinh viên</h1>

      <StudentForm onAdd={handleAdd} />

      <Statistics students={students} />

      <FilterBar filters={FILTERS} current={filter} onChange={setFilter} />

      <StudentList students={filteredStudents} onDelete={handleDelete} />
    </div>
  );
};

export default App;
