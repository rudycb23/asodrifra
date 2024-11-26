import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Carousel } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";

const DetalleNoticia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [noticia, setNoticia] = useState(null);

  const cargarNoticia = async () => {
    try {
      const respuesta = await fetch(`http://localhost:4000/noticias/${id}`);
      if (!respuesta.ok) {
        throw new Error("Error al cargar la noticia");
      }
      const datos = await respuesta.json();
      setNoticia(datos);
    } catch (error) {
      console.error("Error al cargar la noticia:", error);
    }
  };

  useEffect(() => {
    cargarNoticia();
  }, [id]);

  if (!noticia) {
    return (
      <Container className="mt-5 text-center">
        <h2 className="text-danger">Noticia no encontrada</h2>
        <Button
          variant="secondary"
          onClick={() => navigate("/noticias-eventos")}
        >
          <FaArrowLeft className="mb-1 me-2" /> Volver a Noticias
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <div className="bg-white p-4 rounded shadow">
            <h1 className=" text-center mb-4">{noticia.titulo}</h1>
            {noticia.imagenes && noticia.imagenes.length > 1 ? (
              <Carousel className="detalle-slider my-3">
                {noticia.imagenes.map((imagen, index) => (
                  <Carousel.Item key={index}>
                    <img
                      src={`http://localhost:4000${imagen}`}
                      className="d-block w-100 slider-img"
                      alt={`Imagen ${index + 1}`}
                      style={{ maxHeight: "500px", objectFit: "contain" }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              <img
                className="img-fluid rounded shadow mb-4"
                src={`http://localhost:4000${noticia.imagenes?.[0]}`}
                alt={noticia.titulo}
                style={{ maxHeight: "500px", objectFit: "cover" }}
              />
            )}
            <div className="mb-4">
              {Array.isArray(noticia.contenido) ? (
                noticia.contenido.map((parrafo, index) => (
                  <p key={index} className="text-start fs-5 mb-3">
                    {parrafo}
                  </p>
                ))
              ) : (
                <p className="text-justify fs-5">{noticia.contenido}</p>
              )}
            </div>
            <div className="text-center mt-4">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft className="mb-1 me-2" /> Regresar
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default DetalleNoticia;
