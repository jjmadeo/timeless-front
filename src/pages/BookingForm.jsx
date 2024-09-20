import React, { useState } from 'react';

const BookingForm = ({ selectedPlace, onBookingConfirmed }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleConfirm = () => {
    if (date && time) {
      const bookingDetails = {
        place: selectedPlace,
        date: new Date(`${date}T${time}`), // Combina la fecha y la hora
        time,
      };
      onBookingConfirmed(bookingDetails);
    } else {
      console.error('Por favor, selecciona una fecha y una hora.');
    }
  };

  return (
    <div>
      <h2>Reserva tu turno</h2>
      <div>
        <label>
          Fecha:
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
          />
        </label>
      </div>
      <div>
        <label>
          Hora:
          <input
            type="time"
            value={time}
            onChange={handleTimeChange}
          />
        </label>
      </div>
      <button onClick={handleConfirm}>Confirmar Reserva</button>
      {selectedPlace && (
        <div>
          <h3>Detalles de la Reserva</h3>
          <p>Peluquería: {selectedPlace.name}</p>
          <p>Fecha: {date || 'No seleccionada'}</p>
          <p>Hora: {time || 'No seleccionada'}</p>
        </div>
      )}
    </div>
  );
};

export default BookingForm;