import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaFacebook,
  FaWhatsapp,
  FaEnvelope,
  FaArrowRight,
} from "react-icons/fa";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

function PaginaPrincipal() {
  const navigate = useNavigate();
  const [noticias, setNoticias] = useState([]);

  // Cargar las últimas tres noticias desde Firebase
  const cargarNoticias = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "noticias"));
      const noticiasArray = [];
      querySnapshot.forEach((doc) => {
        noticiasArray.push({ id: doc.id, ...doc.data() });
      });

      // Ordenar las noticias por fecha y tomar las tres más recientes
      const noticiasRecientes = noticiasArray
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 3);

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
      {/* Portada como banner */}
      <div className="hero-section bg-primary text-white text-center py-5">
        <div className="hero-text">
          <h1>Bienvenidos a la Comunidad de San Francisco</h1>
          <p>Un lugar donde el progreso, la cultura y la comunidad se unen.</p>
        </div>
      </div>

      {/* Noticias Recientes */}
      <Container className="my-5">
        <div
          className="bg-white shadow p-4 rounded"
          style={{ maxWidth: "800px", margin: "0 auto" }}
        >
          <h2 className="text-center section-title text-success mb-4">
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
                        transition: "all 0.5s ease-in-out",
                      }}
                    >
                      <img
                        src={`http://localhost:4000${noticia.imagenes[0]}`}
                        alt={noticia.titulo}
                        style={{
                          maxHeight: "100%",
                          maxWidth: "100%",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />
                    </div>
                    <div className="card-slider mt-3">
                      <div className="card-body">
                        <h5 className="card-title p-3 my-2 text-center text-success">
                          {noticia.titulo}
                        </h5>
                      </div>
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
              <div className="text-center mt-4">
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
            <p className="text-center">Cargando noticias...</p>
          )}
        </div>
      </Container>

      {/* Sección del Salón Comunal */}
      <Container className="my-5 bg-light section-box shadow rounded p-4">
        <Row>
          <Col md={6}>
            <img
              src={`${process.env.PUBLIC_URL}/assets/salon1.jpg`}
              alt="Salón Comunal"
              className="img-fluid rounded shadow"
            />
          </Col>
          <Col md={6} className="d-flex flex-column justify-content-center">
            <h2 className="text-success">Salón Comunal</h2>
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

      {/* Misión y Visión */}
      <Container className="my-5 bg-light section-box shadow rounded p-4">
        <h2 className="text-center section-title text-success mb-4">
          Misión y Visión
        </h2>
        <Row>
          <Col md={6} className="text-center">
            <FaCheckCircle size={50} className="text-dark mb-3" />
            <h4>Misión</h4>
            <p>
              Trabajar en conjunto para el desarrollo integral de nuestra
              comunidad, promoviendo valores y mejorando la calidad de vida de
              todos los habitantes.
            </p>
          </Col>
          <Col md={6} className="text-center">
            <FaCheckCircle size={50} className="text-dark mb-3" />
            <h4>Visión</h4>
            <p>
              Ser una comunidad ejemplar, donde la solidaridad, la cultura y la
              innovación sean pilares fundamentales para el progreso.
            </p>
          </Col>
        </Row>
      </Container>

      {/* Valores comunitarios */}
      <Container className="my-5 bg-light section-box shadow rounded p-4">
        <h2 className="text-center section-title text-success mb-4">
          Nuestros Valores
        </h2>
        <Row>
          <Col md={4} className="text-center">
            <h4>Solidaridad</h4>
            <p>
              Fomentamos la unidad y el apoyo entre los miembros de nuestra
              comunidad.
            </p>
          </Col>
          <Col md={4} className="text-center">
            <h4>Innovación</h4>
            <p>Buscamos soluciones creativas para los desafíos locales.</p>
          </Col>
          <Col md={4} className="text-center">
            <h4>Sostenibilidad</h4>
            <p>Trabajamos por un futuro más limpio y verde para todos.</p>
          </Col>
        </Row>
      </Container>

      {/* Contacto */}
      <Container className="my-5 bg-light section-box shadow rounded p-4">
        <h2 className="text-center section-title text-success mb-4">
          Contáctanos
        </h2>
        <Row className="text-center">
          <Col md={4}>
            <FaFacebook size={50} className="text-primary mb-2" />
            <p>
              <strong>Facebook</strong>
              <br />
              <a
                href="https://www.facebook.com/ASODISFRA"
                target="_blank"
                rel="noopener noreferrer"
              >
                ASODISFRA
              </a>
            </p>
          </Col>
          <Col md={4}>
            <FaWhatsapp size={50} className="text-success mb-2" />
            <p>
              <strong>WhatsApp</strong>
              <br />
              <a
                href="https://wa.me/50687616802"
                target="_blank"
                rel="noopener noreferrer"
              >
                +506 8761 6802
              </a>
            </p>
          </Col>
          <Col md={4}>
            <FaEnvelope size={50} className="text-danger mb-2" />
            <p>
              <strong>Correo Electrónico</strong>
              <br />
              <a href="mailto:asodisfra@correo.com">asodisfra@correo.com</a>
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default PaginaPrincipal;
