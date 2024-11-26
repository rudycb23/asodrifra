import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaNewspaper, FaComments, FaPen } from "react-icons/fa";

function AdminPanel() {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col sm={10}>
          <div className="bg-white shadow p-4 rounded">
            <h2 className="text-center my-1 section-title text-success">
              Panel de Administración
            </h2>
          </div>

          <Row className="mt-2 g-4">
            <Col sm={12} md={6}>
              <Link to="/admin-crear-noticia" className="text-decoration-none">
                <div className="admin-card bg-white shadow p-5 rounded text-center">
                  <FaPen size={50} className="admin-card-icon" color="green" />
                  <div className="admin-card-title my-auto">Crear Noticia</div>
                </div>
              </Link>
            </Col>

            <Col sm={12} md={6}>
              <Link to="/admin-noticias" className="text-decoration-none">
                <div className="admin-card bg-white shadow p-5 rounded text-center">
                  <FaNewspaper
                    size={50}
                    className="admin-card-icon"
                    color="green"
                  />
                  <div className="admin-card-title my-auto">
                    Gestión de Noticias
                  </div>
                </div>
              </Link>
            </Col>

            <Col sm={12} md={6}>
              <Link to="/admin-reservas" className="text-decoration-none">
                <div className="admin-card bg-white shadow p-5 rounded text-center">
                  <FaCalendarAlt
                    size={50}
                    className="admin-card-icon"
                    color="green"
                  />
                  <div className="admin-card-title my-auto">
                    Gestión de Reservas
                  </div>
                </div>
              </Link>
            </Col>

            <Col sm={12} md={6}>
              <Link to="/admin-comentarios" className="text-decoration-none">
                <div className="admin-card bg-white shadow p-5 rounded text-center">
                  <FaComments
                    size={50}
                    className="admin-card-icon"
                    color="green"
                  />
                  <div className="admin-card-title my-auto">
                    Gestión de Comentarios
                  </div>
                </div>
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminPanel;
