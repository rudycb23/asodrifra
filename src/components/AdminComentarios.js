import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { FaTrash, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

const AdminComentarios = () => {
  const [comentarios, setComentarios] = useState([]);
  const [comentariosFiltrados, setComentariosFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [comentarioSeleccionado, setComentarioSeleccionado] = useState(null);

  const cargarComentarios = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "comentarios"));
      const comentariosData = [];
      querySnapshot.forEach((doc) => {
        comentariosData.push({ id: doc.id, ...doc.data() });
      });

      // Ordenar comentarios por fecha más reciente
      comentariosData.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setComentarios(comentariosData);
      setComentariosFiltrados(comentariosData);
    } catch (error) {
      console.error("Error al cargar comentarios: ", error);
    }
  };

  const handleBusqueda = (e) => {
    const valor = e.target.value.toLowerCase();
    setBusqueda(valor);

    // Filtrar comentarios por nombre, correo, teléfono, texto del comentario o fecha
    const filtrados = comentarios.filter((comentario) => {
      const fechaFormateada = comentario.fecha
        ? new Date(comentario.fecha).toLocaleDateString()
        : "";

      return (
        comentario.nombre.toLowerCase().includes(valor) ||
        comentario.correo.toLowerCase().includes(valor) ||
        comentario.telefono.toLowerCase().includes(valor) ||
        comentario.texto?.toLowerCase().includes(valor) ||
        fechaFormateada.includes(valor)
      );
    });
    setComentariosFiltrados(filtrados);
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
          setComentariosFiltrados(
            comentariosFiltrados.filter((comentario) => comentario.id !== id)
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
        <h2 className="text-success text-center py-2 fw-bolder">
          Lista de Comentarios
        </h2>
        <Form.Control
          type="text"
          placeholder="Buscar por nombre, correo, teléfono, comentario o fecha..."
          value={busqueda}
          onChange={handleBusqueda}
          className="mb-4"
        />
        <Table responsive className="table-striped table-bordered mt-2">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Fecha</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {comentariosFiltrados.map((comentario) => (
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
                  <Row className="justify-content-center">
                    <Col xs={12} sm="auto" className="mb-2 mb-sm-0">
                      <Button
                        variant="info"
                        className="w-100"
                        onClick={() => handleVerComentario(comentario)}
                      >
                        <FaEye className="mb-1 me-1" />
                        Ver Detalles
                      </Button>
                    </Col>
                    <Col xs={12} sm="auto">
                      <Button
                        variant="danger"
                        className="w-100"
                        onClick={() => handleEliminar(comentario.id)}
                      >
                        <FaTrash className="mb-1 me-1" />
                        Eliminar
                      </Button>
                    </Col>
                  </Row>
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
