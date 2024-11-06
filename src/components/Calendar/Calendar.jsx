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

const AppCalendar = ({ onSelectSlot, onSelectEvent, events, horaApertura, horaCierre, duracionTurnos }) => {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [view, setView] = useState('week');

  useEffect(() => {
    setCurrentEvents(events);
  }, [events]);

  const handleSelectSlot = (slotInfo) => {
    const { start, end } = slotInfo;
    onSelectSlot({ start, end });
  };

  const minTime = new Date();
  minTime.setHours(parseInt(horaApertura.split(':')[0]), parseInt(horaApertura.split(':')[1]), 0);

  const maxTime = new Date();
  maxTime.setHours(parseInt(horaCierre.split(':')[0]), parseInt(horaCierre.split(':')[1]), 0);

  const eventTitleAccessor = (event) => {
    if (view === 'week' ) {
      return event.title;
    } else {
      return event.details;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setView('day');
      } else {
        setView('week');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Llamar a la función una vez para establecer la vista inicial

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Container className="my-4">
      <Calendar
        localizer={localizer}
        events={currentEvents}
        startAccessor="start"
        endAccessor="end"
        titleAccessor={eventTitleAccessor} // Utiliza el campo "title" o "details" según la vista
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={onSelectEvent}
        views={['week', 'day', 'agenda']} 
        defaultView={view}
        onView={(newView) => setView(newView)}
        step={duracionTurnos} // Duración de los turnos en minutos
        timeslots={1} // Número de divisiones por cada "step"
        min={minTime}
        max={maxTime}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.color,
          },
        })}
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
          eventTimeRangeFormat: () => '', // No mostrar la hora en el título del evento
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