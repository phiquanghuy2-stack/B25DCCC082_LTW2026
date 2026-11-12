import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import Play from './pages/Play';
import Result from './pages/Result';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bankFilters, setBankFilters] = useState({ levels: [1, 2, 3], onlyBookmarked: false, keyword: '' });
  const [bookmarks, setBookmarks] = useState([]);
  const [playerName, setPlayerName] = useState('');

  // Mounting: gọi API lấy câu hỏi, cleanup bằng abort()
  useEffect(() => {
    const controller = new AbortController();
    axios
      .get('/data/questions.json', { signal: controller.signal })
      .then((res) => {
        if (!Array.isArray(res.data)) throw new Error('Dữ liệu không hợp lệ');
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setError('Không tải được câu hỏi');
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const toggleBookmark = (id) =>
    setBookmarks((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]));

  return (
    <Routes>
      <Route path="/" element={<Layout loading={loading} error={error} />}>
        <Route index element={<Home playerName={playerName} setPlayerName={setPlayerName} />} />
        <Route path="play" element={<Play questions={questions} playerName={playerName} />} />
        <Route path="result" element={<Result />} />
        <Route path="history" element={<h2>Lịch sử</h2>} />
        <Route
          path="questions"
          element={
            <QuestionBank
              questions={questions}
              bookmarks={bookmarks}
              toggleBookmark={toggleBookmark}
              filters={bankFilters}
              setFilters={setBankFilters}
            />
          }
        />
        <Route
          path="questions/:id"
          element={
            <QuestionDetail questions={questions} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
