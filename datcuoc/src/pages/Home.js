import { useNavigate } from 'react-router-dom';
import {
  START_SCORE,
  MIN_BET,
  MAX_BET,
  TIME_PER_QUESTION,
  MULTIPLIERS,
  formatScore,
  formatMultiplier,
} from '../data';

const Home = ({ playerName, setPlayerName, history }) => {
  const navigate = useNavigate();
  const canPlay = playerName.trim() !== '';

  const best = history.reduce((top, item) => (!top || item.finalScore > top.finalScore ? item : top), null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canPlay) return;
    setPlayerName(playerName.trim());
    navigate('/play');
  };

  return (
    <section>
      <h1>Đặt cược kiến thức</h1>

      {best && (
        <p className="record">
          Kỷ lục: {formatScore(best.finalScore)} – {best.name}
        </p>
      )}

      <div className="card">
        <h3>Luật chơi</h3>
        <ul className="rules">
          <li>Bắt đầu với {formatScore(START_SCORE)}, đi qua 12 câu hỏi về HTML, CSS, JavaScript và React.</li>
          <li>
            Trước mỗi câu chỉ biết chủ đề và mức độ; đặt cược từ {formatScore(MIN_BET)} đến{' '}
            {formatScore(MAX_BET)} (bội số của 100, không vượt quá số điểm đang có).
          </li>
          <li>Câu hỏi hiện ra sau khi đặt cược, có {TIME_PER_QUESTION} giây để trả lời.</li>
          <li>
            Đúng: cộng mức cược × hệ số (Dễ {formatMultiplier(MULTIPLIERS[1])}, Trung bình{' '}
            {formatMultiplier(MULTIPLIERS[2])}, Khó {formatMultiplier(MULTIPLIERS[3])}). Sai hoặc hết giờ: trừ
            đúng mức cược.
          </li>
          <li>Còn dưới {formatScore(MIN_BET)} là cháy túi, lượt chơi kết thúc.</li>
          <li>Có 3 quyền trợ giúp, mỗi quyền dùng một lần: Xem trước, Bảo hiểm, Gợi ý.</li>
        </ul>
      </div>

      <form className="card start-form" onSubmit={handleSubmit}>
        <label className="field">
          Tên người chơi
          <input
            type="text"
            value={playerName}
            placeholder="Nhập tên của bạn"
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </label>
        <button type="submit" className="btn-primary" disabled={!canPlay}>
          Vào chơi
        </button>
      </form>
    </section>
  );
};

export default Home;
