import { useNavigate, useParams } from 'react-router-dom';
import { LEVELS, LETTERS, MULTIPLIERS, formatMultiplier } from '../data';

const QuestionDetail = ({ questions, bookmarks, toggleBookmark }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const question = questions.find((q) => q.id === Number(id));

  if (!question) {
    return (
      <section className="card">
        <h2>Không tìm thấy câu hỏi</h2>
        <button type="button" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </section>
    );
  }

  const marked = bookmarks.includes(question.id);

  return (
    <section className="card">
      <h2>
        {`Câu hỏi số ${question.id} – ${question.topic} · ${LEVELS[question.level]} (${formatMultiplier(
          MULTIPLIERS[question.level]
        )})`}
      </h2>
      <p className="question-text">{question.question}</p>

      <ul className="options">
        {question.options.map((option, i) => {
          const isCorrect = i === question.answer;
          return (
            <li key={LETTERS[i]} className={isCorrect ? 'option correct' : 'option'}>
              {`${LETTERS[i]}. `}
              {option}
              {isCorrect && <strong> (Đáp án đúng)</strong>}
            </li>
          );
        })}
      </ul>

      <p className="hint">Gợi ý: {question.hint}</p>

      <div className="actions">
        <button type="button" className="btn-primary" onClick={() => toggleBookmark(question.id)}>
          {marked ? 'Bỏ đánh dấu' : 'Đánh dấu'}
        </button>
        <button type="button" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </div>
    </section>
  );
};

export default QuestionDetail;
