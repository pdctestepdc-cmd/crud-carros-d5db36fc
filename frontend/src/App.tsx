import { NavLink, Route, Routes } from "react-router-dom";
import CarrosPage from "./pages/CarrosPage";
import NovoCarroPage from "./pages/NovoCarroPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar-inner">
          <span className="brand">CRUD Carros</span>
          <nav className="nav-links">
            <NavLink to="/carros" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Carros</NavLink>
          </nav>
        </div>
      </header>
      <main className="content">
        <Routes>
          <Route path="/carros" element={<CarrosPage />} />
          <Route path="/carros/novo" element={<NovoCarroPage />} />
          <Route path="/" element={<DashboardPage />} />
        </Routes>
      </main>
    </div>
  );
}
