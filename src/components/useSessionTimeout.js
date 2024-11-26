import { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";

const useSessionTimeout = () => {
  const auth = getAuth();
  const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutos

  useEffect(() => {
    let timeout;

    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        signOut(auth)
          .then(() => console.log("Sesión cerrada por inactividad."))
          .catch((error) => console.error("Error al cerrar sesión:", error));
      }, TIMEOUT_DURATION);
    };

    window.addEventListener("mousemove", resetTimeout);
    window.addEventListener("keypress", resetTimeout);

    resetTimeout();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimeout);
      window.removeEventListener("keypress", resetTimeout);
    };
  }, [auth]);
};

export default useSessionTimeout;
