import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import Play from './pages/Play';
import Result from './pages/Result';
import History from './pages/History';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';

const BOOKMARKS_KEY = 'ltw_cuoc_bookmarks';
const HISTORY_KEY = 'ltw_cuoc_history';

const readList = (key) => {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bankFilters, setBankFilters] = useState({ levels: [1, 2, 3], onlyBookmarked: false, keyword: '' });
  const [bookmarks, setBookmarks] = useState(() => readList(BOOKMARKS_KEY));
  const [playerName, setPlayerName] = useState('');
  const [history, setHistory] = useState(() => readList(HISTORY_KEY));

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

  // Updating: ghi lại localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const toggleBookmark = (id) =>
    setBookmarks((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]));

  const addHistory = (record) => setHistory((prev) => [...prev, record]);

  const clearHistory = () => setHistory([]);

  return (
    <Routes>
      <Route path="/" element={<Layout loading={loading} error={error} />}>
        <Route
          index
          element={<Home playerName={playerName} setPlayerName={setPlayerName} history={history} />}
        />
        <Route
          path="play"
          element={<Play questions={questions} playerName={playerName} onFinish={addHistory} />}
        />
        <Route path="result" element={<Result />} />
        <Route path="history" element={<History history={history} onClear={clearHistory} />} />
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
