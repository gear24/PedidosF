import { useNavigate } from 'react-router-dom';

/**
 * Custom hook para manejar la navegación entre las rutas de la aplicación.
 * Utiliza `useNavigate` de `react-router-dom` para realizar las redirecciones.
 * 
 * Métodos disponibles:
 * - goToLogin: Redirige al usuario a la ruta "/login".
 * - goToRegister: Redirige al usuario a la ruta "/register".
 * - goBack: Redirige al usuario a una ruta dinámica (pasada como argumento) como "/home" o "/profile".
 * - goToHome: Redirige al usuario a la ruta principal "/" (home).
 * 
 * @returns {Object} Un objeto con las funciones de navegación.
 */
const useNavigation = () => {
  const navigate = useNavigate();
  const goToLogin = () => navigate("/login");
  const goToRegister = () => navigate("/register");
  const goBack = (route) => navigate(`/${route}`);
  const goToHome = () => navigate("/");

  return { goToLogin, goToRegister, goToHome, goBack };
};

export default useNavigation;
