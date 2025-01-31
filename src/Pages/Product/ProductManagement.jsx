import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import productService from "../../Services/productService";
import { useAuth } from "../../Services/Context";
import Drawer from "../../MicroComponents/Drawer";



const ProductManagement = () => {
  const { id } = useParams(); // Si hay ID, vamos a cargar el producto, si no, es para crear uno nuevo
  const navigate = useNavigate(); // Para hacer el redireccionamiento después de guardar
  const { token } = useAuth(); // Necesitamos el token para guardar el producto

  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    url: "", // Necesitamos una URL de imagen, por si acaso
    average_rating: null, // No olvidemos la calificación promedio
    reviews: [], // Siempre asegurar que haya un array de reseñas
  });

  const [loading, setLoading] = useState(false); // Para el "Guardando..." mientras todo sucede
  const [error, setError] = useState(null); // Si algo sale mal, esto nos lo dice

    const isAuthenticated = !!token;  // Si hay token, ya ta logueado
      const { user } = useAuth();
    
        const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Estado pa' saber si el menú está abierto
        const toggleDrawer = () => setIsDrawerOpen((prevState) => !prevState);
      
        const drawerOptions = [
          ...(!isAuthenticated
            ? [
                
                
                { label: 'Ir a pagina principal', link: '/', icon: 'house' },
              ]
            : []),
          ...(isAuthenticated
            ? [
                { label: 'Ir a pagina principal', link: '/', icon: 'house' },
              ]
            : []),
        ];

  // Esto es para cargar el producto si ya tenemos un ID (porque, si no, estamos creando algo nuevo)
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          setLoading(true); // caragandoooooo
          const response = await productService.getProductById(id);
          setProduct({
            ...response.data,
            reviews: response.data.reviews || [], // Siempre asegurarnos de que "reviews" sea un array
          });
        } catch (error) {
          setError("Error al cargar el producto"); // Algo salió mal, aquí está el mensaje
        } finally {
          setLoading(false); // Cuando termine la carga, ya no estamos cargando
        }
      };

      fetchProduct(); // Llamamos a la función para que haga magia
    }
  }, [id]);

  // Esta función se encarga de actualizar el estado de nuestro producto
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };
  const handleLogout = async () => {
    try {
      await authService.logout(setToken, setUser); 
      navigate("/");  // Nos vamos al home después de cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Aquí es donde se guarda el producto, ya sea para actualizar o crear
  const handleSubmit = async (e) => {
    e.preventDefault(); // Que no se recargue la página
    setLoading(true); // Y mientras se guarda, que no se pueda hacer nada más

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
      navigate("/"); // Nos redirigimos al home después de guardar
    } catch (error) {
      setError("Error al guardar el producto"); // Si algo falla, lo informamos
    } finally {
      setLoading(false); // Cuando termine, ya no estamos cargando
    }


  };

  return (
    <main className="responsive">
      <aside className="right padding round" style={{ position: 'fixed' }}>
        <button onClick={toggleDrawer} className="red4">
          {isDrawerOpen ? "Cerrar Menú" : "Abrir Menú"}
        </button>
      </aside>
      <h1>{id ? "Editar Producto" : "Crear Producto"}</h1> {/* Cambiamos el título según si es creación o edición */}
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Si hay error, lo mostramos en rojo */}

      <form onSubmit={handleSubmit}>
        <fieldset className="red-border">
          <legend className="white-text">Datos del Producto</legend>

          {/* Campo para el nombre */}
          <div className="field red-border label">
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="red-border"
              required
            />
            <label className="white-text">Nombre</label>
          </div>

          {/* Campo para el precio */}
          <div className="field red-border label">
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="red-border"
              required
            />
            <label className="white-text">Precio</label>
          </div>

          {/* Campo para la descripción */}
          <div className="field red-border label">
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="red-border"
              required
            />
            <label className="white-text">Descripción</label>
          </div>

          {/* Campo para la URL de la imagen */}
          <div className="field red-border label">
            <input
              type="url"
              name="url"
              value={product.url}
              onChange={handleChange}
              className="red-border"
              required
            />
            <label className="white-text">URL de la Imagen</label>
          </div>

          {/* Botón para enviar el formulario */}
          <div className="middle-align center-align">
            <button
              type="submit"
              className="responsive red3 black-text"
              disabled={loading}
            >
              {loading ? "Guardando..." : id ? "Actualizar" : "Crear"}
            </button>
          </div>
        </fieldset>
      </form>


      {isDrawerOpen && (
        <Drawer
          options={drawerOptions}
          closeDrawer={toggleDrawer}
          user={user}
          handleLogout={handleLogout} // Pasamos handleLogout como prop
        />
      )}
    </main>
  );
};

export default ProductManagement;