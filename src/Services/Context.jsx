import { createContext, useState, useContext, useEffect } from "react";

// Crear el contexto
export const Context = createContext();

// Crear el hook para acceder facilmente al contexto
export const useAuth = () => useContext(Context);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Guardar token y usuario en localStorage cuando cambien
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <Context.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </Context.Provider>
  );
};
