import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

const FormularioEmpresa = ({ empresa, handleNestedChange, handleSubmit }) => {
  return (
    <Form onSubmit={handleSubmit}>
      <h3>Datos Fiscales</h3>
      <Row>
        <Col lg={4} md={6} sm={12}>
          <Form.Group controlId="razon_social">
            <Form.Label>Razón Social</Form.Label>
            <Form.Control
              type="text"
              name="razon_social"
              value={empresa.datos_fiscales.razon_social}
              onChange={(e) => handleNestedChange(e, "datos_fiscales")}
            />
          </Form.Group>
        </Col>
        <Col lg={4} md={6} sm={12}>
          <Form.Group controlId="nombre_fantasia">
            <Form.Label>Nombre de Fantasía</Form.Label>
            <Form.Control
              type="text"
              name="nombre_fantasia"
              value={empresa.datos_fiscales.nombre_fantasia}
              onChange={(e) => handleNestedChange(e, "datos_fiscales")}
            />
          </Form.Group>
        </Col>
        <Col lg={4} md={6} sm={12}>
          <Form.Group controlId="cuit">
            <Form.Label>CUIT</Form.Label>
            <Form.Control
              type="text"
              name="cuit"
              value={empresa.datos_fiscales.cuit}
              onChange={(e) => handleNestedChange(e, "datos_fiscales")}
            />
          </Form.Group>
        </Col>
      </Row>
      <h4 className="mt-4">Domicilio Fiscal</h4>
      {empresa.datos_fiscales.domicilio_fiscal && (
        <>
          <Row>
            <Col lg={4} md={6} sm={12}>
              <Form.Group controlId="calle">
                <Form.Label>Calle</Form.Label>
                <Form.Control
                  type="text"
                  name="calle"
                  value={empresa.datos_fiscales.domicilio_fiscal.calle}
                  onChange={(e) =>
                    handleNestedChange(e, "datos_fiscales", "domicilio_fiscal")
                  }
                />
              </Form.Group>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Form.Group controlId="numero">
                <Form.Label>Número</Form.Label>
                <Form.Control
                  type="text"
                  name="numero"
                  value={empresa.datos_fiscales.domicilio_fiscal.numero}
                  onChange={(e) =>
                    handleNestedChange(e, "datos_fiscales", "domicilio_fiscal")
                  }
                />
              </Form.Group>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Form.Group controlId="ciudad">
                <Form.Label>Ciudad</Form.Label>
                <Form.Control
                  type="text"
                  name="ciudad"
                  value={empresa.datos_fiscales.domicilio_fiscal.ciudad}
                  onChange={(e) =>
                    handleNestedChange(e, "datos_fiscales", "domicilio_fiscal")
                  }
                />
              </Form.Group>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Form.Group controlId="localidad">
                <Form.Label>Localidad</Form.Label>
                <Form.Control
                  type="text"
                  name="localidad"
                  value={empresa.datos_fiscales.domicilio_fiscal.localidad}
                  onChange={(e) =>
                    handleNestedChange(e, "datos_fiscales", "domicilio_fiscal")
                  }
                />
              </Form.Group>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Form.Group controlId="provincia">
                <Form.Label>Provincia</Form.Label>
                <Form.Control
                  type="text"
                  name="provincia"
                  value={empresa.datos_fiscales.domicilio_fiscal.provincia}
                  onChange={(e) =>
                    handleNestedChange(e, "datos_fiscales", "domicilio_fiscal")
                  }
                />
              </Form.Group>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Form.Group controlId="pais">
                <Form.Label>País</Form.Label>
                <Form.Control
                  type="text"
                  name="pais"
                  value={empresa.datos_fiscales.domicilio_fiscal.pais}
                  onChange={(e) =>
                    handleNestedChange(e, "datos_fiscales", "domicilio_fiscal")
                  }
                />
              </Form.Group>
            </Col>
          </Row>
        </>
      )}
      <Button variant="primary" type="submit" className="btn-save mt-4">
        Guardar Cambios
      </Button>
    </Form>
  );
};

export default FormularioEmpresa;