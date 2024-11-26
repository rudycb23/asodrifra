import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaPaperPlane } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";

const MySwal = withReactContent(Swal);

function Comentarios() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    texto: "",
  });
  const [validated, setValidated] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [mensajeError, setMensajeError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
    setMensajeError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      setMensajeError("Por favor completa el CAPTCHA.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/comentarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          captchaToken,
        }),
      });

      const data = await response.json();
      if (data.success) {
        Swal.fire(
          "Enviado",
          "¡Tu comentario ha sido enviado correctamente!",
          "success"
        );
        setFormData({ nombre: "", correo: "", telefono: "", texto: "" });
        setCaptchaToken(null);
      } else {
        setMensajeError(data.message || "Error al validar el CAPTCHA.");
      }
    } catch (error) {
      console.error("Error enviando comentario:", error);
      Swal.fire("Error", "No se pudo enviar el comentario.", "error");
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="bg-white shadow p-4 rounded">
            <h2 className="text-center mb-4">Deja tu comentario</h2>
            {mensajeError && <p className="text-danger">{mensajeError}</p>}
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="nombre">
                <Form.Label>Nombre completo</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  placeholder="Escribe tu nombre completo"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Por favor, ingresa tu nombre completo.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="correo">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="correo"
                  placeholder="ejemplo@correo.com"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Por favor, ingresa un correo válido.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="telefono">
                <Form.Label>Número telefónico</Form.Label>
                <Form.Control
                  type="tel"
                  name="telefono"
                  placeholder="+506 1234 5678"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Por favor, ingresa un número telefónico válido.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="texto">
                <Form.Label>Comentario</Form.Label>
                <Form.Control
                  as="textarea"
                  name="texto"
                  rows={6}
                  placeholder="Escribe tu comentario aquí..."
                  value={formData.texto}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Por favor, ingresa tu comentario.
                </Form.Control.Feedback>
              </Form.Group>
              <ReCAPTCHA
                sitekey="6LevGIgqAAAAAEcuEfRRiSRQbdXY6dXdxoR0hmXe"
                onChange={onCaptchaChange}
              />
              <Button variant="success" type="submit" className="w-100 mt-3">
                <FaPaperPlane className="me-2" />
                Enviar
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Comentarios;