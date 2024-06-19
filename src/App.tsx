import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./componentes/NavBar";
import VistaUsuario from "./Usuario/VistaUsuario";
import VistaServicios from "./VistaServicios";
import VistaPrincipal from "./VistaPrincipal";
import Login from "./Usuario/Login";
import Registrar from "./Usuario/Registrarse";
import VistaCuenta from "./Usuario/VistaCuenta";
import Recuperacion from "./Usuario/Recuperacion";
import { Usuario } from "./tipos/Usuario";
import Footer from './Footer';
import MembresiasList from "./Membresias/MembresiaListar";
import AgregarMembresia from "./Membresias/MembresiaAgregar";
import ActualizarMembresia from "./Membresias/MembresiaActualizar";

const AppContent: React.FC<{ usuario: Usuario | null, handleLogout: () => void }> = ({ usuario, handleLogout }) => {
  const location = useLocation();
  const hideNavAndFooter = location.pathname === "/login" || location.pathname === "/registrarse";

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
        <Route path="/membresias" element={<MembresiasList />} />
        <Route path="/agregar" element={<AgregarMembresia />} />
        <Route path="/actualizar/:id" element={<ActualizarMembresia />} />
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
