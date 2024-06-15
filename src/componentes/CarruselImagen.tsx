import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa los estilos de Bootstrap
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

interface Image {
  label: string;
  imgPath: string;
  description: string;
}

interface Props {
  images: Image[];
  carouselWidth: number;
  carouselHeight: number;
}

const SwipeableCardCarousel: React.FC<Props> = ({ images, carouselWidth, carouselHeight }: Props) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [newImages, setNewImages] = useState<Image[]>([]); // Estado para almacenar las nuevas imágenes

  const handleNext = () => {
    setActiveStep((prevActiveStep: number) => (prevActiveStep === images.length - 1 ? 0 : prevActiveStep + 1));
  };

  const handlePrev = () => {
    setActiveStep((prevActiveStep: number) => (prevActiveStep === 0 ? images.length - 1 : prevActiveStep - 1));
  };

  const handleAddImages = () => {
    // Implementa la lógica para agregar nuevas imágenes
  };

  return (
    <Box sx={{ maxWidth: carouselWidth, flexGrow: 2 }}>
      <Carousel activeIndex={activeStep} onSelect={handleNext} prevIcon={<span className="carousel-control-prev-icon" aria-hidden="true" />} nextIcon={<span className="carousel-control-next-icon" aria-hidden="true" />}>
        {images.map((image: { imgPath: any; label: any; description: any; }, index: any) => (
          <Carousel.Item key={index}>
            <img src={image.imgPath} className="d-block w-100" alt={image.label} />
            <Carousel.Caption>
              <h5>{image.label}</h5>
              <p>{image.description}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </Box>
  );
}

export default SwipeableCardCarousel;
