import { useContext, useEffect, useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext, useAuth } from "../../lib/authProvider";
import logo from "../../../public/assets/Logo.png";
import "./Navbar.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

const NavigationBar = () => {
  const { user, logout } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [showScroll, setShowScroll] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Función para decodificar el token
  const decodeToken = (token) => {
    if (token) {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    }
    return null;
  };

  useEffect(() => {
    setUserProfile(auth.userProfile || null);
  }, [user, auth]);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.pageYOffset > 400) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 400) {
        setShowScroll(false);
      }
    };

    window.addEventListener('scroll', checkScrollTop);
    return () => {
      window.removeEventListener('scroll', checkScrollTop);
    };
  }, [showScroll]);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const userRole = user ? decodeToken(localStorage.getItem("token")).ROL : null;

  return (
    <>
      <Navbar bg="primary" expand="md">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img
              src={logo}
              alt="Logo"
              width="30"
              height="50"
              className="d-inline-block me-3"
            />{" "}
            timeless
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {!user ? (
                <>{/* Links for non-authenticated users */}</>
              ) : userRole === "[ROLE_GENERAL]" ? (
                <>
                  <Nav.Link as={Link} to="/homeGeneral">
                    Mis turnos
                  </Nav.Link>
                  <Nav.Link as={Link} to="/reservarTurno">
                    Reservar turno
                  </Nav.Link>
                </>
              ) : userRole === "[ROLE_EMPRESA]" ? (
                <>
                  <Nav.Link as={Link} to="/schedule">
                    Agendas
                  </Nav.Link>
                  <Nav.Link as={Link} to="/auditoria">
                    Turnos cancelados
                  </Nav.Link>
                  {userProfile && userProfile.id_empresa === null && (
                    <Button variant="secondary" as={Link} to="/crearEmpresa">
                      Crear Empresa
                    </Button>
                  )}
                </>
                
              ) : null}
            </Nav>
            <Nav className="ml-auto">
              {user ? (
                <>
                  {userProfile && userProfile.id_empresa !== null && (
                    <Nav.Link as={Link} to="/modificarEmpresa">
                      Modificar Empresa
                    </Nav.Link>
                  )}
                  <Nav.Link className="mx-2" as={Link} to="/profile">
                    Perfil
                  </Nav.Link>
                  <Button
                    className="me-4"
                    variant="primary"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </Button>
                </>
              ) : (
                <>
                {location.pathname === "/" && (
                
                <>
                  <Nav.Link className="mx-2" href="#services">
                    Beneficios
                  </Nav.Link>
                  <Nav.Link className="mx-2" href="#features">
                    Ventajas
                  </Nav.Link>
                  <Nav.Link className="mx-2" href="#showcase">
                    Comunidad
                  </Nav.Link>
                </>
                )}
                  <Button
                    className="me-4"
                    variant="primary"
                    as={Link}
                    to="/login"
                  >
                    Iniciar sesión
                  </Button>
                  <Button variant="secondary" as={Link} to="/register">
                    Registrarse
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <FontAwesomeIcon
        icon={faArrowUp}
        onClick={handleScrollTop}
        className="scrollTop"
        style={{ display: showScroll ? 'flex' : 'none' }}
      />
    </>
  );
};

export default NavigationBar;
