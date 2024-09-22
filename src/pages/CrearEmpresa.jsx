import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { Stepper, Step } from "react-form-stepper";
import { useNavigate } from "react-router-dom";
import { empresaRequest } from "../helpers/fetch";
import "./styles/CrearEmpresa.scss";

const CrearEmpresa = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    datos_fiscales: {
      razon_social: "",
      nombre_fantasia: "",
      cuit: "",
      domicilio_fiscal: {
        calle: "",
        numero: "",
        ciudad: "",
        localidad: "",
        provincia: "",
        pais: "",
      },
    },
    parametros: [],
    calendario: {
      hora_apertura: "00:00:00",
      hora_cierre: "00:00:00",
      dias_laborales: [],
      ausencias: [],
    },
    lineas_atencion: [{ descripcion: "", duracion_turnos: "" }],
    rubro: "",
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
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
    if (!validateStep()) {
      return;
    }
    setCurrentStep((prevStep) => {
      const newStep = prevStep + 1;
      console.log(`Avanzando al paso: ${newStep}`);
      console.log(currentStep);
      return newStep;
    });
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => {
      const newStep = prevStep - 1;
      console.log(`Retrocediendo al paso: ${newStep}`);
      return newStep;
    });
  };

  const handleAddParametro = () => {
    setFormData((prevData) => ({
      ...prevData,
      parametros: [
        ...prevData.parametros,
        { clave: "", valor: "", descripcion: "" },
      ],
    }));
  };

  const handleRemoveParametro = (index) => {
    setFormData((prevData) => {
      const newParametros = prevData.parametros.filter((_, i) => i !== index);
      return { ...prevData, parametros: newParametros };
    });
  };

  const handleAddAusencia = () => {
    setFormData((prevData) => ({
      ...prevData,
      calendario: {
        ...prevData.calendario,
        ausencias: [
          ...prevData.calendario.ausencias,
          { desde: "", hasta: "", descripcion: "" },
        ],
      },
    }));
  };

  const handleRemoveAusencia = (index) => {
    setFormData((prevData) => {
      const newAusencias = prevData.calendario.ausencias.filter(
        (_, i) => i !== index
      );
      return {
        ...prevData,
        calendario: {
          ...prevData.calendario,
          ausencias: newAusencias,
        },
      };
    });
  };

  const handleAddDiaLaboral = (e) => {
    const dia = e.target.value;
    if (!formData.calendario.dias_laborales.includes(dia)) {
      setFormData((prevData) => ({
        ...prevData,
        calendario: {
          ...prevData.calendario,
          dias_laborales: [...prevData.calendario.dias_laborales, dia],
        },
      }));
    }
  };

  const handleRemoveDiaLaboral = (dia) => {
    setFormData((prevData) => ({
      ...prevData,
      calendario: {
        ...prevData.calendario,
        dias_laborales: prevData.calendario.dias_laborales.filter(
          (d) => d !== dia
        ),
      },
    }));
  };

  const handleAddLineaAtencion = () => {
    setFormData((prevData) => ({
      ...prevData,
      lineas_atencion: [
        ...prevData.lineas_atencion,
        { descripcion: "", duracion_turnos: "" },
      ],
    }));
  };

  const handleRemoveLineaAtencion = (index) => {
    setFormData((prevData) => {
      const newLineasAtencion = prevData.lineas_atencion.filter(
        (_, i) => i !== index
      );
      return { ...prevData, lineas_atencion: newLineasAtencion };
    });
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        return validateDatosFiscales();
      case 1:
        return validateParametros();
      case 2:
        return validateCalendario();
      case 3:
        return validateLineasAtencion();
      default:
        return true;
    }
  };

  const validateDatosFiscales = () => {
    const { razon_social, nombre_fantasia, cuit, domicilio_fiscal } =
      formData.datos_fiscales;
    if (
      !razon_social ||
      !nombre_fantasia ||
      !cuit ||
      !domicilio_fiscal.calle ||
      !domicilio_fiscal.numero ||
      !domicilio_fiscal.ciudad ||
      !domicilio_fiscal.localidad ||
      !domicilio_fiscal.provincia ||
      !domicilio_fiscal.pais
    ) {
      setToastMessage("Todos los campos de datos fiscales son obligatorios.");
      setError(true);
      setShowToast(true);
      return false;
    }
    return true;
  };

  const validateParametros = () => {
    if (formData.parametros.length === 0) {
      return true;
    } else {
      return true;
    }
  };

  const validateCalendario = () => {
    const { hora_apertura, hora_cierre, dias_laborales, ausencias } =
      formData.calendario;
    if (!hora_apertura || !hora_cierre || dias_laborales.length === 0) {
      setToastMessage("Todos los campos del calendario son obligatorios.");
      setError(true);
      setShowToast(true);
      return false;
    }
    if (hora_apertura >= hora_cierre) {
      setToastMessage(
        "La hora de apertura no puede ser mayor o igual a la hora de cierre."
      );
      setError(true);
      setShowToast(true);
      return false;
    }
    for (const ausencia of ausencias) {
      if (ausencia.desde >= ausencia.hasta) {
        setToastMessage(
          "La fecha de inicio de la ausencia no puede ser mayor o igual a la fecha de fin."
        );
        setError(true);
        setShowToast(true);
        return false;
      }
    }
    return true;
  };

  const validateLineasAtencion = () => {
    if (formData.lineas_atencion.length === 0) {
      setToastMessage("Debe agregar al menos una línea de atención.");
      setError(true);
      setShowToast(true);
      return false;
    }
    for (const linea of formData.lineas_atencion) {
      if (!linea.descripcion || !linea.duracion_turnos) {
        setToastMessage(
          "Todos los campos de las líneas de atención son obligatorios."
        );
        setError(true);
        setShowToast(true);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep()) {
      return;
    }

    const token = JSON.parse(localStorage.getItem("token")).token; // Obtener el token del localStorage

    // Format hora_apertura and hora_cierre to include seconds
    const formattedData = {
      ...formData,
      calendario: {
        ...formData.calendario,
        hora_apertura: `${formData.calendario.hora_apertura}:00`,
        hora_cierre: `${formData.calendario.hora_cierre}:00`,
        dias_laborales: formData.calendario.dias_laborales.join(","),
      },
    };

    try {
      const response = await empresaRequest(formattedData, token);
      if (response.id) {
        setToastMessage("La empresa se ha creado con exito");
        setError(false);
        setShowToast(true);
        navigate("/HomeEmpresa");
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
                    <Step label="Líneas de Atención y Rubro" />
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
                                <Row key={index} className="item-container">
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
                                    <Col md={12} className="text-right">
                                        <Button
                                            variant="danger"
                                            className="btn-quitar"
                                            onClick={() => handleRemoveParametro(index)}
                                        >
                                            Quitar
                                        </Button>
                                    </Col>
                                </Row>
                            ))}
                            <Button variant="primary" onClick={handleAddParametro}>
                                Agregar Parámetro
                            </Button>
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
                                            as="select"
                                            name="calendario.dias_laborales"
                                            onChange={handleAddDiaLaboral}
                                        >
                                            <option value="">Seleccione un día</option>
                                            <option value="Domingo">Domingo</option>
                                            <option value="Lunes">Lunes</option>
                                            <option value="Martes">Martes</option>
                                            <option value="Miércoles">Miércoles</option>
                                            <option value="Jueves">Jueves</option>
                                            <option value="Viernes">Viernes</option>
                                            <option value="Sábado">Sábado</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Row>
                                        <Col>
                                            <h5>Días Laborales</h5>
                                            {formData.calendario.dias_laborales.map(
                                                (dia, index) => (
                                                    <div key={index} className="item-container">
                                                        <span className="item-text">{dia}</span>
                                                        <button
                                                            className="btn-quitar"
                                                            onClick={() => handleRemoveDiaLaboral(dia)}
                                                        >
                                                            Quitar
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <h3>Ausencias</h3>
                            {formData.calendario.ausencias.map((ausencia, index) => (
                                <Row key={index} className="item-container">
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
                            <Button variant="primary" onClick={handleAddAusencia}>
                                Agregar Ausencia
                            </Button>
                        </div>
                    )}
                    {currentStep === 3 && (
                        <div>
                            <h3>Rubro</h3>
                            <Row>
                                <Col md={12}>
                                    <Form.Group controlId="rubro">
                                        <Form.Label>Rubro</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="rubro"
                                            value={formData.rubro}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <h3>Líneas de Atención</h3>
                            {formData.lineas_atencion.map((linea, index) => (
                                <Row key={index} className="item-container">
                                    <Col md={6}>
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
                                    <Col md={6}>
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
                                    <Col md={12} className="text-right">
                                        {formData.lineas_atencion.length > 1 && (
                                            <Button
                                                variant="danger"
                                                className="btn-quitar"
                                                onClick={() => handleRemoveLineaAtencion(index)}
                                            >
                                                Quitar
                                            </Button>
                                        )}
                                    </Col>
                                </Row>
                            ))}
                            <Button variant="primary" onClick={handleAddLineaAtencion}>
                                Agregar Línea de Atención
                            </Button>
                        </div>
                    )}
                    <div className="d-flex justify-content-between mt-4">
                        {currentStep > 0 && (
                            <Button variant="secondary" onClick={handleBack}>
                                Atrás
                            </Button>
                        )}
                        {currentStep < 3 ? (
                            <Button
                                variant="primary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNext();
                                }}
                            >
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
