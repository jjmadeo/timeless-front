import { useState } from 'react';
import AppCalendar from '../components/Calendar/Calendar';
import { Modal, Dropdown } from 'react-bootstrap';
import AppForm from '../components/Forms/Form';
import { addDays, setHours, setMinutes } from 'date-fns';

const Schedule = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedAgenda, setSelectedAgenda] = useState('Estilista 1');

  const agendas = ['Estilista 1', 'Estilista 2'];

  const baseDate = new Date(2024, 8, 1, 10, 0);

  const eventsByAgenda = {
    'Estilista 1': [
      { title: 'Turno Reservado', start: new Date(), end: new Date() },
    ],
    'Estilista 2': [
      {
      title: 'Turno Reservado',
      start: setMinutes(setHours(addDays(baseDate, 5), 14), 30), 
      end: setMinutes(setHours(addDays(baseDate, 5), 15), 0),
      }
    ],
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSlot(null);
  };

  const handleSelectAgenda = (agenda) => {
    setSelectedAgenda(agenda);
  };

  return (
    <div>
      <h1>Reserva tu Turno</h1>
      
      <Dropdown onSelect={handleSelectAgenda}>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {selectedAgenda}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {agendas.map((agenda, index) => (
            <Dropdown.Item key={index} eventKey={agenda}>
              {agenda}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      <AppCalendar events={eventsByAgenda[selectedAgenda]} onSelectSlot={handleSelectSlot} />

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Reservar Turno</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AppForm slotInfo={selectedSlot} onSuccess={handleCloseModal} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Schedule;