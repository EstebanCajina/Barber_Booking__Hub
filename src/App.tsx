import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import NavBar from "./NavBar"; // Importa el componente NavBar
import VistaUsuario from "./VistaUsuario";
import VistaServicios from "./VistaServicios";
import VistaPrincipal from "./VistaPrincipal";
import Login from "./Login";
import Registrar from "./Registrarse";
import VistaCuenta from "./VistaCuenta";





const App: React.FC = () => {
  return (
    <Router basename="/barber_shop_booking_hub"> {/* Define el basename */}
      <NavBar /> {/* NavBar siempre presente */}
      <Routes>
        <Route path="/" element={<VistaPrincipal />} />
        <Route path="/perfil" element={<VistaUsuario />} />
        <Route path="/servicios" element={<VistaServicios />} /> {/* Remove the 'loading' prop */}
        <Route path="/login" element={<Login />} /> {/* Change the component name to 'Registrar' */}
        <Route path="/registrarse" element={<Registrar />} /> {/* Change the component name to 'Registrar' */}
        <Route path="/cuenta" element={<VistaCuenta />} /> {/* Remove the extra closing angle bracket '>' */}
      
        {/* Otras rutas de tu aplicación */}
      </Routes>
    </Router>
  );
};


export default App;
