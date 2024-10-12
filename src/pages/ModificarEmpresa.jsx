import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ToastContainer,
  Toast,
  Nav,
} from "react-bootstrap";
import { useAuth } from "../lib/authProvider";
import { actualizarEmpresa, getEmpresaById } from "../helpers/fetch";
import FormularioEmpresa from "./FormularioDatosFiscales";
import FormularioCalendario from "./FormularioCalendario";
import "../pages/styles/ModificarEmpresa.scss";

const ModificarEmpresa = () => {
  const [empresa, setEmpresa] = useState({
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
    calendario: {
      id: null,
      hora_apertura: "00:00:00",
      hora_cierre: "00:00:00",
      dias_laborales: [],
      ausencias: [],
    },
    lineas_atencion: [{ descripcion: "", duracion_turnos: "" }],
    rubro: "",
  });
  const [idEmpresa, setIdEmpresa] = useState(null);
  const [activeSection, setActiveSection] = useState("datos_fiscales");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [error, setError] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    if (auth.userProfile) {
      setIdEmpresa(auth.userProfile.id_empresa);
    }
  }, [auth]);

  useEffect(() => {
    const fetchEmpresaData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token")).token;
        const empresa = await getEmpresaById(idEmpresa, token);
        empresa.calendario.hora_apertura = formatTime(empresa.calendario.hora_apertura);
        empresa.calendario.hora_cierre = formatTime(empresa.calendario.hora_cierre);
        empresa.calendario.dias_laborales = typeof empresa.calendario.dias_laborales === 'string'
          ? empresa.calendario.dias_laborales.split(';').map(Number)
          : [];
        setEmpresa(empresa);
      } catch (err) {
        console.error("Error al obtener la empresa:", err);
      }
    };
    if (idEmpresa) {
      fetchEmpresaData();
    }
  }, [idEmpresa]);

  useEffect(() => {
    console.log(empresa);
  }, [empresa]);

  const formatTime = (time) => {
    if (time.length === 5) {
      return `${time}:00`;
    }
    return time;
  };

  const formatDate = (dateTime) => {
    return dateTime.split(" ")[0];
  };

  const handleNestedChange = (e, section, subSection = null, index = null) => {
    const { name, value } = e.target;
    if (subSection) {
      setEmpresa((prevState) => ({
        ...prevState,
        [section]: {
          ...prevState[section],
          [subSection]: {
            ...prevState[section][subSection],
            [name]: value,
          },
        },
      }));
    } else if (index !== null) {
      setEmpresa((prevState) => {
        const updatedArray = [...prevState[section]];
        updatedArray[index] = {
          ...updatedArray[index],
          [name]: value,
        };
        return {
          ...prevState,
          [section]: updatedArray,
        };
      });
    } else {
      setEmpresa((prevState) => ({
        ...prevState,
        [section]: {
          ...prevState[section],
          [name]: value,
        },
      }));
    }
  };

  const handleToggleDiaLaboral = (dia) => {
    setEmpresa((prevState) => {
      const dias_laborales = Array.isArray(prevState.calendario.dias_laborales)
        ? prevState.calendario.dias_laborales.includes(dia)
          ? prevState.calendario.dias_laborales.filter((d) => d !== dia)
          : [...prevState.calendario.dias_laborales, dia]
        : [dia];
      return {
        ...prevState,
        calendario: {
          ...prevState.calendario,
          dias_laborales,
        },
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedAusencias = empresa.calendario.ausencias.map((ausencia) => ({
      ...ausencia,
      desde: formatDate(ausencia.desde),
      hasta: formatDate(ausencia.hasta),
    }));

    const formattedData = {
      datos_fiscales: empresa.datos_fiscales,
      calendario: {
        id: empresa.calendario.id,
        hora_apertura: formatTime(empresa.calendario.hora_apertura),
        hora_cierre: formatTime(empresa.calendario.hora_cierre),
        dias_laborales: Array.isArray(empresa.calendario.dias_laborales)
          ? empresa.calendario.dias_laborales.join(";")
          : empresa.calendario.dias_laborales,
        ausencias: formattedAusencias,
      },
      lineas_atencion: empresa.lineas_atencion,
      rubro: empresa.rubro,
    };

    try {
      const token = JSON.parse(localStorage.getItem("token")).token;
      const response = await actualizarEmpresa(idEmpresa, formattedData, token);
      setToastMessage("Empresa actualizada con éxito");
      setError(false);
      setShowToast(true);
    } catch (err) {
      setToastMessage("Error al actualizar la empresa");
      setError(true);
      setShowToast(true);
    }
  };
  const renderForm = () => {
    switch (activeSection) {
      case "datos_fiscales":
        return (
          <FormularioEmpresa
            empresa={empresa}
            handleNestedChange={handleNestedChange}
            handleSubmit={handleSubmit}
          />
        );
      case "calendario":
        return (
          <FormularioCalendario
            empresa={empresa}
            handleChange={(e) => handleNestedChange(e, "calendario")}
            handleToggleDiaLaboral={handleToggleDiaLaboral}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container className="modificar-empresa-container">
      <Row>
        <Col md={3}>
          <Nav className="flex-column sidebar">
            <Nav.Link
              onClick={() => setActiveSection("datos_fiscales")}
              className={activeSection === "datos_fiscales" ? "active" : ""}
            >
              Modificar Datos Fiscales
            </Nav.Link>
            <Nav.Link
              onClick={() => setActiveSection("calendario")}
              className={activeSection === "calendario" ? "active" : ""}
            >
              Modificar Calendario
            </Nav.Link>
          </Nav>
        </Col>
        <Col md={9}>
          <Card className="modificar-empresa-card">
            <Card.Body>{renderForm()}</Card.Body>
          </Card>
        </Col>
      </Row>
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

export default ModificarEmpresa;