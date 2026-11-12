const AnswerButton = ({ letter, text, state, disabled, onClick }) => (
  <button type="button" className={`answer-btn ${state}`} disabled={disabled} onClick={onClick}>
    <strong>{`${letter}. `}</strong>
    {text}
  </button>
);

export default AnswerButton;
