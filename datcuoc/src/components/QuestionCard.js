import AnswerButton from './AnswerButton';
import { LETTERS } from '../data';
import { formatMeta } from '../utils';

const getAnswerState = (i, answer, selected, revealed) => {
  if (!revealed) return '';
  if (i === answer) return 'correct';
  if (i === selected) return 'wrong';
  return '';
};

const QuestionCard = ({ number, total, question, selected, revealed, onSelect, hint }) => (
  <div className="card question-card">
    <p className="meta">{formatMeta(number, total, question)}</p>
    <p className="question-text">{question.question}</p>
    {hint && <p className="hint">Gợi ý: {hint}</p>}
    <div className="answers">
      {question.options.map((option, i) => (
        <AnswerButton
          key={LETTERS[i]}
          letter={LETTERS[i]}
          text={option}
          state={getAnswerState(i, question.answer, selected, revealed)}
          disabled={revealed}
          onClick={() => onSelect(i)}
        />
      ))}
    </div>
  </div>
);

export default QuestionCard;
