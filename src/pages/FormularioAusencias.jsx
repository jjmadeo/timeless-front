import React, { useState } from "react";
import { Form, Row, Col, Button, Toast, ToastContainer } from "react-bootstrap";

const FormularioAusencias = ({
    empresa,
    handleDateChange,
    handleAddAusencia,
    handleRemoveAusencia,
    handleRemoveNewAusencia,
    handleAddAusenciaAPI,
}) => {
    const [showToast, setShowToast] = useState(false);

    const validateFields = (ausencia) => {
        const { desde, hasta, descripcion } = ausencia;
        if (!desde || !hasta || !descripcion) {
            return false;
        }
        if (new Date(desde) > new Date(hasta)) {
            return false;
        }
        return true;
    };

    const handleSave = () => {
        const invalidAusencias = empresa.calendario.ausencias.some(
            (ausencia) => !validateFields(ausencia)
        );
        if (invalidAusencias) {
            setShowToast(true);
            return;
        }
        handleAddAusenciaAPI();
    };

    return (
        <div>
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
                            variant="primary"
                            className="btn-quitar"
                            onClick={() =>
                                ausencia.id
                                    ? handleRemoveAusencia(index, ausencia.id)
                                    : handleRemoveNewAusencia(index)
                            }
                        >
                            {ausencia.id ? "Eliminar" : "Remover"}
                        </Button>
                    </Col>
                </Row>
            ))}
            <Button variant="secondary" onClick={handleAddAusencia}>
                Agregar Ausencia
            </Button>
            <Button variant="primary" className="btn-save mt-4" onClick={handleSave}>
                Guardar Ausencias
            </Button>

            <ToastContainer position="top-end">
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg={"danger"}>
                    <Toast.Body>Por favor, complete todos los campos correctamente.</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
};

export default FormularioAusencias;