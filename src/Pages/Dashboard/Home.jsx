import React, { useEffect, useState } from "react"; 
import { useAuth } from "../../Services/Context"; 
import userService from "../../Services/userService"; 
import productService from "../../Services/productService"; 
import { MutatingDots } from "react-loader-spinner"; 
import { Link, useNavigate } from "react-router-dom"; 
import authService from "../../Services/authService";

const Home = () => {
  // Sacamos el usuario y token del contexto
  const { user, token, setUser, setToken } = useAuth();
  // Acá creamos los estados pa' los productos, si estamos cargando o si hay error
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const isAuthenticated = !!token;  // Si hay token, ya ta logueado
  const navigate = useNavigate();  

  // useEffect que se ejecuta pa' cargar los productos cuando el token cambia
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = isAuthenticated
          ? await productService.getAllProducts(token)  // Si ta logueado, pedimos los productos con el token
          : await productService.getAllProducts(); // Si no, los pedimos sin token

        console.log("📥 Datos recibidos:", response);

        // Esto lo hacemos pa' actualizar los productos con los datos que recibimos
        setData(Array.isArray(response.data.products) ? response.data.products : []);
        console.log(isAuthenticated ? "Si ta logueado" : "No ta logueado");
      } catch (error) {
        setError(error.message); // Si hubo un error, lo guardamos
      } finally {
        setLoading(false); // Al final, le decimos que ya no estamos cargando
      }
    };

    fetchData();
  }, [token]);  // Esto se vuelve a ejecutar cuando el token cambia

  // Función pa' eliminar productos
  const handleDelete = async (id) => {
    try {
      const response = await productService.deleteProduct(id, token); 
      console.log("Producto eliminado:", response);
      // Filtramos el producto eliminado de la lista
      setData((prevData) => prevData.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Error al eliminar el producto:", error.message);
    }
  };

  // Función pa' cerrar sesión
  const handleLogout = async () => {
    try {
      await authService.logout(setToken, setUser); 
      navigate("/");  // Nos vamos al home después de cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Si estamos cargando, mostramos el loader
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <MutatingDots color="#00BFFF" height={100} width={100} />
      </div>
    );
  }

  // Si hubo algún error, lo mostramos
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="home">
      {/* Esto es pa' mostrar el nombre del usuario y las opciones si está logueado */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Bienvenido, {user?.name || "Usuario"}</h1>
        {isAuthenticated && (
          <div>
            {/* Botón para crear un producto */}
            <Link to="/product/create">
              <button style={{ marginRight: "10px" }}>Crear Producto</button>
            </Link>
            {/* Botón para cerrar sesión */}
            <button onClick={handleLogout}>Cerrar Sesión</button>
          </div>
        )}
      </div>

      {/* Si no hay productos, mostramos esto */}
      {data.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <div>
          {/* Si hay productos, los mostramos en una lista */}
          {data.map((product, index) => (
            <article key={index} className="no-padding">
              <div className="grid no-space">
                <div className="s4">
                  {/* Imagen del producto */}
                  <img
                    src={product.url}
                    alt={product.name}
                    className="responsive"
                  />
                </div>
                <div className="s6">
                  <div className="padding">
                    <h5>
                      {product.name} - ${product.price}
                    </h5>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                    <nav>
                      {/* Enlace pa' ver detalles del producto */}
                      <Link to={`/product/${product.id}`}>
                        <button>Ver</button>
                      </Link>
                      {isAuthenticated && (
                        <>
                          {/* Enlaces pa' editar y eliminar producto */}
                          <Link to={`/product/edit/${product.id}`}>
                            <button>Editar</button>
                          </Link>
                          <button onClick={() => handleDelete(product.id)}>
                            Eliminar
                          </button>
                        </>
                      )}
                    </nav>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
