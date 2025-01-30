const API_BASE_URL = "http://127.0.0.1:8000"; // URL base de la API

const authService = {
  /**
   * Inicia sesión con las credenciales del usuario y guarda el token.
   * @param {Object} credentials - Credenciales del usuario (email, password).
   * @param {Function} setUser - Función para actualizar el estado del usuario.
   * @param {Function} setToken - Función para actualizar el estado del token.
   * @returns {Object} Respuesta de la API.
   */
  async login(credentials, setUser, setToken) {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok && data.data.token) {
      setUser({ email: data.data.user.email, name: data.data.user.name });
      setToken(data.data.token); // Establecer el token en el contexto
      localStorage.setItem("token", data.data.token); // Guardar el token
      console.log("Login exitoso:", data.data.token);
    } else {
      console.log("Error en el login:", response.message || "No se obtuvo un token");
    }

    return data;
  },

  /**
   * Obtiene el token desde localStorage.
   * @returns {string|null} El token almacenado, o null si no existe.
   */
  getToken() {
    return localStorage.getItem("token");
  },

  /**
   * Cierra sesión, limpiando el token y el usuario.
   * @param {Function} setToken - Función para actualizar el estado del token.
   * @param {Function} setUser - Función para actualizar el estado del usuario.
   */
  async logout(setToken, setUser) {
    const token = localStorage.getItem("token");

    if (!token) return;

    await fetch(`${API_BASE_URL}/api/logout`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  },

  /**
   * Refresca el token de acceso.
   * @returns {string|null} El nuevo token si la operación fue exitosa, o null si falló.
   */
  async refreshToken() {
    const token = localStorage.getItem("token");

    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/api/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (response.ok && data.data.token) {
      localStorage.setItem("token", data.data.token); // Guardar el nuevo token
      return data.data.token;
    }

    return null;
  },
};

export default authService;
