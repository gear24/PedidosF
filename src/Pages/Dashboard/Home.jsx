import React, { useEffect, useState } from "react";
import { useAuth } from "../../Services/Context";
import productService from "../../Services/productService";
import { MutatingDots } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../Services/authService";
import Drawer from "../../MicroComponents/Drawer";
import useNavigation from "../../Routes/Navigation";
import Header from "../../MicroComponents/Header";
import ReactStars from "react-stars";

const Home = () => {
  const { user, token, setUser, setToken } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isAuthenticated = !!token; // Si hay token, ya ta logueado
  const navigate = useNavigate();
  const { goToHome } = useNavigation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Estado pa' saber si el menú está abierto
  const toggleDrawer = () => setIsDrawerOpen((prevState) => !prevState);

  const drawerOptions = [
    ...(!isAuthenticated
      ? [
          { label: "Login", link: "/login", icon: "login" },
          { label: "Register", link: "/register", icon: "person_add" },
        ]
      : []),
    ...(isAuthenticated
      ? [{ label: "Crear Producto", link: "/product/create", icon: "create" }]
      : []),
  ];

  // useEffect que se ejecuta pa' cargar los productos cuando el token cambia
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = isAuthenticated
          ? await productService.getAllProducts(token)
          : await productService.getAllProducts();

        // Ordenar los productos por su calificación promedio (de mayor a menor)
        const sortedProducts = response.data.products.sort((a, b) => {
          return b.average_rating - a.average_rating;
        });

        setData(Array.isArray(sortedProducts) ? sortedProducts : []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Función para mostrar un Snackbar personalizado
  const showSnackbar = (
    message,
    color = "blue",
    icon = "info",
    duration = 4000
  ) => {
    const snackbar = document.createElement("div");
    snackbar.className = `snackbar active ${color}`; // Agregamos el color como clase
    snackbar.innerHTML = `
      <i>${icon}</i> <!-- Usamos el ícono proporcionado -->
      <span>${message}</span>
    `;
    document.body.appendChild(snackbar);

    // Ocultar el Snackbar después de `duration` milisegundos
    setTimeout(() => {
      snackbar.classList.remove("active");
      setTimeout(() => {
        document.body.removeChild(snackbar);
      }, 300); // Esperar a que termine la animación
    }, duration);
  };

  // Función para eliminar un producto
  const handleDelete = async (productId) => {
    try {
      // Mostrar un Snackbar de confirmación
      const confirmSnackbar = document.createElement("div");
      confirmSnackbar.className = "snackbar active transparent red4";
      confirmSnackbar.innerHTML = `
        <i>warning</i>
        <span>¿Estás seguro de que quieres eliminar este producto?</span>
        <nav>
          <button onclick="handleConfirmDelete(${productId})" class="red border white-text">Eliminar</button>
          <button onclick="handleCancelDelete()" class="border white-text blue-grey">Cancelar</button>
        </nav>
      `;
      document.body.appendChild(confirmSnackbar);

      // Función para manejar la confirmación de eliminación
      window.handleConfirmDelete = async (id) => {
        try {
          // Llamar al servicio para eliminar el producto
          await productService.deleteProduct(id, token);

          // Actualizar el estado local eliminando el producto
          setData((prevData) =>
            prevData.filter((product) => product.id !== id)
          );

          // Mostrar un Snackbar de éxito
          showSnackbar("Producto eliminado con éxito", "green", "check_circle");
        } catch (error) {
          console.error("Error al eliminar el producto:", error);
          showSnackbar(
            "Hubo un error al eliminar el producto",
            "red",
            "error",
            6000
          );
        } finally {
          document.body.removeChild(confirmSnackbar); // Cerrar el Snackbar de confirmación
        }
      };

      // Función para manejar la cancelación
      window.handleCancelDelete = () => {
        document.body.removeChild(confirmSnackbar); // Cerrar el Snackbar de confirmación
      };
    } catch (error) {
      console.error("Error al mostrar la confirmación:", error);
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
    <main className="responsive surface-dim">
      {/* Esto es pa' mostrar el nombre del usuario y las opciones si está logueado */}
      <Header
        goToHome={goToHome}
        toggleDrawer={toggleDrawer}
        isDrawerOpen={isDrawerOpen}
        drawerOptions={drawerOptions}
      />

      {/* Sección de productos mejor calificados */}
      {/* <h2>Productos mejor calificados</h2>
      <div className="row scroll">
        {data.slice(0, 5).map(
          (
            product,
            index // Mostrar solo los primeros 5 productos
          ) => (
            <article
              key={index}
              className="no-padding border tertiary-border transparent"
            >
              <div className="grid no-space">
                <div className="s4">
                  <img
                    src={product.url}
                    alt={product.name}
                    className="responsive small"
                  />
                </div>
                <div className="s6">
                  <div className="padding">
                    <h5>
                      {product.name} - ${product.price}
                    </h5>
                    <p>⭐ {product.average_rating || "Sin calificación"}</p>
                    <nav className="small-space row">
                      <Link to={`/product/${product.id}`}>
                        <button className="border light-blue-border cyan-text">
                          Ver
                        </button>
                      </Link>
                    </nav>
                  </div>
                </div>
              </div>
            </article>
          )
        )}
      </div> */}
      <div className="medium-space"></div>

      {/* Si no hay productos, mostramos esto */}
      {data.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <div>
          {data.map((product, index) => (
            <article
              key={index}
              className="no-padding border tertiary-border transparent"
            >
              <div className="grid no-space">
                <div className="s4">
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
                    <p>{product.description} </p>
                    <p>
                      <ReactStars
                        count={5}
                        value={product.average_rating || 0}
                        size={24}
                        edit={false}
                        color2={"#ffd700"}
                      />
                    </p>
                    <nav className="small-space row">
                      <Link to={`/product/${product.id}`}>
                        <button className="border light-blue-border cyan-text">
                          Ver
                        </button>
                      </Link>
                      {isAuthenticated && (
                        <>
                          <Link to={`/product/edit/${product.id}`}>
                            <button className="border lime-border amber-text">
                              Editar
                            </button>
                          </Link>
                          <button
                            className="border pink-border red-text"
                            onClick={() => handleDelete(product.id)}
                          >
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

export default Home;
