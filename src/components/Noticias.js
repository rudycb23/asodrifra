import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Pagination } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { motion } from "framer-motion";

const variantesSeccion = {
  oculto: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const Noticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [pagina, setPagina] = useState(1);
  const noticiasPorPagina = 6;
  const navigate = useNavigate();

  const cargarNoticias = async () => {
    try {
      const noticiasRef = collection(firestore, "noticias");
      const consulta = query(noticiasRef, orderBy("fecha", "desc"));
      const querySnapshot = await getDocs(consulta);

      const noticiasObtenidas = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNoticias(noticiasObtenidas);
    } catch (error) {
      console.error("Error al cargar noticias:", error);
    }
  };

  useEffect(() => {
    cargarNoticias();
  }, []);

  const cambiarPagina = (numero) => setPagina(numero);

  const noticiasPaginadas = noticias.slice(
    (pagina - 1) * noticiasPorPagina,
    pagina * noticiasPorPagina
  );

  const totalPaginas = Math.ceil(noticias.length / noticiasPorPagina);

  return (
    <Container className="mt-5">
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-center my-2 section-title text-success fw-bolder">
          Últimas Noticias
        </h2>
      </div>

      <motion.div
        variants={variantesSeccion}
        initial="oculto"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Row>
          {noticiasPaginadas.map((noticia) => (
            <Col md={6} lg={4} className="mb-4" key={noticia.id}>
              <Card className="shadow h-100">
                <Card.Img
                  variant="top"
                  src={`https://asodisfra.com${noticia.imagenes?.[0]}`}
                  alt={noticia.titulo || "Imagen de la noticia"}
                />
                <Card.Body>
                  <Card.Title className="fw-bold text-success">
                    {noticia.titulo || "Sin título"}
                  </Card.Title>
                  <Card.Text className="text-justify">
                    {Array.isArray(noticia.contenido) &&
                    noticia.contenido[0]?.length > 135
                      ? `${noticia.contenido[0].slice(0, 135)}...`
                      : noticia.contenido[0] || "Sin contenido disponible"}
                  </Card.Text>
                  <Button
                    variant="success"
                    onClick={() => navigate(`/noticias-eventos/${noticia.id}`)}
                  >
                    <FaEye className="mb-1 me-2" />
                    Ver Más
                  </Button>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted">
                    Fecha:{" "}
                    {noticia.fecha
                      ? new Date(noticia.fecha).toLocaleDateString()
                      : "Sin fecha"}
                  </small>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </motion.div>

      {totalPaginas > 1 && (
        <Pagination className="justify-content-center mt-4">
          {[...Array(totalPaginas).keys()].map((numero) => (
            <Pagination.Item
              key={numero + 1}
              active={numero + 1 === pagina}
              onClick={() => cambiarPagina(numero + 1)}
            >
              {numero + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </Container>
  );
};

export default Noticias;
