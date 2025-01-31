import { React, useState } from 'react';
import { useForm } from 'react-hook-form'; // Esto es pa' manejar el formulario fácilmente
import { useAuth } from "../../Services/Context"; // Esto es pa' usar el contexto de autenticación
import authService from '../../Services/authService';  // Esto es pa' llamar a las funciones de autenticación
import useNavigation from "../../Routes/Navigation"; // Esto es pa' navegar entre páginas
import Drawer from '../../MicroComponents/Drawer';





const Login = () => {
  const token = localStorage.getItem("token");  // Verificamos si hay sesión activa, esto es importante
  const isAuthenticated = !!token;  // Si hay token, ya ta logueado
    const { user } = useAuth();
  
      const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Estado pa' saber si el menú está abierto
      const toggleDrawer = () => setIsDrawerOpen((prevState) => !prevState);
    
      const drawerOptions = [
        ...(!isAuthenticated
          ? [
              
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



  // Esto es pa' manejar el formulario, los errores y validaciones
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Esto es pa' actualizar el usuario y el token en el contexto
  const { setUser, setToken } = useAuth();

  // Esto es pa' navegar a la página de inicio o volver atrás
  const { goToHome, goBack } = useNavigation();

  /**
   * Esta función se ejecuta cuando el formulario se envía.
   * Si el login es exitoso, redirige a la página de inicio.
   * Si no, muestra un error.
   * 
   * @param {Object} data - Los datos del formulario (email y contraseña).
   */
  const onSubmit = async (data) => {
    // Llamamos a la función de login de authService
    const response = await authService.login(data, setUser, setToken);

    // Si el login es exitoso (hay un token), redirigimos a la página de inicio
    if (response.data?.token) {
      console.log('Login exitoso');
      goToHome(); // Redirigimos después del login
    } else {
      // Si no, mostramos el error en la consola
      console.log('Error en el login', response.message);
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

  return (
    <main className="responsive">
      <aside className="right padding round" style={{ position: 'fixed' }}>
        <button onClick={toggleDrawer} className="border pink-border orange-text">
          {isDrawerOpen ? "Cerrar Menú" : "Abrir Menú"}
        </button>
      </aside>
      {/* Este es el formulario de login */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="small-space"></div>
        <h1>Inicio de sesión</h1>
        

        {/* Este es el campo para ingresar las credenciales */}
        <fieldset className='red-border'>
          <legend className='white-text'>Ingresa tus credenciales</legend>

          {/* Campo para el correo electrónico */}
          <div className="field red-border label">
            <input className='red-border' {...register("email", { required: true })} />
            {errors.email && <p>Email es requerido</p>} {/* Si no hay email, muestra un error */}
            <label className='white-text'>Correo electrónico</label>
          </div>

          {/* Campo para la contraseña */}
          <div className="field red-border label">
            <input className='red-border' {...register("password", { required: true })} type="password" />
            {errors.password && <p>Contraseña es requerida</p>} {/* Si no hay contraseña, muestra un error */}
            <label className='white-text'>Contraseña</label>
          </div>

          {/* Botón para enviar el formulario */}
          <div className="middle-align center-align">
            <button type="submit" className="responsive red3 black-text">Ingresar <i>login</i></button>
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

export default Login;