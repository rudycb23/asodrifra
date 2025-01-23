import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import {
  FaCheckCircle,
  FaFacebook,
  FaWhatsapp,
  FaEnvelope,
  FaArrowRight,
} from "react-icons/fa";
import { motion } from "framer-motion";

function PaginaPrincipal() {
  const navigate = useNavigate();
  const [noticias, setNoticias] = useState([]);
  const variantesSeccion = {
    oculto: { opacity: 0, y: 50 }, 
    visible: { opacity: 1, y: 0 }, 
  };

  const cargarNoticias = async () => {
    try {
      const noticiasRef = collection(firestore, "noticias");
      const consulta = query(noticiasRef, orderBy("fecha", "desc"), limit(3));
      const querySnapshot = await getDocs(consulta);

      const noticiasRecientes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNoticias(noticiasRecientes);
    } catch (error) {
      console.error("Error al cargar las noticias:", error);
    }
  };

  useEffect(() => {
    cargarNoticias();
  }, []);

  return (
    <>
      {/* Portada/banner */}
      <motion.div
        className="hero-section bg-sucess text-white text-center py-5"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-text">
          <h1>Bienvenidos a la Comunidad de San Francisco</h1>
          <p>Un lugar donde el progreso, la cultura y la comunidad se unen.</p>
        </div>
      </motion.div>

      {/* Noticias Recientes */}
      <motion.div
        className="my-5"
        variants={variantesSeccion}
        initial="oculto"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Container>
          <div
            className="bg-white shadow p-4 rounded"
            style={{ maxWidth: "800px", margin: "0 auto" }}
          >
            <h2 className="text-center section-title text-success mb-4 fw-bolder">
              <FaArrowRight className="mb-2 me-2" />
              Noticias Recientes
            </h2>
            {noticias.length > 0 ? (
              <>
                <Carousel interval={4000} fade>
                  {noticias.map((noticia, index) => (
                    <Carousel.Item
                      key={index}
                      className="d-flex flex-column align-items-center"
                    >
                      {/* Contenedor de la imagen */}
                      <div
                        className="image-container"
                        style={{
                          height: "450px",
                          width: "100%",
                          backgroundColor: "transparent",
                          overflow: "hidden",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={`https://asodisfra.com${noticia.imagenes?.[0]}`}
                          alt={noticia.titulo || "Sin título"}
                          style={{
                            maxHeight: "100%",
                            maxWidth: "100%",
                            objectFit: "cover",
                            borderRadius: "10px",
                          }}
                        />
                      </div>

                      {/* Contenido debajo de la imagen */}
                      <div
                        className=" rounded p-3 mt-3 text-center"
                        style={{ width: "100%" }}
                      >
                        <h5 className="fw-bold">
                          {noticia.titulo || "Sin título"}
                        </h5>
                        <p className="text-justify">{`${noticia.contenido[0].slice(
                          0,
                          185
                        )}...`}</p>
                      </div>
                    </Carousel.Item>
                  ))}
                </Carousel>
                <div className="text-center mt-2">
                  <Button
                    variant="success"
                    size="lg"
                    onClick={() => navigate("/noticias-eventos")}
                  >
                    Ver Más Noticias
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-center">
                No hay noticias disponibles por el momento.
              </p>
            )}
          </div>
        </Container>
      </motion.div>

      {/* Salón Comunal */}
      <motion.div
        variants={variantesSeccion}
        initial="oculto"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="my-5"
      >
        <Container className="bg-light section-box shadow rounded p-4">
          <Row>
            <Col md={6}>
              <img
                src={`${process.env.PUBLIC_URL}/assets/salon1.jpg`}
                alt="Salón Comunal"
                className="img-fluid rounded shadow"
              />
            </Col>
            <Col md={6} className="d-flex flex-column justify-content-center">
              <h2 className="text-success fw-bold mt-4">Salón Comunal</h2>
              <p>
                Nuestro salón comunal es el espacio ideal para realizar tus
                eventos y actividades. Cuenta con todas las comodidades para
                garantizar una experiencia inolvidable.
              </p>
              <Button
                variant="success"
                onClick={() => navigate("/salon-comunal")}
              >
                Más Información
              </Button>
            </Col>
          </Row>
        </Container>
      </motion.div>

      {/* Misión y Visión */}
      <motion.div
        variants={variantesSeccion}
        initial="oculto"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Container className="my-5 bg-light section-box shadow rounded p-4">
          <h2 className="text-center section-title text-success mb-4 fw-bolder">
            Misión y Visión
          </h2>
          <Row>
            <Col md={6} className="text-center">
              <FaCheckCircle size={50} className="text-dark mb-3" />
              <h4 className="fw-bold">Misión</h4>
              <p>
                Trabajar en conjunto para el desarrollo integral de nuestra
                comunidad, promoviendo valores y mejorando la calidad de vida de
                todos los habitantes.
              </p>
            </Col>
            <Col md={6} className="text-center">
              <FaCheckCircle size={50} className="text-dark mb-3" />
              <h4 className="fw-bold">Visión</h4>
              <p>
                Ser una comunidad ejemplar, donde la solidaridad, la cultura y
                la innovación sean pilares fundamentales para el progreso.
              </p>
            </Col>
          </Row>
        </Container>
      </motion.div>

      {/* Valores comunitarios */}

      <motion.div
        variants={variantesSeccion}
        initial="oculto"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Container className="my-5 bg-light section-box shadow rounded p-4">
          <h2 className="text-center section-title text-success mb-4 fw-bolder">
            Nuestros Valores
          </h2>
          <Row>
            <Col md={4} className="text-center">
              <h4 className="fw-bold">Solidaridad</h4>
              <p>
                Fomentamos la unidad y el apoyo entre los miembros de nuestra
                comunidad.
              </p>
            </Col>
            <Col md={4} className="text-center">
              <h4 className="fw-bold">Innovación</h4>
              <p>Buscamos soluciones creativas para los desafíos locales.</p>
            </Col>
            <Col md={4} className="text-center">
              <h4 className="fw-bold">Sostenibilidad</h4>
              <p>Trabajamos por un futuro más limpio y verde para todos.</p>
            </Col>
          </Row>
        </Container>
      </motion.div>

      <motion.div
        variants={variantesSeccion}
        initial="oculto"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Contacto */}
        <Container className="my-5 bg-light section-box shadow rounded p-4">
          <h2 className="text-center section-title text-success mb-4 fw-bolder">
            Contáctanos
          </h2>
          <Row className="justify-content-center text-center text-md-start">
            {/* Facebook */}
            <Col lg={3} md={4} sm={12} className="mb-4">
              <div className="d-flex flex-column flex-md-row align-items-center justify-content-center">
                <FaFacebook
                  size={50}
                  className="text-primary mb-2 mb-md-0 me-md-3"
                />
                <div>
                  <p className="mb-0 fw-bold">Facebook</p>
                  <a
                    className="texto-contacto-pagina-principal text-success fw-bold"
                    href="https://www.facebook.com/ASODISFRA"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ASODISFRA
                  </a>
                </div>
              </div>
            </Col>

            {/* WhatsApp */}
            <Col lg={3} md={4} sm={12} className="mb-4">
              <div className="d-flex flex-column flex-md-row align-items-center justify-content-center">
                <FaWhatsapp
                  size={50}
                  className="text-success mb-2 mb-md-0 me-md-3"
                />
                <div>
                  <p className="mb-0 fw-bold">WhatsApp</p>
                  <a
                    className="texto-contacto-pagina-principal text-success fw-bold"
                    href="https://wa.me/50687616802"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +506 8761 6802
                  </a>
                </div>
              </div>
            </Col>

            {/* Correo Electrónico */}
            <Col lg={3} md={4} sm={12} className="mb-4">
              <div className="d-flex flex-column flex-md-row align-items-center justify-content-center">
                <FaEnvelope
                  size={50}
                  className="text-danger mb-2 mb-md-0 me-md-3"
                />
                <div>
                  <p className="mb-0 fw-bold">Correo Electrónico</p>
                  <a
                    className="texto-contacto-pagina-principal text-success fw-bold"
                    href="mailto:asodisfra@correo.com"
                  >
                    asodisfra@correo.com
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </motion.div>
    </>
  );
}

export default PaginaPrincipal;
