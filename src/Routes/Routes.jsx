import React from 'react';
import { Routes, Route } from 'react-router-dom'; // pa ruting
import Login from '../Pages/Auth/Login'; //el login
import Home from '../Pages/Dashboard/Home'; // el home
import ProductDetails from '../Pages/Dashboard/ProductDetails'; // los details
import ProductManagement from '../Pages/Product/ProductManagement'; // esto pa gestionar productos (Crear y Editar)
import Register from '../Pages/Auth/Register'; //el registro

/**
 * Componente principal de rutas de la aplicación.
 * Define las rutas disponibles y los componentes asociados a ellas.
 *
 * Rutas:
 * - "/login": Página de inicio de sesión, muestra el componente Login.
 * - "/register": Página de registro de usuario, muestra el componente Register.
 * - "/": Página principal (Dashboard), muestra el componente Home.
 * - "/product/:id": Página de detalles de un producto específico, muestra el componente ProductDetails.
 * - "/product/edit/:id": Página para editar un producto existente, muestra el componente ProductManagement.
 * - "/product/create": Página para crear un nuevo producto, muestra el componente ProductManagement.
 *
 * @returns {JSX.Element} Componente que gestiona las rutas de la aplicación.
 */
const RoutesComponent = () => {
  return (
    <Routes>      
      <Route path="/login" element={<Login />} />      
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/product/edit/:id" element={<ProductManagement />} />
      <Route path="/product/create" element={<ProductManagement />} />
    </Routes>
  );
};

export default RoutesComponent;
