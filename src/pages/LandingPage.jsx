import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const LandingPage = () => {
    return (
        <Container>
            <Container className="mt-5">
                <h1>Bienvenido a Timeless</h1>
                <p>
                    Reserva tus turnos de manera fácil y rápida con nuestra aplicación.
                </p>
            </Container>


            <Container className="mt-5">
            <Row className="text-center">
                <Col>
                    <h2>Fácil de usar</h2>
                    <p>Interfaz intuitiva y amigable para todos los usuarios.</p>
                </Col>
                <Col>
                    <h2>Rápido</h2>
                    <p>Reserva tus turnos en cuestión de segundos.</p>
                </Col>
                <Col>
                    <h2>Seguro</h2>
                    <p>Tus datos están protegidos con nosotros.</p>
                </Col>
            </Row>
            </Container>
        </Container>
    );
};

export default LandingPage;