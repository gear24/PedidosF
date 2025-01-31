import React, { useState, useEffect, useRef } from "react";
import authService from "../Services/authService";



/**
 * Componente `SessionAlert`: Gestiona la alerta de sesión y la renovación del token.
 * 
 * @param {Object} props - Propiedades del componente.
 * @param {Function} props.onSessionRenewed - Función que se ejecuta cuando la sesión se renueva.
 * @param {Function} props.setToken - Función para actualizar el token en el estado global.
 * @param {Function} props.setUser - Función para actualizar el usuario en el estado global.
 * @returns {JSX.Element} - Retorna un componente que muestra una alerta cuando la sesión está a punto de expirar.
 */
const SessionAlert = ({ onSessionRenewed, setToken, setUser }) => {
  const [showAlert, setShowAlert] = useState(false);
  const logoutTimeout = useRef(null); // Usamos useRef para mantener el timeout entre renders
  const dialogRef = useRef(null); // Referencia al diálogo

  useEffect(() => {
    let checkInterval;

        /**
     * Verifica el estado de la sesión y muestra una alerta si el token está a punto de expirar.
     */
    const checkSession = () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const expirationTime = getExpirationTime(token);
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;

      console.log("Token actual:", token);
      console.log("Tiempo hasta expiración (minutos):", timeUntilExpiration / 1000 / 60);

      // Mostrar alerta 1 minuto antes de expirar
      if (timeUntilExpiration <= 1 * 60 * 1000 && timeUntilExpiration > 0) {
        setShowAlert(true);
        if (dialogRef.current) {
          dialogRef.current.showModal(); // Abrir el diálogo
        }

        // Reemplazar el logoutTimeout con el nuevo tiempo de expiración
        if (logoutTimeout.current) clearTimeout(logoutTimeout.current);
        logoutTimeout.current = setTimeout(() => {
          console.log("Cerrando sesión por timeout...");
          handleLogout();
        }, timeUntilExpiration);
      }

      // Si ya expiró, hacer logout inmediatamente
      if (timeUntilExpiration <= 0) {
        console.log("El token ha expirado, cerrando sesión.");
        handleLogout();
      }
    };

    // Revisar inmediatamente al montar
    checkSession();

    // Establecer intervalo para revisar cada 30 segundos
    checkInterval = setInterval(checkSession, 30 * 1000);

    // Limpiar intervalos y timeouts al desmontar
    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (logoutTimeout.current) clearTimeout(logoutTimeout.current);
    };
  }, []);


    /**
   * Obtiene el tiempo de expiración del token.
   * 
   * @param {string} token - Token de autenticación.
   * @returns {number} - Tiempo de expiración en milisegundos.
   */
  const getExpirationTime = (token) => {
    const expiresAt = localStorage.getItem("expires_at");
    if (expiresAt) {
      console.log("Fecha de expiración guardada:", expiresAt);
      return parseInt(expiresAt, 10);
    }
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    return decodedToken.exp * 1000;
  };

    /**
   * Renueva la sesión obteniendo un nuevo token y actualizando el tiempo de expiración.
   */
  const handleRenewSession = async () => {
    try {
      const newToken = await authService.refreshToken();
      if (newToken) {
        console.log("Nuevo token recibido:", newToken);

        onSessionRenewed(newToken);
        const decodedToken = JSON.parse(atob(newToken.split(".")[1]));
        const newExpirationTime = decodedToken.exp * 1000;

        console.log("Nueva fecha de expiración:", newExpirationTime);

        localStorage.setItem("expires_at", newExpirationTime.toString());

        // Reemplazar el logoutTimeout con el nuevo tiempo de expiración
        if (logoutTimeout.current) clearTimeout(logoutTimeout.current);
        logoutTimeout.current = setTimeout(() => {
          console.log("Cerrando sesión por timeout...");
          handleLogout();
        }, newExpirationTime - Date.now());

        setShowAlert(false);
        if (dialogRef.current) {
          dialogRef.current.close(); // Cerrar el diálogo
        }
      } else {
        console.error("No se pudo renovar la sesión");
        handleLogout();
      }
    } catch (error) {
      console.error("Error al renovar el token:", error);
      handleLogout();
    }
  };

    /**
   * Cierra la sesión del usuario, eliminando el token y recargando la página.
   */
  const handleLogout = async () => {
    try {
      await authService.logout(setToken, setUser);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("expires_at");
      window.location.reload();
    } catch (error) {
      console.error("Error durante el logout:", error);
      // Forzar logout aunque haya error
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("expires_at");
      window.location.reload();
    }
  };

  return (
    <>
      {showAlert && (
        <dialog ref={dialogRef} className="bottom active">
          <p>¡Tu sesión está a punto de expirar! ¿Quieres seguir navegando?</p>
          <nav className="right-align">
            <button onClick={handleLogout} className="border lime-border lime9  black-text">
              Cerrar sesión
            </button>
            <button onClick={handleRenewSession} className="border green7 green-border black-text">
              Sí, seguir navegando
            </button>
          </nav>
        </dialog>
      )}
    </>
  );
};

export default SessionAlert;