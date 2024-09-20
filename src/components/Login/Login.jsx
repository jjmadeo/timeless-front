import { useState, useContext } from 'react';
import { AuthContext } from '../../lib/authProvider';
import './Login.scss';
import { Button, Card, Container, Form } from 'react-bootstrap';

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      var res = await login(email, password);


    if (res) {
      console.log('Login exitoso:', res);
    }

      
    } catch (err) {
      setError('Error al iniciar sesión. Verifique sus credenciales.');
    }
  };

  return (
    <Container className="login-container">
      <img 
        src="../../../public/assets/Login.png" 
        className="background-image" 
        alt="Background" 
      />
      <Card className="login-card">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail">
              <Form.Label className="label">Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-input"
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-input"
              />
            </Form.Group>
            <Button type="submit" className="btn-login mt-3">Iniciar sesión</Button>
          </Form>
          {error && <p className="text-danger mt-3">{error}</p>}
          <div className="text-center mt-3">
            <p className="register-link">
              ¿Primera vez en Timeless? <a href="/register">Registrate</a>
            </p>
          </div>
          {user && <p className="text-center mt-3">Welcome, {user.email}!</p>}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;