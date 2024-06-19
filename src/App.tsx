import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./Componentes/NavBar";
import VistaUsuario from "./Usuario/VistaUsuario";
import VistaServicios from "./VistaServicios";
import VistaPrincipal from "./VistaPrincipal";
import Login from "./Usuario/Login";
import Registrar from "./Usuario/Registrarse";
import VistaCuenta from "./Usuario/VistaCuenta";
import Recuperacion from "./Usuario/Recuperacion";
import { Usuario } from "./tipos/Usuario";
import Productos from "./Producto/Productos";
import AgregarProductos from "./Producto/ProductoAgregar";
import EditarProductos from "./Producto/ProductosEditar";
import AgregarCitas from "./Citas/CitasAgregar";
import ListarCitasCliente from "./Citas/ListarCitasCliente";
import ListarCitasBarbero from "./Citas/ListarCitasBarbero";
import CitaActualizar from "./Citas/CitasActualizar";
import Footer from './Footer';

const AppContent: React.FC<{ usuario: Usuario | null, handleLogout: () => void }> = ({ usuario, handleLogout }) => {
  const location = useLocation();
  const hideNavAndFooter = location.pathname === "/login" || location.pathname === "/registrarse";


  const renderCitas = () => {
    if (usuario) {
      if (usuario.barbero === "1") {
        console.log("vas para las citas del barbero");
        return <ListarCitasBarbero user={usuario} />;
        
      } else {
        
        console.log("vas para las citas del usuario");
        return <ListarCitasCliente user={usuario} />;
      }
    } else {
      return <Login />;
    }
  };

  return (
    <>
      {!hideNavAndFooter && <NavBar onLogout={handleLogout} />}
      <Routes>



        <Route path="/" element={<VistaPrincipal />} />
        <Route path="/perfil" element={usuario ? <VistaUsuario /> : <Login />} />
        <Route path="/servicios" element={<VistaServicios />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrarse" element={<Registrar />} />
        <Route path="/recuperacion" element={<Recuperacion />} />
        <Route path="/cuenta" element={usuario ? <VistaCuenta /> : <Login />} />
        <Route path="/productos" element={usuario ? <Productos user={usuario} /> :<Login />} />
  <Route path="/productos/agregar" element={(usuario?.barbero ?? '') === '1' ? <AgregarProductos /> : <Login />} />
<Route path="/productos/editar/:id" element={(usuario?.barbero ?? '') === '1' ? <EditarProductos /> : <Login />} />
<Route path="/agendar Citas" element={usuario ? <AgregarCitas user={usuario} /> : <Login />} />
<Route path="/actualizar-cita/:id" element={usuario ? <CitaActualizar user={usuario} /> : <Login />} />
<Route path="/ver Citas" element={usuario ? renderCitas() :<Login />} />

        {/* Otras rutas de tu aplicación */}
      </Routes>
       <Footer />
    </>
  );
};

const App: React.FC = () => {
  const [usuario, setUser] = useState<Usuario | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <Router basename="/">
      <AppContent usuario={usuario} handleLogout={handleLogout} />
    </Router>
  );
};

export default App;
