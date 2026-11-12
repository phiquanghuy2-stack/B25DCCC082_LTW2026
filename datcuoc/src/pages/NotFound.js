import { Link } from 'react-router-dom';

const NotFound = () => (
  <section className="card center">
    <h2>404 - Không tìm thấy trang</h2>
    <Link to="/">Về trang chủ</Link>
  </section>
);

export default NotFound;
