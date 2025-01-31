import React, { useEffect, useState } from "react"; 
import { useAuth } from "../../Services/Context"; 
import userService from "../../Services/userService"; 
import productService from "../../Services/productService"; 
import { MutatingDots } from "react-loader-spinner"; 
import { Link, useNavigate } from "react-router-dom"; 
import authService from "../../Services/authService";
import Drawer from "../../MicroComponents/Drawer";


const Home = () => {
  // Sacamos el usuario y token del contexto
  const { user, token, setUser, setToken } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isAuthenticated = !!token;  // Si hay token, ya ta logueado
  const navigate = useNavigate();  

  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Estado pa' saber si el menú está abierto
  const toggleDrawer = () => setIsDrawerOpen((prevState) => !prevState);

  const drawerOptions = [
    ...(!isAuthenticated
      ? [
          { label: 'Login', link: '/login', icon: 'login' },
          { label: 'Register', link: '/register', icon: 'person_add' },
        ]
      : []),
    ...(isAuthenticated
      ? [
          { label: 'Crear Producto', link: '/product/create', icon: 'create' },
        ]
      : []),
  ];
  

  // useEffect que se ejecuta pa' cargar los productos cuando el token cambia
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = isAuthenticated
          ? await productService.getAllProducts(token)
          : await productService.getAllProducts();

        setData(Array.isArray(response.data.products) ? response.data.products : []);
      } catch (error) {
        setError(error.message); 
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Función pa' cerrar sesión
  const handleLogout = async () => {
    try {
      await authService.logout(setToken, setUser); 
      navigate("/");  // Nos vamos al home después de cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  const handleDelete = async (productId) => {
    try {
      // Confirmar antes de eliminar
      const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este producto?");
      if (!confirmDelete) return; // Si el usuario cancela, no hacemos nada
  
      // Llamar al servicio para eliminar el producto
      await productService.deleteProduct(productId, token);
      console.log("Producto eliminado con éxito:", productId);
  
      // Actualizar el estado local eliminando el producto
      setData((prevData) => prevData.filter((product) => product.id !== productId));
  
      alert("Producto eliminado con éxito");
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      alert("Hubo un error al eliminar el producto");
    }
  };

  // Si estamos cargando, mostramos el loader
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Bienvenido, {user?.name || "Usuario"}</h1>
        <aside className="right padding round" style={{ position: 'fixed' }}>
        <button onClick={toggleDrawer} className="border pink-border orange-text">
          {isDrawerOpen ? "Cerrar Menú" : "Abrir Menú"}
        </button>
      </aside>


      </div>

      {/* Si no hay productos, mostramos esto */}
      {data.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <div>
          {data.map((product, index) => (
            <article key={index} className="no-padding border tertiary-border transparent ">
              <div className="grid no-space">
                <div className="s4">
                  <img src={product.url} alt={product.name} className="responsive" />
                </div>
                <div className="s6">
                  <div className="padding">
                    <h5>{product.name} - ${product.price}</h5>
                    <p>{product.description}</p>
                    <nav className="small-space row ">
                      <Link to={`/product/${product.id}`}>
                        <button className="border light-blue-border cyan-text">Ver</button>
                      </Link>
                      {isAuthenticated && (
                        <>
                          <Link to={`/product/edit/${product.id}`}>
                            <button className="border lime-border amber-text ">Editar</button>
                          </Link>
                          <button className="border pink-border red-text" onClick={() => handleDelete(product.id)}>Eliminar</button>
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
