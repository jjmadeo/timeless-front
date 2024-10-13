import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

const FormularioCalendario = ({
  empresa,
  handleDateChange,
  handleToggleDiaLaboral,
  handleAddAusencia,
  handleRemoveAusencia,
  handleSubmit,
}) => {
  const diasSemana = {
    Lunes: 1,
    Martes: 2,
    Miércoles: 3,
    Jueves: 4,
    Viernes: 5,
    Sábado: 6,
    Domingo: 7,
  };

  const diasLaborales = Array.isArray(empresa.calendario.dias_laborales)
    ? empresa.calendario.dias_laborales
    : [];

  return (
    <Form onSubmit={handleSubmit}>
      <h3>Calendario</h3>
      <Row>
        <Col md={6}>
          <Form.Group controlId="hora_apertura">
            <Form.Label>Hora de Apertura</Form.Label>
            <Form.Control
              type="time"
              name="hora_apertura"
              value={empresa.calendario.hora_apertura}
              onChange={(e) => handleDateChange(e, "calendario")}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="hora_cierre">
            <Form.Label>Hora de Cierre</Form.Label>
            <Form.Control
              type="time"
              name="hora_cierre"
              value={empresa.calendario.hora_cierre}
              onChange={(e) => handleDateChange(e, "calendario")}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Form.Group controlId="dias_laborales">
            <Form.Label>Días Laborales</Form.Label>
            <div className="dias-laborales-container">
              {Object.keys(diasSemana).map((dia) => (
                <Form.Check
                  inline
                  key={dia}
                  type="checkbox"
                  label={dia}
                  value={diasSemana[dia]}
                  checked={diasLaborales.includes(diasSemana[dia])}
                  onChange={(e) =>
                    handleToggleDiaLaboral(Number(e.target.value))
                  }
                />
              ))}
            </div>
          </Form.Group>
        </Col>
      </Row>
      <h3>Ausencias</h3>
      {empresa.calendario.ausencias.map((ausencia, index) => (
        <Row key={index} className="item-container">
          <Col md={4}>
            <Form.Group controlId={`desde-${index}`}>
              <Form.Label>Desde</Form.Label>
              <Form.Control
                type="date"
                name="desde"
                value={ausencia.desde}
                onChange={(e) =>
                  handleDateChange(e, "calendario", index, "desde")
                }
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId={`hasta-${index}`}>
              <Form.Label>Hasta</Form.Label>
              <Form.Control
                type="date"
                name="hasta"
                value={ausencia.hasta}
                onChange={(e) =>
                  handleDateChange(e, "calendario", index, "hasta")
                }
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId={`descripcion-${index}`}>
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                name="descripcion"
                value={ausencia.descripcion}
                onChange={(e) =>
                  handleDateChange(e, "calendario", index, "descripcion")
                }
              />
            </Form.Group>
          </Col>
          <Col md={12} className="text-right">
            <Button
              variant="danger"
              className="btn-quitar"
              onClick={() => handleRemoveAusencia(index)}
            >
              Quitar
            </Button>
          </Col>
        </Row>
      ))}
      <Button variant="secondary" onClick={handleAddAusencia}>
        Agregar Ausencia
      </Button>
      <Button variant="primary" type="submit" className="btn-save mt-4">
        Guardar Cambios
      </Button>
    </Form>
  );
};

export default FormularioCalendario;
