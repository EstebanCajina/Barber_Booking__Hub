import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./componentes/NavBar";
import VistaUsuario from "./Usuario/VistaUsuario";
import VistaServicios from "./VistaServicios";
import VistaPrincipal from "./VistaPrincipal";
import Login from "./Usuario/Login";
import Registrar from "./Usuario/Registrarse";
import VistaCuenta from "./Usuario/VistaCuenta";
import Recuperacion from "./Usuario/Recuperacion";
import { Usuario } from "./tipos/Usuario";


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
      <NavBar onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<VistaPrincipal />} />
        <Route path="/perfil" element={usuario ? <VistaUsuario /> : <Login />} />
        <Route path="/servicios" element={<VistaServicios/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/registrarse" element={<Registrar />} />
        <Route path="/recuperacion" element={<Recuperacion />} />
        <Route path="/cuenta" element={usuario ? <VistaCuenta /> : <Login />} />
        {/* Otras rutas de tu aplicación */}
      </Routes>
    </Router>
  );
};

export default App;
