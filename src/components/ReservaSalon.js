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
import {
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaMoneyBillWave,
  FaUniversity,
} from "react-icons/fa";

const MySwal = withReactContent(Swal);

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
          const response = await fetch("http://localhost:4000/api/reservas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...formData,
              fecha: fechaSeleccionada,
              captchaToken,
            }),
          });

          const data = await response.json();
          if (data.success) {
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
          } else {
            setMensajeError(data.message || "Error al validar el CAPTCHA.");
          }
        } catch (error) {
          console.error("Error al enviar la reserva:", error);
          Swal.fire("Error", "No se pudo enviar la reserva.", "error");
        }
      }
    });
  };

  const cargarFechas = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/reservas/fechas");
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        const aprobadas = data.fechas
          .filter((item) => item.estado === "Aprobada")
          .map((item) => item.fecha);
        const pendientes = data.fechas
          .filter((item) => item.estado === "Pendiente")
          .map((item) => item.fecha);

        setFechas({
          aprobadas,
          pendientes,
        });
      } else {
        console.error("Error en la respuesta:", data.message);
      }
    } catch (error) {
      console.error("Error al cargar fechas:", error);
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
        <h2 className="text-success text-center">
          <FaCalendarAlt className="mb-1 me-2" />
          Reserva del Salón Comunal
        </h2>
        <p className="text-center text-muted">
          Selecciona una fecha disponible para reservar el salón.
        </p>
      </div>

      <Row className="align-items-stretch mt-2">
        {/* Columna para el calendario */}
        <Col lg={6} className="d-flex flex-column mt-5 mb-4">
          <div
            className="calendar-container bg-white p-4 mt-2 mb-5 rounded shadow text-center h-90"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",

              transform: "scale(1.3)",
              overflow: "hidden",
            }}
          >
            <div style={{ flexGrow: 1 }}>
              <Calendar
                onChange={handleDateChange}
                tileClassName={({ date }) => {
                  const fecha = convertirFecha(date);
                  if (fechas.aprobadas.includes(fecha)) return "reservado";
                  if (fechas.pendientes.includes(fecha)) return "pendiente";
                  if (convertirFecha(date) === convertirFecha(fechaHoy))
                    return "hoy";

                  return null;
                }}
                minDate={fechaHoy}
                formatShortWeekday={formatShortWeekday}
                formatMonthYear={formatMonthYear}
              />
            </div>
            <div className="mt-4 ">
              <Row className="mt-1 text-center">
                <Col
                  xs={6}
                  lg={3}
                  className="d-flex justify-content-center p-1 "
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
                  className="d-flex justify-content-cente p-1 "
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
                  className="d-flex justify-content-center p-1 "
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
                  className="d-flex justify-content-center p-1 "
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
          </div>
        </Col>

        <Col lg={6}>
          <div className="bg-white p-4 rounded shadow h-100">
            {mensajeError && <Alert variant="danger">{mensajeError}</Alert>}
            <Form onSubmit={handleSubmit} className="h-100 d-flex flex-column">
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
                  required
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
                  required
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
                  required
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
                  required
                />
              </Form.Group>
              <ReCAPTCHA
                sitekey="6LevGIgqAAAAAEcuEfRRiSRQbdXY6dXdxoR0hmXe"
                onChange={onCaptchaChange}
                className="mt-3"
              />
              <Button
                variant="success"
                type="submit"
                className="mt-4 w-100"
                style={{ marginTop: "auto" }}
              >
                <FaCalendarAlt className="mb-1 me-2" />
                Solicitar Reserva
              </Button>
            </Form>
          </div>
        </Col>
      </Row>

      <Row className="p-3 justify-content-between">
        <Col
          lg={5}
          className="mx-auto d-flex flex-column align-items-center bg-white my-1 p-4 rounded shadow"
        >
          <a
            href="https://wa.me/50687616802"
            target="_blank"
            rel="noopener noreferrer"
            className="text-decoration-none"
          >
            <FaWhatsapp size={50} color="#25D366" />
          </a>
          <p className="mt-2 text-center">
            <strong>Toca el ícono y confirma tu reserva vía WhatsApp</strong>
          </p>
        </Col>

        <Col
          lg={6}
          className="d-flex flex-column align-items-center bg-white p-4 my-1 rounded shadow"
        >
          <p className="text-center mb-3">
            <strong>Depósitos</strong>
          </p>
          <div className="d-flex align-items-center mb-2">
            <FaMoneyBillWave size={24} color="#28a745" className="me-2" />
            <p className="mb-0">
              SINPE Móvil: <strong>87616802</strong>
            </p>
          </div>
          <div className="d-flex align-items-center">
            <FaUniversity size={24} color="#007bff" className="me-2" />
            <p className="mb-0 text-center">
              Transferencia Bancaria:{" "}
              <strong>Cuenta IBAN CR12345678901234567890</strong>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ReservaSalon;
