import { Link } from 'react-router-dom';
import { LEVELS, MULTIPLIERS, formatMultiplier } from '../data';

const LEVEL_IDS = [1, 2, 3];

// Bộ lọc đặt ở App (lifting state up) để khi sang trang chi tiết rồi Quay lại vẫn giữ nguyên
const QuestionBank = ({ questions, bookmarks, toggleBookmark, filters, setFilters }) => {
  const { levels, onlyBookmarked, keyword } = filters;

  const toggleLevel = (level) =>
    setFilters((prev) => ({
      ...prev,
      levels: prev.levels.includes(level) ? prev.levels.filter((l) => l !== level) : [...prev.levels, level],
    }));

  const setOnlyBookmarked = (checked) => setFilters((prev) => ({ ...prev, onlyBookmarked: checked }));

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setFilters((prev) => ({ ...prev, keyword: value }));
  };

  const search = keyword.trim().toLowerCase();
  const filtered = questions
    .filter((q) => levels.includes(q.level))
    .filter((q) => !onlyBookmarked || bookmarks.includes(q.id))
    .filter((q) => q.question.toLowerCase().includes(search));

  return (
    <section>
      <h2>Ngân hàng câu hỏi</h2>

      <div className="card filters">
        <div className="filter-group">
          {LEVEL_IDS.map((level) => (
            <label key={level} className="check">
              <input
                type="checkbox"
                checked={levels.includes(level)}
                onChange={() => toggleLevel(level)}
              />
              {LEVELS[level]}
            </label>
          ))}
        </div>
        <label className="check">
          <input
            type="checkbox"
            checked={onlyBookmarked}
            onChange={(e) => setOnlyBookmarked(e.target.checked)}
          />
          Chỉ hiện câu đã đánh dấu
        </label>
        <input
          type="search"
          className="search"
          placeholder="Tìm kiếm theo nội dung câu hỏi"
          value={keyword}
          onChange={handleSearchChange}
        />
      </div>

      <p className="summary">
        Có {filtered.length} câu hỏi · Đã đánh dấu: {bookmarks.length} câu
      </p>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Chủ đề</th>
              <th>Mức độ</th>
              <th>Hệ số</th>
              <th>Câu hỏi</th>
              <th>Đánh dấu</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((q, i) => {
              const marked = bookmarks.includes(q.id);
              return (
                <tr key={q.id}>
                  <td>{i + 1}</td>
                  <td>{q.topic}</td>
                  <td>{LEVELS[q.level]}</td>
                  <td>{formatMultiplier(MULTIPLIERS[q.level])}</td>
                  <td>
                    <Link to={`/questions/${q.id}`}>{q.question}</Link>
                  </td>
                  <td className="center">
                    <button
                      type="button"
                      className="star"
                      title={marked ? 'Bỏ đánh dấu' : 'Đánh dấu'}
                      onClick={() => toggleBookmark(q.id)}
                    >
                      {marked ? '★' : '☆'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default QuestionBank;
