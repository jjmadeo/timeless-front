import React, { useState } from 'react';
//import MapComponent from '../components/Map/Map';
//import BookingForm from '../pages/BookingForm';
import AppCalendar from '../components/Calendar/Calendar';

const ReservarTurno = () => {
  {/* 
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [events, setEvents] = useState([]);

  const handlePlaceSelected = (place) => {
    setSelectedPlace(place);
  };

  const handleBookingConfirmed = (details) => {
    setBookingDetails(details);
    
    const newEvent = {
      title: `Reserva en ${details.place.name}`,
      start: new Date(details.date),
      end: new Date(new Date(details.date).setMinutes(details.date.getMinutes() + 30)), // Ajusta la duración del evento
      allDay: false,
    };
    
    setEvents([...events, newEvent]); // Añade el nuevo evento al estado
    console.log("Reserva confirmada:", details);
  };

  const handleSelectSlot = (slotInfo) => {
    const start = slotInfo.start;
    // Puedes manejar la selección del slot aquí si es necesario
    console.log('Slot seleccionado:', start);
  };
  */}

  return (
    <div>
      <h1>Reserva tu Turno</h1>
      {/*<MapComponent onPlaceSelected={handlePlaceSelected} />
      
      {selectedPlace && (
        <BookingForm
          selectedPlace={selectedPlace}
          onBookingConfirmed={handleBookingConfirmed}
        />
      )}
      
      <AppCalendar
        events={events}
        onSelectSlot={handleSelectSlot}
      />
      
      {bookingDetails && (
        <div>
          <h3>Reserva Confirmada</h3>
          <p>Peluquería: {bookingDetails.place.name}</p>
          <p>Fecha: {bookingDetails.date.toLocaleDateString()}</p>
          <p>Hora: {bookingDetails.time}</p>
        </div>
      )}
      */}
    </div>
  );
};

export default ReservarTurno;