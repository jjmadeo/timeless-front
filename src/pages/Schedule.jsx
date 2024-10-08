import { useState, useEffect } from 'react';
import AppCalendar from '../components/Calendar/Calendar';
import { Modal, Dropdown } from 'react-bootstrap';
import AppForm from '../components/Forms/Form';
import { parseISO, isBefore } from 'date-fns';
import { getTurnosByLineaId, getEmpresaById } from "../helpers/fetch";
import { useAuth } from '../lib/authProvider';

const Schedule = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedAgenda, setSelectedAgenda] = useState('');
  const [empresaId, setEmpresaId] = useState(null);
  const [eventsByAgenda, setEventsByAgenda] = useState({});
  const [agendas, setAgendas] = useState([]);
  const [horaApertura, setHoraApertura] = useState('09:00');
  const [horaCierre, setHoraCierre] = useState('18:00');
  const [duracionTurnos, setDuracionTurnos] = useState(30); // Valor por defecto
  const auth = useAuth();

  useEffect(() => {
    if (auth.userProfile) {
      const fetchEmpresaData = async () => {
        const token = JSON.parse(localStorage.getItem("token")).token;
        const empresa = await getEmpresaById(auth.userProfile.id_empresa, token);
        setEmpresaId(empresa.id);
        const lineasAtencion = empresa.lineas_atencion.map(linea => linea.descripcion);
        setAgendas(lineasAtencion);
        setSelectedAgenda(lineasAtencion[0]);
        setHoraApertura(empresa.calendario.hora_apertura);
        setHoraCierre(empresa.calendario.hora_cierre);
      };
      fetchEmpresaData();
    }
  }, [auth]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedAgenda) return;

      const token = JSON.parse(localStorage.getItem("token")).token;
      const empresa = await getEmpresaById(auth.userProfile.id_empresa, token);
      const linea = empresa.lineas_atencion.find(linea => linea.descripcion === selectedAgenda);
      const res = await getTurnosByLineaId(linea.id, token);

      const now = new Date();
      const events = {
        [selectedAgenda]: [
          ...res.pasados.map(event => ({
            title: event.mensaje,
            start: parseISO(event.fecha_hora),
            end: new Date(parseISO(event.fecha_hora).getTime() + event.duracion * 60000),
            color: '#ff9999', // Rojo suave
          })),
          ...res.hoy.map(event => {
            const start = parseISO(event.fecha_hora);
            const end = new Date(start.getTime() + event.duracion * 60000);
            const color = isBefore(end, now) ? '#ff9999' : '#99ccff'; // Rojo suave para pasados, azul suave para futuros
            return {
              title: event.mensaje,
              start,
              end,
              color,
            };
          }),
          ...res.futuros.map(event => ({
            title: event.mensaje,
            start: parseISO(event.fecha_hora),
            end: new Date(parseISO(event.fecha_hora).getTime() + event.duracion * 60000),
            color: '#99cc99', // Verde suave
          })),
        ],
      };

      setEventsByAgenda(events);
      setDuracionTurnos(parseInt(linea.duracion_turnos)); // Actualiza la duración de los turnos
    };

    fetchData();
  }, [selectedAgenda, auth]);

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

      <AppCalendar 
        events={eventsByAgenda[selectedAgenda]} 
        onSelectSlot={handleSelectSlot} 
        horaApertura={horaApertura} 
        horaCierre={horaCierre} 
        duracionTurnos={duracionTurnos} 
      />

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