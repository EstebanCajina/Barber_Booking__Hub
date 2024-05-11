import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa el CSS de Bootstrap

function MainView() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handlePrevSlide = () => {
    setActiveIndex(prevIndex => (prevIndex === 0 ? 2 : prevIndex - 1));
  };

  const handleNextSlide = () => {
    setActiveIndex(prevIndex => (prevIndex === 2 ? 0 : prevIndex + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextSlide();
    }, 7000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <div id="carouselExampleInterval" className="carousel slide carousel-fade" data-bs-ride="carousel">
      <div className="carousel-inner">
      <div className={`carousel-item ${activeIndex === 0 ? 'active' : ''} carousel-item-next`} data-bs-interval="3000">
          <div className="card text-bg-dark" style={{ width: '100%', height: '100%' }}>
            <img src="https://e1.pxfuel.com/desktop-wallpaper/793/233/desktop-wallpaper-barber-shop.jpg" className="card-img" alt="..." style={{ width: '100%', maxHeight: '700px', objectFit: 'cover', objectPosition: 'center' }} />
            <div className="card-img-overlay d-flex flex-column justify-content-center align-items-center position-absolute top-0 start-0">
              <div className="bg-dark bg-opacity-50 p-3 p-md-5 rounded">
                <h5 className="card-title display-3 text-white fw-bold">¡Bienvenido a nuestra barbería 1!</h5>
                <p className="card-text lead text-white fw-bold">Ofrecemos cortes de cabello y afeitados de alta calidad para hombres de todas las edades.</p>
                <p className="card-text lead fw-bold"><small className="text-white">Atendido por expertos en el arte de la barbería</small></p>
              </div>
            </div>
          </div>
        </div>
        <div className={`carousel-item ${activeIndex === 1 ? 'active' : ''} carousel-item-next`} data-bs-interval="3000">
          <div className="card text-bg-dark" style={{ width: '100%', height: '100%' }}>
            <img src="https://tevian.com/wp-content/uploads/2016/03/Disen%CC%83o-sin-ti%CC%81tulo-2-scaled-e1627461964712.jpg" className="card-img" alt="..." style={{ width: '100%', maxHeight: '700px', objectFit: 'cover', objectPosition: 'center' }} />
            <div className="card-img-overlay d-flex flex-column justify-content-center align-items-center position-absolute top-0 start-0">
              <div className="bg-dark bg-opacity-50 p-3 p-md-5 rounded">
                <h5 className="card-title display-3 text-white fw-bold">¡Bienvenido a nuestra barbería 2!</h5>
                <p className="card-text lead text-white fw-bold">Ofrecemos cortes de cabello y afeitados de alta calidad para hombres de todas las edades.</p>
                <p className="card-text lead fw-bold"><small className="text-white">Atendido por expertos en el arte de la barbería</small></p>
              </div>
            </div>
          </div>
        </div>
        <div className={`carousel-item ${activeIndex === 2 ? 'active' : ''} carousel-item-next`} data-bs-interval="3000">
          <div className="card text-bg-dark" style={{ width: '100%', height: '100%' }}>
            <img src="https://institutoferrer.com/wp-content/uploads/2022/06/BARBERIA-scaled.jpg" className="card-img" alt="..." style={{ width: '100%', maxHeight: '700px', objectFit: 'cover', objectPosition: 'center' }} />
            <div className="card-img-overlay d-flex flex-column justify-content-center align-items-center position-absolute top-0 start-0">
              <div className="bg-dark bg-opacity-50 p-3 p-md-5 rounded">
                <h5 className="card-title display-3 text-white fw-bold">¡Bienvenido a nuestra barbería 3!</h5>
                <p className="card-text lead text-white fw-bold">Ofrecemos cortes de cabello y afeitados de alta calidad para hombres de todas las edades.</p>
                <p className="card-text lead fw-bold"><small className="text-white">Atendido por expertos en el arte de la barbería</small></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev" onClick={handlePrevSlide}>
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next" onClick={handleNextSlide}>
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default MainView;
