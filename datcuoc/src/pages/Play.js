import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import BetPanel from '../components/BetPanel';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import ScoreInfo from '../components/ScoreInfo';
import { START_SCORE, MIN_BET, TIME_PER_QUESTION } from '../data';
import { validateBet, calcChange, formatChange } from '../utils';

const REVEAL_DELAY = 2000;

const Game = ({ questions, playerName }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(START_SCORE);
  const [bet, setBet] = useState(String(MIN_BET));
  const [status, setStatus] = useState('betting'); // betting → answering → revealed → betting ...
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selected, setSelected] = useState(null);
  const [rounds, setRounds] = useState([]);

  const total = questions.length;
  const number = index + 1;
  const question = questions[index];
  const betValue = Number(bet);
  const betError = validateBet(bet, score);
  const lastRound = rounds[rounds.length - 1];

  const placeBet = () => {
    if (validateBet(bet, score)) return;
    setTimeLeft(TIME_PER_QUESTION);
    setStatus('answering');
  };

  // choice = null nghĩa là hết giờ
  const reveal = (choice) => {
    if (status !== 'answering') return;
    const correct = choice === question.answer;
    const change = calcChange(betValue, question.level, correct);
    const scoreAfter = score + change;
    setSelected(choice);
    setScore(scoreAfter);
    setRounds((prev) => [
      ...prev,
      { id: question.id, bet: betValue, correct, change, scoreAfter, timeout: choice === null },
    ]);
    setStatus('revealed');
  };

  const finish = () => {
    const correctCount = rounds.filter((r) => r.correct).length;
    const reason = score < MIN_BET ? 'broke' : 'completed';
    navigate('/result', {
      replace: true,
      state: { name: playerName, rounds, finalScore: score, correctCount, reason },
    });
  };

  const goNext = () => {
    setIndex((i) => i + 1);
    setBet(String(MIN_BET));
    setSelected(null);
    setTimeLeft(TIME_PER_QUESTION);
    setStatus('betting');
  };

  // Đồng hồ: chỉ chạy khi đang trả lời, cleanup bằng clearInterval
  useEffect(() => {
    if (status !== 'answering') return undefined;
    const intervalId = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(intervalId);
  }, [status, index]);

  // Hết giờ: lộ đáp án đúng và trừ điểm như trả lời sai
  useEffect(() => {
    if (status === 'answering' && timeLeft <= 0) reveal(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, status]);

  // Chờ 2 giây rồi sang câu tiếp theo hoặc kết thúc, cleanup bằng clearTimeout
  useEffect(() => {
    if (status !== 'revealed') return undefined;
    const timeoutId = setTimeout(() => {
      if (score < MIN_BET || index + 1 >= total) finish();
      else goNext();
    }, REVEAL_DELAY);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const renderFeedback = () => {
    if (status !== 'revealed' || !lastRound) return null;
    return (
      <p className={`feedback ${lastRound.change >= 0 ? 'plus' : 'minus'}`}>
        {lastRound.timeout ? 'Hết giờ! ' : ''}
        {formatChange(lastRound.change)}
      </p>
    );
  };

  return (
    <section className="play">
      <p className="player">Người chơi: {playerName}</p>

      {status === 'betting' ? (
        <BetPanel
          number={number}
          total={total}
          question={question}
          score={score}
          bet={bet}
          error={betError}
          onBetChange={setBet}
          onPlaceBet={placeBet}
        />
      ) : (
        <>
          <div className="card status-bar">
            <Timer timeLeft={timeLeft} />
            <ScoreInfo score={score} bet={betValue} />
          </div>
          <QuestionCard
            number={number}
            total={total}
            question={question}
            selected={selected}
            revealed={status === 'revealed'}
            onSelect={reveal}
          />
          {renderFeedback()}
        </>
      )}
    </section>
  );
};

// Chưa có tên người chơi thì không cho vào màn hình chơi
const Play = ({ questions, playerName }) =>
  playerName.trim() ? (
    <Game questions={questions} playerName={playerName.trim()} />
  ) : (
    <Navigate to="/" replace />
  );

export default Play;
