import React, { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Row, Col, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { motion } from "framer-motion";

const variantesSeccion = {
  oculto: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const AdminReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [reservasFiltradas, setReservasFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [selectedReserva, setSelectedReserva] = useState(null);

  const fetchReservas = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "reservas"));
      const reservasData = [];
      querySnapshot.forEach((doc) => {
        reservasData.push({ id: doc.id, ...doc.data() });
      });

      // Ordenar reservas: pendientes primero, luego las demás por fecha descendente
      reservasData.sort((a, b) => {
        if (a.estado === "Pendiente" && b.estado !== "Pendiente") return -1;
        if (a.estado !== "Pendiente" && b.estado === "Pendiente") return 1;
        if (a.estado !== "Pendiente" && b.estado !== "Pendiente") {
          return new Date(b.fecha) - new Date(a.fecha); 
        }
        return new Date(a.fecha) - new Date(b.fecha);
      });

      setReservas(reservasData);
      setReservasFiltradas(reservasData);
    } catch (error) {
      console.error("Error al cargar reservas:", error);
    }
  };

  const handleBusqueda = (e) => {
    const valor = e.target.value.toLowerCase();
    setBusqueda(valor);

    // Filtrar reservas dinámicamente
    const filtradas = reservas.filter((reserva) => {
      const fechaFormateada = new Date(reserva.fecha).toLocaleDateString();
      return (
        reserva.nombre.toLowerCase().includes(valor) ||
        reserva.email.toLowerCase().includes(valor) ||
        reserva.telefono.toLowerCase().includes(valor) ||
        reserva.estado.toLowerCase().includes(valor) ||
        fechaFormateada.includes(valor) 
      );
    });

    setReservasFiltradas(filtradas);
  };

  const handleAprobar = async (id) => {
    try {
      const reserva = reservas.find((reserva) => reserva.id === id);
      await updateDoc(doc(firestore, "reservas", id), { estado: "Aprobada" });
      setReservas(
        reservas.map((r) => (r.id === id ? { ...r, estado: "Aprobada" } : r))
      );
      Swal.fire(
        "¡Aprobada!",
        `La reserva para ${reserva.nombre} ha sido aprobada.`,
        "success"
      );
    } catch (error) {
      console.error("Error al aprobar reserva:", error);
    }
  };

  const handleRechazar = async (id) => {
    try {
      const reserva = reservas.find((reserva) => reserva.id === id);
      await updateDoc(doc(firestore, "reservas", id), { estado: "Rechazada" });
      setReservas(
        reservas.map((r) => (r.id === id ? { ...r, estado: "Rechazada" } : r))
      );
      Swal.fire(
        "¡Rechazada!",
        `La reserva para ${reserva.nombre} ha sido rechazada.`,
        "success"
      );
    } catch (error) {
      console.error("Error al rechazar reserva:", error);
    }
  };

  const handleViewDetails = (reserva) => {
    setSelectedReserva(reserva);
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  return (
    <motion.div
      variants={variantesSeccion}
      initial="oculto"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <Container className="mt-5">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-success text-center py-2 fw-bolder">
            Lista de Reservas
          </h2>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre, correo, teléfono, estado o fecha..."
            value={busqueda}
            onChange={handleBusqueda}
            className="mb-4"
          />
          <Table responsive className="table-striped table-bordered">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservasFiltradas.map((reserva) => (
                <tr key={reserva.id}>
                  <td>{reserva.nombre}</td>
                  <td>{reserva.email}</td>
                  <td>{reserva.telefono}</td>
                  <td>{new Date(reserva.fecha).toLocaleDateString()}</td>
                  <td
                    className={`fw-bold ${
                      reserva.estado === "Pendiente"
                        ? "text-warning"
                        : reserva.estado === "Aprobada"
                        ? "text-success"
                        : "text-danger"
                    }`}
                  >
                    {reserva.estado}
                  </td>
                  <td>
                    <Row className="justify-content-center">
                      <Col xs={12} sm="auto" className="mb-2 mb-sm-0">
                        <Button
                          variant="info"
                          className="w-100"
                          onClick={() => handleViewDetails(reserva)}
                        >
                          Ver Detalles
                        </Button>
                      </Col>
                      <Col xs={12} sm="auto" className="mb-2 mb-sm-0">
                        <Button
                          variant="success"
                          className="w-100"
                          onClick={() => handleAprobar(reserva.id)}
                        >
                          Aprobar
                        </Button>
                      </Col>
                      <Col xs={12} sm="auto">
                        <Button
                          variant="danger"
                          className="w-100"
                          onClick={() => handleRechazar(reserva.id)}
                        >
                          Rechazar
                        </Button>
                      </Col>
                    </Row>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Modal
            show={!!selectedReserva}
            onHide={() => setSelectedReserva(null)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Detalles de la Reserva</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedReserva && (
                <>
                  <p>
                    <strong>Nombre:</strong> {selectedReserva.nombre}
                  </p>
                  <p>
                    <strong>Correo:</strong> {selectedReserva.email}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {selectedReserva.telefono}
                  </p>
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {new Date(selectedReserva.fecha).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Estado:</strong> {selectedReserva.estado}
                  </p>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setSelectedReserva(null)}
              >
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </Container>
    </motion.div>
  );
};

export default AdminReservas;
