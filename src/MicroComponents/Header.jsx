import useNavigation from "../Routes/Navigation";
import Drawer from "./Drawer";  
import { useState } from "react";
import { useAuth } from "../Services/Context";
import authService from "../Services/authService";
import {useNavigate } from "react-router-dom";




const Header = ({  isAuthenticated, drawerOptions }) => {
  const { goToHome } = useNavigation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user, token, setUser, setToken } = useAuth();
  const navigate = useNavigate(); // Para hacer el redireccionamiento después de guardar
  
  const toggleDrawer = () => setIsDrawerOpen((prevState) => !prevState);

  const handleLogout = async () => {
    try {
      await authService.logout(setToken, setUser); 
      navigate("/");  // Nos vamos al home después de cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <>
      <header>
        <nav>
          <button className="circle transparent" onClick={goToHome}>  
            <img src="https://cdn-icons-png.flaticon.com/512/1057/1057509.png" alt="Home" />
          </button>

          <h5 className="max center-align">Bienvenido, {user?.name || "Usuario"}</h5>

          <aside className="right padding round" style={{ position: 'fixed' }}>
            <button onClick={toggleDrawer} className="border pink-border orange-text">
              {isDrawerOpen ? "Cerrar Menú" : "Abrir Menú"}
            </button>
          </aside>
        </nav>
      </header>
      <div className="small-space"></div>

      {isDrawerOpen && (
      <Drawer options={drawerOptions} closeDrawer={toggleDrawer} user={user} handleLogout={handleLogout} />
    )}

    </>
  );
};

export default Header;




