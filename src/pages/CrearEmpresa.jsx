import React, { useEffect, useState } from "react";
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
import Select from "react-select";
import { empresaRequest, getStaticData } from "../helpers/fetch";
import "./styles/CrearEmpresa.scss";
import { useAuth } from "../lib/authProvider";

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
        latitud: "",
        longitud: "",
      },
    },
    parametros: [],
    calendario: {
      hora_apertura: "00:00",
      hora_cierre: "00:00",
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
  const auth = useAuth();
  const [rubros, setRubros] = useState([]);
  const [selectedRubro, setSelectedRubro] = useState(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!auth.user || auth.user.ROL !== "[ROLE_EMPRESA]") {
        navigate("/login");
      }
    }, .1000);

    return () => clearTimeout(timeoutId);
  }, [auth, navigate]);

  const diasSemana = {
    Lunes: 1,
    Martes: 2,
    Miércoles: 3,
    Jueves: 4,
    Viernes: 5,
    Sábado: 6,
    Domingo: 7,
  };

  const fetchRubros = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token")).token;
      const res = await getStaticData(token);
      setRubros(res.rubro.map((r) => ({ value: r.id, label: r.detalle })));
    } catch (error) {
      console.error("Error al obtener los rubros:", error);
    }
  };

  useEffect(() => {
    fetchRubros();
  }, []);

  useEffect(() => {
    console.log(rubros);
  }, [rubros]);

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

  const handleRubroChange = (selectedOption) => {
    setSelectedRubro(selectedOption);
    setFormData((prevData) => ({
      ...prevData,
      rubro: selectedOption ? selectedOption.label : "",
    }));
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

  const getCoordinates = async (direccion) => {
    const apiKey = "AIzaSyAZ6rhipfSVaz-41Jn4vv-MgEDd87n4Zkc"; // Reemplaza con tu API Key de Google Maps
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      direccion
    )}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK") {
          const result = data.results[0];
          const location = result.geometry.location;
          return { lat: location.lat, lng: location.lng };
        } 
      else {
        throw new Error(data.status);
      }
    } catch (error) {
      console.error("Error al obtener las coordenadas:", error);
      return null;
    }
  };

  const handleToggleDiaLaboral = (dia) => {
    setFormData((prevData) => {
      const dias_laborales = prevData.calendario.dias_laborales.includes(dia)
        ? prevData.calendario.dias_laborales.filter((d) => d !== dia)
        : [...prevData.calendario.dias_laborales, dia];
      return {
        ...prevData,
        calendario: {
          ...prevData.calendario,
          dias_laborales,
        },
      };
    });
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
        return validateCalendario();
      case 2:
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

  const validateCalendario = () => {
    const { hora_apertura, hora_cierre, dias_laborales } = formData.calendario;
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

    const diasLaboralesNumeros = formData.calendario.dias_laborales.map(
      (dia) => diasSemana[dia]
    );

    const direccion = `${formData.datos_fiscales.domicilio_fiscal.calle} ${formData.datos_fiscales.domicilio_fiscal.numero}, ${formData.datos_fiscales.domicilio_fiscal.ciudad}, ${formData.datos_fiscales.domicilio_fiscal.localidad}`;

    const coordenadas = await getCoordinates(direccion);

    if (coordenadas) {
      console.log("Coordenadas obtenidas:", coordenadas);
      // Actualizar formData con las coordenadas
      const updatedFormData = {
        ...formData,
        datos_fiscales: {
          ...formData.datos_fiscales,
          domicilio_fiscal: {
            ...formData.datos_fiscales.domicilio_fiscal,
            latitud: parseFloat(coordenadas.lat),
            longitud: parseFloat(coordenadas.lng),
          },
        },
      };

      // Formatear los datos para enviarlos al servidor
      const formattedData = {
        ...updatedFormData,
        calendario: {
          ...updatedFormData.calendario,
          hora_apertura: `${updatedFormData.calendario.hora_apertura}:00`,
          hora_cierre: `${updatedFormData.calendario.hora_cierre}:00`,
          dias_laborales: diasLaboralesNumeros.join(";"),
        },
      };

      // Enviar los datos al servidor
      try {
        const response = await empresaRequest(formattedData, token);
        if (response.id) {
          setToastMessage("La empresa se ha creado con éxito");
          setError(false);
          setShowToast(true);
          auth.fetchUserProfile();
          navigate("/schedule");
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
    } else {
      console.error("No se pudieron obtener las coordenadas.");
      setError(true);
      setToastMessage("No se pudieron obtener las coordenadas.");
      setShowToast(true);
    }
  };

  return (
    <Container fluid className="register-container" id="container-form">
      <Row className="crear-empresa-container">
        <Col md={12}>
          <Stepper activeStep={currentStep}>
            <Step label="Datos Fiscales" />
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
                        value={
                          formData.datos_fiscales.domicilio_fiscal.localidad
                        }
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
                        value={
                          formData.datos_fiscales.domicilio_fiscal.provincia
                        }
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
                      <div className="dias-laborales-container">
                        {[
                          "Domingo",
                          "Lunes",
                          "Martes",
                          "Miércoles",
                          "Jueves",
                          "Viernes",
                          "Sábado",
                        ].map((dia) => (
                          <Form.Check
                            inline
                            key={dia}
                            type="checkbox"
                            label={dia}
                            value={dia}
                            checked={formData.calendario.dias_laborales.includes(
                              dia
                            )}
                            onChange={(e) =>
                              handleToggleDiaLaboral(e.target.value)
                            }
                          />
                        ))}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            )}
            {currentStep === 2 && (
              <div>
                <h3>Rubro</h3>
                <Row>
                  <Col md={12}>
                    <Form.Group controlId="rubro">
                      <Form.Label>Rubro</Form.Label>
                      <Select
                        className="select-rubro"
                        placeholder="Seleccione un rubro"
                        options={rubros}
                        value={selectedRubro}
                        onChange={handleRubroChange}
                        isClearable
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
              {currentStep < 2 ? (
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
