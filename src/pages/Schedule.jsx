import { useState, useEffect } from 'react';
import AppCalendar from '../components/Calendar/Calendar';
import { Modal, Dropdown, Button, Toast, ToastContainer, Card } from 'react-bootstrap';
import { parseISO, isBefore, isToday } from 'date-fns';
import { getTurnosByLineaId, getEmpresaById, postCancelarTurnoUsuario } from "../helpers/fetch";
import { useAuth } from '../lib/authProvider';
import { useNavigate } from 'react-router-dom';

const Schedule = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedAgenda, setSelectedAgenda] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showConfirmCancelModal, setShowConfirmCancelModal] = useState(false);
  const [empresaId, setEmpresaId] = useState(null);
  const [eventsByAgenda, setEventsByAgenda] = useState({});
  const [agendas, setAgendas] = useState([]);
  const [horaApertura, setHoraApertura] = useState('09:00');
  const [horaCierre, setHoraCierre] = useState('18:00');
  const [duracionTurnos, setDuracionTurnos] = useState(30); // Valor por defecto
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!auth.user || auth.user.ROL !== "[ROLE_EMPRESA]") {
        navigate("/login");
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [auth, navigate]);

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
            title: `${event.usuario_turno_owner.nombre} ${event.usuario_turno_owner.apellido}`,
            details: `${event.usuario_turno_owner.nombre} ${event.usuario_turno_owner.apellido} - ${event.usuario_turno_owner.email} - ${event.usuario_turno_owner.telefono}`,
            start: parseISO(event.fecha_hora),
            end: parseISO(event.fechafin),
            color: '#ff9999', // Rojo suave
            hashid: event.hashid,
            ...event.usuario_turno_owner,
          })),
          ...res.hoy.map(event => {
            const start = parseISO(event.fecha_hora);
            const end =  parseISO(event.fechafin);
            const color = isBefore(end, now) ? '#ff9999' : '#99ccff'; // Rojo suave para pasados, azul suave para futuros
            return {
              title: `${event.usuario_turno_owner.nombre} ${event.usuario_turno_owner.apellido}`,
              details: `${event.usuario_turno_owner.nombre} ${event.usuario_turno_owner.apellido} - ${event.usuario_turno_owner.email} - ${event.usuario_turno_owner.telefono}`,
              start,
              end,
              color,
              hashid: event.hashid,
              ...event.usuario_turno_owner,
            };
          }),
          ...res.futuros.map(event => ({
            title: `${event.usuario_turno_owner.nombre} ${event.usuario_turno_owner.apellido}`,
            details: `${event.usuario_turno_owner.nombre} ${event.usuario_turno_owner.apellido} - ${event.usuario_turno_owner.email} - ${event.usuario_turno_owner.telefono}`,
            start: parseISO(event.fecha_hora),
            end: parseISO(event.fechafin),
            color: '#99cc99', // Verde suave
            hashid: event.hashid,
            ...event.usuario_turno_owner,
          })),
        ],
      };

      setEventsByAgenda(events);
      setDuracionTurnos(parseInt(linea.duracion_turnos)); // Actualiza la duración de los turnos
    };

    fetchData();
  }, [selectedAgenda, auth]);

  const handleSelectSlot = (slotInfo) => {
    //setSelectedSlot(slotInfo);
    //setShowModal(true);
  };

  const handleSelectEvent = (event) => {
    if (event.hashid) {

      setSelectedEvent(event);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSlot(null);
    setSelectedEvent(null);
  };

  const handleSelectAgenda = (agenda) => {
    setSelectedAgenda(agenda);
  };

  const handleCancelTurno = () => {
    setShowConfirmCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token")).token;

      // Cancelar turno con la API usando el hashid del evento seleccionado
      const response = await postCancelarTurnoUsuario(selectedEvent.hashid, token);

      if (response.error == null) {
        console.log("Turno cancelado:", response);
        setToastMessage(response.mensaje);
        setToastType("success");
        setShowToast(true);
        const updatedEvents = eventsByAgenda[selectedAgenda].filter(event => event.hashid !== selectedEvent.hashid);
        setEventsByAgenda({ ...eventsByAgenda, [selectedAgenda]: updatedEvents });
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
    handleCloseModal();
  };

  return (
    <div>
      {agendas.length === 0 ? (
        <Card className="text-center">
          <Card.Body>
            <Card.Title>No tienes agendas</Card.Title>
            <Card.Text>
              Para poder ver tus agendas, primero tienes que crear una empresa.
            </Card.Text>
            <Button variant="secondary" onClick={() => navigate("/crearEmpresa")}>
              Crear Empresa
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          <h1>Estas son tus agendas</h1>
          
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
            onSelectEvent={handleSelectEvent} 
            horaApertura={horaApertura} 
            horaCierre={horaCierre} 
            duracionTurnos={duracionTurnos} 
          />

          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Información del Turno</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedEvent ? (
                <div>
                  <p><strong>Nombre:</strong> {selectedEvent.nombre}</p>
                  <p><strong>Apellido:</strong> {selectedEvent.apellido}</p>
                  <p><strong>Teléfono:</strong> {selectedEvent.telefono}</p>
                  <p><strong>Correo:</strong> {selectedEvent.email}</p>
                  {(isToday(selectedEvent.start) || isBefore(new Date(), selectedEvent.start)) && (
                    <Button variant="danger" onClick={handleCancelTurno}>Cancelar Turno</Button>
                  )}
                </div>
              ) : (
                null
              )}
            </Modal.Body>
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

          <ToastContainer position="bottom-end" className="p-3 text-white">
            <Toast
              bg={toastType === "success" ? "success" : "danger"}
              onClose={() => setShowToast(false)}
              show={showToast}
              delay={3000}
              autohide
            >
              <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
          </ToastContainer>
        </>
      )}
    </div>
  );
};

export default Schedule;