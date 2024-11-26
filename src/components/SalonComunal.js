import React from "react";
import { Container, Row, Col, Carousel, Button, Table } from "react-bootstrap";
import { FaCheckCircle, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function SalonComunal() {
  const navigate = useNavigate();

  return (
    <Container className="mt-5">
      <Row className="mb-5">
        <Col md={8}>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-success mb-3">Información del Salón</h2>
            <p>
              <strong>
                El Salón Comunal de San Francisco ofrece un espacio versátil y
                seguro, ideal para actividades como:
              </strong>
            </p>
            <ul
              style={{ textAlign: "left", listStyle: "none", paddingLeft: 0 }}
            >
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
            <ul
              style={{ textAlign: "left", listStyle: "none", paddingLeft: 0 }}
            >
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

      {/* <Row className="bg-white p-4 rounded shadow mb-5">
        <Col>
          <h3 className="text-center text-success mb-3">
            Beneficios al Reservar
          </h3>
          <ul style={{ textAlign: "left", listStyle: "none", paddingLeft: 0 }}>
            <li>
              <FaCheckCircle className="text-success me-2" />
              Asistencia personalizada para organizar tu evento.
            </li>
            <li>
              <FaCheckCircle className="text-success me-2" />
              Horarios flexibles adaptados a tus necesidades.
            </li>
            <li>
              <FaCheckCircle className="text-success me-2" />
              Precios especiales para residentes de la comunidad.
            </li>
            <li>
              <FaCheckCircle className="text-success me-2" />
              Ambiente seguro y amigable para todas las edades.
            </li>
          </ul>
          <p style={{ textAlign: "left" }}>
            <strong>
              ¡Haz de tu celebración un momento inolvidable en nuestras
              instalaciones!
            </strong>
          </p>
        </Col>
      </Row> */}

      <Row className="my-4">
        <Col>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-center text-success mb-3">
              Tarifas y Horarios
            </h3>
            <Table
              bordered
              hover
              className="text-center"
              style={{ backgroundColor: "white" }}
            >
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

      <div className="bg-white p-2 rounded shadow">
        <Carousel className="mb-2">
          <Carousel.Item>
            <img
              className="d-block w-100 rounded"
              src={`${process.env.PUBLIC_URL}/assets/salon1.jpg`}
              alt="Imagen 1 del salón comunal"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100 rounded"
              src={`${process.env.PUBLIC_URL}/assets/salon2.jpg`}
              alt="Imagen 2 del salón comunal"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100 rounded"
              src={`${process.env.PUBLIC_URL}/assets/salon3.jpg`}
              alt="Imagen 2 del salón comunal"
            />
          </Carousel.Item>
        </Carousel>
      </div>
    </Container>
  );
}

export default SalonComunal;
