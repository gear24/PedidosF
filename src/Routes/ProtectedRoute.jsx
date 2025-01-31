import { Navigate } from "react-router-dom";
import { useAuth } from "../Services/Context";
import { useEffect } from "react";
import { showSnackbar } from "../MicroComponents/showSnackbar";

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      showSnackbar("Debes iniciar sesión para acceder a esta página.", "red", "warning"); // Snackbar de advertencia
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;