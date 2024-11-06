import { useState } from "react";
import { Button, Card, Container, Form, Toast, ToastContainer } from "react-bootstrap";
import { postResetPass } from "../../helpers/fetch";
import "./Login.scss";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleResetPassword = async () => {
    try {
      const payload = { email };
      const response = await postResetPass(payload);
      if (response.status === 200) {
        setToastMessage("Se ha enviado un correo para restablecer la contraseña.");
        setError(false);
        setShowToast(true);
      } else {
        setToastMessage(response.text);
        setError(true);
        setShowToast(true);
      }
    } catch (error) {
      setError(true);
      setToastMessage(
        error.message || "Error al enviar la solicitud de restablecimiento de contraseña."
      );
      setShowToast(true);
    }
  };

  return (
    <Container className="login-container">
      <img
        src="/assets/01-login.png"
        className="background-image"
        alt="Background"
      />
      <Card className="login-card">
        <Card.Body>
          <Form>
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
            <Button className="btn-login mt-3" onClick={handleResetPassword}>
              Recuperar
            </Button>
          </Form>
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

export default ResetPassword;