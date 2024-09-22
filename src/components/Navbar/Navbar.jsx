import { useContext, useEffect, useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../lib/authProvider';
import logo from '../../../public/assets/logo.png';
import { getProfile } from '../../helpers/fetch';
import './Navbar.scss';


const NavigationBar = () => {
  const { user, logout } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);

  // Función para decodificar el token
  const decodeToken = (token) => {
    if (token) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      return JSON.parse(jsonPayload);
    }
    return null;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const userRole = user ? decodeToken(localStorage.getItem("token")).ROL : null;
  console.log("Rol del usuario:", decodeToken(localStorage.getItem("token")));


  return (
    <Navbar bg="primary" variant="dark" expand="md">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={logo} alt="Logo" width="30" height="50" className="d-inline-block me-3" />{' '}timeless
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {!user ? (
              <>
                             
              </>
            ) : userRole === '[ROLE_GENERAL]' ? (
              <>
                <Nav.Link as={Link} to="/schedule">Pedir Turno</Nav.Link>
              </>
            ) : userRole === '[ROLE_EMPRESA]' ? (
              <>
                <Nav.Link as={Link} to="/empresa">Opciones de Empresa</Nav.Link>
                {userProfile && userProfile.id_empresa === null && (
                  <Nav.Link as={Link} to="/crear-empresa">Crear Empresa</Nav.Link>
                )}
              </>
            ) : null}
          </Nav>
          <Nav className="ml-auto">
            {user ? (
              <>
                <Nav.Link className="mx-2" as={Link} to="/profile">Perfil</Nav.Link>
                <Button className="me-4" variant='primary' onClick={logout}>Cerrar sesión</Button>
              </>
            ) : (
              <>
              <Nav.Link className="mx-2" as={Link} to="/about">Nosotros</Nav.Link>
              <Nav.Link className="mx-2" as={Link} to="/products">Productos</Nav.Link>
              <Nav.Link className="mx-2" as={Link} to="/help">Ayuda</Nav.Link>   
              <Button className="me-4" variant='primary' as={Link} to="/login">Iniciar sesión</Button>
              <Button variant='secondary' as={Link} to="/register">Registrarse</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;