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

    if (!titulo.trim() || !contenido.trim()) {
      MySwal.fire(
        "Error",
        "El título y el contenido son obligatorios.",
        "error"
      );
      return;
    }

    try {
      const nuevasImagenes = [];

      // Subir imágenes al servidor PHP
      for (const imagen of imagenes) {
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
      }

      // Crear nueva noticia en Firestore
      const nuevaNoticia = {
        titulo: titulo.trim(),
        contenido: contenido
          .split("\n")
          .map((p) => p.trim())
          .filter((p) => p),
        imagenes: nuevasImagenes,
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
      MySwal.fire(
        "Error",
        "No se pudo crear la noticia. Por favor, inténtalo más tarde.",
        "error"
      );
    }
  };

  return (
    <Container className="mt-5">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-center text-success mb-4 fw-bolder">
          Crear Nueva Noticia
        </h2>
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
              rows={8}
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
