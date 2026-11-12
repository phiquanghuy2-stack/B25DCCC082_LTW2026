const DANGER_TIME = 5;

const Timer = ({ timeLeft }) => (
  <p className="timer" style={{ color: timeLeft <= DANGER_TIME ? '#c62828' : 'inherit' }}>
    Còn {Math.max(timeLeft, 0)} giây
  </p>
);

export default Timer;
