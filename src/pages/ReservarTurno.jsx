import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroup, Button, Alert, Modal, Spinner, Card } from 'react-bootstrap';
import MapComponent from '../components/Map/Map';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const mockCompanies = [
  {
    id: 1,
    name: 'Empresa A',
    location: { lat: -34.6911, lng: -58.5638 },
    lines: [
      { id: 1, name: 'Linea 1', schedule: { Monday: ['09:00 AM', '10:00 AM', '11:00 AM'], Tuesday: ['01:00 PM', '02:00 PM', '03:00 PM'], Wednesday: [], Thursday: ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM'], Friday: ['02:00 PM', '03:00 PM'], Saturday: ['09:00 AM', '10:00 AM'], Sunday: [] } },
      { id: 2, name: 'Linea 2', schedule: { Monday: ['01:00 PM', '02:00 PM'], Tuesday: ['09:00 AM', '10:00 AM'], Wednesday: ['11:00 AM'], Thursday: ['02:00 PM', '03:00 PM'], Friday: ['09:00 AM', '10:00 AM'], Saturday: [], Sunday: [] } },
    ],
  },
  {
    id: 2,
    name: 'Empresa B',
    location: { lat: -34.6711, lng: -58.5638 },
    lines: [
      { id: 1, name: 'Linea 1', schedule: { Monday: ['09:00 AM', '10:00 AM'], Tuesday: ['01:00 PM', '02:00 PM'], Wednesday: [], Thursday: ['09:00 AM', '10:00 AM'], Friday: ['02:00 PM', '03:00 PM'], Saturday: ['09:00 AM'], Sunday: [] } },
    ],
  },
];

const ReservarTurno = () => {
  const [location, setLocation] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [events, setEvents] = useState([]);
  const [showNoTimesModal, setShowNoTimesModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // Llamada a ipinfo.io con tu token
        const response = await fetch('https://ipinfo.io/json?token=85e8e7ad2053f3');
        const data = await response.json();
        const [lat, lng] = data.loc.split(','); // 'loc' devuelve una cadena con latitud y longitud separada por comas
        const currentLocation = {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        };
        console.log('Ubicación obtenida:', currentLocation);
        setLocation(currentLocation);
        fetchCompanies(parseFloat(lat), parseFloat(lng));
      } catch (error) {
        console.error('Error al obtener ubicación:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  const fetchCompanies = (lat, lng) => {
    // Mock fetching companies based on location
    setCompanies(mockCompanies);
  };

  const handleCompanySelected = (company) => {
    setSelectedCompany(company);
    setSelectedLine(null);
    setSelectedDate(null);
    setAvailableTimes([]);
    setSelectedTime(null);
    setLocation(company.location); 
  };

  const handleLineSelected = (line) => {
    setSelectedLine(line);
    setSelectedDate(null);
    setAvailableTimes([]);
    setSelectedTime(null);
  };

  const handleDateSelected = (date) => {
    setSelectedDate(date);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const times = selectedLine.schedule[dayOfWeek] || [];
    if (times.length === 0) {
      setShowNoTimesModal(true);
    } else {
      setAvailableTimes(times);
    }
  };

  const handleTimeSelected = (time) => {
    setSelectedTime(time);
  };

  const handleBookingConfirmed = () => {
    const details = {
      company: selectedCompany,
      line: selectedLine,
      date: selectedDate,
      time: selectedTime,
    };
    // Mock confirming the booking
    setBookingDetails(details);

    const newEvent = {
      title: `Reserva en ${details.company.name} - ${details.line.name}`,
      start: new Date(details.date),
      end: new Date(new Date(details.date).setMinutes(details.date.getMinutes() + 30)),
      allDay: false,
    };

    setEvents([...events, newEvent]);
    setShowConfirmModal(false);
  };

  return (
    <Container fluid>
      <h1 className="text-center my-4">Reserva tu Turno</h1>
      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status">
            <span className="sr-only">Cargando...</span>
          </Spinner>
        </div>
      ) : location ? (
        <>

          <Row>
            <Col md={12} className="mb-4">
              <MapComponent location={location} />
            </Col>
          </Row>
          {bookingDetails && (
            <Alert variant="success" className="mt-3">
              <h3>Reserva Confirmada</h3>
              <p>Empresa: {bookingDetails.company.name}</p>
              <p>Linea: {bookingDetails.line.name}</p>
              <p>Fecha: {new Date(bookingDetails.date).toLocaleDateString()}</p>
              <p>Hora: {bookingDetails.time}</p>
            </Alert>
          )}
          <Row className="w-full">
            <Col md={3} className="mb-4">
              <Card>
                <Card.Header as="h2">Empresas Cercanas</Card.Header>
                <ListGroup variant="flush">
                  {companies.map((company) => (
                    <ListGroup.Item
                      key={company.id}
                      onClick={() => handleCompanySelected(company)}
                      active={selectedCompany && selectedCompany.id === company.id}
                      action
                    >
                      {company.name}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            </Col>
            <Col md={3} className="mb-4">
              {selectedCompany && (
                <Card>
                  <Card.Header as="h3">Selecciona una Linea de Atención</Card.Header>
                  <ListGroup variant="flush">
                    {selectedCompany.lines.map((line) => (
                      <ListGroup.Item
                        key={line.id}
                        onClick={() => handleLineSelected(line)}
                        active={selectedLine && selectedLine.id === line.id}
                        action
                      >
                        {line.name}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card>
              )}
            </Col>
            <Col md={3} className="mb-4">
              {selectedLine && (
                <Card>
                  <Card.Header as="h3">Selecciona una Fecha</Card.Header>
                  <Card.Body>
                    <DatePicker selected={selectedDate} onChange={handleDateSelected} inline />
                  </Card.Body>
                </Card>
              )}
            </Col>
            <Col md={3} className="mb-4">
              {selectedDate && availableTimes.length > 0 && (
                <Card>
                  <Card.Header as="h4">Horarios Disponibles</Card.Header>
                  <ListGroup variant="flush">
                    {availableTimes.map((time) => (
                      <ListGroup.Item
                        key={time}
                        onClick={() => handleTimeSelected(time)}
                        active={selectedTime === time}
                        action
                      >
                        {time}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card>
              )}
            </Col>
          </Row>
          <Row className="justify-content-center m-4">
            {selectedTime && (
              <div className="text-center">
                <Button variant="secondary" onClick={() => setShowConfirmModal(true)} className="mt-3">
                  Seleccionar Turno
                </Button>
              </div>
            )}
          </Row>


        </>
      ) : (
        <p>Obteniendo ubicación...</p>
      )}

      <Modal show={showNoTimesModal} onHide={() => setShowNoTimesModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sin Horarios Disponibles</Modal.Title>
        </Modal.Header>
        <Modal.Body>No hay horarios disponibles para la fecha seleccionada.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNoTimesModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Turno</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Desea confirmar su turno?</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowConfirmModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="secondary"
            onClick={handleBookingConfirmed}
            disabled={!selectedDate || !selectedTime}
          >
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ReservarTurno;