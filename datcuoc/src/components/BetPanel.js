import { MIN_BET, MAX_BET, BET_STEP, formatScore } from '../data';
import { formatMeta } from '../utils';

const BetPanel = ({ number, total, question, score, bet, error, onBetChange, onPlaceBet, previewText }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!error) onPlaceBet();
  };

  return (
    <form className="card bet-panel" onSubmit={handleSubmit}>
      <p className="meta">{formatMeta(number, total, question)}</p>
      <p>Điểm hiện có: {formatScore(score)}</p>
      {previewText && <p className="preview">Xem trước: {previewText}</p>}
      <label className="field">
        Mức cược
        <input
          type="number"
          min={MIN_BET}
          max={MAX_BET}
          step={BET_STEP}
          value={bet}
          onChange={(e) => onBetChange(e.target.value)}
        />
      </label>
      {error && <p className="error-text">{error}</p>}
      <button type="submit" className="btn-primary" disabled={Boolean(error)}>
        Đặt cược
      </button>
    </form>
  );
};

export default BetPanel;
