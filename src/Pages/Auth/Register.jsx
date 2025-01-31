import React, { useContext,useState } from 'react'; 
import { useForm } from 'react-hook-form'; // Esto es pa' manejar el formulario de registro fácil
import userService from '../../Services/userService'; // Pa' crear el usuario en el backend
import authService from '../../Services/authService'; // Pa' hacer el login después del registro
import useNavigation from "../../Routes/Navigation"; // Pa' navegar entre páginas
import { Context,useAuth } from '../../Services/Context'; // Pa' acceder al contexto de autenticación
import Drawer from '../../MicroComponents/Drawer';
import Header from '../../MicroComponents/HEader';

const Register = () => {
  // Esto es pa' manejar el formulario, las validaciones y los errores
  const { register, handleSubmit, formState: { errors }, setError } = useForm();

  // Esto es pa' navegar después del registro
  const { goToHome } = useNavigation();

  // Esto es pa' actualizar el usuario y el token en el contexto
  const { setUser, setToken } = useContext(Context);

    const token = localStorage.getItem("token");  // Verificamos si hay sesión activa, esto es importante
    const isAuthenticated = !!token;  // Si hay token, ya ta logueado
      const { user } = useAuth();
    
        const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Estado pa' saber si el menú está abierto
        const toggleDrawer = () => setIsDrawerOpen((prevState) => !prevState);
      
        const drawerOptions = [
          ...(!isAuthenticated
            ? [
                
                { label: 'Login', link: '/login', icon: 'login' },
                { label: 'Ir a pagina principal', link: '/', icon: 'house' },
              ]
            : []),
          ...(isAuthenticated
            ? [
                { label: 'Ir a pagina principal', link: '/', icon: 'house' },
              ]
            : []),
        ];



  /**
   * Esta función se ejecuta cuando el formulario se envía.
   * Registra al usuario, luego hace login automáticamente si todo va bien.
   * Si hay algún error, muestra el mensaje correspondiente.
   * 
   * @param {Object} data - Los datos del formulario (nombre, correo y contraseña).
   */
  const onSubmit = async (data) => {
    try {
      // Primero, intentamos registrar al usuario con los datos
      const registerResponse = await userService.addUser(data);
      console.log('Respuesta del registro:', registerResponse);

      if (registerResponse.code === 201) {
        // Si el registro es exitoso, hacemos login con los mismos datos
        const loginCredentials = {
          email: data.email,
          password: data.password
        };

        // Usamos authService pa' loguear al usuario
        const loginResponse = await authService.login(loginCredentials, setUser, setToken);
        console.log('Respuesta del login:', loginResponse);

        if (loginResponse?.data?.token) {
          console.log('Login exitoso después del registro');
          goToHome(); // Si todo va bien, nos mandamos a la página de inicio
        } else {
          throw new Error('Error al iniciar sesión automáticamente');
        }
      } else {
        throw new Error(registerResponse.message || 'Error en el registro');
      }
    } catch (error) {
      // Si hubo algún error, lo mostramos y lo manejamos
      console.error('Error durante el proceso:', error);
      setError('submit', { 
        type: 'manual',
        message: error.message || 'Error en el registro. Por favor, intenta nuevamente.'
      });
    }
    
  };

  return (
    <main className="responsive">
      <Header  goToHome={goToHome} toggleDrawer={toggleDrawer} isDrawerOpen={isDrawerOpen} drawerOptions={drawerOptions}/>
    

      {/* Este es el formulario de registro */}
      <form onSubmit={handleSubmit(onSubmit)}>
        
        <h1>Registro</h1>

        {/* Este es el campo para ingresar los datos del usuario */}
        <fieldset className='pink-border'>
          <legend>Ingresa tus datos</legend>

          {/* Campo para el nombre */}
          <div className="field pink-border label">
            <input className='pink-border'  {...register("name", { required: "El nombre es requerido" })} />
            {errors.name && <p className="error">{errors.name.message}</p>} {/* Si no hay nombre, muestra un error */}
            <label className="white-text">Nombre</label>
          </div>

          {/* Campo para el correo electrónico */}
          <div className="field pink-border label">
            <input className='pink-border'
              {...register("email", { 
                required: "El correo electrónico es requerido",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Correo electrónico inválido"
                }
              })} 
              type="email"
            />
            {errors.email && <p className="error">{errors.email.message}</p>} {/* Si no hay email o es inválido, muestra error */}
            <label className="white-text">Correo electrónico</label>
          </div>

          {/* Campo para la contraseña */}
          <div className="field pink-border label">
            <input className='pink-border'
              {...register("password", { 
                required: "La contraseña es requerida",
                minLength: {
                  value: 9,
                  message: "La contraseña debe tener al menos 9 caracteres"
                }
              })} 
              type="password" 
            />
            {errors.password && <p className="error">{errors.password.message}</p>} {/* Si no hay contraseña o es muy corta, muestra error */}
            <label className="white-text">Contraseña</label>
          </div>

          {/* Si hubo algún error general en el submit, lo mostramos */}
          {errors.submit && <p className="error">{errors.submit.message}</p>}

          {/* Botón pa' enviar el formulario */}
          <div className="middle-align center-align">
            <button type="submit" className="responsive pink3 white-text">
              Registrarse <i>person_add</i> {/* Icono de agregar persona */}
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

export default Register;
