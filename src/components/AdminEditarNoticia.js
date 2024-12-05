import React, { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

const MySwal = withReactContent(Swal);

const AdminEditarNoticia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [noticia, setNoticia] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [galeria, setGaleria] = useState([]);
  const [imagenesEliminadas, setImagenesEliminadas] = useState([]);

  // Cargar la noticia desde Firestore
  useEffect(() => {
    const cargarNoticia = async () => {
      try {
        const docRef = doc(firestore, "noticias", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          Swal.fire("Error", "La noticia no fue encontrada.", "error").then(
            () => navigate("/admin-noticias")
          );
          return;
        }

        const datos = docSnap.data();
        setNoticia(datos);
        setTitulo(datos.titulo || "");
        setContenido(datos.contenido?.join("\n") || "");
        setGaleria(datos.imagenes || []);
      } catch (error) {
        console.error("Error al cargar la noticia:", error);
        Swal.fire("Error", "No se pudo cargar la noticia.", "error").then(() =>
          navigate("/admin-noticias")
        );
      }
    };

    cargarNoticia();
  }, [id, navigate]);

  // Manejar subida de nuevas imágenes
  const manejarSubidaImagen = (e) => {
    const archivos = Array.from(e.target.files);
    setGaleria([...galeria, ...archivos]);
  };

  // Eliminar una imagen
  const eliminarImagen = (indice) => {
    const imagenAEliminar = galeria[indice];
    if (!(imagenAEliminar instanceof File)) {
      setImagenesEliminadas([...imagenesEliminadas, imagenAEliminar]);
    }
    setGaleria(galeria.filter((_, i) => i !== indice));
  };

  // Enviar cambios a Firestore
  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!titulo.trim() || !contenido.trim()) {
      Swal.fire("Error", "El título y el contenido son obligatorios.", "error");
      return;
    }

    try {
      const nuevasImagenes = [];

      // Subir nuevas imágenes al servidor
      for (const imagen of galeria) {
        if (imagen instanceof File) {
          const datosFormulario = new FormData();
          datosFormulario.append("imagen", imagen);

          const respuesta = await fetch("https://asodisfra.com/imagenes.php", {
            method: "POST",
            body: datosFormulario,
          });

          if (!respuesta.ok) {
            throw new Error("Error al subir imágenes al servidor");
          }

          const { ruta } = await respuesta.json();
          nuevasImagenes.push(ruta);
        } else {
          nuevasImagenes.push(imagen);
        }
      }

      // Actualizar Firestore con los datos y referencias de imágenes
      const contenidoArray = contenido
        .split("\n")
        .filter((p) => p.trim() !== "");
      const datosActualizados = {
        titulo,
        contenido: contenidoArray,
        imagenes: nuevasImagenes,
        imagenesEliminadas,
      };

      const docRef = doc(firestore, "noticias", id);
      await updateDoc(docRef, datosActualizados);

      Swal.fire("Éxito", "Noticia actualizada correctamente.", "success").then(
        () => navigate("/admin-noticias")
      );
    } catch (error) {
      console.error("Error al actualizar la noticia:", error);
      Swal.fire("Error", "Hubo un problema al editar la noticia.", "error");
    }
  };

  if (!noticia) {
    return (
      <Container className="mt-5 text-center">
        <h2>Cargando noticia...</h2>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-success text-center fw-bolder">Editar Noticia</h2>
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
              rows={8}
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
                      src={`https://asodisfra.com${imagen}`}
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
      </div>
    </Container>
  );
};

export default AdminEditarNoticia;
