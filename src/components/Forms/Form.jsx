/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import './Form.scss';

const AppForm = ({ slotInfo, onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const appointment = {
      name,
      email,
      phone,
      start: slotInfo.start,
      end: slotInfo.end,
    };

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment),
      });

      if (!response.ok) {
        throw new Error('Error al reservar el turno');
      }

      // Si la reserva es exitosa
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group controlId="formName">
        <Form.Label>Nombre Completo</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingresa tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="formEmail" className="mt-3">
        <Form.Label>Correo Electrónico</Form.Label>
        <Form.Control
          type="email"
          placeholder="Ingresa tu correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="formPhone" className="mt-3">
        <Form.Label>Teléfono</Form.Label>
        <Form.Control
          type="tel"
          placeholder="Ingresa tu número de teléfono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </Form.Group>

      <div className="mt-4">
        <Button className='btn-custom' type="submit" disabled={loading}>
          {loading ? 'Reservando...' : 'Reservar Turno'}
        </Button>
      </div>
    </Form>
  );
};

export default AppForm;