import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";  
import { AuthProvider } from "./Services/Context"; 
import Routes from "./Routes/Routes"; // Rutas de la app
import SessionAlert from "./Components/SessionAlert"; // Alerta de sesión
import "beercss";  // Estilos de BeerCSS, porque nos gusta lo sencillo
import "material-dynamic-colors"; // Estilos dinámicos de Material, para dar flow

const App = () => {
  // Establecer los estados de token y usuario
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  // Función para manejar la renovación del token
  const handleSessionRenewed = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  return (
    <BrowserRouter> {/* Lo envolvemos todo en un Router para manejar rutas */}
      <AuthProvider>
        {/* Sesión renovada o alertas? Sesión Alert en acción */}
        <SessionAlert 
          onSessionRenewed={handleSessionRenewed} 
          setToken={setToken} 
          setUser={setUser}
        />
        <Routes /> {/* Rutas que nos llevan a todas las partes de la app */}
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
