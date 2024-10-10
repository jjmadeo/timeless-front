import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, endOfWeek, getDay } from 'date-fns';
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

const getWeekRange = () => {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 }); // Lunes
  const end = endOfWeek(now, { weekStartsOn: 1 }); // Domingo
  return {
    start: format(start, 'yyyy-MM-dd'),
    end: format(end, 'yyyy-MM-dd')
  };
};

const TurnoCalendar = ({ onSelectEvent, events, horaApertura, horaCierre, duracionTurnos }) => {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [view, setView] = useState('week');

  useEffect(() => {
    setCurrentEvents(events);
  }, [events]);

  const minTime = new Date();
  minTime.setHours(parseInt(horaApertura.split(':')[0]), parseInt(horaApertura.split(':')[1]), 0);

  const maxTime = new Date();
  maxTime.setHours(parseInt(horaCierre.split(':')[0]), parseInt(horaCierre.split(':')[1]), 0);

  const eventTitleAccessor = (event) => event.title;

  return (
    <Container className="my-4">
      <Calendar
        localizer={localizer}
        events={currentEvents}
        startAccessor="start"
        endAccessor="end"
        titleAccessor={eventTitleAccessor}
        style={{ height: 500 }}
        selectable={false} // No permitir seleccionar espacios vacíos
        onSelectEvent={onSelectEvent}
        views={['week']}
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
          week: 'Semana',
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
        }}
        culture="es" 
      />
    </Container>
  );
};

export default TurnoCalendar;