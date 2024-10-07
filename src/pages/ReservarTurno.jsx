import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Spinner,
  Alert,
  Card,
  ListGroup,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { Autocomplete, LoadScriptNext } from "@react-google-maps/api";
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
registerLocale("es", es);
import {
  getStaticData,
  getEmpresasByLocation,
  getTurnosDisponibles,
  postPreseleccionarTurno,
  postConfirmarTurno,
} from "../helpers/fetch";
import { useLocation, useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

const libraries = ["places"];

const ReservarTurno = () => {
  const [location, setLocation] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedRubro, setSelectedRubro] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [rubros, setRubros] = useState([]);
  const [autocomplete, setAutocomplete] = useState(null);
  const [address, setAddress] = useState("");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedLine, setSelectedLine] = useState(null);
  const [showNoResultsModal, setShowNoResultsModal] = useState(false);
  const [showNoTimesModal, setShowNoTimesModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedHashid, setSelectedHashId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorTimes, setErrorTimes] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  // Cargar rubros al inicio
  useEffect(() => {
    fetchRubros();
  }, []);

  const fetchRubros = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token")).token;
      const res = await getStaticData(token);
      setRubros(res.rubro);
    } catch (error) {
      console.error("Error al obtener los rubros:", error);
    }
  };

  const handlePlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setLocation({ lat, lng });
      setAddress(place.formatted_address);
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  // Obtener empresas cercanas basadas en lat/lng y rubro
  const fetchCompanies = async (lat, lng, rubro) => {
    try {
      setLoading(true); // Mostrar spinner
      const token = JSON.parse(localStorage.getItem("token")).token;
      const res = await getEmpresasByLocation(lat, lng, 6, rubro, token);
      if (res.data.length === 0) {
        setShowNoResultsModal(true);
      } else {
        setCompanies(res.data);
      }
    } catch (error) {
      console.error("Error al obtener las empresas:", error);
    } finally {
      setLoading(false); // Ocultar spinner
    }
  };

  const handleRubroChange = (e) => {
    const selectedText = e.target.options[e.target.selectedIndex].text;
    setSelectedRubro(selectedText);
  };

  const handleUseCurrentLocationChange = (e) => {
    setUseCurrentLocation(e.target.checked);
  };

  const handleSearch = async () => {
    if (!selectedRubro) {
      console.error("Debes seleccionar un rubro antes de buscar.");
      return;
    }
    if (!address && !useCurrentLocation) {
      console.error("Debes ingresar una dirección o usar la ubicación actual.");
      return;
    }

    if (useCurrentLocation && location) {
      fetchCompanies(location.lat, location.lng, selectedRubro);
    } else {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
          )}&key=AIzaSyAZ6rhipfSVaz-41Jn4vv-MgEDd87n4Zkc`
        );
        const data = await response.json();
        if (data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          setLocation({ lat, lng });
          fetchCompanies(lat, lng, selectedRubro);
        } else {
          console.error("No se encontraron resultados para la dirección.");
        }
      } catch (error) {
        console.error("Error al obtener coordenadas:", error.message);
      }
    }
  };

  const handleCompanyChange = (e) => {
    const selectedCompanyId = parseInt(e.target.value, 10);
    const company = companies.find(
      (company) => company.id === selectedCompanyId
    );
    setSelectedCompany(company);
    setSelectedLine(null);
  };

  const handleLineChange = (e) => {
    const selectedLineId = parseInt(e.target.value, 10);
    const line = selectedCompany.lineas_atencion.find(
      (line) => line.id === selectedLineId
    );
    setSelectedLine(line);
  };

  const handleDateSelected = async (date) => {
    setSelectedDate(date);

    if (selectedLine) {
      try {
        const token = JSON.parse(localStorage.getItem("token")).token;
        const formattedDate = date.toISOString().split("T")[0]; // Formatear la fecha como 'YYYY-MM-DD'
        const res = await getTurnosDisponibles(
          selectedLine.id,
          formattedDate,
          token
        );

        if (res.data) {
          if (res.data.length > 0) {
            // Extraer los horarios desde el campo fecha_hora
            const now = new Date();
            const horariosDisponibles = res.data
              .filter((turno) => new Date(turno.fecha_hora) > now) // Filtrar horarios pasados
              .map((turno) => {
                const hora = new Date(turno.fecha_hora).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return {
                  hora,
                  hashid: turno.hashid, // Incluir el hashid
                };
              });
            setAvailableTimes(horariosDisponibles);
          }
        } else {
          if (res.error.status == "BAD_REQUEST") {
            setErrorTimes(res.error.title);
            setShowNoTimesModal(true);
          }
        }
      } catch (error) {
        console.error("Error al obtener turnos disponibles:", error);
      }
    }
  };

  const handleTimeSelected = (time, hashid) => {
    setSelectedTime(time);
    setSelectedHashId(hashid);
  };

  const handlePreseleccionarTurno = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token")).token;

      // Preseleccionar turno con la API usando el selectedHashId
      const response = await postPreseleccionarTurno(selectedHashid, token);

      console.log("Response:", response.error);
      if (response.error == null) {
        setShowConfirmModal(true);
      } else {
        console.error("Error al preseleccionar turno:", response.message);
      }
    } catch (error) {
      console.error("Error al preseleccionar turno:", error.message);
    }
  };

  const handleConfirmarTurno = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token")).token;

      // Confirmar turno con la API usando el selectedHashId
      const response = await postConfirmarTurno(selectedHashid, token);

      if (response.error == null) {
        console.log("Turno confirmado:", response);
        navigate("/HomeGeneral", { state: { message: response, type: "success" } });
      } else {
        console.error("Error al confirmar turno:", response.message);
      }
    } catch (error) {
      console.error("Error al confirmar turno:", error.message);
    }
  };

  // Obtener ubicación actual solo si se selecciona la opción "usar ubicación actual"
  useEffect(() => {
    if (useCurrentLocation) {
      const fetchLocation = async () => {
        try {
          const response = await fetch(
            "https://ipinfo.io/json?token=85e8e7ad2053f3"
          );
          const data = await response.json();
          const [lat, lng] = data.loc.split(",");
          const currentLocation = {
            lat: parseFloat(lat),
            lng: parseFloat(lng),
          };
          setLocation(currentLocation);
        } catch (error) {
          console.error("Error al obtener ubicación:", error.message);
        }
      };
      fetchLocation();
    }
  }, [useCurrentLocation]);

  const resetForm = () => {
    setSelectedDate(null);
    setAvailableTimes([]);
    setSelectedTime(null);
    setSelectedHashId("");
    setLoading(false);
    setErrorTimes("");
    setError(false);
  };

  return (
    <Container fluid>
      <h1 className="text-center my-4">Solicita un nuevo turno</h1>
      <hr />
      <Row className="w-full">
        <Col md={3} className="mb-4">
          <Form.Group>
            <Form.Label>Rubros</Form.Label>
            <Form.Control as="select" onChange={handleRubroChange}>
              <option value="">Selecciona un Rubro</option>
              {rubros.map((rubro) => (
                <option key={rubro.id} value={rubro.id}>
                  {rubro.detalle}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>

        <Col md={6} className="mb-4">
          <Form.Group>
            <Form.Label>Dirección</Form.Label>
            <LoadScriptNext
              googleMapsApiKey="AIzaSyAZ6rhipfSVaz-41Jn4vv-MgEDd87n4Zkc"
              libraries={libraries}
            >
              <Autocomplete
                onLoad={(autocomplete) => setAutocomplete(autocomplete)}
                onPlaceChanged={handlePlaceChanged}
              >
                <Form.Control
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Escribe una dirección"
                  disabled={useCurrentLocation}
                />
              </Autocomplete>
            </LoadScriptNext>
          </Form.Group>
        </Col>

        <Col md={3} className="d-flex align-items-center">
          <Form.Check
            type="checkbox"
            label="Usar ubicación actual"
            checked={useCurrentLocation}
            onChange={handleUseCurrentLocationChange}
          />
        </Col>

        <Col md={12} className="text-center">
          <Button variant="primary" onClick={handleSearch} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Buscar"}
          </Button>
        </Col>
      </Row>
      <hr />
      {companies.length > 0 && (
        <Col md={12} className="mb-4">
          <Card>
            <Card.Header as="h2">
              Seleccionar Servicio, Fecha y Horario
            </Card.Header>
            <Card.Body>
              <Row>
                {/* Columna izquierda: Servicios y Líneas de Atención */}
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Servicio</Form.Label>
                    <Form.Control as="select" onChange={handleCompanyChange}>
                      <option value="">Selecciona un Servicio</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.datos_fiscales.nombre_fantasia}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  {selectedCompany && (
                    <Form.Group className="mt-3">
                      <Form.Label>Línea de Atención</Form.Label>
                      <Form.Control as="select" onChange={handleLineChange}>
                        <option value="">Selecciona una línea</option>
                        {selectedCompany.lineas_atencion.map((line) => (
                          <option key={line.id} value={line.id}>
                            {line.descripcion}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  )}
                </Col>

                <Col md={4} className="text-center">
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateSelected}
                    inline
                    locale="es"
                    minDate={new Date()} // Deshabilitar fechas anteriores al día actual
                  />
                </Col>

                <Col md={4}>
                  <h5>Horarios Disponibles</h5>
                  <ListGroup
                    variant="flush"
                    style={{ maxHeight: "200px", overflowY: "auto" }}
                  >
                    {availableTimes.map((turno) => (
                      <ListGroup.Item
                        key={turno.hora}
                        onClick={() =>
                          handleTimeSelected(turno.hora, turno.hashid)
                        } // Pasar el hashid aquí
                        active={selectedTime === turno.hora}
                        action
                      >
                        {turno.hora}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      )}

      {selectedTime && (
        <div className="text-center">
          <Button
            variant="secondary"
            onClick={handlePreseleccionarTurno}
            className="mt-3"
          >
            Seleccionar Turno
          </Button>
        </div>
      )}

      <Modal
        show={showNoResultsModal}
        onHide={() => setShowNoResultsModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>No se encontraron servicios cercanos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          No se encontraron empresas cercanas a la dirección seleccionada.
          Intenta con otra ubicación o rubro.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowNoResultsModal(false)}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showNoTimesModal} onHide={() => setShowNoTimesModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sin Horarios Disponibles</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorTimes}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowNoTimesModal(false)}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Turno</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tiene 2 minutos para confirmar el turno <br></br>¿Desea confirmar su
          turno?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setShowConfirmModal(false);
              setError(true);
              setToastMessage("No ha sido confirmado el turno");
              setShowToast(true);
              resetForm();
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="secondary"
            onClick={handleConfirmarTurno}
            disabled={!selectedDate || !selectedTime}
          >
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
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

export default ReservarTurno;