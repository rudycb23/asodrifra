import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaFacebook,
  FaWhatsapp,
  FaEnvelope,
  FaFacebookMessenger,
} from "react-icons/fa";

function Contacto() {
  return (
    <div
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/assets/iglesia1.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        className="mt-5 mb-2 p-3 rounded"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          color: "black",
          textShadow: "none",
          maxWidth: "800px",
        }}
      >
        <Row>
          <Col className="text-center mt-3">
            <h2>Contáctanos</h2>
            <p>
              Si tienes alguna duda o necesitas más información, no dudes en
              contactarnos a través de nuestros medios oficiales. También puedes
              visitarnos en nuestras redes sociales para mantenerte actualizado
              sobre los eventos y actividades de la comunidad.
            </p>
          </Col>
        </Row>
        <Row className="text-center my-4">
          <Col xs={6} sm={6} md={3} className="mb-4">
            <a
              href="https://www.facebook.com/ASODISFRA"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook size={50} color="#4267B2" />
            </a>
            <p className="mt-2">
              <strong>Facebook</strong>
            </p>
          </Col>
          <Col xs={6} sm={6} md={3} className="mb-4">
            <a
              href="https://wa.me/50687616802"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp size={50} color="#25D366" />
            </a>
            <p className="mt-2">
              <strong>WhatsApp</strong>
            </p>
          </Col>
          <Col xs={6} sm={6} md={3} className="mb-4">
            <a
              href="mailto:asodisfra@outlook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaEnvelope size={50} color="#EA4335" />
            </a>
            <p className="mt-2">
              <strong>Correo Electrónico</strong>
            </p>
          </Col>
          <Col xs={6} sm={6} md={3} className="mb-4">
            <a
              href="https://www.facebook.com/messages/t/752218898287963"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookMessenger size={50} color="#006AFF" />
            </a>
            <p className="mt-2">
              <strong>Messenger</strong>
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Contacto;
