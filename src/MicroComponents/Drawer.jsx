import { useNavigate,Link } from 'react-router-dom'; // Importamos useNavigate 
import { useAuth } from '../Services/Context';

const Drawer = ({ options, closeDrawer, user, handleLogout }) => {
  const navigate = useNavigate(); // Usamos useNavigate para redirigir

  return (
    <dialog className="left no-padding" open>
      <nav className="drawer">
        <header>
          <nav>
            <img src="https://cdn-icons-png.flaticon.com/512/1057/1057509.png" className="circle" alt="Logo" />
            <h6 className="max">Opciones</h6>
            <button className="transparent circle large" onClick={closeDrawer}>
              <i>close</i>
            </button>
          </nav>
        </header>

        <div>
          {/* Mostrar nombre del usuario si está logueado */}
          <p>{user ? `Hola, ${user.name}` : "Bienvenido, Usuario"}</p>
        </div>

        {options.map((option, index) => (
          <button
          key={index}
          className="transparent" // Aplicamos la clase transparent
          onClick={() => navigate(option.link)} // Redirigimos al hacer clic
        >
          <div>
            <i>{option.icon}</i>
            <span>{option.label}</span>
          </div>
        </button>
        ))}
        
        {/* Aquí está el botón de logout */}
        {user && (
          <button className="transparent " onClick={handleLogout}> {/* Usamos handleLogout directamente */}
                      

            <div>
              <i>exit_to_app</i>
              <span>Cerrar sesión</span>
            </div>
          </button>
        )}
      </nav>
    </dialog>
  );
};

export default Drawer;