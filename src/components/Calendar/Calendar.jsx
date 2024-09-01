import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import esES from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.scss';
import { Container } from 'react-bootstrap';

const locales = {
  'es': esES,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

// eslint-disable-next-line react/prop-types
const AppCalendar = ({ onSelectSlot, events }) => {
  const [currentEvents, setCurrentEvents] = useState([]);

  useEffect(() => {
    setCurrentEvents(events);
  }, [events]);

  return (
    <Container className="my-4">
      <Calendar
        localizer={localizer}
        events={currentEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={onSelectSlot}
        onSelectEvent={event => alert(`Turno reservado:\n${event.title}`)}
        messages={{
          next: 'Sig.',
          previous: 'Ant.',
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          agenda: 'Agenda',
          date: 'Fecha',
          time: 'Hora',
          event: 'Evento',
          noEventsInRange: 'No hay eventos en este rango.',
          showMore: total => `+ Ver más (${total})`
        }}
      />
    </Container>
  );
};

export default AppCalendar;