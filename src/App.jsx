import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Navbar from './components/Navbar/Navbar';
import ProvideAuth from './lib/authProvider';
import Login from './components/Login/Login';
import './styles/style.scss';
import LogoutButton from './components/Logout/Logout';

function App() {
  return (
    <ProvideAuth>
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login-test" element={<Login />} />
          <Route path="/logout" element={<LogoutButton />} />
        </Routes>
      </div>
    </Router>
    </ProvideAuth>
  );
}

export default App;