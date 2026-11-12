import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import BetPanel from '../components/BetPanel';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import ScoreInfo from '../components/ScoreInfo';
import Supports from '../components/Supports';
import { START_SCORE, MIN_BET, BET_STEP, TIME_PER_QUESTION } from '../data';
import { validateBet, calcChange, getResult, getMaxBet, formatChange } from '../utils';

const DEFAULT_TITLE = 'Đặt cược kiến thức';
const REVEAL_DELAY = 2000;
const NO_SUPPORTS_USED = { preview: false, insurance: false, hint: false };

const Game = ({ questions, playerName, onFinish }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(START_SCORE);
  const [bet, setBet] = useState(String(MIN_BET));
  const [status, setStatus] = useState('betting'); // betting → answering → revealed → betting ...
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selected, setSelected] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [used, setUsed] = useState(NO_SUPPORTS_USED);
  const [showPreview, setShowPreview] = useState(false);
  const [insured, setInsured] = useState(false);
  const [showHint, setShowHint] = useState(false);

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
    const change = !correct && insured ? 0 : calcChange(betValue, question.level, correct);
    const scoreAfter = score + change;
    setSelected(choice);
    setScore(scoreAfter);
    setRounds((prev) => [
      ...prev,
      { id: question.id, bet: betValue, correct, change, scoreAfter, insured, timeout: choice === null },
    ]);
    setStatus('revealed');
  };

  const finish = () => {
    const correctCount = rounds.filter((r) => r.correct).length;
    const reason = score < MIN_BET ? 'broke' : 'completed';
    onFinish({
      id: Date.now(),
      name: playerName,
      finalScore: score,
      correctCount,
      played: rounds.length,
      result: getResult(score).title,
      playedAt: new Date().toLocaleString('vi-VN'),
    });
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
    setShowPreview(false);
    setInsured(false);
    setShowHint(false);
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

  // Phím tắt ở bước đặt cược: ↑ ↓ Enter
  useEffect(() => {
    if (status !== 'betting') return undefined;
    const handleKey = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const maxBet = getMaxBet(score);
        const current = Math.floor((Number(bet) || 0) / BET_STEP) * BET_STEP;
        const next = e.key === 'ArrowUp' ? current + BET_STEP : current - BET_STEP;
        setBet(String(Math.min(maxBet, Math.max(MIN_BET, next))));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (!validateBet(bet, score)) {
          setTimeLeft(TIME_PER_QUESTION);
          setStatus('answering');
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [status, score, bet]);

  // Tiêu đề tab, trả lại tiêu đề mặc định khi rời màn hình chơi
  useEffect(() => {
    document.title =
      status === 'betting' ? `Câu ${number}/${total} – đặt cược` : `Câu ${number}/${total} – cược ${betValue}`;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [status, number, total, betValue]);

  const handlePreview = () => {
    setShowPreview(true);
    setUsed((prev) => ({ ...prev, preview: true }));
  };

  const handleInsurance = () => {
    setInsured(true);
    setUsed((prev) => ({ ...prev, insurance: true }));
  };

  const handleHint = () => {
    setShowHint(true);
    setUsed((prev) => ({ ...prev, hint: true }));
  };

  const renderFeedback = () => {
    if (status !== 'revealed' || !lastRound) return null;
    const prefix = lastRound.timeout ? 'Hết giờ! ' : '';
    if (!lastRound.correct && lastRound.insured) {
      return <p className="feedback">{prefix}Bảo hiểm: không bị trừ điểm</p>;
    }
    return (
      <p className={`feedback ${lastRound.change >= 0 ? 'plus' : 'minus'}`}>
        {prefix}
        {formatChange(lastRound.change)}
      </p>
    );
  };

  return (
    <section className="play">
      <p className="player">Người chơi: {playerName}</p>

      <Supports
        status={status}
        used={used}
        onPreview={handlePreview}
        onInsurance={handleInsurance}
        onHint={handleHint}
      />

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
          previewText={showPreview ? question.question : ''}
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
            hint={showHint ? question.hint : ''}
          />
          {renderFeedback()}
        </>
      )}
    </section>
  );
};

// Chưa có tên người chơi thì không cho vào màn hình chơi
const Play = ({ questions, playerName, onFinish }) =>
  playerName.trim() ? (
    <Game questions={questions} playerName={playerName.trim()} onFinish={onFinish} />
  ) : (
    <Navigate to="/" replace />
  );

export default Play;
