import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import productService from "../../Services/productService";
import useNavigation from "../../Routes/Navigation";
import ReactStars from "react-rating-stars-component";  // pa las stars
import Drawer from "../../MicroComponents/Drawer";
import { useAuth } from "../../Services/Context"; 



const ProductDetails = () => {
  const { id } = useParams();  // eeste coso, aquí obtenemos el ID del producto
  const [product, setProduct] = useState(null);  // El estado para el producto
  const [loading, setLoading] = useState(true);  // Sabemos que está cargando porque "loading" es true
  const [error, setError] = useState(null);  // Si algo va mal, lo guardamos aquí
  const { goToHome } = useNavigation();  // Esto nos lleva al home si algo sale mal
  const [review, setReview] = useState("");  // Esto para la reseña que el usuario quiere dejar
  const [rating, setRating] = useState(1);  // La calificación inicial, siempre 1 porque no vamos a empezar con 5 estrellas así de fácil
  const token = localStorage.getItem("token");  // Verificamos si hay sesión activa, esto es importante
  const isAuthenticated = !!token;  // Si hay token, ya ta logueado
  const { user } = useAuth();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Estado pa' saber si el menú está abierto
    const toggleDrawer = () => setIsDrawerOpen((prevState) => !prevState);
  
    const drawerOptions = [
      ...(!isAuthenticated
        ? [
            { label: 'Login', link: '/login', icon: 'login' },
            { label: 'Register', link: '/register', icon: 'person_add' },
            { label: 'Ir a pagina principal', link: '/', icon: 'house' },
          ]
        : []),
      ...(isAuthenticated
        ? [
            { label: 'Ir a pagina principal', link: '/', icon: 'house' },
          ]
        : []),
    ];

  // Esto es para obtener la info del producto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getProductById(id);
        console.log("📥 Producto recibido:", response);
        setProduct(response.data);  // Guardamos los datos del producto
      } catch (error) {
        setError(error.message);  // Si hay error, lo almacenamos
      } finally {
        setLoading(false);  // Cuando termine, dejamos de cargar
      }
    };

    fetchProduct();  // Llamamos a la función para que busque el producto
  }, [id]);  // Esto depende del ID, si cambia, se vuelve a ejecutar

  // Esto es para manejar el envío de reseñas
  const handleReviewSubmit = async (e) => {
    e.preventDefault();  // No recargamos la página al enviar el form
  
    if (!review.trim()) {  // Si la reseña está vacía, no lo dejamos pasar
      console.log("⚠️ Reseña vacía, no se enviará.");
      return alert("La reseña no puede estar vacía");
    }
  
    console.log("📤 Enviando reseña con datos:", { id, rating, review, token });
  
    try {
      const response = await productService.saveProductReview(id, { rating, content: review }, token);
      console.log("✅ Reseña enviada con éxito:", response);
  
      setProduct((prev) => ({
        ...prev,
        reviews: [...prev.reviews, { id: Date.now(), rating, content: review }],
      }));
  
      setReview("");  // Limpiamos la reseña
      setRating(1);  // Reseteamos la calificación
    } catch (error) {
      console.error("❌ Error al enviar la reseña:", error);
      alert("Error al enviar la reseña");
    }
  };
  const handleLogout = async () => {
    try {
      await authService.logout(setToken, setUser); 
      navigate("/");  // Nos vamos al home después de cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Si está cargando, mostramos el mensaje de "Cargando..."
  if (loading) return <p>Cargando...</p>;
  // Si hay un error, lo mostramos
  if (error) return <p>Error: {error}</p>;

  return (
    
    <main className="responsive">
      
      <article className="padding round border surface deep-orange-border grey-text">
      <aside className="right padding round" style={{ position: 'fixed' }}>
        <button onClick={toggleDrawer} className="border pink-border orange-text">
          {isDrawerOpen ? "Cerrar Menú" : "Abrir Menú"}
        </button>
      </aside>

        <aside className="center medium-width medium-height padding">
          <img src={product.url} alt="" className="responsive" />
        </aside>
        <div className="padding">
          <h5>{product.name}</h5>
          <p>{product.description}</p>
          <nav>
            <div>
              Rating promedio:{" "}
              <ReactStars
                count={5} // Número máximo de estrellas
                value={product.average_rating || 0} // Valor de las estrellas (el promedio de la calificación)
                size={24} // Tamaño de las estrellas
                edit={false} // Si es true, el usuario puede calificar, si es false solo se muestra
                color2={"#ffd700"} // Color de las estrellas cuando están llenas
              />
            </div>
            <p>Precio: ${product.price}</p>
          </nav>
        </div>
      </article>

      <h2>Reseñas</h2>
      {product.reviews.length > 0 ? (

    <article className="small-height scroll background">
      {product.reviews.map((review) => (
      <div key={review.id} className="row no-padding surface-container round surface-container-highest">
            <ReactStars
              count={5}
              value={review.rating}
              size={20}
              edit={false}
              color2={"#ffd700"}
            />
        <div className="small-space"></div>
          <div className="max">
          <div className="small-space"></div>
            <h6 className="small">{review.content}</h6>
            <div className="small-space"></div>
          </div>
        <div className="small-space"></div>
        <hr />
      </div>
    ))}
  </article>
  
      ) : (
        <p>No hay reseñas para este producto.</p>
      )}

{token && (
  <>
    <h3>Deja tu reseña</h3>
    <form onSubmit={handleReviewSubmit} className="responsive">
      <div className="round border lime-border padding">
      

        {/* Campo para la calificación */}
        <div className="field label suffix border amber-border">          
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))} 
            className="border amber-border"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num} >
                {num}
              </option>
            ))}
          </select>
          <label >Rating:</label>
          <i>⭐</i>
        </div>

        {/* Campo para la reseña */}
        <div className="field textarea label border amber-border">
        <textarea 
            value={review}
            onChange={(e) => setReview(e.target.value)}            
            className="border amber-border"
            rows="4" // Número de filas del textarea
          />
            <label>Escribe tu reseña...</label>

        </div>

        {/* Botón de enviar */}
        <div className="right-align">
          <button type="submit" className="responsive border yellow-border amber-text">
            Enviar
          </button>
        </div>
        {/* <div class="space"></div> */}

      </div>
      
    </form>
  </>
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

export default ProductDetails;
