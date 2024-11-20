import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../lib/authProvider";
import "./Register.scss";
import {
  Button,
  Card,
  Container,
  Form,
  Row,
  Col,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import {
  getStaticData
  
} from "../../helpers/fetch";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    documentNumber: "",
    documentType: "",
    phoneNumber: "",
    birthDate: null,
    street: "",
    number: "",
    city: "",
    locality: "",
    province: "",
    country: "",
  });
  const [error, setError] = useState(false);
  const [toastMessage, setToastMessage] = useState(""); // Estado para el mensaje del toast
  const [showToast, setShowToast] = useState(false);
  const [allowCompanyRegistration, setAllowCompanyRegistration] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    console.log(date);
    setFormData({ ...formData, birthDate: date });
  };


  useEffect(() => {
    fetchStaticData();
  }, []);

  const fetchStaticData = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token")).token;
      const res = await getStaticData(token);
      setData(res);
      const config = res.configs_global.find(config => config.clave === "altaEmpresa");
      setAllowCompanyRegistration(config && config.valor === "true");
    } catch (error) {
      console.error("Error al obtener los datos estaticos:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      // Asegurarse de que la fecha esté en formato dd-MM-yyyy
      const formattedDate = formData.birthDate
        ? `${("0" + formData.birthDate.getDate()).slice(-2)}-${(
            "0" +
            (formData.birthDate.getMonth() + 1)
          ).slice(-2)}-${formData.birthDate.getFullYear()}`
        : "";

      const payload = {
        correo: formData.email,
        clave: formData.password,
        tipoUsuario: userType === "company" ? "EMPRESA" : "GENERAL",
        datosPersonales: {
          nombre: formData.firstName,
          apellido: formData.lastName,
          numeroDocumento: formData.documentNumber,
          tipoDocumento: formData.documentType,
          telefonoCelular: formData.phoneNumber,
          // Usar la fecha formateada en el payload
          fNacimiento: formattedDate,
        },
        domicilio: {
          calle: formData.street,
          numero: formData.number,
          ciudad: formData.city,
          localidad: formData.locality,
          provincia: formData.province,
          pais: formData.country,
        },
      };

      var res = await register(payload);
      console.log(res);
      if (res) {
        localStorage.setItem("registerSuccess", "Registro exitoso"); // Guardar el mensaje en el almacenamiento local
        navigate("/login");
      }
    } catch (err) {
      setError(true);
      setToastMessage(
        err.message || "Error al registrar. Verifique sus datos."
      );
      setShowToast(true);
    }
  };

  return (
    <Container className="register-container">
      <img
        src="/assets/01-login.png"
        className="background-image"
        alt="Background"
      />
      {!userType ? (
        <Card className="user-type-card">
          <Card.Body className="text-center">
            <Button
              onClick={() => setUserType("normal")}
              className="btn-user-type"
            >
              Personal
            </Button>
            {allowCompanyRegistration && (
              <Button
                onClick={() => setUserType("company")}
                className="btn-user-type"
              >
                Empresa
              </Button>
            )}
          </Card.Body>
        </Card>
      ) : (
        <Card className="register-card">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="formFirstName">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="rounded-input"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formLastName">
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="rounded-input"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="formBirthDate">
                    <Form.Label>Fecha de Nacimiento</Form.Label>
                    <DatePicker
                      selected={formData.birthDate}
                      onChange={handleDateChange}
                      dateFormat="dd-MM-yyyy"
                      className="form-control rounded-input"
                      placeholderText="Seleccione una fecha"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={100}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formPhoneNumber">
                    <Form.Label>Teléfono Celular</Form.Label>
                    <Form.Control
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      className="rounded-input"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                <Form.Group controlId="formDocumentType">
                    <Form.Label>Tipo de Documento</Form.Label>
                    <Form.Control
                      as="select"
                      name="documentType"
                      value={formData.documentType}
                      onChange={handleChange}
                      required
                      className="rounded-input"
                    >
                      <option value="">Seleccione...</option>
                      <option value="DNI">DNI</option>
                      <option value="CUIL">CUIL</option>
                      <option value="LE">LE</option>
                      <option value="LC">LC</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formDocumentNumber">
                    <Form.Label>Número de Documento</Form.Label>
                    <Form.Control
                      type="text"
                      name="documentNumber"
                      value={formData.documentNumber}
                      onChange={handleChange}
                      required
                      className="rounded-input"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="formStreet">
                    <Form.Label>Calle</Form.Label>
                    <Form.Control
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      required
                      className="rounded-input"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formNumber">
                    <Form.Label>Número</Form.Label>
                    <Form.Control
                      type="text"
                      name="number"
                      value={formData.number}
                      onChange={handleChange}
                      required
                      className="rounded-input"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="formCity">
                    <Form.Label>Ciudad</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="rounded-input"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formLocality">
                    <Form.Label>Localidad</Form.Label>
                    <Form.Control
                      type="text"
                      name="locality"
                      value={formData.locality}
                      onChange={handleChange}
                      required
                      className="rounded-input"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="formProvince">
                    <Form.Label>Provincia</Form.Label>
                    <Form.Control
                      type="text"
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      required
                      className="rounded-input"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formCountry">
                    <Form.Label>País</Form.Label>
                    <Form.Control
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="rounded-input"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <hr></hr>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Correo Electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="rounded-input"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="formPassword">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="rounded-input"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formConfirmPassword">
                    <Form.Label>Repetir Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="rounded-input"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button type="submit" className="btn-register mt-3">
                Registrarse
              </Button>
            </Form>
            {error && <p className="text-danger mt-3">{error}</p>}
          </Card.Body>
        </Card>
      )}
      {/* Toast container */}
      <ToastContainer position="bottom-end" className="p-3 text-white">
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

export default Register;
