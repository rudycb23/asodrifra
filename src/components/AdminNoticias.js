import React, { useState, useEffect } from "react";
import { Container, Table, Button, Row, Col, Form } from "react-bootstrap";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

const AdminNoticias = () => {
  const navigate = useNavigate();
  const [noticias, setNoticias] = useState([]);
  const [noticiasFiltradas, setNoticiasFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const cargarNoticias = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "noticias"));
      const datos = [];
      querySnapshot.forEach((doc) => {
        datos.push({ id: doc.id, ...doc.data() });
      });

      // Ordenar noticias por fecha más reciente primero
      datos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setNoticias(datos);
      setNoticiasFiltradas(datos);
    } catch (error) {
      console.error("Error al cargar noticias:", error);
    }
  };

  const handleBusqueda = (e) => {
    const valor = e.target.value.toLowerCase();
    setBusqueda(valor);

    // Filtrar noticias dinámicamente por título y fecha
    const filtradas = noticias.filter((noticia) => {
      const fechaFormateada = new Date(noticia.fecha).toLocaleDateString();
      return (
        noticia.titulo.toLowerCase().includes(valor) ||
        fechaFormateada.includes(valor)
      );
    });

    setNoticiasFiltradas(filtradas);
  };

  const handleEliminar = async (id) => {
    const noticia = noticias.find((noticia) => noticia.id === id);
    Swal.fire({
      title: "Eliminar Noticia",
      text: `¿Estás seguro de eliminar la noticia "${noticia.titulo}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(firestore, "noticias", id));
          setNoticias(noticias.filter((noticia) => noticia.id !== id));
          setNoticiasFiltradas(noticiasFiltradas.filter((noticia) => noticia.id !== id));
          Swal.fire({
            title: "Noticia Eliminada",
            text: "La noticia ha sido eliminada correctamente.",
            icon: "success",
            confirmButtonColor: "#28a745",
          });
        } catch (error) {
          console.error("Error al eliminar noticia:", error);
          Swal.fire({
            title: "Error",
            text: "Hubo un error al intentar eliminar la noticia.",
            icon: "error",
            confirmButtonColor: "#dc3545",
          });
        }
      }
    });
  };

  useEffect(() => {
    cargarNoticias();
  }, []);

  return (
    <Container className="mt-5">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-success text-center py-2 fw-bolder">
          Lista de Noticias
        </h2>
        <Form.Control
          type="text"
          placeholder="Buscar por título o fecha..."
          value={busqueda}
          onChange={handleBusqueda}
          className="mb-4"
        />
        <Table responsive className="table-striped table-bordered">
          <thead>
            <tr>
              <th>Título</th>
              <th>Fecha</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {noticiasFiltradas.map((noticia) => (
              <tr key={noticia.id}>
                <td>{noticia.titulo}</td>
                <td>{new Date(noticia.fecha).toLocaleDateString()}</td>
                <td>
                  <Row className="justify-content-center">
                    <Col xs={12} sm="auto" className="mb-2 mb-sm-0">
                      <Button
                        variant="primary"
                        className="w-100"
                        onClick={() =>
                          navigate(`/noticias-eventos/${noticia.id}`)
                        }
                      >
                        <FaEye className="mb-1 me-1" />
                        Ver
                      </Button>
                    </Col>
                    <Col xs={12} sm="auto" className="mb-2 mb-sm-0">
                      <Button
                        variant="secondary"
                        className="w-100"
                        onClick={() =>
                          navigate(`/admin-noticias/editar/${noticia.id}`)
                        }
                      >
                        <FaEdit className="mb-1 me-1" />
                        Editar
                      </Button>
                    </Col>
                    <Col xs={12} sm="auto">
                      <Button
                        variant="danger"
                        className="w-100"
                        onClick={() => handleEliminar(noticia.id)}
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
      </div>
    </Container>
  );
};

export default AdminNoticias;
