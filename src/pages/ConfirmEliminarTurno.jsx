import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { postCancelarTurno } from "../helpers/fetch";
import { Container, Button, Spinner, Alert } from "react-bootstrap";
import "./styles/ConfirmEliminarTurno.scss";

const ConfirmEliminarTurno = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const hash = queryParams.get("hash");

    const cancelTurno = () => {
      try {
        const token = JSON.parse(localStorage.getItem("token")).token;
        postCancelarTurno(hash, token)
          .then((response) => {
            if (response.error == null) {
              setMessage("El turno ha sido cancelado exitosamente.");
              setError(false);
            } else {
              setMessage("El turno no existe o fue cancelado previamente.");
              setError(true);
            }
          })
          .catch(() => {
            setMessage("El turno no existe o fue cancelado previamente.");
            setError(true);
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (err) {
        setMessage("No se proporcionó un token válido.");
        setError(true);
        setLoading(false);
      }
    };

    if (hash) {
      cancelTurno();
    } else {
      setMessage("No se proporcionó un hash válido.");
      setError(true);
      setLoading(false);
    }
  }, [location.search]);

  return (
    <Container className="confirm-eliminar-turno-container">
      <img
        src="../../../public/assets/Login.png"
        className="background-image"
        alt="Background"
      />
      {loading ? (
        <div className="loading-spinner">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      ) : (
        <Alert variant={error ? "danger" : "success"}>{message}</Alert>
      )}
      <Button variant="primary" onClick={() => navigate("/landingPage")}>
        Volver al inicio
      </Button>
    </Container>
  );
};

export default ConfirmEliminarTurno;