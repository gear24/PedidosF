import { useContext } from "react";
import { Context } from "../Services/Context";

const API_BASE_URL = "http://127.0.0.1:8000"; // URL base de la API

const userService = {
  /**
   * Obtiene todos los usuarios.
   * @returns {Object} Respuesta de la API con los usuarios.
   * @throws {Error} Si el token no está disponible.
   */
  async getAllUsers() {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token no disponible");
    }

    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.json();
  },

  /**
   * Obtiene el usuario actual.
   * @returns {Object} Respuesta de la API con el usuario actual.
   * @throws {Error} Si el token no está disponible.
   */
  async getCurrentUser() {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token no disponible");
    }

    const response = await fetch(`${API_BASE_URL}/api/user/current`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.json();
  },

  /**
   * Agrega un nuevo usuario (registro y login en una sola acción).
   * @param {Object} userData - Datos del nuevo usuario.
   * @returns {Object} Respuesta de la API con el usuario creado.
   */
  async addUser(userData) {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    }).then(res => res.json());

    return response;
  },

  /**
   * Actualiza un usuario existente.
   * @param {number} userId - ID del usuario a actualizar.
   * @param {Object} updatedData - Nuevos datos del usuario.
   * @returns {Object} Respuesta de la API con el usuario actualizado.
   * @throws {Error} Si el token no está disponible.
   */
  async updateUser(userId, updatedData) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token no disponible");
    }

    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    return response.json();
  },

  /**
   * Elimina un usuario.
   * @param {number} userId - ID del usuario a eliminar.
   * @returns {Object} Respuesta de la API con la confirmación de eliminación.
   * @throws {Error} Si el token no está disponible.
   */
  async deleteUser(userId) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token no disponible");
    }

    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.json();
  },

  /**
   * Obtiene las revisiones del usuario.
   * @returns {Object} Respuesta de la API con las revisiones del usuario.
   * @throws {Error} Si el token no está disponible.
   */
  async getUserReviews() {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token no disponible");
    }

    const response = await fetch(`${API_BASE_URL}/api/users/reviews`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.json();
  }
};

export default userService;
