import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = ({ loading, error }) => (
  <div className="app">
    <NavBar />
    <main className="content">
      {loading && <p className="status">Đang tải câu hỏi...</p>}
      {!loading && error && <p className="status error-text">{error}</p>}
      {!loading && !error && <Outlet />}
    </main>
  </div>
);

export default Layout;
