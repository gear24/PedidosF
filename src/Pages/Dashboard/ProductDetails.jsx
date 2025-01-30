import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import productService from "../../Services/productService";
import useNavigation from "../../Routes/Navigation";

const ProductDetails = () => {
  const { id } = useParams();  // eeste coso, aquí obtenemos el ID del producto
  const [product, setProduct] = useState(null);  // El estado para el producto
  const [loading, setLoading] = useState(true);  // Sabemos que está cargando porque "loading" es true
  const [error, setError] = useState(null);  // Si algo va mal, lo guardamos aquí
  const { goToHome } = useNavigation();  // Esto nos lleva al home si algo sale mal
  const [review, setReview] = useState("");  // Esto para la reseña que el usuario quiere dejar
  const [rating, setRating] = useState(1);  // La calificación inicial, siempre 1 porque no vamos a empezar con 5 estrellas así de fácil
  const token = localStorage.getItem("token");  // Verificamos si hay sesión activa, esto es importante

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

  // Si está cargando, mostramos el mensaje de "Cargando..."
  if (loading) return <p>Cargando...</p>;
  // Si hay un error, lo mostramos
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Precio: ${product.price}</p>
      <p>Rating promedio: {product.average_rating || "Sin calificación"}</p>

      <h2>Reseñas</h2>
      {product.reviews.length > 0 ? (
        <ul>
          {product.reviews.map((review) => (
            <li key={review.id}>
              <strong>⭐ {review.rating}</strong> - {review.content}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay reseñas para este producto.</p>
      )}

      {token && (
        <form onSubmit={handleReviewSubmit}>
          <h3>Deja tu reseña</h3>
          <label>
            ⭐ Rating:
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </label>
          <br />
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Escribe tu reseña..."
          />
          <br />
          <button type="submit">Enviar</button>
        </form>
      )}

      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          goToHome();  // Esto nos lleva al home, como si fuera un botón
        }}
      >
        <i>home</i>
        <div>Ir al dashboard</div>
      </a>
    </div>
  );
};

export default ProductDetails;
