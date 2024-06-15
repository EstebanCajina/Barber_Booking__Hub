import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function MainView() {
  return (
    <div>
      <div style={{ position: 'relative', color: 'white', height: '100vh' }}>
        <img 
          src="https://t3.ftcdn.net/jpg/06/70/53/74/360_F_670537427_n4UsFhTyJyRLAuuukM1Z9LTEbtZp0KWi.jpg" 
          alt="Barber Background" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', zIndex: -1 }} 
        />
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: 'bold' }}>GUÁPILES POCOCÍ LIMÓN TODOS LOS DÍAS DE: 8AM - 6PM</h1>
        </div>
        <div style={{ position: 'absolute', bottom: '20%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
          <h1 style={{ fontSize: '6rem', fontWeight: 'bold' }}>PREMIUM</h1>
          <h2 style={{ fontSize: '4rem' }}>BARBER BOOKING HUB</h2>
          <p style={{ fontSize: '1.5rem' }}>WHATSAPP: 8421 0243</p>
          <p style={{ fontSize: '1.5rem' }}>TELÉFONO: 4702 4498</p>
          <button 
            style={{ backgroundColor: 'red', color: 'white', padding: '1rem 2rem', fontSize: '1.5rem', border: 'none', borderRadius: '5px' }}
            onClick={() => window.location.href = '/agendar citas'}
          >
            RESERVAR UNA CITA
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: '#1a1a1a', color: 'white', textAlign: 'center', padding: '5rem 1rem' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 'bold' }}>The Barber Lounge</h2>
        <p style={{ fontSize: '1.25rem', margin: '1.5rem 0' }}>
          En The Barber Lounge rescatamos el arte de las antiguas barberías y la experiencia que en ellas se vivía.
        </p>
        <p style={{ fontSize: '1.25rem', margin: '1.5rem 0' }}>
          Juntamos la tradición con servicios de altos estándares de calidad e higiene y utilizamos los mejores productos de grooming y shaving. Aquí encontrarás ese espacio que hemos perdido los hombres, donde cortarse el cabello y hacerse la barba se convierten en una terapia de amigos y relajación; más que ser un hábito.
        </p>
        <p style={{ fontSize: '1.25rem', margin: '1.5rem 0' }}>
          Sillas de barbero, espuma, toalla caliente y navaja libre... regresa el ritual del hombre.
        </p>
        <button 
          style={{ backgroundColor: 'red', color: 'white', padding: '1rem 2rem', fontSize: '1.5rem', border: 'none', borderRadius: '5px' }}
          onClick={() => window.location.href = '/servicios'}
        >
          ¡Reservá YA!
        </button>
      </div>

      <div style={{ background: 'linear-gradient(0deg, rgba(98,13,16,1) 0%, rgba(26,26,26,1) 35%, rgba(26,26,26,1) 65%, rgba(98,13,16,1) 100%)', color: 'white', textAlign: 'center', padding: '5rem 1rem' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 'bold' }}>Tienda en línea</h2>
        <p style={{ fontSize: '1.25rem', margin: '1.5rem 0' }}>
          Comprá en línea y recibí tu pedido directamente en tu casa, oficina o bien pasá a retirarlos a The Barber Lounge.
        </p>
        <p style={{ fontSize: '1.25rem', margin: '1.5rem 0' }}>
          Mejorá el brillo y apariencia de tu barba y cabello con nuestros productos de alta calidad y sentite diferente con nuestra línea American Crew.
        </p>
        <p style={{ fontSize: '1.25rem', margin: '1.5rem 0' }}>
          American Crew es más que un simple producto para tu barba y cabello: Es un hito en la historia del aseo masculino. Es la marca de barbería líder creada específicamente para hombres y los barberos en los que confían. Cada marco en su historia refleja el del producto compromiso con el barbero y barbería profesional, ya que busca empoderar a los hombres a través de productos y prácticas de cuidado personal de calidad.
        </p>
        <p style={{ fontSize: '1.25rem', margin: '1.5rem 0' }}>
          En la actualidad, American Crew es la marca líder en el cuidado del cabello profesional para hombres en el mundo. Los hombres y su barbería de confianza cuentan con la calidad de Crew para obtener lo último y lo mejor en productos para el cabello, el cuerpo, el afeitado y el peinado mediante más de 20 años mejorando la apariencia del hombre.
        </p>
      </div>

      <footer style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '2rem 0', textAlign: 'center' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h5>Contactanos</h5>
              <p>Telefono: +506 2260-9777</p>
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
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-tiktok"></i></a>
          </div>
          <p>© 2024, The Barber Lounge Costa Rica Creado por GonDi.solutions</p>
        </div>
      </footer>
    </div>
  );
}

export default MainView;
