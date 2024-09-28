import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomeEmpresa from './pages/HomeEmpresa';
import HomeGeneral from './pages/HomeGeneral';
import Admin from './pages/Admin';
import Navbar from './components/Navbar/Navbar';
import ProvideAuth from './lib/authProvider';
import Login from './components/Login/Login';
import './styles/style.scss';
import Schedule from './pages/Schedule';
import Register from './components/register/Register';
import Profile from './pages/Profile';
import CrearEmpresa from './pages/CrearEmpresa';
import LandingPage from './pages/LandingPage';
import ReservarTurno from './pages/ReservarTurno';

function App() {
  return (
    <ProvideAuth>
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/landingPage" element={<LandingPage />} />
          <Route path="/reservarTurno" element={<ReservarTurno />} />
          <Route path="/homeGeneral" element={<HomeGeneral />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/homeEmpresa" element={<HomeEmpresa />} />
          <Route path="/crearEmpresa" element={<CrearEmpresa />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
    </ProvideAuth>
  );
}

export default App;