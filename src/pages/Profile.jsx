import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Container,
  Form,
  Nav,
  Row,
  Col,
  Toast,
  ToastContainer,
  Modal,
} from "react-bootstrap";
import { useAuth } from "../lib/authProvider";
import "../pages/styles/Profile.scss"; // Importa el archivo de estilos
import {
  actualizarPerfil,
  deleteUser,
  postCambiarContrasena,
} from "../helpers/fetch";

const Profile = () => {
  const [profile, setProfile] = useState({
    tipoUsuario: "",
    datosPersonales: {
      nombre: "",
      apellido: "",
      numeroDocumento: "",
      tipoDocumento: "",
      telefonoCelular: "",
      fNacimiento: "",
    },
    domicilio: {
      calle: "",
      numero: "",
      ciudad: "",
      localidad: "",
      provincia: "",
      pais: "",
    },
    configUsuarioGeneral: {
      email: false,
      wpp: false,
      sms: false,
    },
  });
  const [error, setError] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [activeSection, setActiveSection] = useState("datos_personales");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (
        !auth.user ||
        (auth.user.ROL !== "[ROLE_EMPRESA]" &&
          auth.user.ROL !== "[ROLE_GENERAL]")
      ) {
        navigate("/login");
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [auth, navigate]);

  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    if (auth.userProfile) {
      const {
        tipo_usuario,
        datos_personales,
        domicilio,
        config_usuario_general,
      } = auth.userProfile;
      setProfile({
        tipoUsuario: tipo_usuario,
        datosPersonales: {
          nombre: datos_personales.nombre,
          apellido: datos_personales.apellido,
          numeroDocumento: datos_personales.numero_documento,
          tipoDocumento: datos_personales.tipo_documento,
          telefonoCelular: datos_personales.telefono_celular,
          fNacimiento: datos_personales.fnacimiento,
        },
        domicilio: {
          calle: domicilio.calle,
          numero: domicilio.numero,
          ciudad: domicilio.ciudad,
          localidad: domicilio.localidad,
          provincia: domicilio.provincia,
          pais: domicilio.pais,
        },
        configUsuarioGeneral: {
          email: config_usuario_general.email,
          wpp: config_usuario_general.wpp,
          sms: config_usuario_general.sms,
        },
      });
    }
  }, [auth]);

  const handleNestedChange = (e, section) => {
    const { name, value } = e.target;
    setProfile((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [name]: value,
      },
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm_password) {
      setError(true);
      setToastMessage("Las contraseñas nuevas no coinciden.");
      setShowToast(true);
      return;
    }
    try {
      const token = JSON.parse(localStorage.getItem("token")).token;
      const response = await postCambiarContrasena(passwords, token);
      if (response.status === 200) {
        setToastMessage("Contraseña cambiada exitosamente");
        setError(false);
        setShowToast(true);
        setPasswords({
          old_password: "",
          new_password: "",
          confirm_password: "",
        });
      } else {
        setToastMessage(response.text);
        setError(true);
        setShowToast(true);
      }
    } catch (err) {
      setError(true);
      setToastMessage(
        err.message || "Error al cambiar la contraseña. Intente de nuevo."
      );
      setShowToast(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = auth.userProfile.id;
      const token = JSON.parse(localStorage.getItem("token")).token;
      const response = await actualizarPerfil(userId, profile, token);
      console.log(response);
      if (response.status === 200) {
        setToastMessage("Perfil actualizado exitosamente");
        setError(false);
        setShowToast(true);
        auth.fetchUserProfile();
      } else {
        setToastMessage("Error al actualizar el perfil. Intente de nuevo.");
        setError(false);
        setShowToast(true);
      }
    } catch (err) {
      setError(true);
      setToastMessage(
        err.message || "Error al actualizar el perfil. Intente de nuevo."
      );
      setShowToast(true);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token")).token;
      const response = await deleteUser(token);

      if (response.error == null) {
        setToastMessage("Usuario eliminado exitosamente");
        setError(false);
        setShowToast(true);
        auth.logout();

        navigate("/login", {
          state: { message: response },
        });
      } else {
        setToastMessage("Error al eliminar el usuario. Intente de nuevo.");
        setError(false);
        setShowToast(true);
      }
    } catch (err) {
      setError(true);
      setToastMessage(
        err.message || "Error al eliminar el usuario. Intente de nuevo."
      );
      setShowToast(true);
    }
  };

  const renderForm = () => {
    switch (activeSection) {
      case "datos_personales":
        return (
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formNombre">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={profile.datosPersonales.nombre}
                    onChange={(e) => handleNestedChange(e, "datosPersonales")}
                    required
                    className="rounded-input"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formApellido">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    name="apellido"
                    value={profile.datosPersonales.apellido}
                    onChange={(e) => handleNestedChange(e, "datosPersonales")}
                    required
                    className="rounded-input"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formNumeroDocumento">
                  <Form.Label>Número de Documento</Form.Label>
                  <Form.Control
                    type="text"
                    name="numeroDocumento"
                    value={profile.datosPersonales.numeroDocumento}
                    onChange={(e) => handleNestedChange(e, "datosPersonales")}
                    required
                    className="rounded-input"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formTipoDocumento">
                  <Form.Label>Tipo de Documento</Form.Label>
                  <Form.Control
                    type="text"
                    name="tipoDocumento"
                    value={profile.datosPersonales.tipoDocumento}
                    onChange={(e) => handleNestedChange(e, "datosPersonales")}
                    required
                    className="rounded-input"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formTelefonoCelular">
                  <Form.Label>Teléfono Celular</Form.Label>
                  <Form.Control
                    type="text"
                    name="telefonoCelular"
                    value={profile.datosPersonales.telefonoCelular}
                    onChange={(e) => handleNestedChange(e, "datosPersonales")}
                    required
                    className="rounded-input"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formFnacimiento">
                  <Form.Label>Fecha de Nacimiento</Form.Label>
                  <Form.Control
                    type="text"
                    name="fNacimiento"
                    value={profile.datosPersonales.fNacimiento}
                    onChange={(e) => handleNestedChange(e, "datosPersonales")}
                    required
                    className="rounded-input"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formCalle">
                  <Form.Label>Calle</Form.Label>
                  <Form.Control
                    type="text"
                    name="calle"
                    value={profile.domicilio.calle}
                    onChange={(e) => handleNestedChange(e, "domicilio")}
                    required
                    className="rounded-input"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formNumero">
                  <Form.Label>Número</Form.Label>
                  <Form.Control
                    type="text"
                    name="numero"
                    value={profile.domicilio.numero}
                    onChange={(e) => handleNestedChange(e, "domicilio")}
                    required
                    className="rounded-input"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formCiudad">
                  <Form.Label>Ciudad</Form.Label>
                  <Form.Control
                    type="text"
                    name="ciudad"
                    value={profile.domicilio.ciudad}
                    onChange={(e) => handleNestedChange(e, "domicilio")}
                    required
                    className="rounded-input"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formLocalidad">
                  <Form.Label>Localidad</Form.Label>
                  <Form.Control
                    type="text"
                    name="localidad"
                    value={profile.domicilio.localidad}
                    onChange={(e) => handleNestedChange(e, "domicilio")}
                    required
                    className="rounded-input"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formProvincia">
                  <Form.Label>Provincia</Form.Label>
                  <Form.Control
                    type="text"
                    name="provincia"
                    value={profile.domicilio.provincia}
                    onChange={(e) => handleNestedChange(e, "domicilio")}
                    required
                    className="rounded-input"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formPais">
                  <Form.Label>País</Form.Label>
                  <Form.Control
                    type="text"
                    name="pais"
                    value={profile.domicilio.pais}
                    onChange={(e) => handleNestedChange(e, "domicilio")}
                    required
                    className="rounded-input"
                  />
                </Form.Group>
              </Col>
              <Button type="submit" className="btn-save mt-3">
                Guardar
              </Button>
            </Row>
          </Form>
        );

      case "cambiar_contrasena":
        return (
          <Form onSubmit={handleChangePasswordSubmit}>
            <Row>
              <Col md={12}>
                <Form.Group controlId="formOldPassword">
                  <Form.Label>Contraseña Actual</Form.Label>
                  <Form.Control
                    type="password"
                    name="old_password"
                    value={passwords.old_password}
                    onChange={handlePasswordChange}
                    required
                    className="rounded-input"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="formNewPassword">
                  <Form.Label>Nueva Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="new_password"
                    value={passwords.new_password}
                    onChange={handlePasswordChange}
                    required
                    className="rounded-input"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="formConfirmPassword">
                  <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirm_password"
                    value={passwords.confirm_password}
                    onChange={handlePasswordChange}
                    required
                    className="rounded-input"
                  />
                </Form.Group>
              </Col>
              <Button type="submit" className="btn-save mt-3">
                Guardar
              </Button>
            </Row>
          </Form>
        );
      case "notificaciones":
        return (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmailNotif">
              <Form.Check
                type="checkbox"
                label="Notificaciones por Email"
                name="email"
                checked={profile.configUsuarioGeneral.email}
                onChange={(e) => handleNestedChange(e, "configUsuarioGeneral")}
              />
            </Form.Group>
            <Form.Group controlId="formWppNotif">
              <Form.Check
                type="checkbox"
                label="Notificaciones por WhatsApp"
                name="wpp"
                checked={profile.configUsuarioGeneral.wpp}
                onChange={(e) => handleNestedChange(e, "configUsuarioGeneral")}
              />
            </Form.Group>
            <Form.Group controlId="formSmsNotif">
              <Form.Check
                type="checkbox"
                label="Notificaciones por SMS"
                name="sms"
                checked={profile.configUsuarioGeneral.sms}
                onChange={(e) => handleNestedChange(e, "configUsuarioGeneral")}
              />
            </Form.Group>
            <Button type="submit" className="btn-save mt-3">
              Guardar
            </Button>
          </Form>
        );
      case "eliminar_cuenta":
        return null;
      default:
        return null;
    }
  };

  return (
    <Container className="profile-container">
      <Row>
        <Col md={3}>
          <Nav className="flex-column sidebar">
            <Nav.Link
              onClick={() => setActiveSection("datos_personales")}
              className={activeSection === "datos_personales" ? "active" : ""}
            >
              Modificar Datos Personales
            </Nav.Link>
            {/*<Nav.Link
                onClick={() => setActiveSection("notificaciones")}
                className={activeSection === "notificaciones" ? "active" : ""}
              >
                Modificar Notificaciones
              </Nav.Link>*/}
            <Nav.Link
              onClick={() => setActiveSection("cambiar_contrasena")}
              className={activeSection === "cambiar_contrasena" ? "active" : ""}
            >
              Cambiar Contraseña
            </Nav.Link>
            <Button
              variant="danger"
              onClick={() => setShowConfirmModal(true)}
              className={activeSection === "eliminar_cuenta" ? "active" : ""}
              style={{ marginTop: "10px", marginLeft: "15px" }}
            >
              Eliminar Cuenta
            </Button>
          </Nav>
        </Col>
        <Col md={9}>
          <Card className="profile-card">
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

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro de que desea eliminar su cuenta? Esta acción no se puede
          deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setShowConfirmModal(false);
              handleDeleteUser();
            }}
          >
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;
