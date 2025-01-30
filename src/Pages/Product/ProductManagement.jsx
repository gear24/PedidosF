import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import productService from "../../Services/productService";
import { useAuth } from "../../Services/Context";

const ProductManagement = () => {
  const { id } = useParams();  // si hay ID, vamos a cargar el producto, si no, es para crear uno nuevo
  const navigate = useNavigate();  // Para hacer el redireccionamiento después de guardar
  const { token } = useAuth();  // Necesitamos el token para guardar el producto

  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    url: "",  // Necesitamos una URL de imagen, por si acaso
    average_rating: null,  // No olvidemos la calificación promedio
    reviews: [],  // Siempre asegurar que haya un array de reseñas
  });

  const [loading, setLoading] = useState(false);  // Para el "Guardando..." mientras todo sucede
  const [error, setError] = useState(null);  // Si algo sale mal, esto nos lo dice

  // Esto es para cargar el producto si ya tenemos un ID (porque, si no, estamos creando algo nuevo)
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          setLoading(true);  // caragandoooooo
          const response = await productService.getProductById(id);
          setProduct({
            ...response.data,
            reviews: response.data.reviews || [],  // Siempre asegurarnos de que "reviews" sea un array
          });
        } catch (error) {
          setError("Error al cargar el producto");  // Algo salió mal, aquí está el mensaje
        } finally {
          setLoading(false);  // Cuando termine la carga, ya no estamos cargando
        }
      };

      fetchProduct();  // Llamamos a la función para que haga magia
    }
  }, [id]);

  // Esta función se encarga de actualizar el estado de nuestro producto
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // Aquí es donde se guarda el producto, ya sea para actualizar o crear
  const handleSubmit = async (e) => {
    e.preventDefault();  // Que no se recargue la página
    setLoading(true);  // Y mientras se guarda, que no se pueda hacer nada más

    try {
      if (id) {
        // Si hay ID, estamos actualizando
        await productService.updateProduct(id, product, token);
        alert("Producto actualizado con éxito");
      } else {
        // Si no hay ID, estamos creando un nuevo producto
        await productService.addProduct(product, token);
        alert("Producto creado con éxito");
      }
      navigate("/");  // Nos redirigimos al home después de guardar
    } catch (error) {
      setError("Error al guardar el producto", error);  // Si algo falla, lo informamos
    } finally {
      setLoading(false);  // Cuando termine, ya no estamos cargando
    }
  };

  return (
    <div>
      <h2>{id ? "Editar Producto" : "Crear Producto"}</h2>  {/* Cambiamos el título según si es creación o edición */}
      {error && <p style={{ color: "red" }}>{error}</p>}  {/* Si hay error, lo mostramos en rojo */}

      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input type="text" name="name" value={product.name} onChange={handleChange} required />

        <label>Precio:</label>
        <input type="number" name="price" value={product.price} onChange={handleChange} required />

        <label>Descripción:</label>
        <textarea name="description" value={product.description} onChange={handleChange} required />

        <label>URL de Imagen:</label>
        <input type="url" name="url" value={product.url} onChange={handleChange} required />

        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : id ? "Actualizar" : "Crear"}  {/* Dependiendo del estado, mostramos un mensaje distinto */}
        </button>
      </form>
    </div>
  );
};

export default ProductManagement;
