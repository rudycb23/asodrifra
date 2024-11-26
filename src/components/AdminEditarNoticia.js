import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const AdminEditarNoticia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [noticia, setNoticia] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [galeria, setGaleria] = useState([]);
  const [imagenesEliminadas, setImagenesEliminadas] = useState([]);

  const cargarNoticia = async () => {
    try {
      const respuesta = await fetch(`http://localhost:4000/noticias/${id}`);
      const datos = await respuesta.json();
      setNoticia(datos);
      setTitulo(datos.titulo);
      setContenido(datos.contenido.join("\n"));
      setGaleria(datos.imagenes || []);
    } catch (error) {
      console.error("Error al cargar la noticia:", error);
    }
  };

  useEffect(() => {
    cargarNoticia();
  }, [id]);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    try {
      const datosFormulario = new FormData();
      galeria.forEach((imagen) => {
        if (imagen instanceof File) {
          datosFormulario.append("imagenes", imagen);
        }
      });

      const datos = {
        titulo,
        contenido: contenido.split("\n").filter((p) => p.trim() !== ""),
        imagenesEliminadas,
      };

      datosFormulario.append("datos", JSON.stringify(datos));

      console.log("Datos enviados al servidor:", datos);
      console.log("Archivos:", galeria);

      const respuesta = await fetch(`http://localhost:4000/noticias/${id}`, {
        method: "PUT",
        body: datosFormulario,
      });

      if (respuesta.ok) {
        const respuestaJson = await respuesta.json();
        console.log("Respuesta del servidor:", respuestaJson);
        MySwal.fire({
          title: "¡Éxito!",
          text: "La noticia fue actualizada correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
        }).then(() => navigate("/admin-noticias"));
      } else {
        const errorMsg = await respuesta.text();
        console.error("Error del servidor:", errorMsg);
        Swal.fire("Error", "No se pudo actualizar la noticia.", "error");
      }
    } catch (error) {
      console.error("Error al enviar los cambios:", error);
      Swal.fire("Error", "Hubo un problema al editar la noticia.", "error");
    }
  };

  const manejarSubidaImagen = (e) => {
    const archivos = Array.from(e.target.files);
    setGaleria([...galeria, ...archivos]);
  };

  const eliminarImagen = (indice) => {
    const imagenAEliminar = galeria[indice];
    if (!(imagenAEliminar instanceof File)) {
      setImagenesEliminadas([...imagenesEliminadas, imagenAEliminar]);
    }
    setGaleria(galeria.filter((_, i) => i !== indice));
  };

  return (
    <Container className="mt-5">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-success text-center">Editar Noticia</h2>
        {noticia ? (
          <Form onSubmit={manejarEnvio} className="mt-4">
            <Form.Group controlId="titulo">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="contenido" className="mt-3">
              <Form.Label>Contenido</Form.Label>
              <Form.Control
                as="textarea"
                rows={16}
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="galeria" className="mt-3">
              <Form.Label>Imágenes</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                multiple
                onChange={manejarSubidaImagen}
              />
              <Row className="mt-3">
                {galeria.map((imagen, index) => (
                  <Col key={index} xs={6} md={4} className="position-relative">
                    {imagen instanceof File ? (
                      <img
                        src={URL.createObjectURL(imagen)}
                        alt={`Imagen ${index + 1}`}
                        className="img-fluid rounded shadow-sm mb-2"
                      />
                    ) : (
                      <img
                        src={`http://localhost:4000${imagen}`}
                        alt={`Imagen ${index + 1}`}
                        className="img-fluid rounded shadow-sm mb-2"
                      />
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      className="position-absolute top-0 end-0"
                      onClick={() => eliminarImagen(index)}
                    >
                      X
                    </Button>
                  </Col>
                ))}
              </Row>
            </Form.Group>
            <Button variant="success" type="submit" className="mt-4 w-100">
              Guardar Cambios
            </Button>
          </Form>
        ) : (
          <p className="text-center">Cargando noticia...</p>
        )}
      </div>
    </Container>
  );
};

export default AdminEditarNoticia;
