import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Carousel } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { motion } from "framer-motion";

const variantesSeccion = {
  oculto: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const DetalleNoticia = () => {
  const { id } = useParams(); // ID de la noticia
  const navigate = useNavigate();
  const [noticia, setNoticia] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarNoticia = async () => {
      try {
        const docRef = doc(firestore, "noticias", id); // Consulta a Firebase
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setError("La noticia no fue encontrada.");
          return;
        }

        const datos = docSnap.data(); // Datos de Firebase
        setNoticia(datos);
      } catch (err) {
        console.error("Error al cargar la noticia:", err);
        setError("No se pudo cargar la noticia. Inténtalo más tarde.");
      }
    };

    cargarNoticia();
  }, [id]);

  if (error) {
    return (
      <Container className="mt-5 text-center">
        <h2 className="text-danger fw-bolder">{error}</h2>
        <Button onClick={() => navigate("/noticias-eventos")}>
          <FaArrowLeft className="me-2" /> Volver a Noticias
        </Button>
      </Container>
    );
  }

  if (!noticia) {
    return (
      <Container className="mt-5 text-center">
        <h2 className=" fw-bolder">Cargando noticia...</h2>
      </Container>
    );
  }

  return (
    <motion.div
      variants={variantesSeccion}
      initial="oculto"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="bg-white p-4 rounded shadow">
              <h1 className="text-center fw-bolder">
                {noticia.titulo || "Sin título"}
              </h1>
              {noticia.imagenes && noticia.imagenes.length > 0 ? (
                <Carousel
                  controls={noticia.imagenes.length > 1}
                  indicators={noticia.imagenes.length > 1}
                >
                  {noticia.imagenes.map((imagen, index) => (
                    <Carousel.Item key={index}>
                      <img
                        src={`https://asodisfra.com${imagen}`}
                        className="d-block w-100"
                        alt={`Imagen ${index + 1}`}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : (
                <p className="text-center">No hay imágenes disponibles.</p>
              )}

              <div className="mt-4 text-justify">
                {Array.isArray(noticia.contenido) ? (
                  noticia.contenido.map((parrafo, index) => (
                    <p key={index}>{parrafo}</p>
                  ))
                ) : (
                  <p>{noticia.contenido || "Sin contenido disponible"}</p>
                )}
              </div>
              <Button
                variant="secondary"
                onClick={() => navigate(-1)}
                className="mt-3"
              >
                <FaArrowLeft className="me-2" /> Regresar
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default DetalleNoticia;
