import { useState } from 'react';
import { MIN_BET, formatScore } from '../data';

const ALL = 'all';

const History = ({ history, onClear }) => {
  const [player, setPlayer] = useState(ALL);

  if (history.length === 0) {
    return (
      <section>
        <h2>Lịch sử</h2>
        <p className="card">Chưa có lượt chơi nào</p>
      </section>
    );
  }

  const names = [...new Set(history.map((item) => item.name))];
  const visible = player === ALL ? history : history.filter((item) => item.name === player);
  const sorted = [...visible].sort((a, b) => b.finalScore - a.finalScore);
  const bestScore = visible.reduce((max, item) => Math.max(max, item.finalScore), 0);
  const brokeCount = visible.filter((item) => item.finalScore < MIN_BET).length;

  const handleClear = () => {
    onClear();
    setPlayer(ALL);
  };

  return (
    <section>
      <h2>Lịch sử</h2>

      <div className="card filters">
        <label className="field-inline">
          Người chơi:
          <select value={player} onChange={(e) => setPlayer(e.target.value)}>
            <option value={ALL}>Tất cả</option>
            {names.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="btn-danger" onClick={handleClear}>
          Xóa lịch sử
        </button>
      </div>

      <div className="stats">
        <p>Số lượt chơi: {visible.length}</p>
        <p>Điểm cao nhất: {formatScore(bestScore)}</p>
        <p>Số lần cháy túi: {brokeCount}</p>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Người chơi</th>
              <th>Số câu đúng</th>
              <th>Điểm cuối</th>
              <th>Đánh giá</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{`${item.correctCount}/${item.played}`}</td>
                <td>{formatScore(item.finalScore)}</td>
                <td>{item.result}</td>
                <td>{item.playedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default History;
