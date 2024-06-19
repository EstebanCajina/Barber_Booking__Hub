import React, { useState, useEffect, useRef } from 'react';
import { Button, InputAdornment, styled, Modal, Box, Typography } from '@mui/material';
import { CameraAlt, Delete } from '@mui/icons-material';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import axios from 'axios';

const StyledInput = styled('input')({
  display: 'none',
});

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
});

const ImageContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  position: 'relative',
});

const DeleteIcon = styled(Delete)({
  position: 'absolute',
  top: '5px',
  right: '5px',
  cursor: 'pointer',
  color: '#fff',
  background: 'rgba(0, 0, 0, 0.5)',
  borderRadius: '50%',
});

const CarouselContainer = styled('div')({
  width: '60%',
  maxWidth: '400px',
  margin: 'auto',
});

const Image = styled('img')({
  width: '200px',
  height: '200px',
  objectFit: 'cover',
  borderRadius: '4px',
});

const FilePicker: React.FC<{
  onImageSelect: (files: File[]) => void;
  onFilesSelect: (files: File[]) => void;
  initialImages: string[];
  eliminarImagenSecundaria: (index: number) => void;
}> = ({ onImageSelect, onFilesSelect, initialImages, eliminarImagenSecundaria }) => {
  const [selectedImages, setSelectedImages] = useState<string[]>(initialImages || []);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [openModal, setOpenModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const carouselRef = useRef<Carousel>(null);

  useEffect(() => {
    console.log("Initial Images:", initialImages);
    setSelectedImages(initialImages);
  }, [initialImages]);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const allowedFormats = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
    
    if (files && files.length > 0) {
      const invalidFiles = Array.from(files).filter(file => !allowedFormats.includes(file.type));
      if (invalidFiles.length > 0) {
        setErrorMessage('Uno de los archivos no cumple con el formato permitido.');
        setOpenModal(true);
        return;
      }

      const fileURLs = Array.from(files).map(file => URL.createObjectURL(file));
      onImageSelect(Array.from(files));
      onFilesSelect(Array.from(files));
      
      const fileUploadPromises = Array.from(files).map(async (file) => {
        let formData = new FormData();
        formData.append('imagen', file);

        try {
          const response = await axios.post("http://localhost:1111/productos/actualizarImagen", formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log("Imagen actualizada exitosamente:", response.data);
          return response.data.url;
        } catch (error) {
          console.error("Error al actualizar la imagen:", error);
          return null;
        }
      });

      const uploadedUrls = await Promise.all(fileUploadPromises);
      const validUrls = uploadedUrls.filter(url => url !== null) as string[];

      setSelectedImages(prevImages => {
        // Filtrar duplicados
        const uniqueUrls = [...new Set([...prevImages, ...validUrls])];
        // Limpiar URLs temporales
        fileURLs.forEach(URL.revokeObjectURL);
        return uniqueUrls;
      });
    }
  };

  const removeCurrentImage = () => {
    const newSelectedImages = [...selectedImages];
    newSelectedImages.splice(currentIndex, 1);
    setSelectedImages(newSelectedImages);

    // Actualiza el índice de la imagen actual si es necesario
    if (currentIndex === selectedImages.length - 1 && currentIndex !== 0) {
      setCurrentIndex(currentIndex - 1);
    }

    eliminarImagenSecundaria(currentIndex);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setErrorMessage('');
  };

  return (
    <Container>
      <StyledInput
        id="file-input"
        type="file"
        accept="image/png, image/jpg, image/jpeg, image/gif"
        onChange={handleImageChange}
        multiple
      />
      <label htmlFor="file-input">
        <Button
          component="span"
          variant="outlined"
          startIcon={<CameraAlt />}
          endIcon={<InputAdornment position="end"></InputAdornment>}
        >
          Agregar imágenes
        </Button>
      </label>
      {selectedImages.length > 0 && (
        <CarouselContainer>
          <Carousel
            showThumbs={false}
            dynamicHeight
            selectedItem={currentIndex}
            onChange={(index: number) => setCurrentIndex(index)}
            ref={carouselRef}
          >
            {selectedImages.map((image, index) => (
              <ImageContainer key={index}>
                {image && <Image src={image} alt={`Selected ${index}`} />}
              </ImageContainer>
            ))}
          </Carousel>
        </CarouselContainer>
      )}
      <Button variant="outlined" onClick={() => removeCurrentImage()} disabled={selectedImages.length === 0}>
        Eliminar imagen actual
      </Button>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          width={400}
          bgcolor="background.paper"
          p={4}
          borderRadius="8px"
          boxShadow={24}
        >
          <Typography variant="h6" component="h2">
            Error de formato
          </Typography>
          <Typography sx={{ mt: 2 }}>
            {errorMessage}
          </Typography>
          <Box mt={4} display="flex" justifyContent="flex-end">
            <Button onClick={handleCloseModal} color="primary">
              Cerrar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default FilePicker;
