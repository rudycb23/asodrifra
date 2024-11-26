import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Pagination } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

const Noticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [pagina, setPagina] = useState(1);
  const noticiasPorPagina = 6;
  const navigate = useNavigate();

  const cargarNoticias = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "noticias"));
      const datos = [];
      querySnapshot.forEach((doc) => {
        datos.push({ id: doc.id, ...doc.data() });
      });

      const noticiasOrdenadas = datos.sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
      );
      setNoticias(noticiasOrdenadas);
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
        <h2 className="text-center my-2 section-title text-success">
          Últimas Noticias
        </h2>
      </div>

      <Row>
        {noticiasPaginadas.map((noticia) => (
          <Col md={6} lg={4} className="mb-4" key={noticia.id}>
            <Card className="shadow h-100">
              <Card.Img
                variant="top"
                src={`http://localhost:4000${noticia.imagenes[0]}`}
                alt={noticia.titulo}
              />
              <Card.Body>
                <Card.Title>{noticia.titulo}</Card.Title>
                <Card.Text>
                  {Array.isArray(noticia.contenido) &&
                  noticia.contenido[0]?.length > 27
                    ? `${noticia.contenido[0].slice(0, 200)}...`
                    : noticia.contenido[0]}
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
                  Fecha: {new Date(noticia.fecha).toLocaleDateString()}
                </small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      <Pagination className="justify-content-center">
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
    </Container>
  );
};

export default Noticias;
