import { START_SCORE, formatScore } from '../data';

const MAX_HEIGHT = 200; // cột cao nhất cao 200px
const LABEL_SPACE = 24; // chỗ cho dòng số điểm phía trên cột

const ScoreChart = ({ rounds }) => {
  const maxScore = Math.max(...rounds.map((r) => r.scoreAfter));
  const toHeight = (value) => (maxScore > 0 ? Math.round((value / maxScore) * MAX_HEIGHT) : 0);

  return (
    <div className="chart">
      <div className="chart-plot" style={{ height: `${MAX_HEIGHT + LABEL_SPACE}px` }}>
        {maxScore >= START_SCORE && (
          <div className="chart-baseline" style={{ bottom: `${toHeight(START_SCORE)}px` }}>
            <span>Vốn {formatScore(START_SCORE)}</span>
          </div>
        )}
        {rounds.map((round) => (
          <div key={round.id} className="chart-col">
            <span className="chart-value">{formatScore(round.scoreAfter)}</span>
            <div
              className="chart-bar"
              style={{
                height: `${toHeight(round.scoreAfter)}px`,
                background: round.correct ? '#2e7d32' : '#c62828',
              }}
            />
          </div>
        ))}
      </div>
      <div className="chart-labels">
        {rounds.map((round, i) => (
          <span key={round.id}>Câu {i + 1}</span>
        ))}
      </div>
    </div>
  );
};

export default ScoreChart;
