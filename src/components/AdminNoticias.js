import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

const AdminNoticias = () => {
  const navigate = useNavigate();
  const [noticias, setNoticias] = useState([]);

  const cargarNoticias = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "noticias"));
      const datos = [];
      querySnapshot.forEach((doc) => {
        datos.push({ id: doc.id, ...doc.data() });
      });
      setNoticias(datos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
    } catch (error) {
      console.error("Error al cargar noticias:", error);
    }
  };

  useEffect(() => {
    cargarNoticias();
  }, []);

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

  return (
    <Container className="mt-5">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-success text-center py-2">Lista de Noticias</h2>
        <Table className="mt-2" striped bordered hover>
          <thead>
            <tr>
              <th>Título</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {noticias.map((noticia) => (
              <tr key={noticia.id}>
                <td>{noticia.titulo}</td>
                <td>{new Date(noticia.fecha).toLocaleDateString()}</td>
                <td>
                  <Button
                    variant="primary"
                    className="me-2"
                    onClick={() => navigate(`/noticias-eventos/${noticia.id}`)}
                  >
                    <FaEye className="mb-1" /> Ver
                  </Button>
                  <Button
                    variant="secondary"
                    className="me-2"
                    onClick={() =>
                      navigate(`/admin-noticias/editar/${noticia.id}`)
                    }
                  >
                    <FaEdit className="mb-1" /> Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleEliminar(noticia.id)}
                  >
                    <FaTrash className="mb-1" /> Eliminar
                  </Button>
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
