import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { format } from 'date-fns';

const AdminPanel = () => {
  const [appointments, setAppointments] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
  });
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      console.error('Error al obtener los turnos:', err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    setError(null);

    const { title, date, startTime, endTime } = newAppointment;
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    if (start >= end) {
      setError('La hora de inicio debe ser antes de la hora de fin.');
      return;
    }

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, start, end }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el turno.');
      }

      setShowAddModal(false);
      setNewAppointment({ title: '', date: '', startTime: '', endTime: '' });
      fetchAppointments();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAppointment = async (id) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el turno.');
      }

      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Gestionar Turnos</h2>
      <Button variant="primary" onClick={() => setShowAddModal(true)}>
        Agregar Turno
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Título</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.title}</td>
              <td>{format(new Date(appointment.start), 'Pp')}</td>
              <td>{format(new Date(appointment.end), 'Pp')}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteAppointment(appointment.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para agregar turno */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nuevo Turno</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleAddAppointment}>
            <Form.Group controlId="formTitle">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese un título"
                value={newAppointment.title}
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, title: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group controlId="formDate" className="mt-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={newAppointment.date}
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, date: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group controlId="formStartTime" className="mt-3">
              <Form.Label>Hora de Inicio</Form.Label>
              <Form.Control
                type="time"
                value={newAppointment.startTime}
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, startTime: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group controlId="formEndTime" className="mt-3">
              <Form.Label>Hora de Fin</Form.Label>
              <Form.Control
                type="time"
                value={newAppointment.endTime}
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, endTime: e.target.value })
                }
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-4">
              Agregar Turno
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminPanel;