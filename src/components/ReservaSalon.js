import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Badge,
} from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ReCAPTCHA from "react-google-recaptcha";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import {
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaMoneyBillWave,
  FaUniversity,
} from "react-icons/fa";
import { motion } from "framer-motion";

const MySwal = withReactContent(Swal);

const variantesElemento = {
  oculto: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const ReservaSalon = () => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [fechas, setFechas] = useState({ aprobadas: [], pendientes: [] });
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
  });
  const [mensajeError, setMensajeError] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);

  const fechaHoy = new Date();

  const convertirFecha = (date) => {
    const año = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const dia = String(date.getDate()).padStart(2, "0");
    return `${año}-${mes}-${dia}`;
  };

  const handleDateChange = (date) => {
    const fecha = convertirFecha(date);
    if (fechas.aprobadas.includes(fecha)) {
      setMensajeError(
        "Esta fecha ya está reservada. Por favor, selecciona otra."
      );
      setFechaSeleccionada(null);
    } else if (fechas.pendientes.includes(fecha)) {
      setMensajeError(
        "Esta fecha ya está en estado pendiente. Por favor, selecciona otra."
      );
      setFechaSeleccionada(null);
    } else if (date < fechaHoy) {
      setMensajeError("No puedes seleccionar una fecha anterior a la actual.");
      setFechaSeleccionada(null);
    } else {
      setMensajeError("");
      setFechaSeleccionada(fecha);
    }
  };

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
    if (!fechaSeleccionada) {
      setMensajeError("Por favor selecciona una fecha válida antes de enviar.");
      return;
    }
    if (!captchaToken) {
      setMensajeError("Por favor completa el CAPTCHA antes de enviar.");
      return;
    }
    if (formData.nombre.length < 3 || formData.telefono.length < 8) {
      setMensajeError("Completa todos los campos correctamente.");
      return;
    }
    MySwal.fire({
      title: "Confirmar Reserva",
      text: `¿Deseas reservar el salón el día ${fechaSeleccionada}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Reservar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#dc3545",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await addDoc(collection(firestore, "reservas"), {
            ...formData,
            fecha: fechaSeleccionada,
            estado: "Pendiente",
            fechaRegistro: new Date().toISOString(),
          });
          setFechas((prev) => ({
            ...prev,
            pendientes: [...prev.pendientes, fechaSeleccionada],
          }));
          setFormData({ nombre: "", telefono: "", email: "" });
          setFechaSeleccionada(null);
          setCaptchaToken(null);
          MySwal.fire({
            title: "Reserva Pendiente",
            text: "Recuerda confirmar la reserva vía WhatsApp y realizar el depósito a una de nuestras cuentas.",
            icon: "info",
            confirmButtonColor: "#28a745",
          });
        } catch (error) {
          Swal.fire("Error", "No se pudo guardar la reserva.", "error");
        }
      }
    });
  };

  const cargarFechas = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "reservas"));
      const fechasOcupadas = { aprobadas: [], pendientes: [] };
      querySnapshot.forEach((doc) => {
        const { fecha, estado } = doc.data();
        if (estado === "Aprobada") {
          fechasOcupadas.aprobadas.push(fecha);
        } else if (estado === "Pendiente") {
          fechasOcupadas.pendientes.push(fecha);
        }
      });
      setFechas(fechasOcupadas);
    } catch (error) {
      console.error("Error al cargar las fechas:", error);
    }
  };

  useEffect(() => {
    cargarFechas();
  }, []);

  const localeES = {
    months: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    days: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  };

  const formatShortWeekday = (locale, date) => localeES.days[date.getDay()];
  const formatMonthYear = (locale, date) =>
    `${localeES.months[date.getMonth()]} ${date.getFullYear()}`;

  return (
    <Container className="reserva-salon mt-5">
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-success text-center fw-bolder">
          <FaCalendarAlt className="mb-1 me-2" />
          Reserva del Salón Comunal
        </h2>
      </div>

      {/* Animaciones para WhatsApp y Depósitos */}
      <Row className="d-flex align-items-center justify-content-center">
        <motion.div
          className="d-flex flex-lg-row flex-column col-12 bg-white rounded shadow-lg px-1"
          variants={variantesElemento}
          initial="oculto"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex-grow-1 p-3 text-center border-lg-end">
            <a
              href="https://wa.me/50687616802"
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none"
            >
              <FaWhatsapp size={50} color="#25D366" className="mt-4" />
            </a>
            <p className="mt-3">
              <strong>
                Toca el ícono para confirmar tu reserva vía WhatsApp
              </strong>
            </p>
          </div>

          <div className="flex-grow-1 p-4 text-center">
            <p className="mb-3">
              <strong>Depósitos</strong>
            </p>

            {/* Sección SINPE Móvil */}
            <div className="d-flex align-items-center justify-content-center mb-3">
              <FaMoneyBillWave size={24} color="#28a745" className="me-2" />
              <p className="mb-0 text-wrap">
                SINPE Móvil: <strong>87616802</strong>
              </p>
            </div>

            {/* Sección Transferencia Bancaria */}
            <div className="d-flex flex-column align-items-center text-center">
              <div className="d-flex align-items-center mb-2">
                <FaUniversity size={24} color="#007bff" className="me-2" />
                <p className="mb-0 text-wrap">Transferencia Bancaria:</p>
              </div>
              <p className="mb-0 text-break">
                <strong>Cuenta IBAN CR12345678901234567890</strong>
              </p>
            </div>
          </div>
        </motion.div>
      </Row>

      {/* Calendario, Badges y Formulario */}
      <Row className="align-items-center my-1">
        <Col lg={6} className="d-flex flex-column">
          <motion.div
            className="calendar-container bg-white p-4 my-2 rounded shadow text-center"
            variants={variantesElemento}
            initial="oculto"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
          >
            <p className="text-center text-muted">
              Selecciona una fecha disponible.
            </p>
            <Calendar
              onChange={handleDateChange}
              tileClassName={({ date }) => {
                const fecha = convertirFecha(date);
                if (fecha === convertirFecha(new Date()))
                  return "bg-success text-white";
                if (fechas.aprobadas.includes(fecha)) return "reservado";
                if (fechas.pendientes.includes(fecha)) return "pendiente";
                return null;
              }}
              minDate={fechaHoy}
              formatShortWeekday={formatShortWeekday}
              formatMonthYear={formatMonthYear}
            />
            <div className="mt-4">
              <Row className="mt-2 text-center">
                <Col
                  xs={6}
                  lg={3}
                  className="d-flex justify-content-center p-1"
                >
                  <Badge
                    bg="success"
                    className="w-100 text-center"
                    style={{ minWidth: "90px" }}
                  >
                    Hoy
                  </Badge>
                </Col>
                <Col
                  xs={6}
                  lg={3}
                  className="d-flex justify-content-center p-1"
                >
                  <Badge
                    bg="primary"
                    className="w-100 text-center"
                    style={{ minWidth: "90px" }}
                  >
                    Seleccionado
                  </Badge>
                </Col>
                <Col
                  xs={6}
                  lg={3}
                  className="d-flex justify-content-center p-1"
                >
                  <Badge
                    bg="warning"
                    className="w-100 text-center text-dark"
                    style={{ minWidth: "90px" }}
                  >
                    Pendiente
                  </Badge>
                </Col>
                <Col
                  xs={6}
                  lg={3}
                  className="d-flex justify-content-center p-1"
                >
                  <Badge
                    bg="danger"
                    className="w-100 text-center"
                    style={{ minWidth: "90px" }}
                  >
                    Reservado
                  </Badge>
                </Col>
              </Row>
            </div>
          </motion.div>
        </Col>

        <Col lg={6}>
          <motion.div
            className="bg-white p-4 mt-2 rounded shadow h-100"
            variants={variantesElemento}
            initial="oculto"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 2 }}
          >
            {mensajeError && <Alert variant="danger">{mensajeError}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="fecha">
                <Form.Label>
                  <strong>
                    <FaCalendarAlt className="mb-1 me-2" />
                    Fecha Seleccionada
                  </strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={
                    fechaSeleccionada || "Selecciona una fecha en el calendario"
                  }
                  readOnly
                />
              </Form.Group>
              <Form.Group controlId="nombre" className="mt-3">
                <Form.Label>
                  <strong>
                    <FaUser className="mb-1 me-2" />
                    Nombre Completo
                  </strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Escribe tu nombre completo"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="telefono" className="mt-3">
                <Form.Label>
                  <strong>
                    <FaPhone className="mb-1 me-2" />
                    Número Telefónico
                  </strong>
                </Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="+506 1234 5678"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="email" className="mt-3">
                <Form.Label>
                  <strong>
                    <FaEnvelope className="mb-1 me-2" />
                    Correo Electrónico
                  </strong>
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="ejemplo@correo.com"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>
              <ReCAPTCHA
                sitekey="6LevGIgqAAAAAEcuEfRRiSRQbdXY6dXdxoR0hmXe"
                onChange={onCaptchaChange}
                className="mt-3"
              />
              <Button variant="success" type="submit" className="mt-4 w-100">
                <FaCalendarAlt className="mb-1 me-2" />
                Solicitar Reserva
              </Button>
            </Form>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default ReservaSalon;
