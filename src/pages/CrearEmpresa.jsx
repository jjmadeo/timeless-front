import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Toast, ToastContainer } from 'react-bootstrap';
import { Stepper, Step } from 'react-form-stepper';
import { useNavigate } from 'react-router-dom';
import { empresaRequest } from '../helpers/fetch';

const CrearEmpresa = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        datos_fiscales: {
            razon_social: '',
            nombre_fantasia: '',
            cuit: '',
            domicilio_fiscal: {
                calle: '',
                numero: '',
                ciudad: '',
                localidad: '',
                provincia: '',
                pais: ''
            }
        },
        parametros: [
            { clave: 'margen_ganancia', valor: '', descripcion: '' },
            { clave: 'descuento_temporada', valor: '', descripcion: '' }
        ],
        calendario: {
            hora_apertura: '00:00:00',
            hora_cierre: '00:00:00',
            dias_laborales: '',
            ausencias: [
                { desde: '', hasta: '', descripcion: '' },
                { desde: '', hasta: '', descripcion: '' }
            ]
        },
        lineas_atencion: [
            { rubro: '', descripcion: '', duracion_turnos: '' },
            { rubro: '', descripcion: '', duracion_turnos: '' }
        ]
    });

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');
        setFormData((prevData) => {
            let data = { ...prevData };
            let temp = data;
            for (let i = 0; i < keys.length - 1; i++) {
                temp = temp[keys[i]];
            }
            temp[keys[keys.length - 1]] = value;
            return data;
        });
    };

    const handleNext = () => {
        setCurrentStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setCurrentStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = JSON.parse(localStorage.getItem('token')).token; // Obtener el token del localStorage

        // Format hora_apertura and hora_cierre to include seconds
        const formattedData = {
            ...formData,
            calendario: {
                ...formData.calendario,
                hora_apertura: `${formData.calendario.hora_apertura}:00`,
                hora_cierre: `${formData.calendario.hora_cierre}:00`
            }
        };

        try {
            const response = await empresaRequest(formattedData, token);
            if (response.id) {
                setToastMessage("La empresa se ha creado con exito");
                setError(false);
                setShowToast(true);
                navigate('/HomeEmpresa');
            } else {
                throw new Error(response.error.title);
            }
        } catch (err) {
            setError(true);
            setToastMessage(
                err.message || "Error al crear la empresa. Verifique sus datos."
            );
            setShowToast(true);
        }
    };

    return (
        <Container fluid className="register-container">
            <Row>
                <Col md={10}>
                    <Stepper activeStep={currentStep}>
                        <Step label="Datos Fiscales" />
                        <Step label="Parámetros" />
                        <Step label="Calendario" />
                        <Step label="Líneas de Atención" />
                    </Stepper>
                    <Form onSubmit={handleSubmit}>
                        {currentStep === 0 && (
                            <div>
                                <h3>Datos Fiscales</h3>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group controlId="razon_social">
                                            <Form.Label>Razón Social</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="datos_fiscales.razon_social"
                                                value={formData.datos_fiscales.razon_social}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="nombre_fantasia">
                                            <Form.Label>Nombre de Fantasía</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="datos_fiscales.nombre_fantasia"
                                                value={formData.datos_fiscales.nombre_fantasia}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group controlId="cuit">
                                            <Form.Label>CUIT</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="datos_fiscales.cuit"
                                                value={formData.datos_fiscales.cuit}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="calle">
                                            <Form.Label>Calle</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="datos_fiscales.domicilio_fiscal.calle"
                                                value={formData.datos_fiscales.domicilio_fiscal.calle}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group controlId="numero">
                                            <Form.Label>Número</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="datos_fiscales.domicilio_fiscal.numero"
                                                value={formData.datos_fiscales.domicilio_fiscal.numero}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="ciudad">
                                            <Form.Label>Ciudad</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="datos_fiscales.domicilio_fiscal.ciudad"
                                                value={formData.datos_fiscales.domicilio_fiscal.ciudad}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group controlId="localidad">
                                            <Form.Label>Localidad</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="datos_fiscales.domicilio_fiscal.localidad"
                                                value={formData.datos_fiscales.domicilio_fiscal.localidad}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="provincia">
                                            <Form.Label>Provincia</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="datos_fiscales.domicilio_fiscal.provincia"
                                                value={formData.datos_fiscales.domicilio_fiscal.provincia}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group controlId="pais">
                                            <Form.Label>País</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="datos_fiscales.domicilio_fiscal.pais"
                                                value={formData.datos_fiscales.domicilio_fiscal.pais}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>
                        )}
                        {currentStep === 1 && (
                            <div>
                                <h3>Parámetros</h3>
                                {formData.parametros.map((parametro, index) => (
                                    <Row key={index}>
                                        <Col md={4}>
                                            <Form.Group controlId={`clave-${index}`}>
                                                <Form.Label>Clave</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name={`parametros.${index}.clave`}
                                                    value={parametro.clave}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group controlId={`valor-${index}`}>
                                                <Form.Label>Valor</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name={`parametros.${index}.valor`}
                                                    value={parametro.valor}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group controlId={`descripcion-${index}`}>
                                                <Form.Label>Descripción</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name={`parametros.${index}.descripcion`}
                                                    value={parametro.descripcion}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                ))}
                            </div>
                        )}
                        {currentStep === 2 && (
                            <div>
                                <h3>Calendario</h3>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group controlId="hora_apertura">
                                            <Form.Label>Hora de Apertura</Form.Label>
                                            <Form.Control
                                                type="time"
                                                name="calendario.hora_apertura"
                                                value={formData.calendario.hora_apertura}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="hora_cierre">
                                            <Form.Label>Hora de Cierre</Form.Label>
                                            <Form.Control
                                                type="time"
                                                name="calendario.hora_cierre"
                                                value={formData.calendario.hora_cierre}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <Form.Group controlId="dias_laborales">
                                            <Form.Label>Días Laborales</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="calendario.dias_laborales"
                                                value={formData.calendario.dias_laborales}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <h3>Ausencias</h3>
                                {formData.calendario.ausencias.map((ausencia, index) => (
                                    <Row key={index}>
                                        <Col md={4}>
                                            <Form.Group controlId={`desde-${index}`}>
                                                <Form.Label>Desde</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name={`calendario.ausencias.${index}.desde`}
                                                    value={ausencia.desde}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group controlId={`hasta-${index}`}>
                                                <Form.Label>Hasta</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name={`calendario.ausencias.${index}.hasta`}
                                                    value={ausencia.hasta}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group controlId={`descripcion-${index}`}>
                                                <Form.Label>Descripción</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name={`calendario.ausencias.${index}.descripcion`}
                                                    value={ausencia.descripcion}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                ))}
                            </div>
                        )}
                        {currentStep === 3 && (
                            <div>
                                <h3>Líneas de Atención</h3>
                                {formData.lineas_atencion.map((linea, index) => (
                                    <Row key={index}>
                                        <Col md={4}>
                                            <Form.Group controlId={`rubro-${index}`}>
                                                <Form.Label>Rubro</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name={`lineas_atencion.${index}.rubro`}
                                                    value={linea.rubro}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group controlId={`descripcion-${index}`}>
                                                <Form.Label>Descripción</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name={`lineas_atencion.${index}.descripcion`}
                                                    value={linea.descripcion}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group controlId={`duracion_turnos-${index}`}>
                                                <Form.Label>Duración de Turnos (minutos)</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name={`lineas_atencion.${index}.duracion_turnos`}
                                                    value={linea.duracion_turnos}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                ))}
                            </div>
                        )}
                        <div className="d-flex justify-content-between mt-4">
                            {currentStep > 0 && (
                                <Button variant="secondary" onClick={handleBack}>
                                    Atrás
                                </Button>
                            )}
                            {currentStep == 0 || currentStep == 1 || currentStep == 2 ? (
                                <Button variant="primary" onClick={handleNext}>
                                    Siguiente
                                </Button>
                            ) : (
                                <Button variant="success" type="submit">
                                    Crear Empresa
                                </Button>
                            )}
                        </div>
                    </Form>
                </Col>
            </Row>
            {/* Toast container */}
            <ToastContainer position="bottom-end" className="p-3">
                <Toast
                    bg={error ? "danger" : "success"}
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    delay={3000}
                    autohide
                >
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    );
};

export default CrearEmpresa;