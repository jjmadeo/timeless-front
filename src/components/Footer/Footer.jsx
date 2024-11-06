import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import './Footer.scss';

const Footer = () => {
  return (
    <footer className="footer bg-primary text-white">
      <Container>
        <Row className="">
          <Col className="text-center d-flex flex-column align-items-center">
            <div className="contact-info d-flex align-items-center">
              <h2 className="me-3">Contactanos!</h2>
              <p className="me-3 d-flex align-items-center">
                <FaEnvelope className="me-2" />
                soporte@timeless.com
              </p>
              <p className="d-flex align-items-center">
                <FaPhone className="me-2" />
                0800-1111-2256
              </p>
            </div>
          </Col>
        </Row>
        <hr className="footer-divider" />
        <Row>
          <Col className="text-center d-flex flex-column align-items-center">
            <p>&copy; 2024 - Timeless | Todos los derechos reservados</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;