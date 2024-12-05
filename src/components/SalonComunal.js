import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Carousel,
  Button,
  Table,
  Accordion,
  Modal,
} from "react-bootstrap";
import {
  FaCheckCircle,
  FaCalendarAl,
  FaCalendarAlt,
  FaChair,
  FaUtensils,
  FaRestroom,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function SalonComunal() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const variantesSeccion = {
    oculto: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const images = [
    `${process.env.PUBLIC_URL}/assets/salon1.jpg`,
    `${process.env.PUBLIC_URL}/assets/salon2.jpg`,
    `${process.env.PUBLIC_URL}/assets/salon3.jpg`,
  ];

  const handleImageClick = (image) => {
    setCurrentImage(image);
    setShowModal(true);
  };

  return (
    <Container className="mt-5">
      <motion.div
        variants={variantesSeccion}
        initial="oculto"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Row className="mb-4">
          <Col md={8}>
            <div className="bg-white p-4 text-start rounded shadow">
              <h2 className="text-success mb-3 fw-bolder">
                Información del Salón
              </h2>
              <p>
                <strong>
                  El Salón Comunal de San Francisco ofrece un espacio versátil y
                  seguro, ideal para actividades como:
                </strong>
              </p>
              <ul className="list-unstyled">
                <li>
                  <FaCheckCircle className="text-success me-2" />
                  Fiestas de cumpleaños
                </li>
                <li>
                  <FaCheckCircle className="text-success me-2" />
                  Quinceaños
                </li>
                <li>
                  <FaCheckCircle className="text-success me-2" />
                  Reuniones familiares
                </li>
                <li>
                  <FaCheckCircle className="text-success me-2" />
                  Eventos corporativos
                </li>
                <li>
                  <FaCheckCircle className="text-success me-2" />
                  Actividades comunitarias
                </li>
              </ul>
              <p>
                <strong>Nuestras instalaciones cuentan con:</strong>
              </p>
              <ul className="list-unstyled">
                <li>
                  <FaCheckCircle className="text-success me-2" />
                  Sillas y mesas
                </li>
                <li>
                  <FaCheckCircle className="text-success me-2" />
                  Cocina equipada (microondas, refrigeradora y congelador)
                </li>
                <li>
                  <FaCheckCircle className="text-success me-2" />
                  Baños accesibles
                </li>
              </ul>
            </div>
          </Col>
          <Col md={4} className="text-center">
            <div className="bg-white p-4 rounded shadow">
              <h4 className="text-success">Reserva del Salón</h4>
              <img
                src={`${process.env.PUBLIC_URL}/assets/salon1.jpg`}
                alt="Reserva del salón"
                className="img-fluid rounded shadow mb-3"
              />
              <Button
                variant="success"
                className="w-100"
                onClick={() => navigate("/reserva-salon")}
              >
                <FaCalendarAlt className="mb-1 me-2" />
                Reservar Ahora
              </Button>
            </div>
          </Col>
        </Row>
      </motion.div>

      {/* Características del Salón */}
      <motion.div
        variants={variantesSeccion}
        initial="oculto"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-success text-center fw-bold mb-4">
            Características del Salón
          </h2>
          <Row className="g-4">
            <Col md={4} className="text-center">
              <FaChair size={50} className="text-success mb-3" />
              <p className="fw-bold">Sillas Plegables</p>
            </Col>
            <Col md={4} className="text-center">
              <FaUtensils size={50} className="text-success mb-3" />
              <p className="fw-bold">Cocina Equipada</p>
            </Col>
            <Col md={4} className="text-center">
              <FaRestroom size={50} className="text-success mb-3" />
              <p className="fw-bold">Baños Accesibles</p>
            </Col>
          </Row>
        </div>
      </motion.div>

      <motion.div
        variants={variantesSeccion}
        initial="oculto"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        <Row className="my-4">
          <Col>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-center text-success mb-3">
                Tarifas y Horarios
              </h3>
              <Table bordered hover className="text-center bg-white">
                <thead>
                  <tr>
                    <th>Día</th>
                    <th>Precio</th>
                    <th>Depósito</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Sábados</td>
                    <td>₡60,000</td>
                    <td rowSpan={2} className="align-middle">
                      ₡20,000
                    </td>
                  </tr>
                  <tr>
                    <td>Domingos</td>
                    <td>₡45,000</td>
                  </tr>
                  <tr>
                    <td colSpan={3}>Horario: 2:00 PM - 10:00 PM</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </motion.div>

      <motion.div
        variants={variantesSeccion}
        initial="oculto"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 2 }}
      >
        <Accordion className="bg-white text-start rounded shadow mt-5">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Servicios Opcionales</Accordion.Header>
            <Accordion.Body>
              <ul>
                <li>Alquiler de Coffee Maker</li>
                <li>Alquiler de manteles y cubremanteles</li>
                <li>Equipo audiovisual (micrófonos, proyectores)</li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Términos y Condiciones</Accordion.Header>
            <Accordion.Body>
              <ul>
                <li>
                  El salón debe ser devuelto limpio y en las mismas condiciones.
                </li>
                <li>Está prohibido fumar dentro de las instalaciones.</li>
                <li>
                  El depósito no es reembolsable en caso de daños o
                  cancelaciones tardías.
                </li>
                <li>El horario máximo permitido es hasta las 10:00 PM.</li>
                <li>
                  El cliente es responsable de cualquier daño causado durante el
                  uso del salón.
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </motion.div>

      <motion.div
        variants={variantesSeccion}
        initial="oculto"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 1.6 }}
      >
        <div className="bg-white p-2 rounded shadow">
          <Carousel className="mb-2">
            {images.map((image, index) => (
              <Carousel.Item key={index}>
                <div className="bg-white p-3 rounded">
                  <img
                    className="d-block w-100 rounded"
                    src={image}
                    alt={`Imagen ${index + 1} del salón comunal`}
                    onClick={() => handleImageClick(image)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      </motion.div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
      >
        <Modal.Body className="p-0 bg-white">
          <img
            src={currentImage}
            alt="Imagen en grande"
            className="w-100 rounded"
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default SalonComunal;
