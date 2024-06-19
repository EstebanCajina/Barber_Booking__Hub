import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '2rem 0', textAlign: 'center' }}>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>Contactanos</h5>
            <p>Teléfono: +506 2260-9777</p>
            <p>Celular: +506 7023-1949</p>
            <p>Email: hola@thebarberloungecr.com</p>
          </div>
          <div className="col-md-4">
            <h5>Horarios de atención</h5>
            <p>Lunes a miércoles: 10:00 AM a 8:00 PM</p>
            <p>Jueves a sábado: 10:00 AM a 8:30 PM</p>
            <p>Domingos: 10:00 AM a 6:00 PM</p>
          </div>
          <div className="col-md-4">
            <h5>Nuestra ubicación</h5>
            <p>San Francisco de Heredia, del BAC Credomatic 75m al Este. Mano derecha.</p>
          </div>
        </div>
        <div className="social-icons" style={{ margin: '1rem 0' }}>
          <a href="https://www.facebook.com/thebarberloungecr" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
          <a href="https://www.instagram.com/thebarberloungecr" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
          <a href="https://www.tiktok.com/@thebarberloungecr" target="_blank" rel="noopener noreferrer"><i className="fab fa-tiktok"></i></a>
        </div>
        <p>© 2024, The Barber Lounge Costa Rica Creado por GonDi.solutions</p>
        {/* Agregar el enlace para redirigir a la página principal */}
        <Link className='btn btn-danger' to="/" style={{ color: 'white' }}>Ir a la página principal</Link>
      </div>
    </footer>
  );
}

export default Footer;
