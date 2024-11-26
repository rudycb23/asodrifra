import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaEnvelope,
  FaComments,
  FaNewspaper,
  FaUserLock,
  FaTools,
  FaLandmark,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

function NavbarComponent() {
  const [expanded, setExpanded] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdminAuthenticated(!!user);
    });

    const handleStorageChange = () => {
      if (!localStorage.getItem("isAdminAuthenticated")) {
        setIsAdminAuthenticated(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      unsubscribe();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [auth]);

  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        signOut(auth)
          .then(() => {
            localStorage.removeItem("isAdminAuthenticated");
            setIsAdminAuthenticated(false);
            navigate("/acceso-admn2-Y25a");
          })
          .catch((error) => console.error("Error al cerrar sesión:", error));
      }
    });
    handleClose();
  };

  const handleToggle = () => setExpanded(!expanded);
  const handleClose = () => setExpanded(false);

  return (
    <Navbar
      bg="light"
      expand="lg"
      className="shadow fixed-top"
      expanded={expanded}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src={`${process.env.PUBLIC_URL}/assets/Logo Asociación de Desarrollo Integral de San Francisco de Goicoechea.png`}
            alt="Logo Asociación"
            height="50"
            className="me-2"
          />
          <span className="fs-6">ASODISFRA</span>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          aria-label="Abrir menú"
          aria-expanded={expanded}
          onClick={handleToggle}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" onClick={handleClose}>
              <FaHome className="mb-1 me-1" />
              Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/salon-comunal" onClick={handleClose}>
            <FaLandmark className="mb-1 me-1" />
              Salón Comunal
            </Nav.Link>
            <Nav.Link as={Link} to="/noticias-eventos" onClick={handleClose}>
              <FaNewspaper className="mb-1 me-1" />
              Noticias y Eventos
            </Nav.Link>
            <Nav.Link as={Link} to="/contacto" onClick={handleClose}>
              <FaEnvelope className="mb-1 me-1" />
              Contacto
            </Nav.Link>
            <Nav.Link as={Link} to="/comentarios" onClick={handleClose}>
              <FaComments className="mb-1 me-1" />
              Comentarios
            </Nav.Link>

            {isAdminAuthenticated && (
              <>
                <Nav.Link as={Link} to="/admin-panel" onClick={handleClose}>
                  <FaTools className="mb-1 me-1" />
                  Gestionar
                </Nav.Link>
                <Nav.Link onClick={handleLogout}>
                  <FaUserLock className="mb-1 me-1" />
                  Cerrar Sesión
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
