import { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const IdleTimeout = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutos

  useEffect(() => {
    let timeout;

    const handleOnIdle = () => {
      signOut(auth)
        .then(() => {
          Swal.fire(
            "Sesión Expirada",
            "Por inactividad se cerró tu sesión.",
            "info"
          );
          navigate("/acceso-admn2-Y25a");
        })
        .catch((error) => console.error("Error al cerrar sesión:", error));
    };

    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(handleOnIdle, TIMEOUT_DURATION);
    };

    window.addEventListener("mousemove", resetTimeout);
    window.addEventListener("keypress", resetTimeout);

    resetTimeout();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimeout);
      window.removeEventListener("keypress", resetTimeout);
    };
  }, [auth, navigate]);

  return null;
};

export default IdleTimeout;
