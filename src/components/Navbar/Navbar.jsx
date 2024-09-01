import { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../lib/authProvider';
import './Navbar.scss';

const NavigationBar = () => {

  const { user, logout } = useContext(AuthContext);

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Mi Aplicación de Turnos</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            {user && (
              <Nav.Link as={Link} to="/admin">Administración</Nav.Link>
            )}
          </Nav>

          <Nav className="ml-auto">
            {user ? (
              <>
                <span className="navbar-text me-2">Bienvenido, {user.email}!</span>
                <Button variant="outline-light" onClick={logout}>Cerrar sesión</Button>
              </>
            ) : (
              <Button variant="outline-light" as={Link} to="/login-test">Iniciar sesión</Button>
            )}
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;