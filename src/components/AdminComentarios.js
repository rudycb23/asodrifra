import React, { useState, useEffect } from "react";
import { Container, Table, Button, Modal } from "react-bootstrap";
import { FaTrash, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

const AdminComentarios = () => {
  const [comentarios, setComentarios] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [comentarioSeleccionado, setComentarioSeleccionado] = useState(null);

  const cargarComentarios = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "comentarios"));
      const comentarios = [];
      querySnapshot.forEach((doc) => {
        comentarios.push({ id: doc.id, ...doc.data() });
      });
      setComentarios(comentarios);
    } catch (error) {
      console.error("Error al cargar comentarios: ", error);
    }
  };

  const handleEliminar = async (id) => {
    Swal.fire({
      title: "Eliminar Comentario",
      text: "¿Estás seguro de eliminar este comentario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(firestore, "comentarios", id));
          setComentarios(
            comentarios.filter((comentario) => comentario.id !== id)
          );
          Swal.fire("Eliminado", "Comentario eliminado con éxito.", "success");
        } catch (error) {
          console.error("Error al eliminar comentario: ", error);
          Swal.fire("Error", "No se pudo eliminar el comentario.", "error");
        }
      }
    });
  };

  const handleVerComentario = (comentario) => {
    setComentarioSeleccionado(comentario);
    setModalShow(true);
  };

  useEffect(() => {
    cargarComentarios();
  }, []);

  return (
    <Container className="mt-5">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-success text-center py-2">Lista de Comentarios</h2>
        <Table className="mt-2" striped bordered hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {comentarios.map((comentario) => (
              <tr key={comentario.id}>
                <td>{comentario.nombre}</td>
                <td>{comentario.correo}</td>
                <td>{comentario.telefono}</td>
                <td>
                  {comentario.fecha
                    ? new Date(comentario.fecha).toLocaleDateString()
                    : "Fecha no disponible"}
                </td>
                <td>
                  <Button
                    variant="info"
                    className="me-2"
                    onClick={() => handleVerComentario(comentario)}
                  >
                    <FaEye className="mb-1" /> Ver
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleEliminar(comentario.id)}
                  >
                    <FaTrash className="mb-1" /> Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Detalles del Comentario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {comentarioSeleccionado && (
              <>
                <p>
                  <strong>Nombre:</strong> {comentarioSeleccionado.nombre}
                </p>
                <p>
                  <strong>Correo:</strong> {comentarioSeleccionado.correo}
                </p>
                <p>
                  <strong>Teléfono:</strong> {comentarioSeleccionado.telefono}
                </p>
                <p>
                  <strong>Comentario:</strong> {comentarioSeleccionado.texto}
                </p>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {comentarioSeleccionado.fecha
                    ? new Date(comentarioSeleccionado.fecha).toLocaleString()
                    : "Fecha no disponible"}
                </p>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalShow(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Container>
  );
};

export default AdminComentarios;
