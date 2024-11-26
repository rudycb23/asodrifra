import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);

      Swal.fire({
        title: "¡Bienvenido!",
        text: "Inicio de sesión exitoso.",
        icon: "success",
        timer: 1700,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          popup: "swal2-rounded",
        },
        didOpen: () => {
          const iconElement = document.querySelector(
            ".swal2-icon.swal2-success"
          );
          if (iconElement) {
            iconElement.innerHTML = '<i class="fas fa-smile-beam"></i>';
          }
        },
      });

      localStorage.setItem("isAdmin", "true");

      setTimeout(() => navigate("/admin-panel"), 2000);
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Correo o contraseña incorrectos.");
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center mt-5 pt-5">
      <Row className="w-100 justify-content-center">
        <Col md={8} lg={6}>
          <div className="bg-white p-5 rounded shadow-lg">
            <h2 className="text-center text-success mb-4">Iniciar Sesión</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="email" className="mb-4">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Ingrese su correo"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="password" className="mb-4">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Ingrese su contraseña"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Button variant="success" type="submit" className="w-100 py-2">
                Iniciar Sesión
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
