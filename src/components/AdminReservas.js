import React, { useState, useEffect } from "react";
import { Container, Table, Button, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

const AdminReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [selectedReserva, setSelectedReserva] = useState(null);

  const fetchReservas = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "reservas"));
      const reservasData = [];
      querySnapshot.forEach((doc) => {
        reservasData.push({ id: doc.id, ...doc.data() });
      });
      setReservas(reservasData);
    } catch (error) {
      console.error("Error al cargar reservas:", error);
    }
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
    <Container className="mt-5">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-success text-center py-2">Lista de Reservas</h2>
        <Table className="mt-2" striped bordered hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((reserva) => (
              <tr key={reserva.id}>
                <td>{reserva.nombre}</td>
                <td>{reserva.email}</td>
                <td>{reserva.telefono}</td>
                <td>{reserva.fecha}</td>
                <td>{reserva.estado}</td>
                <td>
                  <Button
                    variant="info"
                    className="me-2"
                    onClick={() => handleViewDetails(reserva)}
                  >
                    Ver Detalles
                  </Button>
                  <Button
                    variant="success"
                    className="me-2"
                    onClick={() => handleAprobar(reserva.id)}
                  >
                    Aprobar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleRechazar(reserva.id)}
                  >
                    Rechazar
                  </Button>
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
                  <strong>Fecha:</strong> {selectedReserva.fecha}
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
  );
};

export default AdminReservas;
