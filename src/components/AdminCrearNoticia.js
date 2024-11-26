import React, { useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaSave } from "react-icons/fa";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { firestore } from "../firebaseConfig";

const MySwal = withReactContent(Swal);

const AdminCrearNoticia = () => {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const navigate = useNavigate();

  const manejarCambioImagen = (e) => {
    const archivos = Array.from(e.target.files);
    setImagenes([...imagenes, ...archivos]);
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!titulo || !contenido) {
      Swal.fire("Error", "El título y el contenido son obligatorios.", "error");
      return;
    }

    try {
      let rutasImagenes = [];

      if (imagenes.length > 0) {
        const datosFormulario = new FormData();
        imagenes.forEach((imagen) =>
          datosFormulario.append("imagenes", imagen)
        );

        const respuestaSubida = await fetch("http://localhost:4000/subir", {
          method: "POST",
          body: datosFormulario,
        });

        if (!respuestaSubida.ok) {
          throw new Error("Error al subir imágenes");
        }

        const datos = await respuestaSubida.json();
        rutasImagenes = datos.rutasArchivos;
      }

      const nuevaNoticia = {
        titulo,
        contenido: contenido
          .split("\n")
          .filter((parrafo) => parrafo.trim() !== ""),
        imagenes: rutasImagenes,
        fecha: new Date().toISOString(),
      };

      await addDoc(collection(firestore, "noticias"), nuevaNoticia);

      MySwal.fire({
        title: "Éxito",
        text: "La noticia fue creada correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      }).then(() => navigate("/admin-noticias"));
    } catch (error) {
      console.error("Error al crear la noticia:", error);
      Swal.fire("Error", "No se pudo crear la noticia.", "error");
    }
  };

  return (
    <Container className="mt-5">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-center text-success mb-4">Crear Nueva Noticia</h2>
        <Form onSubmit={manejarEnvio}>
          <Form.Group className="mb-3" controlId="titulo">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              placeholder="Escribe el título de la noticia"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="contenido">
            <Form.Label>Contenido</Form.Label>
            <Form.Control
              as="textarea"
              rows={16}
              placeholder="Escribe el contenido de la noticia. Usa saltos de línea para párrafos."
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="imagenes">
            <Form.Label>Imágenes (opcional)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              multiple
              onChange={manejarCambioImagen}
            />
            <Row className="mt-3">
              {imagenes.map((img, index) => (
                <Col key={index} xs={6} md={4}>
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`Vista previa ${index}`}
                    className="img-fluid rounded shadow-sm"
                  />
                </Col>
              ))}
            </Row>
          </Form.Group>
          <Button variant="success" type="submit" className="w-100">
            <FaSave className="mb-1 me-2" />
            Crear Noticia
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default AdminCrearNoticia;
