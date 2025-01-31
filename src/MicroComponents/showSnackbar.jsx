/**
 * Muestra un Snackbar con un mensaje, color e ícono personalizados.
 * 
 * @param {string} message - El mensaje a mostrar.
 * @param {string} color - El color del Snackbar (por defecto: "blue").
 * @param {string} icon - El ícono a mostrar (por defecto: "info").
 * @param {number} duration - Duración en milisegundos (por defecto: 4000).
 */

export const showSnackbar = (message, color = "blue", icon = "info", duration = 4000) => {
  const snackbar = document.createElement("div");
  snackbar.className = `snackbar active ${color}`;
  snackbar.innerHTML = `
    <i>${icon}</i>
    <span>${message}</span>
  `;
  document.body.appendChild(snackbar);

  setTimeout(() => {
    snackbar.classList.remove("active");
    setTimeout(() => {
      document.body.removeChild(snackbar);
    }, 300);
  }, duration);
};