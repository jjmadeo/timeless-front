import { useState, useContext } from 'react';
import { AuthContext } from '../../lib/authProvider';
import './Register.scss';
import { Button, Card, Container, Form, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const Register = () => {
    const { register } = useContext(AuthContext);
    const [userType, setUserType] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        documentNumber: '',
        documentType: '',
        phoneNumber: '',
        birthDate: null
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDateChange = (date) => {
        setFormData({ ...formData, birthDate: date });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        try {
            var res = await register(formData);
            if (res) {
                console.log('Registro exitoso:', res);
            }
        } catch (err) {
            setError('Error al registrar. Verifique sus datos.');
        }
    };

    return (
        <Container className="register-container">
            <img 
                src="../../../public/assets/Login.png" 
                className="background-image" 
                alt="Background" 
            />
            {!userType ? (
                <Card className="user-type-card">
                    <Card.Body className="text-center">
                        <Button onClick={() => setUserType('normal')} className="btn-user-type">Personal</Button>
                        <Button onClick={() => setUserType('company')} className="btn-user-type">Empresa</Button>
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
                                            dateFormat="dd/MM/yyyy"
                                            className="form-control rounded-input"
                                            placeholderText="Seleccione una fecha"
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
                                            type="text"
                                            name="documentType"
                                            value={formData.documentType}
                                            onChange={handleChange}
                                            required
                                            className="rounded-input"
                                        />
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
                            <Button type="submit" className="btn-register mt-3">Registrarse</Button>
                        </Form>
                        {error && <p className="text-danger mt-3">{error}</p>}
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default Register;