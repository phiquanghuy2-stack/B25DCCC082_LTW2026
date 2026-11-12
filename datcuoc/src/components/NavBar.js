import { NavLink } from 'react-router-dom';

const NavBar = () => (
  <nav className="navbar">
    <span className="brand">Đặt cược kiến thức</span>
    <NavLink to="/" end className="nav-link">
      Trang chủ
    </NavLink>
    <NavLink to="/questions" className="nav-link">
      Ngân hàng câu hỏi
    </NavLink>
    <NavLink to="/history" className="nav-link">
      Lịch sử
    </NavLink>
  </nav>
);

export default NavBar;
