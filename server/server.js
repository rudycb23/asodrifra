const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fetch = require("node-fetch");
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
} = require("firebase/firestore");
const fs = require("fs");

const app = express();
const PORT = 4000;

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCY4dSE7S7EXzrjtuDYo1fNS8WWSmzDPs8",
  authDomain: "asodisfra-83e90.firebaseapp.com",
  projectId: "asodisfra-83e90",
  storageBucket: "asodisfra-83e90.appspot.com",
  messagingSenderId: "619165109512",
  appId: "1:619165109512:web:9766af1def87358d6830bd",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const corsOptions = {
  origin: [
    "http://localhost:3000", // Para desarrollo local
    "https://www.asodisfra.com", // Reemplaza con tu dominio de producción
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  "/assets/imagenes",
  express.static(path.join(__dirname, "publico/assets/imagenes"))
);
app.use(cors(corsOptions));

// Clave secreta de reCAPTCHA
const RECAPTCHA_SECRET_KEY = "6LevGIgqAAAAAJO_C200LhK6pEN4Kw4cXms_4Hc9";

// Función para validar el token de reCAPTCHA
const validateCaptcha = async (token) => {
  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
      { method: "POST" }
    );
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error al validar CAPTCHA:", error);
    return false;
  }
};

// Configuración de multer para subida de imágenes
const almacenamiento = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "publico/assets/imagenes"));
  },
  filename: (req, file, cb) => {
    const nombreUnico = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${nombreUnico}-${file.originalname}`);
  },
});

const subir = multer({ storage: almacenamiento });

// Endpoints

// Obtener noticia por ID
app.get("/noticias/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const noticiaRef = doc(db, "noticias", id);
    const noticiaSnap = await getDoc(noticiaRef);

    if (!noticiaSnap.exists()) {
      return res.status(404).json({ mensaje: "Noticia no encontrada" });
    }

    res.status(200).json(noticiaSnap.data());
  } catch (error) {
    console.error("Error al obtener la noticia:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
});

// Subir imágenes
app.post("/subir", subir.array("imagenes"), (req, res) => {
  try {
    const rutasArchivos = req.files
      ? req.files.map((archivo) => `/assets/imagenes/${archivo.filename}`)
      : [];
    res.status(200).json({ mensaje: "Subida exitosa", rutasArchivos });
  } catch {
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
});

// Eliminar noticia
app.delete("/noticias/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const noticiaRef = doc(db, "noticias", id);
    const noticiaSnap = await getDoc(noticiaRef);
    if (!noticiaSnap.exists()) {
      return res.status(404).json({ mensaje: "Noticia no encontrada" });
    }
    const noticiaData = noticiaSnap.data();
    const imagenes = noticiaData.imagenes || [];

    imagenes.forEach((imagen) => {
      const rutaImagen = path.join(__dirname, "publico", imagen);
      if (fs.existsSync(rutaImagen)) {
        fs.unlinkSync(rutaImagen);
      }
    });

    await deleteDoc(noticiaRef);

    res.status(200).json({ mensaje: "Noticia eliminada correctamente" });
  } catch {
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
});

// Editar noticia
app.put("/noticias/:id", subir.array("imagenes"), async (req, res) => {
  try {
    if (!req.body || !req.body.datos) {
      return res.status(400).json({ mensaje: "Datos no proporcionados." });
    }

    const { id } = req.params;
    const datos = JSON.parse(req.body.datos);
    const { titulo, contenido, imagenesEliminadas } = datos;

    if (!titulo || !contenido) {
      return res
        .status(400)
        .json({ mensaje: "Título y contenido son obligatorios." });
    }

    const noticiaRef = doc(db, "noticias", id);
    const noticiaSnap = await getDoc(noticiaRef);

    if (!noticiaSnap.exists()) {
      return res.status(404).json({ mensaje: "Noticia no encontrada" });
    }

    const noticiaData = noticiaSnap.data();
    let rutasImagenes = noticiaData.imagenes || [];

    if (imagenesEliminadas && imagenesEliminadas.length > 0) {
      imagenesEliminadas.forEach((imagen) => {
        const rutaImagen = path.join(__dirname, "publico", imagen);
        if (fs.existsSync(rutaImagen)) {
          fs.unlinkSync(rutaImagen);
        }
      });
      rutasImagenes = rutasImagenes.filter(
        (img) => !imagenesEliminadas.includes(img)
      );
    }

    if (req.files && req.files.length > 0) {
      const nuevasRutas = req.files.map(
        (archivo) => `/assets/imagenes/${archivo.filename}`
      );
      rutasImagenes = [...rutasImagenes, ...nuevasRutas];
    }

    const noticiaActualizada = {
      titulo,
      contenido,
      imagenes: rutasImagenes,
      fecha: new Date().toISOString(),
    };

    await updateDoc(noticiaRef, noticiaActualizada);

    res.status(200).json({
      mensaje: "Noticia actualizada correctamente",
      noticia: noticiaActualizada,
    });
  } catch (error) {
    console.error("Error en el servidor al actualizar noticia:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
});

// Endpoint para comentarios con validación de CAPTCHA
app.post("/api/comentarios", async (req, res) => {
  const { nombre, correo, telefono, texto, captchaToken } = req.body;

  if (!captchaToken) {
    return res
      .status(400)
      .json({ success: false, message: "Captcha requerido" });
  }

  const isValidCaptcha = await validateCaptcha(captchaToken);
  if (!isValidCaptcha) {
    return res
      .status(400)
      .json({ success: false, message: "Captcha inválido" });
  }

  try {
    await addDoc(collection(db, "comentarios"), {
      nombre,
      correo,
      telefono,
      texto,
      fecha: new Date().toISOString(),
    });

    res
      .status(200)
      .json({ success: true, message: "Comentario enviado exitosamente" });
  } catch (error) {
    console.error("Error al guardar el comentario:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al enviar el comentario" });
  }
});

// Endpoint para reservas con validación de CAPTCHA
app.post("/api/reservas", async (req, res) => {
  const { nombre, telefono, email, fecha, captchaToken } = req.body;

  if (!captchaToken) {
    return res
      .status(400)
      .json({ success: false, message: "Captcha requerido" });
  }

  const isValidCaptcha = await validateCaptcha(captchaToken);
  if (!isValidCaptcha) {
    return res
      .status(400)
      .json({ success: false, message: "Captcha inválido" });
  }

  try {
    await addDoc(collection(db, "reservas"), {
      nombre,
      telefono,
      email,
      fecha,
      estado: "Pendiente",
      fechaRegistro: new Date().toISOString(),
    });

    res
      .status(200)
      .json({ success: true, message: "Reserva creada exitosamente" });
  } catch (error) {
    console.error("Error al guardar la reserva:", error);
    res.status(500).json({ success: false, message: "Error al crear reserva" });
  }
});

app.get("/api/reservas/fechas", async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, "reservas"));
    const fechasOcupadas = [];

    snapshot.forEach((doc) => {
      const { fecha, estado } = doc.data();
      if (estado === "Pendiente" || estado === "Aprobada") {
        fechasOcupadas.push({ fecha, estado });
      }
    });

    res.status(200).json({
      success: true,
      fechas: fechasOcupadas,
      message: "Fechas ocupadas obtenidas exitosamente",
    });
  } catch (error) {
    console.error("Error al obtener fechas ocupadas:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener fechas ocupadas",
      error,
    });
  }
});

// Middleware de archivos estáticos
app.use(express.static(path.join(__dirname, "publico")));

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
