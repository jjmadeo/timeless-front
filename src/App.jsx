import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import HomeGeneral from './pages/HomeGeneral';
import ModificarEmpresa from './pages/ModificarEmpresa';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ProvideAuth from './lib/authProvider';
import Login from './components/Login/Login';
import ResetPassword from './components/Login/ResetPassword';
import './styles/style.scss';
import Schedule from './pages/Schedule';
import Register from './components/register/Register';
import Profile from './pages/Profile';
import CrearEmpresa from './pages/CrearEmpresa';
import LandingPage from './pages/LandingPage';
import ReservarTurno from './pages/ReservarTurno';
import ConfirmEliminarTurno from './pages/ConfirmEliminarTurno';

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/cancelarTurno';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className="container mt-4" style={{ minHeight: 'calc(100vh - 233px)' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/reservarTurno" element={<ReservarTurno />} />
          <Route path="/homeGeneral" element={<HomeGeneral />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/login" element={<Login />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/crearEmpresa" element={<CrearEmpresa />} />
          <Route path="/modificarEmpresa" element={<ModificarEmpresa />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cancelarTurno" element={<ConfirmEliminarTurno />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

function App() {
  return (
    <ProvideAuth>
      <Router>
        <AppContent />
      </Router>
    </ProvideAuth>
  );
}

export default App;