import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../lib/authProvider";
import {
  Button,
  Card,
  Container,
  Form,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import "./Login.scss";

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [toastMessage, setToastMessage] = useState(""); // Estado para el mensaje del toast
  const [showToast, setShowToast] = useState(false); // Estado para mostrar/ocultar el toast
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);

      if (res) {
        setToastMessage("Login exitoso");
        setError(false);
        setShowToast(true);


        console.log("Usuario logueado:", res.userInfo.ROL);

        if (res.userInfo.ROL === "[ROLE_GENERAL]") {
          navigate("/admin-dashboard");
        } else if (res.userInfo.ROL === "[ROLE_EMPRESA]") {
          navigate("/HomeEmpresa");
        } else {
          navigate("/default-dashboard");
        }
      }
    } catch (err) {
      setError(true);
      setToastMessage(err.message || "Error al iniciar sesión. Intente de nuevo.");
      setShowToast(true);
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
            <Button type="submit" className="btn-login mt-3">
              Iniciar sesión
            </Button>
          </Form>
          {user && <p className="text-center mt-3">Welcome, {user.email}!</p>}
        </Card.Body>
      </Card>
      {/* Toast container */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          bg={error ? "danger" : "success"}
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default Login;