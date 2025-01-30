const API_BASE_URL = "http://127.0.0.1:8000"; // URL base de la API

const productService = {
  /**
   * Obtiene todos los productos.
   * @returns {Object} Respuesta de la API con los productos.
   */
  async getAllProducts() {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.json();
  },

  /**
   * Obtiene un producto por su ID.
   * @param {number} productId - ID del producto a obtener.
   * @returns {Object} Respuesta de la API con el producto.
   */
  async getProductById(productId) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.json();
  },

  /**
   * Agrega un nuevo producto.
   * @param {Object} productData - Datos del producto a agregar.
   * @returns {Object} Respuesta de la API con el producto agregado.
   * @throws {Error} Si no hay token disponible.
   */
  async addProduct(productData) {
    const token = localStorage.getItem("token");

    if (!token) throw new Error("Token no disponible");

    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    return response.json();
  },

  /**
   * Actualiza un producto existente.
   * @param {number} productId - ID del producto a actualizar.
   * @param {Object} updatedData - Datos actualizados del producto.
   * @returns {Object} Respuesta de la API con el producto actualizado.
   * @throws {Error} Si no hay token disponible o ha expirado.
   */
  async updateProduct(productId, updatedData) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token no disponible o ha expirado");
    }

    const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Elimina un producto.
   * @param {number} productId - ID del producto a eliminar.
   * @returns {Object} Respuesta de la API con la confirmación de eliminación.
   * @throws {Error} Si no hay token disponible.
   */
  async deleteProduct(productId) {
    const token = localStorage.getItem("token");

    if (!token) throw new Error("Token no disponible");

    const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    return response.json();
  },

  /**
   * Obtiene los productos con su promedio.
   * @returns {Object} Respuesta de la API con los productos y sus promedios.
   */
  async getProductsWithAverage() {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.json();
  },

  /**
   * Guarda una revisión de un producto.
   * @param {number} productId - ID del producto al que se le va a guardar la revisión.
   * @param {Object} reviewData - Datos de la revisión.
   * @returns {Object} Respuesta de la API con la revisión guardada.
   * @throws {Error} Si no hay token disponible.
   */
  async saveProductReview(productId, reviewData) {
    const token = localStorage.getItem("token");

    if (!token) throw new Error("Token no disponible");

    const response = await fetch(`${API_BASE_URL}/api/users/reviews/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });

    return response.json();
  }
};

export default productService;
