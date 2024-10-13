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
import MapComponent from "../components/Map/Map";
import "./styles/ReservarTurnos.scss";
import TurnoCalendar from "../components/Calendar/TurnoCalendar";
import { getWeekRange } from "../helpers/dateUtils";
import Select from "react-select";

const libraries = ["places"];

const ReservarTurno = () => {
  const [location, setLocation] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedRubro, setSelectedRubro] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);
  const [rubros, setRubros] = useState([]);
  const [autocomplete, setAutocomplete] = useState(null);
  const [address, setAddress] = useState("");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedLine, setSelectedLine] = useState(null);

  const [selectedHashid, setSelectedHashId] = useState("");
  const [loading, setLoading] = useState(false);
  const [horaApertura, setHoraApertura] = useState("09:00");
  const [horaCierre, setHoraCierre] = useState("18:00");
  const [duracionTurnos, setDuracionTurnos] = useState(30);
  const [events, setEvents] = useState([]);

  const [errorTimes, setErrorTimes] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [error, setError] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showNoResultsModal, setShowNoResultsModal] = useState(false);
  const [showNoTimesModal, setShowNoTimesModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const navigate = useNavigate();

  // Cargar rubros al inicio
  useEffect(() => {
    fetchRubros();
  }, []);

  useEffect(() => {
    console.log(rubros);
  }, [rubros]);

  const resetForm = () => {
    setSelectedTime(null);
    setSelectedHashId("");
    setLoading(false);
    setErrorTimes("");
    setError(false);
  };

  const handleConfirmarTurno = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token")).token;

      // Confirmar turno con la API usando el selectedHashId
      const response = await postConfirmarTurno(selectedHashid, token);

      if (response.error == null) {
        console.log("Turno confirmado:", response);
        navigate("/HomeGeneral", {
          state: { message: response, type: "success" },
        });
      } else {
        console.error("Error al confirmar turno:", response.message);
      }
    } catch (error) {
      console.error("Error al confirmar turno:", error.message);
    }
  };

  const fetchRubros = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token")).token;
      const res = await getStaticData(token);
      setRubros(res.rubro.map(r => ({ value: r.id, label: r.detalle })));
    } catch (error) {
      console.error("Error al obtener los rubros:", error);
    }
  };
  

  const handlePlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setLocation({ lng, lat });
      setAddress(place.formatted_address);
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  // Obtener empresas cercanas basadas en lat/lng y rubro
  const fetchCompanies = async (lng, lat, rubro) => {
    try {
      setLoading(true); // Mostrar spinner
      const token = JSON.parse(localStorage.getItem("token")).token;
      const res = await getEmpresasByLocation(lng, lat, 20, rubro, token);
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

  const handleRubroChange = (selectedOption) => {
    setSelectedRubro(selectedOption);
  };

  const handleUseCurrentLocationChange = (e) => {
    setUseCurrentLocation(e.target.checked);
  };

  const handleSearch = async () => {
    console.log(selectedRubro);
    if (!selectedRubro) {
      setToastMessage("Debes seleccionar un rubro antes de buscar.");
      setShowToast(true);

      return;
    }
    if (!address && !useCurrentLocation) {
      setToastMessage(
        "Debes ingresar una dirección o usar la ubicación actual."
      );
      setShowToast(true);
      return;
    }

    if (useCurrentLocation && location) {
      fetchCompanies(location.lat, location.lng, selectedRubro.label);
    } else {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
          )}&key=AIzaSyAZ6rhipfSVaz-41Jn4vv-MgEDd87n4Zkc`
        );
        const data = await response.json();
        if (data.results.length > 0) {
          const { lng, lat } = data.results[0].geometry.location;
          setLocation({ lng, lat });
          fetchCompanies(lng, lat, selectedRubro.label);
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
    setHoraApertura(company.calendario.hora_apertura);
    setHoraCierre(company.calendario.hora_cierre);
    setSelectedLine(null);
  };

  const handleLineChange = (e, currentDate) => {
    const selectedLineId = parseInt(e.target.value, 10);
    const line = selectedCompany.lineas_atencion.find(
      (line) => line.id === selectedLineId
    );
    setSelectedLine(line);
    handleDateSelected(currentDate);
  };
  useEffect(() => {
    if (selectedLine) {
      handleDateSelected(selectedDate);
    }
  }, [selectedLine]);

  const handleDateSelected = async (date) => {
    console.log(selectedLine);
    if (selectedLine) {
      const { start, end } = getWeekRange(date);
      try {
        const token = JSON.parse(localStorage.getItem("token")).token;
        const res = await getTurnosDisponibles(
          selectedLine.id,
          start,
          end,
          token
        );

        if (res.data) {
          setDuracionTurnos(res.data[0].duracion);
          if (res.data.length > 0) {
            const now = new Date();
            const horariosDisponibles = res.data
              .filter((turno) => new Date(turno.fecha_hora) > now)
              .map((turno) => ({
                title: "Disponible",
                start: new Date(turno.fecha_hora),
                end: new Date(
                  new Date(turno.fecha_hora).getTime() + turno.duracion * 60000
                ),
                hashid: turno.hashid,
                color: "#99cc99",
              }));
            setEvents(horariosDisponibles);
          }
        } else {
          if (res.error.status === "BAD_REQUEST") {
            // Handle error
          }
        }
      } catch (error) {
        console.error("Error al obtener turnos disponibles:", error);
      }
    }
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

  useEffect(() => {
    if (useCurrentLocation) {
      const fetchLocation = async () => {
        try {
          const response = await fetch(
            "https://ipinfo.io/json?token=85e8e7ad2053f3"
          );
          const data = await response.json();
          const [lng, lat] = data.loc.split(",");
          const currentLocation = {
            lng: parseFloat(lng),
            lat: parseFloat(lat),
          };
          setLocation(currentLocation);
        } catch (error) {
          console.error("Error al obtener ubicación:", error.message);
        }
      };
      fetchLocation();
    }
  }, [useCurrentLocation]);

  const handleSelectEvent = (event) => {
    setSelectedTime(event.start);
    setSelectedHashId(event.hashid);
  };

  const handleWeekChange = (date) => {
    console.log("Nueva semana seleccionada:", date);
    setSelectedDate(date);
    handleDateSelected(date);
  };

  return (
    <Container fluid>
      <h1 className="text-center my-4">Solicita un nuevo turno</h1>
      <hr />
      <h2 className="text-center my-4">Buscar por Rubro y zona</h2>
      <Row className="w-full">
        <Col md={3} className="mb-4">
          <Form.Group>
            <Form.Label>Rubros</Form.Label>
            <Select
                        placeholder="Ingrese un rubro"
                        className="select-rubro"
                        options={rubros}
                        value={selectedRubro}
                        onChange={handleRubroChange}
                        isClearable
                      />
          </Form.Group>
        </Col>

        <Col md={6} className="mb-4">
          <Form.Group>
            <Form.Label>Dirección / Zona</Form.Label>
            <LoadScriptNext
              googleMapsApiKey="AIzaSyAZ6rhipfSVaz-41Jn4vv-MgEDd87n4Zkc"
              libraries={libraries}
            >
              <Autocomplete
                onLoad={(autocomplete) => setAutocomplete(autocomplete)}
                onPlaceChanged={handlePlaceChanged}
              >
                <Form.Control
                  className="select"
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
          <Button variant="secondary" onClick={handleSearch} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Buscar"}
          </Button>
        </Col>
      </Row>
      <hr />
      {companies.length > 0 && (
        <Col md={12} className="mb-4">
          <Card>
            <Card.Body className="card-servicios">
              <Row>
                {/* Columna izquierda: Servicios y Líneas de Atención */}
                <Col md={12} lg={4} className="mb-4">
                  <Form.Group>
                    <Form.Label>
                      <strong>Servicio</strong>
                    </Form.Label>
                    <div className="d-flex">
                      <Form.Control
                        className="select me-1"
                        as="select"
                        onChange={handleCompanyChange}
                      >
                        <option value="">Selecciona un Servicio</option>
                        {companies.map((company) => (
                          <option key={company.id} value={company.id}>
                            {company.datos_fiscales.nombre_fantasia}
                          </option>
                        ))}
                      </Form.Control>
                      {selectedCompany && (
                        <Button
                          variant="secondary"
                          className="w-50 p-0"
                          onClick={() => setShowMapModal(true)}
                        >
                          Ver Mapa
                        </Button>
                      )}
                    </div>
                  </Form.Group>

                  {selectedCompany && (
                    <>
                      <Form.Group className="mt-3">
                        <Form.Label>
                          <strong>Línea de Atención</strong>
                        </Form.Label>
                        <Form.Control
                          className="select"
                          as="select"
                          onChange={(e) => handleLineChange(e, selectedDate)}
                        >
                          <option value="">Selecciona una línea</option>
                          {selectedCompany.lineas_atencion.map((line) => (
                            <option key={line.id} value={line.id}>
                              {line.descripcion}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                      <div className="mt-3">
                        <h5>
                          <strong>Información de la Empresa</strong>
                        </h5>
                        <p>
                          <strong>Dirección:</strong>{" "}
                          {
                            selectedCompany.datos_fiscales.domicilio_fiscal
                              .calle
                          }{" "}
                          {
                            selectedCompany.datos_fiscales.domicilio_fiscal
                              .numero
                          }{" "}
                          -{" "}
                          {
                            selectedCompany.datos_fiscales.domicilio_fiscal
                              .localidad
                          }
                        </p>
                        <p>
                          <strong>Horario de atención:</strong>{" "}
                          {selectedCompany.calendario.hora_apertura} -{" "}
                          {selectedCompany.calendario.hora_cierre}
                        </p>
                      </div>
                    </>
                  )}
                </Col>

                {selectedLine && (
                  <Col md={12} lg={8} className="text-center mb-4">
                    <TurnoCalendar
                      events={events}
                      onSelectEvent={handleSelectEvent}
                      horaApertura={horaApertura}
                      horaCierre={horaCierre}
                      duracionTurnos={duracionTurnos}
                      onWeekChange={handleWeekChange}
                    />
                  </Col>
                )}
              </Row>
              {selectedTime && (
                <div className="text-right">
                  <Button
                    variant="secondary"
                    onClick={handlePreseleccionarTurno}
                  >
                    Seleccionar Turno
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      )}

      <Modal
        show={showNoResultsModal}
        onHide={() => setShowNoResultsModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>No se encontraron servicios cercanos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          No se encontraron servicios cercanos a la dirección seleccionada.
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
            disabled={!selectedTime}
          >
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showMapModal}
        onHide={() => setShowMapModal(false)}
        className="custom-map-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Ubicación del servicio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCompany &&
          selectedCompany.datos_fiscales &&
          selectedCompany.datos_fiscales.domicilio_fiscal ? (
            <MapComponent
              location={{
                lat: selectedCompany.datos_fiscales.domicilio_fiscal.latitud,
                lng: selectedCompany.datos_fiscales.domicilio_fiscal.longitud,
              }}
            />
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