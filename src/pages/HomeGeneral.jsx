import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    Toast,
    ToastContainer,
    Card,
    Button,
    Container,
    Row,
    Col,
    Modal,
} from "react-bootstrap";
import "./styles/HomeGeneral.scss";
import { getTurnosByUser, postCancelarTurno } from "../helpers/fetch";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import MapComponent from "../components/Map/Map";
import { useAuth } from "../lib/authProvider";

const AppointmentCard = ({ appointment, color, data, onViewMap, onCancel }) => {
    const formattedDate = format(new Date(appointment.fecha_hora), "EEEE dd 'de' MMMM", { locale: es });
    const formattedTime = format(new Date(appointment.fecha_hora), "HH'hs'", { locale: es });

    return (
        <Card className="mb-3 shadow card-usuario" style={{ backgroundColor: color }}>
            <Card.Body>
                <div className="d-flex justify-content-between">
                    <div>
                        <Card.Text>{formattedDate}</Card.Text>
                        <Card.Text>{formattedTime}</Card.Text>
                        <Card.Text>{appointment.rubro.detalle}</Card.Text>
                    </div>
                    <div>
                        <Card.Title>{appointment.nombre_empresa}</Card.Title>
                        <Card.Text>{appointment.direccion}</Card.Text>
                    </div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                    <Button
                        variant="danger"
                        size="sm"
                        className="mr-2"
                        style={{ visibility: data.pasado === null ? 'visible' : 'hidden' }}
                        onClick={() => onCancel(appointment)}
                    >
                        Cancelar turno
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onViewMap(appointment.cordenadas)}
                    >
                        Ver mapa
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

const HomeGeneral = () => {
    const [data, setData] = useState({ hoy: [], futuros: [], pasados: [] });
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const [showMapModal, setShowMapModal] = useState(false);
    const [selectedCoordinates, setSelectedCoordinates] = useState(null);
    const [showConfirmCancelModal, setShowConfirmCancelModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const auth = useAuth();
  
    useEffect(() => {
      if (!auth.user || auth.user.ROL !== "[ROLE_GENERAL]") {
        navigate("/login");
      }
    }, [auth, navigate]);

    const fetchGetTurnos = async () => {
        try {
            const token = JSON.parse(localStorage.getItem("token")).token;
            const res = await getTurnosByUser(token);
            setData(res);
        } catch (error) {
            console.error("Error al obtener los turnos:", error);
        }
    };

    useEffect(() => {
        fetchGetTurnos();
    }, []);

    useEffect(() => {
        if (location.state && location.state.message) {
            const { mensaje, direccion, fecha_hora } = location.state.message;
            const fechaFormateada = format(
                new Date(fecha_hora),
                "EEEE d 'de' MMMM yyyy 'a las' HH:mm'hs'",
                { locale: es }
            );
            setToastMessage(`${mensaje}<br />${fechaFormateada}<br />${direccion}`);
            setToastType(location.state.type || "success");
            setShowToast(true);
        }
    }, [location.state]);

    const handleViewMap = (coordinates) => {
        setSelectedCoordinates({
            lat: parseFloat(coordinates.latitud),
            lng: parseFloat(coordinates.longitud),
        });
        setShowMapModal(true);
    };

    const handleCancelAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setShowConfirmCancelModal(true);
    };

    const handleConfirmCancel = async () => {
        try {
            const token = JSON.parse(localStorage.getItem("token")).token;
            const response = await postCancelarTurno(selectedAppointment.hashid, token);

            if (response.error == null) {
                console.log("Turno cancelado:", response);
                setToastMessage(response.mensaje);
                setToastType("success");
                setShowToast(true);
                const token = JSON.parse(localStorage.getItem("token")).token;
                const res = await getTurnosByUser(token);
                setData(res);
            } else {
                console.error("Error al cancelar turno:", response.message);
                setToastMessage(response.message);
                setToastType("danger");
                setShowToast(true);
            }
        } catch (error) {
            console.error("Error al cancelar turno:", error.message);
            setToastMessage(error.message);
            setToastType("danger");
            setShowToast(true);
        }
        setShowConfirmCancelModal(false);
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8} className="mb-2">
                    <h2 className="mb-2">Hoy</h2>
                    <div className="scrollable-div-hoy turnoContainer">
                        {data.hoy.length === 0 ? (
                            <p>No hay turnos hoy.</p>
                        ) : (
                            data.hoy.map((appointment) => (
                                <AppointmentCard
                                    key={appointment.id}
                                    appointment={appointment}
                                    color="#3B6C5B"
                                    data={{ pasado: null }}
                                    onViewMap={handleViewMap}
                                    onCancel={handleCancelAppointment}
                                />
                            ))
                        )}
                    </div>
                </Col>
            </Row>

            <Row>
                <Col md={7}>
                    <h2 className="mb-4">Próximos</h2>
                    <div className="scrollable-div-futuros turnoContainer">
                        {data.futuros.length === 0 ? (
                            <p>No hay turnos próximos.</p>
                        ) : (
                            data.futuros.map((appointment) => (
                                <AppointmentCard
                                    key={appointment.id}
                                    appointment={appointment}
                                    color="#73633A"
                                    data={{ pasado: null }}
                                    onViewMap={handleViewMap}
                                    onCancel={handleCancelAppointment}
                                />
                            ))
                        )}
                    </div>
                </Col>

                <Col md={5}>
                    <h2 className="mb-4">Turnos históricos</h2>
                    <div className="scrollable-div-historico turnoContainer">
                        {data.pasados.length === 0 ? (
                            <p>No hay turnos pasados.</p>
                        ) : (
                            data.pasados.map((appointment) => (
                                <AppointmentCard
                                    key={appointment.id}
                                    appointment={appointment}
                                    color="#C25959"
                                    data={{ pasado: true }}
                                    onViewMap={handleViewMap}
                                />
                            ))
                        )}
                    </div>
                </Col>
            </Row>

            <ToastContainer position="bottom-end" className="p-3">
                <Toast
                    bg={toastType === "success" ? "success" : "danger"}
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    delay={3000}
                    autohide
                >
                    <Toast.Body dangerouslySetInnerHTML={{ __html: toastMessage }} />
                </Toast>
            </ToastContainer>

            <Modal
                show={showMapModal}
                onHide={() => setShowMapModal(false)}
                className="custom-map-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Ubicación del servicio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCoordinates ? (
                        <MapComponent location={selectedCoordinates} />
                    ) : (
                        <p>No hay información disponible sobre la ubicación.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowMapModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showConfirmCancelModal}
                onHide={() => setShowConfirmCancelModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Cancelación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que deseas cancelar este turno?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmCancelModal(false)}>
                        Cerrar
                    </Button>
                    <Button variant="danger" onClick={handleConfirmCancel}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default HomeGeneral;