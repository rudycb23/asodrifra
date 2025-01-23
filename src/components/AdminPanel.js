import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaNewspaper, FaComments, FaPen } from "react-icons/fa";
import { motion } from "framer-motion";

const variantesSeccion = {
  oculto: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

function AdminPanel() {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col sm={10}>
          <div className="bg-white shadow p-4 rounded">
            <h2 className="text-center my-1 section-title text-success fw-bolder">
              Panel de Administración
            </h2>
          </div>

          
          <Row className="mt-2 g-4">
            <motion.div
              variants={variantesSeccion}
              initial="oculto"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="col-12 col-md-6 col-lg-6"
            >
              <Link to="/admin-crear-noticia" className="text-decoration-none">
                <div className="admin-card bg-white shadow p-5 rounded text-center">
                  <FaPen size={50} className="admin-card-icon" color="green" />
                  <div className="admin-card-title my-auto">Crear Noticia</div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              variants={variantesSeccion}
              initial="oculto"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="col-12 col-md-6 col-lg-6"
            >
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
            </motion.div>

            <motion.div
              variants={variantesSeccion}
              initial="oculto"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="col-12 col-md-6 col-lg-6"
            >
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
            </motion.div>

            <motion.div
              variants={variantesSeccion}
              initial="oculto"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="col-12 col-md-6 col-lg-6"
            >
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
            </motion.div>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminPanel;
