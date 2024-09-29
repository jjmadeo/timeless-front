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

const AppCalendar = ({ onSelectSlot, events }) => {
  const [currentEvents, setCurrentEvents] = useState([]);

  useEffect(() => {
    setCurrentEvents(events);
  }, [events]);

  const handleSelectSlot = (slotInfo) => {
    const { start, end } = slotInfo;
    onSelectSlot({ start, end });
  };

  return (
    <Container className="my-4">
      <Calendar
        localizer={localizer}
        events={currentEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={event => alert(`Turno reservado:\n${event.title}`)}
        views={['week', 'day', 'agenda']} 
        defaultView="week"
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
        formats={{
          dayFormat: (date, culture, localizer) => localizer.format(date, 'EEEE', culture), // Nombre completo del día en español
          weekdayFormat: (date, culture, localizer) => localizer.format(date, 'EEE', culture), // Nombre abreviado del día en español
          monthHeaderFormat: (date, culture, localizer) => localizer.format(date, 'MMMM yyyy', culture), // Mes y año en español
          dayHeaderFormat: (date, culture, localizer) => localizer.format(date, 'EEEE, MMMM d', culture), // Día, mes y día del mes en español
          agendaDateFormat: (date, culture, localizer) => localizer.format(date, 'EEEE, d MMMM', culture), // Fecha en la vista de agenda
        }}
        culture="es" 
      />
    </Container>
  );
};

export default AppCalendar;