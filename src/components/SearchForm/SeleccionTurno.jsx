import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Row, Card, ListGroup, Modal, Toast, ToastContainer } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getTurnosDisponibles, postPreseleccionarTurno, postConfirmarTurno } from "../../helpers/fetch";
import { getWeekRange } from '../../helpers/dateUtils';

const SeleccionTurno = ({ companies }) => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedHashid, setSelectedHashId] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [error, setError] = useState(false);

  const handleCompanyChange = (e) => {
    const selectedCompanyId = parseInt(e.target.value, 10);
    const company = companies.find(company => company.id === selectedCompanyId);
    setSelectedCompany(company);
    setSelectedLine(null);
  };

  const handleLineChange = (e) => {
    const selectedLineId = parseInt(e.target.value, 10);
    const line = selectedCompany.lineas_atencion.find(line => line.id === selectedLineId);
    setSelectedLine(line);
  };

  const handleDateSelected = async (date) => {
    setSelectedDate(date);
    if (selectedLine) {
      const { start, end } = getWeekRange(date);
      try {
        const turnos = await getTurnosDisponibles(selectedCompany.id, start, end);
        const formattedTurnos = turnos.map(turno => ({
          hora: turno.fecha_hora,
          hashid: turno.hashid
        }));
        setAvailableTimes(formattedTurnos);
      } catch (error) {
        console.error("Error al obtener turnos disponibles:", error);
      }
    }
  };

  const handleTimeSelected = (time, hashid) => {
    setSelectedTime(time);
    setSelectedHashId(hashid);
    setShowConfirmModal(true);
  };

  const handlePreseleccionarTurno = async () => {
    try {
      const payload = { hashid: selectedHashid };
      await postPreseleccionarTurno(payload);
      setToastMessage("Turno preseleccionado con éxito");
      setShowToast(true);
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Error al preseleccionar turno:", error);
      setToastMessage("Error al preseleccionar turno");
      setShowToast(true);
    }
  };

  const handleConfirmarTurno = async () => {
    try {
      const payload = { hashid: selectedHashid };
      await postConfirmarTurno(payload);
      setToastMessage("Turno confirmado con éxito");
      setShowToast(true);
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Error al confirmar turno:", error);
      setToastMessage("Error al confirmar turno");
      setShowToast(true);
    }
  };

  return (
    <div>
      {companies.length > 0 && (
        <Col md={12} className="mb-4">
          <Card>
            <Card.Body className="card-servicios">
              <Row>
                <Col md={12} lg={5} className="mb-4">
                  <Form.Group>
                    <Form.Label>Servicio</Form.Label>
                    <Form.Control
                      className="select"
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
                  </Form.Group>

                  {selectedCompany && (
                    <Form.Group className="mt-3">
                      <Form.Label>Línea de Atención</Form.Label>
                      <Form.Control
                        className="select"
                        as="select"
                        onChange={handleLineChange}
                      >
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

                <Col md={12} lg={4} className="text-center mb-4">
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateSelected}
                    inline
                    locale="es"
                    minDate={new Date()}
                  />
                </Col>

                <Col md={12} lg={3}>
                  <h5>Horarios Disponibles</h5>
                  <ListGroup
                    variant="flush"
                    style={{ maxHeight: "200px", overflowY: "auto" }}
                  >
                    {availableTimes.map((turno) => (
                      <ListGroup.Item
                        key={turno.hora}
                        onClick={() => handleTimeSelected(turno.hora, turno.hashid)}
                        active={selectedTime === turno.hora}
                        action
                      >
                        {turno.hora}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Col>
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

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Turno</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro de que desea preseleccionar este turno?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmarTurno}>
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
    </div>
  );
};

export default SeleccionTurno;