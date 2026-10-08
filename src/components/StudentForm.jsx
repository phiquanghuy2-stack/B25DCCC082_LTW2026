import { useState } from 'react';

const emptyForm = { name: '', score: '', className: '' };

const StudentForm = ({ onAdd }) => {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const { name, score, className } = form;

  const handleChange = (e) => {
    const { name: field, value } = e.target;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || score === '' || !className.trim()) {
      setError('Vui lòng nhập đầy đủ Họ tên, Điểm số và Lớp!');
      return;
    }

    const numericScore = Number(score);
    if (Number.isNaN(numericScore) || numericScore < 0 || numericScore > 10) {
      setError(`Điểm số "${score}" không hợp lệ! Điểm phải nằm trong khoảng 0 - 10.`);
      return;
    }

    onAdd({ name: name.trim(), score: numericScore, class: className.trim() });
    setForm(emptyForm);
    setError('');
  };

  return (
    <form className="student-form" onSubmit={handleSubmit}>
      <h2>Thêm sinh viên mới</h2>
      <div className="form-row">
        <input name="name" placeholder="Họ tên" value={name} onChange={handleChange} />
        <input
          name="score"
          type="number"
          step="0.1"
          placeholder="Điểm số (0 - 10)"
          value={score}
          onChange={handleChange}
        />
        <input name="className" placeholder="Lớp" value={className} onChange={handleChange} />
        <button type="submit">Thêm</button>
      </div>
      {error && <p className="error">⚠️ {error}</p>}
    </form>
  );
};

export default StudentForm;
