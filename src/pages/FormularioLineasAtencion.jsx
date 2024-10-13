import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import Select from "react-select"; // Asegúrate de importar el componente Select

const FormularioLineasAtencion = ({
  empresa,
  handleChangeLineaAtencion,
  handleAddLineaAtencion,
  handleRemoveLineaAtencion,
  handleSubmit,
  handleRubroChange, // Añadir el manejador para el cambio de rubro
  rubros, // Añadir las opciones de rubro
  selectedRubro, // Añadir el valor seleccionado del rubro
}) => {
  return (
    <Form onSubmit={handleSubmit}>
      <h3>Líneas de Atención</h3>
      {empresa.lineas_atencion.map((linea, index) => (
        <Row key={index} className="item-container">
          <Col md={6}>
            <Form.Group controlId={`descripcion-${index}`}>
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                name="descripcion"
                value={linea.descripcion}
                data-index={index}
                onChange={(e) =>
                  handleChangeLineaAtencion(
                    e,
                    "lineas_atencion",
                    index,
                    "descripcion"
                  )
                }
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId={`duracion_turnos-${index}`}>
              <Form.Label>Duración de Turnos</Form.Label>
              <Form.Control
                type="text"
                name="duracion_turnos"
                value={linea.duracion_turnos}
                data-index={index}
                onChange={(e) =>
                  handleChangeLineaAtencion(
                    e,
                    "lineas_atencion",
                    index,
                    "duracion_turnos"
                  )
                }
              />
            </Form.Group>
          </Col>
          <Col md={12} className="text-right">
            <Button
              variant="danger"
              className="btn-quitar"
              onClick={() => handleRemoveLineaAtencion(index)}
            >
              Quitar
            </Button>
          </Col>
        </Row>
      ))}
      <Button variant="secondary" onClick={handleAddLineaAtencion}>
        Agregar Línea de Atención
      </Button>
      {/*<Form.Group controlId="rubro" className="mt-4">
        <Form.Label>Rubro</Form.Label>
        <Select
          className="select-rubro"
          placeholder="Seleccione un rubro"
          options={rubros}
          value={selectedRubro}
          onChange={handleRubroChange} // Cambia aquí a handleRubroChange
          isClearable
        />
      </Form.Group>*/}
      <Button variant="primary" type="submit" className="btn-save mt-4">
        Guardar Cambios
      </Button>
    </Form>
  );
};

export default FormularioLineasAtencion;
