import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import IdleTimeout from "./components/IdleTimeout";
import ScrollToTop from "./components/ScrollToTop";
import NavbarComponent from "./components/Navbar";
import Footer from "./components/Footer";
import useSessionTimeout from "./components/useSessionTimeout";

// Páginas principales
import PaginaPrincipal from "./components/PaginaPrincipal";
import SalonComunal from "./components/SalonComunal";
import Contacto from "./components/Contacto";
import Comentarios from "./components/Comentarios";
import Noticias from "./components/Noticias";
import DetalleNoticia from "./components/DetalleNoticia";

// Administración
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import AdminNoticias from "./components/AdminNoticias";
import AdminCrearNoticia from "./components/AdminCrearNoticia";
import AdminEditarNoticia from "./components/AdminEditarNoticia";
import AdminReservas from "./components/AdminReservas";
import AdminComentarios from "./components/AdminComentarios";
import ReservaSalon from "./components/ReservaSalon";

// Página de error 404
import NotFound from "./components/NotFound";

// Estilos globales
import "./App.css";

function App() {
  useSessionTimeout();

  return (
    <AuthProvider>
      <div className="App">
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <IdleTimeout />
          <NavbarComponent />
          <ScrollToTop />
          <main className="content mt-5 mb-5">
            <Routes>
              {/* Rutas principales */}
              <Route path="/" element={<PaginaPrincipal />} />
              <Route path="/salon-comunal" element={<SalonComunal />} />
              <Route path="/reserva-salon" element={<ReservaSalon />} />
              <Route path="/comentarios" element={<Comentarios />} />
              <Route path="/contacto" element={<Contacto />} />
              {/* Noticias */}
              <Route path="/noticias-eventos" element={<Noticias />} />
              <Route
                path="/noticias-eventos/:id"
                element={<DetalleNoticia />}
              />
              {/* Rutas protegidas */}
              <Route path="/acceso-admn2-Y25a" element={<Login />} />
              <Route
                path="/admin-panel"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-crear-noticia"
                element={
                  <ProtectedRoute>
                    <AdminCrearNoticia />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-noticias/editar/:id"
                element={
                  <ProtectedRoute>
                    <AdminEditarNoticia />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-noticias"
                element={
                  <ProtectedRoute>
                    <AdminNoticias />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-reservas"
                element={
                  <ProtectedRoute>
                    <AdminReservas />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-comentarios"
                element={
                  <ProtectedRoute>
                    <AdminComentarios />
                  </ProtectedRoute>
                }
              />
              {/* Ruta de error */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
