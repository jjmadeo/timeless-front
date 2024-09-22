import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import HomeEmpresa from './pages/HomeEmpresa';
import Admin from './pages/Admin';
import Navbar from './components/Navbar/Navbar';
import ProvideAuth from './lib/authProvider';
import Login from './components/Login/Login';
import './styles/style.scss';
import LogoutButton from './components/Logout/Logout';
import Schedule from './pages/Schedule';
import Register from './components/register/Register';
import CrearEmpresa from './pages/CrearEmpresa';

function App() {
  return (
    <ProvideAuth>
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/homeEmpresa" element={<HomeEmpresa />} />
          <Route path="/crearEmpresa" element={<CrearEmpresa />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<LogoutButton />} />
        </Routes>
      </div>
    </Router>
    </ProvideAuth>
  );
}

export default App;