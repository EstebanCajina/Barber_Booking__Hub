import React from 'react';
import TarjetaImagen from '../componentes/TarjetaImagen';
import CarruselImagen from "../componentes/CarruselImagen";

interface Image {
  label: string;
  imgPath: string;
  description: string;
}

const images: Image[] = [
  {
    label: 'Fachero',
    imgPath:
      'https://tahecosmetics.com/trends/wp-content/uploads/2023/02/mohicano-personalizado.jpg',
    description: 'Description for Fachero',
  },
  {
    label: 'Corte 2',
    imgPath:
      'https://i.pinimg.com/736x/e0/68/f6/e068f67b0c60ea69f250dbe2bc468c40.jpg',
    description: 'Description for Corte 2',
  },
  {
    label: 'Corte 3',
    imgPath:
      'https://tinteparaelcabello.com/wp-content/uploads/2023/02/Mejores-Cortes-de-Cabello-para-Hombre-01.jpg',
    description: 'Description for corte 3',
  },
  {
    label: 'Messi es messi',
    imgPath:
      'https://i.pinimg.com/736x/18/e1/9e/18e19e643a0b28ef7fc7c776807601b8.jpg',
    description: 'Description for Messi',
  },
];

const UserView: React.FC = () => {

  const showDetails: boolean = true; // Puedes cambiar este valor según tus necesidades
  const email: string = 'example@example.com'; // Ejemplo de correo electrónico
  const phone: string = '123-456-7890'; // Ejemplo de número de teléfono
  const experience: number = 5; // Ejemplo de años de experiencia

  return (
    <div className="user-view">
      <div className="user-view__container">
        <div className='information-profile'>
          <TarjetaImagen
            image="https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
            title="Nombre de la persona"
            description="Barbero Profesional"
            showDetails={showDetails}
            email={email}
            phone={phone}
            experience={experience}
            carouselWidth={400} // Puedes ajustar el ancho del carrusel aquí
            carouselHeight={400}
          />     
        </div>
        <div className="user-view__card-container">
          <CarruselImagen images={images} carouselWidth={500} carouselHeight={600} />
        </div>
      </div>
      <style>{`
        .user-view {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 50px 0; /* Ajustar el padding según tus preferencias */
          background: linear-gradient(94deg, rgba(0,0,0,1) 0%, rgba(85,29,61,1) 55%, rgba(210,202,31,1) 100%);
          background-size: auto; /* Ajustar el tamaño de la imagen de fondo */
          background-position: center; /* Centrar la imagen de fondo */
          background-repeat: repeat; /* Repetir la imagen en el fondo */
        }

        .user-view__container {
          background-color: rgba(255, 255, 255, 0.9);
          border-radius: 10px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
          width: 90%;
          max-width: 800px; /* Ajustar el ancho máximo según tus preferencias */
          padding: 20px;
          margin: auto;
          display: flex;
          flex-direction: column;
          gap: 20px; /* Espacio entre elementos hijos */
        }

        .information-profile {
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center; /* Alinea el contenido de manera horizontal */
        }

        
        .user-view__card-container {
          min-width: 0; /* Permite que el carrusel se reduzca más allá de su tamaño mínimo */
          border-radius: 5px;
          overflow: hidden;
          display: flex;
          justify-content: center;
        }

        @media screen and (max-width: 768px) {
          .user-view {
            padding: 20px 0; /* Ajustar el padding en pantallas más pequeñas */
          }
          .user-view__container {
            width: 95%;
          }
        }
      `}</style>
    </div>
  );
};

export default UserView;
